import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from "../../Context/ConfigContext";
import axios from 'axios';
import Swal from 'sweetalert2';
import PageTitle from "../../Components/PageTitle";
import { NoRecords } from "../../Components/Shimmer";

const SupplierManagement = () => {
  const { apiURL, gdcURL, token, headers } = useContext(ConfigContext);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchSuppliers();
  }, [page, limit]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${gdcURL}Suppliers/GetSuppliers`, {
        params: { limit, page },
        headers,
      });
      if (response.data) {
        // desc by POPULAR before set
        response.data.data.sort((a, b) => b.POPULAR - a.POPULAR);
        setSuppliers(response.data.data.map(supplier => ({
          ...supplier,
          solrTransferStatus: supplier.DATA_TRANSFER_STATUS || 0,
          ranking: supplier.SUP_RANKING || '', // Initialize ranking field
        })));
        setTotalRecords(response.data.data.length);
        setTotalPages(Math.ceil(response.data.data.length / limit));
      } else {
        Swal.fire({
          title: "<strong>Error</strong>",
          html: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      Swal.fire({
        title: "<strong>Error</strong>",
        html: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (supplierId, currentStatus) => {
    if (currentStatus === 2) {
      window.location.href = `${gdcURL}Gen/DownloadFile/${supplierId}.csv`;
      return;
    }

    if (currentStatus !== 0 && currentStatus !== 3) return;

    try {
      const response = await axios.post(
        `${gdcURL}Gen/DownloadPartListByBrand`, 
        { sup_id: supplierId },
        { headers }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          html: "Part list generation started. You will be notified when it's ready for download.",
          icon: "success",
        });
        updateSupplierStatus(supplierId, 1);
      } else {
        throw new Error(response.data.message || "Failed to start part list generation");
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      Swal.fire({
        title: "Error",
        html: error.message || "Failed to start part list generation",
        icon: "error",
      });
      updateSupplierStatus(supplierId, 3);
    }
  };

  const updateSupplierStatus = (supplierId, newStatus) => {
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(supplier => 
        supplier.SUP_ID === supplierId ? { ...supplier, LIST_READY: newStatus } : supplier
      )
    );
  };

  const handlePrev = () => { if (page > 1) setPage(page - 1); };
  const handleNext = () => { if (page < totalPages) setPage(page + 1); };
  const handlePageChange = (e) => { setPage(parseInt(e.target.value, 10)); };

  const handleStartSolrTransfer = async (supplierId) => {
    try {
      updateSupplierSolrStatus(supplierId, 1);
      const response = await axios.post(
        `${gdcURL}Gen/StartSolrDataTransfer`,
        { sup_id: supplierId },
        { headers }
      );
      if (response.data.success) {
        Swal.fire({
          title: "Success",
          html: "Solr data transfer started. This process may take some time.",
          icon: "success",
        });
        updateSupplierSolrStatus(supplierId, 1);
      } else {
        throw new Error(response.data.message || "Failed to start Solr data transfer");
      }
    } catch (error) {
      console.error('Error in handleStartSolrTransfer:', error);
      Swal.fire({
        title: "Error",
        html: error.message || "Failed to start Solr data transfer",
        icon: "error",
      });
      updateSupplierSolrStatus(supplierId, 3);
    }
  };

  const updateSupplierSolrStatus = (supplierId, newStatus) => {
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(supplier => 
        supplier.SUP_ID === supplierId ? { ...supplier, solrTransferStatus: newStatus } : supplier
      )
    );
  };

  const handleCheckboxChange = async (supplierId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await axios.post(
        `${gdcURL}Suppliers/UpdateSupplierStatus`,
        { sup_id: supplierId, status: newStatus },
        { headers }
      );
      if (response.data.success) {
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(supplier =>
            supplier.SUP_ID === supplierId ? { ...supplier, SUP_STATUS: newStatus } : supplier
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update supplier status");
      }
    } catch (error) {
      console.error('Error updating supplier status:', error);
      Swal.fire({ title: "Error", html: error.message || "Failed to update supplier status", icon: "error" });
    }
  };

  const handlePopularChange = async (supplierId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await axios.post(
        `${gdcURL}Suppliers/UpdatePopular`,
        { sup_id: supplierId, status: newStatus },
        { headers }
      );
      if (response.data.success) {
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(supplier =>
            supplier.SUP_ID === supplierId ? { ...supplier, POPULAR: newStatus } : supplier
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update popular status");
      }
    } catch (error) {
      console.error('Error updating popular status:', error);
      Swal.fire({ title: "Error", html: error.message || "Failed to update popular status", icon: "error" });
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title="Supplier Management" primary="Home" />
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Supplier Management List</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>Ranking</th>
                          <th>SUP ID</th>
                          <th>Active</th>
                          <th>Popular</th>
                          <th>Supplier Logo</th>
                          <th>Supplier Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="7">Loading...</td></tr>
                        ) : suppliers.length === 0 ? (
                          <tr><td colSpan="7"><NoRecords /></td></tr>
                        ) : (
                          suppliers.map((supplier) => (
                            <tr key={supplier.SUP_ID}>
                              {/* Ranking input with check icon */}
                              <td>
                                <div className="d-flex align-items-center justify-content-center">
                                  <input
                                    type="number"
                                    min="1"
                                    value={supplier.SUP_RANKING}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setSuppliers(prev =>
                                        prev.map(s =>
                                          s.SUP_ID === supplier.SUP_ID ? { ...s, SUP_RANKING: value } : s
                                        )
                                      );
                                    }}
                                    className="form-control form-control-sm"
                                    style={{ width: '60px', marginRight: '5px' }}
                                  />
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={async () => {
                                      if (!supplier.SUP_RANKING) return;
                                      try {
                                        const response = await axios.post(
                                          `${gdcURL}Suppliers/UpdateSupplierRanking`,
                                          { SUP_ID: supplier.SUP_ID, SUP_RANKING: supplier.SUP_RANKING },
                                          { headers }
                                        );
                                        if (response.data.success) {
                                          Swal.fire({
                                            title: "Success",
                                            text: "Ranking updated successfully",
                                            icon: "success",
                                            timer: 1500,
                                            showConfirmButton: false
                                          });
                                        } else {
                                          throw new Error(response.data.message || "Failed to update ranking");
                                        }
                                      } catch (error) {
                                        console.error('Error updating ranking:', error);
                                        Swal.fire({
                                          title: "Error",
                                          text: error.message || "Failed to update ranking",
                                          icon: "error",
                                        });
                                      }
                                    }}
                                  >
                                    <i className="ri-check-line"></i>
                                  </button>
                                </div>
                              </td>

                              <td>{supplier.SUP_ID}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={supplier.SUP_STATUS === 1}
                                  onChange={() => handleCheckboxChange(supplier.SUP_ID, supplier.SUP_STATUS)}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={supplier.POPULAR === 1}
                                  onChange={() => handlePopularChange(supplier.SUP_ID, supplier.POPULAR)}
                                />
                              </td>
                              <td>
                                <img src={`${gdcURL}sup-logo/${supplier.SUP_LOGO_NAME}`} alt={supplier.SUP_BRAND} width="50" height="50" />
                              </td>
                              <td>{supplier.SUP_BRAND}</td>
                              <td width="30%">
                                <button
                                  className={`btn btn-sm ${supplier.LIST_READY === 2 ? 'btn-success' : 'btn-primary'} me-2`}
                                  onClick={() => handleDownload(supplier.SUP_ID, supplier.LIST_READY)}
                                  disabled={supplier.LIST_READY === 1}
                                >
                                  {supplier.LIST_READY === 0 && "Generate CSV"}
                                  {supplier.LIST_READY === 1 && "Generating..."}
                                  {supplier.LIST_READY === 2 && "Download CSV"}
                                  {supplier.LIST_READY === 3 && "Failed Try Again"}
                                </button>
                                <button
                                  className={`btn btn-sm ${supplier.solrTransferStatus === 2 ? 'btn-success' : 'btn-info'}`}
                                  onClick={() => {
                                    if(supplier.solrTransferStatus === 0 || supplier.solrTransferStatus === 3){
                                      handleStartSolrTransfer(supplier.SUP_ID)
                                    }
                                  }}
                                  disabled={supplier.solrTransferStatus === 1}
                                >
                                  {supplier.solrTransferStatus === 0 && "Start Solr Transfer"}
                                  {supplier.solrTransferStatus === 1 && "Transferring..."}
                                  {supplier.solrTransferStatus === 2 && "Transfer Complete"}
                                  {supplier.solrTransferStatus === 3 && "Transfer Failed"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <button className="btn btn-sm btn-secondary" onClick={handlePrev} disabled={page <= 1}>Prev</button>
                    <input type="number" value={page} onChange={handlePageChange} style={{ width: '50px' }} />
                    <span>of {totalPages}</span>
                    <button className="btn btn-sm btn-secondary" onClick={handleNext} disabled={page >= totalPages}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
