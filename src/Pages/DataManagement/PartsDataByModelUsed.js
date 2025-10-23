import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { ConfigContext } from '../../Context/ConfigContext';
import PageTitle from "../../Components/PageTitle";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // Import the xlsx library

const PartsDataByModelUsed = () => {
  const { gdcURL, apiURL, dmURL } = useContext(ConfigContext);
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [downloadsList, setDownloadsList] = useState([]); // New state for downloads list
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermProducts, setSearchTermProducts] = useState('');
  const [searchTermSuppliers, setSearchTermSuppliers] = useState('');

  useEffect(() => {
    // Fetch makes/brands
    axios.get(`${gdcURL}Cars/GetMakes`)
      .then(response => {
        if (response.data.success) {  // Note the spelling change here
          console.log('Makes data:', response.data.data); // Log the data
          setMakes(response.data.data.map(make => ({
            value: make.MFA_ID,
            label: make.MFA_BRAND
          })));
        } else {
          console.error('Error fetching makes:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching makes:', error));
  }, [gdcURL]);

  useEffect(() => {
    console.log('Makes state updated:', makes);
  }, [makes]);

  useEffect(() => {
    // Fetch suppliers
    axios.get(`${gdcURL}Suppliers/GetSuppliers?lang=en&status=1`)
      .then(response => {
        setSuppliers(response.data.data);
      })
      .catch(error => console.error('Error fetching suppliers:', error));
  }, []);

  useEffect(() => {
    // Fetch suppliers
    axios.get(`${gdcURL}Products/GetProducts?lang=en&limit=1000000000&page=1&used=1`)
      .then(response => {
        setProducts(response.data.data);

      })
      .catch(error => console.error('Error fetching suppliers:', error));
  }, []);

  useEffect(() => {
    // Fetch the downloads list when the component mounts
    fetchDownloadsList();
  }, []);

  const fetchDownloadsList = () => {
    axios.get(`${dmURL}Parts/GetPartsByModelUsedDownloadsList`)
      .then(response => {
        if (response.data.success) {
          setDownloadsList(response.data.data);
        } else {
          console.error('Error fetching downloads list:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching downloads list:', error));
  };

  const handleGetParts = () => {
    if (selectedSuppliers.length === 0) {
      Swal.fire('Please select at least one supplier');
      return;
    }

    setLoading(true); // Start loading

    // Extract MS_IDs from selected models

    const supplierIds = selectedSuppliers.join(',');
    const productsIds = selectedProducts.join(',');
    const makeIds = selectedMakes.join(',');
   
    axios.get(`${dmURL}Parts/getPartsByModel?MFA_ID=${makeIds}&SUP_ID=${supplierIds}&PT_ID=${productsIds}`)
      .then(response => {
        if (response.data.success) {
          fetchDownloadsList();
          Swal.fire('Success', response.data.message);
        } else {
          Swal.fire('Error fetching parts:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching parts:', error);
        Swal.fire('Error fetching parts:', error.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };
  const [FileProcessName, setFileProcessName] = useState();
  const handleCreateProcess = () => {
    if (selectedSuppliers.length === 0) {
      Swal.fire('Please select at least one supplier');
      return;
    }

    setLoading(true); // Start loading

    // Extract MS_IDs from selected models
    
    const supplierIds = selectedSuppliers.join(',');
    const productsIds = selectedProducts.join(',');
    const makeIds = selectedMakes.join(',');
    console.log(`${dmURL}Parts/CreateDataProcessUsed?MFA_ID=${makeIds}&SUP_ID=${supplierIds}&PT_ID=${productsIds}&FILE_PROCESS_NAME=${FileProcessName}`)
    //return false;
    axios.get(`${dmURL}Parts/CreateDataProcessUsed?MFA_ID=${makeIds}&SUP_ID=${supplierIds}&PT_ID=${productsIds}&FILE_PROCESS_NAME=${FileProcessName}`)
      .then(response => {
        if (response.data.success) {
          fetchDownloadsList();
          Swal.fire('Success', response.data.message);
          setFileProcessName('');
        } else {
          Swal.fire('Error fetching parts:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching parts:', error);
        Swal.fire('Error fetching parts:', error.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };


  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(parts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PartsData");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "PartsData.xlsx");
  };

  const handleCancelJob = (jobId) => {
    if (!jobId) {
      Swal.fire('Job ID is required');
      return;
    }

    axios.post(`${dmURL}Parts/cancel-job`, { jobId })
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', response.data.message);
          fetchDownloadsList(); // Refresh the downloads list after cancellation
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error canceling job:', error);
        Swal.fire('Error canceling job:', error.message);
      });
  };

  const handleResumeJob = (FILE_DOWNLOAD_ID) => {
    if (!FILE_DOWNLOAD_ID) {
      Swal.fire('Job ID is required');
      return;
    }

    axios.post(`${dmURL}Parts/StartDataProcessUsed`, { FILE_DOWNLOAD_ID })
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', response.data.message);
          fetchDownloadsList(); // Refresh the downloads list after cancellation
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error canceling job:', error);
        Swal.fire('Error canceling job:', error.message);
      });
  };

  const handleDownloadFile = (FILE_DOWNLOAD_ID) => {
    if (!FILE_DOWNLOAD_ID) {
      Swal.fire('Job ID is required');
      return;
    }

    axios.get(`${dmURL}Parts/DownloadFile?FILE_DOWNLOAD_ID=${FILE_DOWNLOAD_ID}`)
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', response.data.message);
          const downloadUrl = `${dmURL}Parts/DownloadFile/${response.data.data}`;

          // Open the download link in a new tab
          const newTab = window.open(downloadUrl, '_blank');

          // Optional: Check if the tab was blocked
          if (newTab) {
            newTab.opener = null; // Security measure to prevent the new tab from being controlled
            newTab.focus();
          } else {
            alert("Please allow pop-ups for this website to download the file.");
          }
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error canceling job:', error);
        Swal.fire('Error canceling job:', error.message);
      });
  };
  // Filtered makes based on search term
  const filteredMakes = makes.filter(make =>
    make.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered products and suppliers based on search term
  const filteredProducts = products.filter(product =>
    product.PRODUCT_NAME.toLowerCase().includes(searchTermProducts.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.SUP_BRAND.toLowerCase().includes(searchTermSuppliers.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title="Parts Data By Model Used" primary="Home" />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Select Make and Supplier</h4>
                </div>
                <div className="card-body">
                  <div className="row gy-4">
                    <div className="col-md-4" style={{maxHeight: '400px', overflow: 'auto'}}>
                      <label>Makes</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search makes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div>
                        {filteredMakes.map((make, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`make-${index}`}
                              value={Number(make.value)}
                              checked={selectedMakes.includes(Number(make.value))}
                              onChange={(e) => {

                                const value = Number(e.target.value);
                                setSelectedMakes(prev =>
                                  prev.includes(value)
                                    ? prev.filter(item => item !== value)
                                    : [...prev, value]
                                );

                              }}
                            />
                            <label className="form-check-label" htmlFor={`make-${index}`}>
                              {make.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>


                    <div className="col-md-4" style={{maxHeight: '400px', overflow: 'auto'}}>
                      <label>Products</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search products..."
                        value={searchTermProducts}
                        onChange={(e) => setSearchTermProducts(e.target.value)}
                      />
                      <div>
                        {filteredProducts.map((product, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`product-${index}`}
                              value={product.PT_ID}  // Fixed: Use correct ID
                              checked={selectedProducts.includes(Number(product.PT_ID))}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                
                                setSelectedProducts(prev =>
                                  prev.includes(value)
                                    ? prev.filter(item => item !== value)
                                    : [...prev, value]
                                );
                              }}
                            />
                            <label className="form-check-label" htmlFor={`product-${index}`}>
                              {product.PRODUCT_NAME}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-4" style={{maxHeight: '400px', overflow: 'auto', display: 'none'}}>
                      <label>Suppliers</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search suppliers..."
                        value={searchTermSuppliers}
                        onChange={(e) => setSearchTermSuppliers(e.target.value)}
                      />
                      <div>
                        {filteredSuppliers.map((supplier, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`supplier-${index}`}
                              value={supplier.SUP_ID}  // Fixed: Use correct ID
                              checked={selectedSuppliers.includes(supplier.SUP_ID)}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                setSelectedSuppliers(prev =>
                                  prev.includes(value)
                                    ? prev.filter(item => item !== value)
                                    : [...prev, value]
                                );
                              }}
                            />
                            <label className="form-check-label" htmlFor={`supplier-${index}`}>
                              {supplier.SUP_BRAND}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <input 
                      type='text' 
                      className='form-control' 
                      style={{width: '300px'}}
                      value={FileProcessName}
                      onChange={(e) => setFileProcessName(e.target.value)} 
                      placeholder="Enter unique process name"
                    />
                    <button
                      className="btn btn-primary"
                      disabled={!FileProcessName || FileProcessName.trim() === ''}
                      onClick={handleCreateProcess}
                    >
                      Create Process
                    </button>
                  </div>
                  {/* <button
                    className="btn btn-primary mt-3"
                    onClick={handleGetParts}
                    disabled={loading}
                  >
                    Get Part List
                  </button>
                  <button
                    className="btn btn-secondary mt-3 ms-2"
                    onClick={handleDownloadExcel}
                    disabled={loading || parts.length === 0}
                  >
                    Download Excel
                  </button> */}
                  <div className="mt-4">
                    {loading ? (
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <>

                        <ul>
                          {parts.map((part, index) => (
                            <li key={`${part.PART_NUMBER}-${index}`}>
                              {part.PART_NAME} - {part.PART_NUMBER} - {part.PART_BRAND} - {part.CAR_BRAND} - {part.MODEL}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    <h5>Downloads List
                      <button className="btn btn-xs btn-primary ms-2" onClick={fetchDownloadsList}>
                        <i className="bx bx-refresh"></i>
                      </button>
                    </h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Process Name</th>
                          <th>Download Time</th>
                          <th>Progress</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloadsList.map((download, index) => {
                          let statusText;
                          switch (download.FILE_STATUS) {
                            case 1:
                              statusText = 'In Process';
                              break;
                            case 2:
                              statusText = 'Completed';
                              break;
                            case 3:
                              statusText = 'Failed';
                              break;
                            default:
                              statusText = 'Unknown';
                          }
                          return (
                            <tr key={index}>
                              <td>{statusText}</td>
                              <td>{download.FILE_PROCESS_NAME}</td>
                              <td>{new Date(download.FILES_DOWNLOA_DATETIME).toLocaleString()}</td>
                              
                              <td>{download.FILE_PROGRESS}</td>
                              <td>
                              <button style={{borderRadius: 0}} className='btn btn-success btn-sm' onClick={() => handleResumeJob(download.FILE_DOWNLOAD_ID)}>
                                    Resume/Start
                                  </button>
                                
                                
                                <button style={{borderRadius: 0}} className='btn btn-primary btn-sm' 
                                onClick={() => handleDownloadFile(download.FILE_DOWNLOAD_ID)}
                                
                                
                                >
                                  Download
                                </button>

                                {download.FILE_STATUS !== 2 && (
                                  <button style={{borderRadius: 0}} className='btn btn-danger btn-sm' onClick={() => handleCancelJob(download.FILE_JOB_ID)}>
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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

export default PartsDataByModelUsed;


