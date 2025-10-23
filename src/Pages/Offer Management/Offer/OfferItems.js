import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../Components/PageTitle";
import { NavLink, useParams } from "react-router-dom";
import { TableRows, NoRecords } from "../../../Components/Shimmer";
import withRouter from "../../../Utils/withRouter";
import AddOfferItemModal from "./AddOfferItemModal";
const OfferItems = () => {
  const { apiURL, token, placeHolderImageURL } = useContext(ConfigContext);

  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(false);
  const [limit] = useState(5);
  const [initLoading, setInitLoading] = useState(false);
  const { offer_id } = useParams();
  const LoadData = () => {
    const headers = { token: `${token}`, "Content-Type": "application/json" };
    axios
      .get(`${apiURL}Offers/GetOfferItems`, {
        params: { limit, page, offer_id },
        headers,
      })
      .then((response) => {
        const data = response.data;
        console.log("errors", response.data);
        if (data.success === true) {
          setRows(data.data);
          setNext(data.next);
          setPrev(data.prev);
          setPage(data.page);
          setTotalRecords(data.total_records);
          setTotalPages(data.total_pages);
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: data.message,
            icon: "error",
          });
        }
        setInitLoading(false);
      })
      .catch((error) => {
        setInitLoading(false);
        console.log("errors", error.message);
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.message,
          icon: "error",
        });
      });
  };

  useEffect(() => {
    setInitLoading(true);
    LoadData();
  }, [page]);

  const handleDelete = (id) => {
    const headers = { token: `${token}`, "Content-Type": "application/json" };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(true);
        const formData = { offer_id: id };
        axios
          .post(
            `${apiURL}Offers/DeleteOfferItem`,
            { offer_item_id: id },
            { headers }
          )
          .then((response) => {
            Swal.fire({
              title: `<strong>${
                response.data.success === true ? "Success" : "Failed"
              }</strong>`,
              text: response.data.message,
              icon: response.data.success === true ? "success" : "error",
            });
            setStatus(false);
            if (response.data.success === true) {
              LoadData();
            }
          })
          .catch((error) => {
            setStatus(false);
            Swal.fire({
              title: "<strong>Error</strong>",
              html: error.message,
              icon: "error",
            });
          });
      }
    });
  };

  const handlePrev = () => {
    if (prev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNext = () => {
    if (next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleChange = (e) => {
    setPage(parseInt(e.target.value, 10));
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <>
          {/* Default Modals */}

          <div
            id="myModal"
            className="modal fade"
            tabIndex={-1}
            aria-labelledby="myModalLabel"
            aria-hidden="true"
            style={{ display: "none" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="myModalLabel">
                    Add Items {""}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                    {" "}
                  </button>
                </div>
                <div className="modal-body">
                  <AddOfferItemModal offer_id={offer_id} />
                </div>
                <div className="modal-footer"></div>
              </div>
              {/* /.modal-content */}
            </div>
            {/* /.modal-dialog */}
          </div>
          {/* /.modal */}
        </>

        <div className="container-fluid">
          <br />
          <PageTitle title="Offer List" primary="Home" />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <div className="avatar-xs flex-shrink-0 mr-5">
                    <NavLink
                      to={`/OfferList`}
                      className="avatar-title bg-dark rounded fs-4">
                      <i className="ri-arrow-left-line"></i>
                    </NavLink>
                  </div>
                  <h4 className="card-title mb-0 flex-grow-1 ml-5">
                    Offer Items
                  </h4>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#myModal"
                    className="btn btn-primary btn-label waves-effect right waves-light">
                    <i className="ri-add-box-line label-icon align-middle fs-16 ms-2" />{" "}
                    Add Offer Items
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-left">
                      <thead>
                        <tr>
                          <th scope="col" width="58%">
                            URL
                          </th>
                          <th scope="col" width="10%">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {initLoading ? (
                          <tr>
                            <td className="text-center" colSpan={15}>
                              Loading...
                            </td>
                          </tr>
                        ) : rows.length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <NoRecords />
                            </td>
                          </tr>
                        ) : (
                          rows.map((row) => (
                            <tr key={`catkey-${row.offer_item_id}`}>
                              <td>{row.offer_item_web_url}</td>

                              <td>
                                <button
                                  onClick={() =>
                                    handleDelete(row.offer_item_id)
                                  }
                                  className="btn-icon btn btn-sm btn-outline-danger">
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
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

export default OfferItems;
