import React, { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../Components/PageTitle";
import { NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../Components/Shimmer";
import Select from "react-select";

const NewPCDataTransfer = () => {
  const { apiURL, gdcURL, token, placeHolderImageURL } = useContext(ConfigContext);
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
  const [makes, setMakes] = useState([]);
  const [make, setMake] = useState(null);
  const [models, setModels] = useState([]);

  const [model, setModel] = useState(null);
  const [series, setSeries] = useState([]);
  const [serie, setSerie] = useState([]);


  useEffect(() => {
    // Fetch makes/brands
    axios.get(`${gdcURL}Cars/GetMakes`)
      .then(response => {
        if (response.data.success) {  // Note the spelling change here
          // Log the data
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
    if (make) {
      axios.get(`${gdcURL}Cars/GetUniModels?MFAID=${make}`)
        .then(data => {
          setModels(data.data.data);
        })
    }
  }, [make]);
  // Load data function
  const LoadData = () => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${gdcURL}Gen/GetRunningPCDataTransfer?lang=en`, {
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
  useEffect(() => {

    if (make && model) {
      var mfa_id = "";
      var ms_id = "";
      if (make) {
        mfa_id = make;
      }
      if (model) {
        ms_id = model;
      }

      axios.get(`${gdcURL}Cars/GetUniSeries?MFAID=${mfa_id}&MSID=${ms_id}`)
        .then(data => {

          setSeries(data.data.data);

        })
    } else {

    }

  }, [model]);
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

  const handleSelectProduct = (index) => {
    rows[index].PT_ACTIVE = 1; 
  }

  // Update company function


  const handleSearch = () => {
    setInitLoading(true);
    // LoadCompanies();
    LoadData();
  }


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleStartTransfer = async () => {  
    if(!serie) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a series'
      });
      return;
    }
    const response = await axios.post(
      `${gdcURL}Gen/StartNewPCDataTransfer`,
      new URLSearchParams({ PC_ID: serie }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data uploaded successfully'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Data upload failed'
      });
      
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={`New PC New Data Transfer`} primary={`Home`} />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">New PC New Data Transfer</h4>

                  <div className="col-md-2">
                    <div className="input-group" style={{ width: '100%', padding: '20px' }}>
                      <Select
                        onChange={(e) => {
                          setMake(e.value);
                        }}
                        placeholder="Select Make"
                        options={makes}
                        styles={{ container: (provided) => ({ ...provided, width: "100%", }), }}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 ">
                    <div className="input-group" style={{ width: '100%', padding: '20px' }}>
                      <Select
                        onChange={(e) => {
                          setModel(e.value);
                        }}
                        placeholder="Select Model"
                        options={models}
                        styles={{ container: (provided) => ({ ...provided, width: "100%", }), }}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 p-2">
                    <div className="input-group" style={{ width: '100%', padding: '20px' }}>
                      <Select
                        onChange={(e) => {
                          setSerie(e.value);
                        }}
                        placeholder="Select Series"
                        options={series}
                        styles={{ container: (provided) => ({ ...provided, width: "100%", }), }}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="input-group" style={{ width: '100%' }}>
                      <button className="btn btn-primary" type="button" onClick={() => handleStartTransfer()}>Transfer</button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-left">
                      <thead>
                        <tr>
                          <th scope="col" width="10%"> PC_ID </th>
                          <th scope="col" width="40%"> Car </th>
                          <th scope="col" width="40%"> Year </th>
                          <th scope="col" width="10%"> Status </th>


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

                            return (
                              <tr key={`catkey-${row.PC_ID}`}>
                                <th scope="row">{row.PC_ID}</th>
                                <td>{row.PC_FULL_NAME}</td>
                                <td>{new Date(row.PCS_CI_FROM).getUTCFullYear()} - {new Date(row.PCS_CI_TO).getUTCFullYear()}</td>
                                <td>{row.PC_DATA_TRANSFER_STATUS === 0 ? 'Pending' : row.PC_DATA_TRANSFER_STATUS === 1 ? 'In Progress' : 'Completed'}</td>
                                <td>

                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>

                      <tfoot className="table-light" style={{display:'none'}}>
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

                              {allINT && <div className="col-md-2">
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
const Row = ({ row, index, selectProduct }) => {
  const [PT_WIDTH, setPTWIDTH] = useState(row.PT_WIDTH);
  const [PT_HEIGHT, setPTHEIGHT] = useState(row.PT_HEIGHT);
  const [PT_LENGTH, setPTLENGTH] = useState(row.PT_LENGTH);
  const [PT_WEIGHT, setPTWEIGHT] = useState(row.PT_WEIGHT);
  const [PT_ACTIVE, setPTACTIVATE] = useState(row.PT_ACTIVE);
  const { apiURL, gdcURL, token, placeHolderImageURL } = useContext(ConfigContext);

  const UpdateActiveStatusProduct = (status) => {

    var formData = {
      PT_ACTIVE: status,
      PT_ID: row.PT_ID,
    }
    const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
    axios
      .post(`${gdcURL}Parts/UpdateActiveStatusProduct`, formData, { headers })
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

    <td><input checked={PT_ACTIVE === 1} onClick={(e) => { setPTACTIVATE(e.target.checked ? 1 : 0); UpdateActiveStatusProduct(e.target.checked ? 1 : '0'); selectProduct(index); }} className="form-check-input code-switcher" type="checkbox" id="gradient-button" /></td>

  </tr>
}
export default NewPCDataTransfer;
