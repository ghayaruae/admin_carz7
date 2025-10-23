import React, { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../Components/PageTitle";
import { NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../Components/Shimmer";
import Select from "react-select";

const ShippingDimensions = () => {
  const { apiURL, gdcURL,token, placeHolderImageURL } = useContext(ConfigContext); 
  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(false);
  const [limit, setLimit] = useState(20);
  const [initLoading, setInitLoading] = useState(true);
  const [allINT, setAllINT] = useState(false);
  const [selectAll, setSelecAll] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [companies, setCompanies] = useState([]);

  // Load data function
  const LoadData = () => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${gdcURL}Parts/GetShippingDimensions?lang=en`, {
        params: { keyword, limit, page },
        headers,
      })
      .then((response) => {
        const data = response.data;
        if (response.data.success) {
          setRows(data.data);
          setNext(data.next);
          setPrev(data.prev);
          setPage(data.page);
          setTotalRecords(data.total_records);
          setTotalPages(data.total_pages);
          setInitLoading(false);
        } else {
          setInitLoading(false);
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  // useEffect to replace componentDidMount
  useEffect(() => {
    setInitLoading(true);
    // LoadCompanies();
    LoadData();
  }, [page, limit]); // The empty array ensures it runs once, page dependency added for navigation

  // Handle previous page
  const handlePrev = () => {
    if (prev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Handle next page
  const handleNext = () => {
    if (next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle page input change
  const handleChange = (e) => {
    setPage(parseInt(e.target.value, 10));
    
  };
  const handleSelectAll = () => {
    for(var i = 0; i < rows.length; i++){
      rows[i].PT_INTL = 1;
    }
    setRows(rows);
  }
  const handleSelectProduct = (index) => {
    rows[index].PT_INTL = 1;
    console.log("rows", rows)
  }
   
  // Update company function
  const UpdateCompany = (country_id, company) => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    setStatus(true);
    axios
      .post(
        `${apiURL}Configuration/UpdateCountrysShippingCompany`,
        { country_id, shipping_company: company },
        { headers }
      )
      .then((response) => {
        setStatus(false);
        if (response.data.success) {
          Swal.fire({
            title: "<strong>Success</strong>",
            html: response.data.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        setStatus(false);
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  const handleSearch = () => {
    setInitLoading(true);
    // LoadCompanies();
    LoadData();
  }

  const UpdateShippingDimensions = () => {
    
    const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
    axios
        .post(`${gdcURL}Parts/UpdateAllActivate`, JSON.stringify(rows), { headers })
        .then((response) => {
            
          if (response.data.success === true) {
              Swal.fire({ title: '<strong>Success</strong>', html: response.data.message, icon: 'success' })
          } else {
              Swal.fire({ title: '<strong>Error</strong>', html: response.data.message, icon: 'error' })
          }
            
            // console.log('API Response:', JSON.stringify(response.data.success));
        })
        .catch((error) => {
            // Handle any errors that occur during the request
            // console.error('API Error:', error);
            Swal.fire({ title: <strong>Error</strong>, html: error, icon: 'error' })
        });
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={`Shipping Products`} primary={`Home`} />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Products List</h4>
                  
                  <div className="col-md-4 mr-5 pr-5">
                    <div className="input-group">
                      <select className="form-select" onChange={(e) => {setLimit(e.target.value); setAllINT(false)}}>
                        <option selected={``} value={10}> Show 10 </option>
                        <option selected={``} value={100}> Show 100 </option>
                        <option selected={``} value={200}> Show 200 </option>
                        <option selected={``} value={300}> Show 300 </option>
                        <option selected={``} value={400}> Show 400 </option>
                        <option selected={``} value={500}> Show 500 </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mr-2">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {  if (e.target.value.length > 3 || e.target.value === '') { setKeyword(e.target.value); } }}
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        placeholder="Search Products"
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => handleSearch()}
                        id="button-addon2">
                        <i className="ri-search-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-left">
                      <thead>
                        <tr>
                          <th scope="col" width="10%"> ID </th>
                          <th scope="col" width="40%"> Product </th>
                          <th scope="col" width="10%"> Width (MM) </th>
                          <th scope="col" width="10%"> Height (MM) </th>
                          <th scope="col" width="10%"> Length (MM)</th>
                          <th scope="col" width="10%"> Weight </th>
                          <th scope="col" width="10%"> Intl </th>
                          <th scope="col" width="10%"> Action </th>
                          
                          
                        </tr>
                      </thead>
                      <tbody>
                        {initLoading === true ? (
                          <TableRows />
                        ) : rows.length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <NoRecords />
                            </td>
                          </tr>
                        ) : (
                          rows.map((row, index) => {
                            return <Row row={row} index={index} selectProduct={handleSelectProduct}/>
                            return (
                              <tr key={`catkey-${row.country_id}`}>
                                <th scope="row">{row.country_id}</th>
                                <td>{row.country}</td>
                                <td>{row.country_alpha1_code}</td>
                                <td>
                                  <Select
                                    onChange={(e) => {
                                      UpdateCompany(row.country_id, e.value);
                                    }}
                                    placeholder={
                                      row.shipping_company || "Select"
                                    }
                                    options={companies}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>

                      <tfoot className="table-light">
                        <tr>
                          <th colSpan={10}>
                            <div className="d-flex justify-content-between">
                              <button
                                disabled={
                                  prev === false && status === false
                                    ? true
                                    : false
                                }
                                type="button"
                                onClick={() => handlePrev()}
                                className={`btn btn-warning btn-label waves-effect waves-light`}>
                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                Previous
                              </button>
                              <div
                                className="col-md-4"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}>
                                {
                                  <small>
                                    Total Records: {totalRecords} | Total Pages:{" "}
                                    {totalPages} | Current Page: {page}
                                  </small>
                                }
                              </div>
                              <div className="col-md-2">
                                <select
                                  className="form-select"
                                  onChange={(e) => handleChange(e)}>
                                  {Array.from(
                                    { length: totalPages },
                                    (_, i) => (
                                      <option
                                        selected={page === i + 1}
                                        key={i}
                                        value={i + 1}>
                                        Page {i + 1}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>

                              { allINT && <div className="col-md-2">
                                <button type="button" className="btn btn-warning">Set all selected Intl</button>
                              </div>
                              }
                              <button
                                disabled={
                                  next === false && status === false
                                    ? true
                                    : false
                                }
                                type="button"
                                onClick={() => handleNext()}
                                className={`btn btn-primary btn-label waves-effect right waves-light`}>
                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />{" "}
                                Next
                              </button>
                            </div>
                          </th>
                          
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/*  <!-- Striped Rows --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Row = ({row, index,  selectProduct}) => {
  const [PT_WIDTH, setPTWIDTH] = useState(row.PT_WIDTH);
  const [PT_HEIGHT, setPTHEIGHT] = useState(row.PT_HEIGHT);
  const [PT_LENGTH, setPTLENGTH] = useState(row.PT_LENGTH);
  const [PT_WEIGHT, setPTWEIGHT] = useState(row.PT_WEIGHT);
  const [PT_INTL, setPTINTL] = useState(row.PT_INTL);
  const { apiURL, gdcURL,token, placeHolderImageURL } = useContext(ConfigContext);
  const UpdateShippingDimensions = () => {
    var formData = {
      PT_WIDTH:PT_WIDTH, 
      PT_HEIGHT:PT_HEIGHT, 
      PT_LENGTH:PT_LENGTH, 
      PT_WEIGHT:PT_WEIGHT,
      PT_INTL:PT_INTL ,
      PT_ID:row.PT_ID ,
    }
    const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
    axios
        .post(`${gdcURL}Parts/UpdateShippingDimensions`, formData, { headers })
        .then((response) => {
            
          if (response.data.success === true) {
              Swal.fire({ title: '<strong>Success</strong>', html: response.data.message, icon: 'success' })
          } else {
              Swal.fire({ title: '<strong>Error</strong>', html: response.data.message, icon: 'error' })
          }
            
            // console.log('API Response:', JSON.stringify(response.data.success));
        })
        .catch((error) => {
            // Handle any errors that occur during the request
            // console.error('API Error:', error);
            Swal.fire({ title: <strong>Error</strong>, html: error, icon: 'error' })
        });
  }
    return <tr>
        <td>{row.PT_ID}</td>
        <td width={`20%`}>{row.PRODUCT_NAME}</td>
        <td><input type="text" value={PT_WIDTH} onChange={(e) =>  setPTWIDTH(e.target.value)}/></td>
        <td><input type="text" value={PT_HEIGHT} onChange={(e) =>  setPTHEIGHT(e.target.value)}/></td>
        <td><input type="text" value={PT_LENGTH} onChange={(e) =>  setPTLENGTH(e.target.value)}/></td>
        <td><input type="text" value={PT_WEIGHT} onChange={(e) =>  setPTWEIGHT(e.target.value)}/></td>
        
        <td><input checked={PT_INTL === 1} onClick={(e) => {setPTINTL(e.target.checked?1:0); selectProduct(index);}} className="form-check-input code-switcher" type="checkbox" id="gradient-button" /></td>
        <td><button type="button" onClick={() => UpdateShippingDimensions()} className="btn btn-sm btn-success">Update</button></td>
    </tr>
}
export default ShippingDimensions;
