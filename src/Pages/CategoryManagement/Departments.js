import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import PageTitle from "../../Components/PageTitle";
import { NoRecords } from "../../Components/Shimmer";
const Departments = () => {
  const [STRID, setSTRID] = useState(null);
  const [PRESTRID, setPRESTRID] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsStat, setRowsStat] = useState(null);
  const [status, setStatus] = useState(false);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [total_records, setTotalRecords] = useState(0);
  const [total_pages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const { apiURL, token, headers } = useContext(ConfigContext);
  useEffect(() => {
    axios
      .get(`${apiURL}Categories/GetCategories`, {
        params: { limit: limit, page: page, STRID:STRID },
        headers,
      })
      .then((response) => {
        var data = response.data;
        console.log(data);
        if (response.data.success === true) {
            setRows(data.data);
            setTotalRecords(data.total_records);
            setTotalPages(data.total_pages);
            setPrev(data.prev);
            setNext(data.next);
            setStatus(true);
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
       
      })
      .catch((error) => {
        
        Swal.fire({
          title: <strong>Error</strong>,
          html: error,
          icon: "error",
        });
      });
  }, [page, STRID]);
  const handleChange = (e) => {
    setPage((prevPage) => {
      const newPage = parseInt(e.target.value, 10);
      return newPage;
    });
  };
  const handlePrev = (ev) => {
    // console.log(prev);
    if (prev === true) {
      setPage((prevPage) => {
        const newPage = prevPage - 1;
        return newPage;
      });
    }
  };
  const handleNext = () => {
    if (next === true) {
      setPage((prevPage) => {
        const newPage = prevPage - +1;
        return newPage;
      });
    }
  };

  const handleRankChange = (STR_RANK, STR_ID) => {
    console.log(`Sending request to: ${apiURL}Categories/UpdateDepartmentRank with data:`, { STR_RANK, STR_ID });
    axios.post(`${apiURL}Categories/UpdateDepartmentRank`, {
        STR_RANK,
        STR_ID
    })
    .then(response => {
        if (response.data.success) {
            Swal.fire({
                title: "Success",
                text: "Rank updated successfully!",
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
    .catch(error => {
        Swal.fire({
            title: "<strong>Error</strong>",
            html: error.message,
            icon: "error",
        });
    });
  }
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={`Category Management`} primary={`Home`} />
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                 { PRESTRID &&  <button 
                    className="btn btn-secondary me-2" 
                    onClick={() => setSTRID(PRESTRID)}
                  >
                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />
                    Back
                  </button>}
                  <h4 className="card-title mb-0 flex-grow-1">
                    Category Management List
                  </h4>
                </div>

                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-center ">
                      <thead className="">
                        <tr>
                          <th scope="col" width="8%"> STR ID </th>
                          <th scope="col" width="24%"> STR NODE NAME </th>
                          <th scope="col" width="30%"> STR PARENT ID </th>
                          <th scope="col" width="10%"> STR PARENT NODE NAME </th>
                          {/* <th scope="col" width="10%"> CHANGE PARENT </th> */}
                          <th scope="col" width="10%"> RANKING</th>
                          
                        </tr>
                      </thead>
                      <tbody className="">
                        {rows.map((row) => {
                          return <tr>
                            <td> {row.STR_ID} </td>
                            <td> <NavLink onClick={() => {setSTRID(row.STR_ID); setPRESTRID(row.STR_PARENT_ID)}}>{row.STR_NODE_NAME} </NavLink></td>
                            <td> {row.STR_PARENT_ID} </td>
                            <td> {row.STR_PARENT_NODE_NAME} </td>
                           

                            <td>
                              <select className="form-control" value={row.STR_RANK} onChange={(e) => handleRankChange(e.target.value, row.STR_ID)} defaultValue={row.STR_RANK}>
                                {Array.from({ length: 1600 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        })}
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
                                    Total Records: {total_records} | Total
                                    Pages: {total_pages} | Current Page: {page}
                                  </small>
                                }
                              </div>
                              <div className="col-md-2">
                                <select
                                  className="form-select"
                                  onChange={(e) => handleChange(e)}>
                                  {Array.from(
                                    { length: total_pages },
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Departments;