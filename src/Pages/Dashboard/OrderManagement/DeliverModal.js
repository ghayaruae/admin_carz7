import React, { useState, useEffect, useContext, useRef } from "react";
import { TextArea } from "../../../Components/InputElements";
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../Components/PageTitle";
import { NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../../Components/Shimmer";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import ParentComponent from "./ParentComponent";

const DeliverModal = ({ onClose, first_name, part_number, order_id }) => {
   
  const { apiURL, token } = useContext(ConfigContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tracking_link, setTrackingLink] = useState("");
  const [tracking_number, setTrackingNumber] = useState("");
  const [company, setCompany] = useState("");
  const [shipping_company, setShippingCompany] = useState("");
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [total_records, setTotalRecords] = useState(0);
  const [total_pages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(false);
  const [limit, setLimit] = useState(5);
  const [companies, setCompanies] = useState([]);
  const [row, setRows] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const handleDateChange = (selectedDates) => {
   
    setSelectedDate(selectedDates[0]);
  };

  const handleChangeCompany = (event) => {
    setCompany(event.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "tracking_link") setTrackingLink(value);
    if (name === "tracking_number") setTrackingNumber(value);
  };

  const LoadCompanies = () => {
    const headers = { token: `${token}`, "Content-Type": "application/json" };
    axios
      .get(`${apiURL}Configuration/GetShippingCompanies?lang=en`, {
        params: { limit, page },
        headers,
      })
      .then((response) => {
        if (response.data.success) {
          setCompanies(response.data.data);
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
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  const LoadData = () => {
    const headers = { token: `${token}`, "Content-Type": "application/json", };
    axios
      .get(`${apiURL}Configuration/GetCountries?lang=en`, {
        params: { keyword, limit, page },
        headers,
      })
      .then((response) => {
        if (response.data.success) {
          const { data, next, prev, page, total_records, total_pages } = response.data;
          setKeyword("");
          setRows(data);
          setNext(next);
          setPrev(prev);
          setPage(page);
          setTotalRecords(total_records);
          setTotalPages(total_pages);
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
  const Shipped = () => {
    const headers = { token: `${token}`, "Content-Type": "application/json", };
   
      
    axios.post(`${apiURL}orders/Shipping?lang=en`, {
        order_id: order_id,
        shipping_by: company,
        order_status: 4,
        shipping_expected_date: selectedDate,
        shipping_tracking_link: tracking_link,
        shipping_tracking_number: tracking_number
      })
      .then(function (response) {
        closeModal();
        Swal.fire({
            title: 'Shipped',
            text: 'Product has been shipped',
            icon: 'success',
        });
        
       
      })
      .catch(function (error) {
       
      });
    
  }
  useEffect(() => {
    setInitLoading(true);
    LoadCompanies();
    LoadData();
  }, [apiURL, token, limit, page, keyword]);
  const closeModal = () => {
   window.location.reload();
    
  };
  return (
    <div
      className="modal fade"
      id="showModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light p-3">
            <h5 className="modal-title" id="exampleModalLabel"> &nbsp; </h5> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal"></button>
          </div>
          <form className="tablelist-form" autoComplete="off">
            <div className="modal-body">
              <div className="row gy-4 mb-3">
                <div className="col-md-6">
                  <div>
                    <label htmlFor="amount-field" className="form-label">
                      Shipping Company
                    </label>
                    <Select
                      onChange={handleChangeCompany}
                      options={companies}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label htmlFor="date" className="form-label">
                      Expected Date
                    </label>
                    <Flatpickr
                      placeholder="Select date"
                      className="form-control"
                      options={{ dateFormat: "Y-m-d" }}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label
                      htmlFor="customername-field"
                      className="form-label">
                      Tracking Link
                    </label>
                    <input
                      type="text"
                      id="customername-field"
                      className="form-control"
                      name="tracking_link"
                      placeholder="Enter Tracking Link"
                      value={tracking_link}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label
                      htmlFor="customername-field"
                      className="form-label">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      id="customername-field"
                      className="form-control"
                      placeholder="Enter Tracking Number"
                      name="tracking_number"
                      value={tracking_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              </div>
            <div className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={onClose}>
                  Close
                </button>
                <button
                  type="button"
                  onClick={Shipped}
                  className="btn btn-success"
                  id="add-btn">
                  Shipped
                </button>
               
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliverModal;
