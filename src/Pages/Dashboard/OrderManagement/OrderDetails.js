import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom"; // Use this to get route params
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../Components/PageTitle";
import { Link, NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../../Components/Shimmer";
import DeliverModal from "./DeliverModal";
import ParentComponent from "./ParentComponent";
import LabelPrint from "./LabelPrint";
import OrderStatusIcons from "../../../Utils/Helper";
import Invoice from "./Invoice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrderAssign from './OrderAssign';
import NewInvoice from "./NewInvoice";

const OrderDetails = () => {
  const { apiURL, token, placeHolderImageURL } = useContext(ConfigContext);
  const { order_id } = useParams(); // Get order_id from the route params

  // Separate state variables
  const [first_name, setFirstName] = useState("");
  const [part_number, setPartNumber] = useState("");
  const [orderInfo, setOrderInfo] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [total_records, setTotalRecords] = useState(0);
  const [total_pages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(false);
  const [limit, setLimit] = useState(5);
  const [timelines, setTimelines] = useState([]);
  const [comments, setComments] = useState([]);
  const printRef = useRef();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  };
  const LoadData = () => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${apiURL}orders/GetOrderDetails?lang=en&order_id=${order_id}`, headers)
      .then((response) => {
        const data = response.data;
        if (data.success === true) {
          // Update individual state variables
          setOrderInfo(data.data.order_info[0]);
          setOrderItems(data.data.order_items[0]);
          setFirstName(data.data.order_info[0].first_name);
          setPartNumber(data.data.order_items[0].part_number);
          setTimelines(data.data.timelines);
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
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  const LoadComments = () => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${apiURL}Orders/GetOrderComments?lang=en&order_id=${order_id}`, headers)
      .then((response) => {
        const data = response.data;
        if (data.success === true) {
          // Update individual state variables
          
          setComments(data.data);
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: data.message,
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
    LoadData();
    LoadComments();
  }, [order_id]);

  const handlePrev = () => {
    if (prev) {
      setPage((prevPage) => prevPage - 1);
      LoadData();
    }
  };

  const handleNext = () => {
    if (next) {
      setPage((prevPage) => prevPage + 1);
      LoadData();
    }
  };

  const handleChange = (e) => {
    const pageNumber = parseInt(e.target.value, 10);
    setPage(pageNumber);
    LoadData();
  };

  const handleChangeStatus = (status, text) => {
    const headers = {
      'token': `${token}`,
      'Content-Type': 'application/json',
    };
    Swal.fire({
      title: 'Enter Remark',
      input: 'text',
      inputPlaceholder: 'Enter your remark here',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update Status',
      preConfirm: (remark) => {
        if (!remark) {
          Swal.showValidationMessage('Remark is required');
        }
        return remark;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(true);
        const formData = {
          order_id: order_id,
          order_status: status,
          remark: result.value??'', // Use the entered remark
          user_id: localStorage.getItem("user_id")
        };
        console.log("formData", formData)
        axios
          .post(`${apiURL}Orders/UpdateOrderStatus`, formData, { headers })
          .then((response) => {
            Swal.fire({
              title: `<strong>${response.data.success === true ? 'Success' : 'Failed'}</strong>`,
              text: response.data.message,
              icon: response.data.success === true ? 'success' : 'error'
            });
            setStatus(false);
            if (response.data.success === true) {
              LoadData();
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "<strong>Error</strong>",
              html: error,
              icon: 'error'
            });
          });
      }
    });
  }

  const [comment, setComment] = useState("");

const handleAddComment = () => {
  const headers = {
    token: `${token}`,
    'Content-Type': 'application/json',
  };
  
  const formData = {
    order_id: order_id,
    comment: comment,
    user_id: localStorage.getItem("user_id")
  };

  axios.post(`${apiURL}Orders/AddComment`, formData, { headers })
    .then((response) => {
      Swal.fire({
        title: `<strong>${response.data.success ? 'Success' : 'Error'}</strong>`,
        text: response.data.message,
        icon: response.data.success ? 'success' : 'error'
      });
      if (response.data.success) {
        setComment(""); // Clear the comment field
        LoadComments(); // Refresh data to show new comment
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

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={`Order Details`} primary={`Home`} />

        
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      Order ID {orderInfo && orderInfo.order_id} 
                      {timelines.slice(-1)[0] && <span className="badge bg-primary ml-5" style={{marginLeft: '10px'}}>{timelines.slice(-1)[0].ot_order_status_label }</span>}
                    </h5>
                    <div className="flex-shrink-0">
                      {/* <Link to="apps-invoices-details.html" className="btn btn-success btn-label right btn-sm"><i className="ri-download-2-fill align-middle me-1"></i> Invoice</Link> */}

                      <button
                        type="button"
                        className="btn btn-info btn-label waves-effect right waves-light btn-sm mx-2"
                        data-bs-toggle="modal"
                        id="create-btn"
                        data-bs-target="#showModal" >
                        <i className="  ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                        Shipping
                      </button>
                      <DeliverModal
                        order_id={orderInfo && orderInfo.order_id}
                        first_name={first_name}
                        part_number={part_number}
                      />

                      <LabelPrint orderInfo={orderInfo} />


                      <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Change Status</button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#assignModal" href="#">Assigned</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(2, 'Order has been accepted')} href="#">Accepted</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(3, 'Order has been packed')} href="#">Packed</a>
                          <a className="dropdown-item" 
                         
                        data-bs-toggle="modal"
                        id="create-btn"
                        data-bs-target="#showModal" href="#">Shipped</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(5, 'Order has been delivered')} href="#">Deliver</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(6, 'Order has been cancelled')} href="#">Cancelled</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(7, 'Order has been returned')} href="#">Rerturn</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(8, 'Order has been returned collected')} href="#">Rerturn Collected</a>
                          <a className="dropdown-item" onClick={() => handleChangeStatus(9, 'Order has been returned received')} href="#">Rerturn Received</a>

                        </div>
                      </div>
                      <button
                        type="button"

                        data-bs-toggle="modal"
                        id="create-btn"
                        data-bs-target="#showPrintLabelModal"
                        className="btn btn-primary btn-label waves-effect right waves-light btn-sm mx-2">
                        <i className=" ri-printer-line label-icon align-middle fs-16 ms-2"></i>
                        Label Print
                      </button>
                      
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table table-nowrap align-middle table-borderless mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col" width="30%"> Customer Name </th>
                          <th scope="col" width="30%" className="text-center"> {" "} Address </th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex">
                              <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                                <img
                                  src="https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg"
                                  alt=""
                                  className="img-fluid d-block"
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <NavLink
                                  to={`/CustomerDetails`}
                                  className="text-body">
                                  {" "}
                                  <h5 className="fs-14">{`${orderInfo.first_name} ${orderInfo.last_name}`}</h5>
                                </NavLink>
                                <p className="text-muted mb-0">
                                  Customer ID:{" "}
                                  <span className="fw-medium">
                                    {orderInfo.customer_id}
                                  </span>
                                </p>
                                <p className="text-muted mb-0">
                                  Email:{" "}
                                  <span className="fw-medium text-primary">
                                    {orderInfo.email_address}
                                  </span>
                                </p>
                                <p>
                                  Mobile: <span className="fw-medium">{`${orderInfo.country_code} ${orderInfo.mobile_number}`}</span>
                                </p>
                              </div>
                            </div>
                          </td>


                          <td className="text-center">
                            {orderInfo.address_json && (
                              <>
                                <p>
                                  {
                                    JSON.parse(orderInfo.address_json)
                                      .apartment
                                  }
                                  , &nbsp;
                                  {
                                    JSON.parse(orderInfo.address_json)
                                      .complete_address
                                  }
                                </p>
                                <p>
                                  {JSON.parse(orderInfo.address_json).city} -{" "}
                                  {JSON.parse(orderInfo.address_json).pincode}
                                  , {orderInfo && JSON.parse(orderInfo.address_json).state}
                                </p>
                                <p>
                                  {JSON.parse(orderInfo.address_json).country}
                                  .
                                </p>
                              </>
                            )}
                          </td>

                          
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="table-responsive table-card">
                        <table className="table table-nowrap align-middle table-borderless mb-0">
                          <thead className="table-light text-muted">
                            <tr>
                              <th scope="col" width="100%">
                                Order Timeline / Logs
                              </th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                      <div className="profile-timeline">
                        <div className="accordion accordion-flush" id="accordionFlushExample">
                          {timelines && timelines.map((item) => {
                            return <div className="accordion-item border-0">
                              <div className="accordion-header" id="headingThree">
                                <a className="accordion-button p-2 shadow-none" data-bs-toggle="collapse" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 avatar-xs">
                                      <div className="avatar-title bg-success rounded-circle">
                                        <OrderStatusIcons status={item.ot_order_status_id} />
                                      </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                      <h6 className="fs-14 mb-1">{item.ot_order_status_label} -  <span className="fw-normal">{item.ot_datetime}</span></h6>
                                    </div>

                                  </div>
                                </a>
                              </div>
                              {
                                item.ot_order_status_text &&
                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                  <div className="accordion-body ms-2 ps-5 pt-0">
                                    <p className="fs-14 mb-1">{item.ot_order_status_text}</p>
                                  </div>
                                </div>
                              }
                              {
                                item.ot_order_status_remark &&
                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                  <div className="accordion-body ms-2 ps-5 pt-0">
                                    <p className="fs-14 mb-1">Remark: {item.ot_order_status_remark}</p>
                                  </div>
                                </div>
                              }
                              {
                                item.user_name &&
                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                  <div className="accordion-body ms-2 ps-5 pt-0">
                                    <p className="fs-14 mb-1">Status By: {item.user_name}</p>
                                  </div>
                                </div>
                              }
                              {
                                orderInfo && Number(item.ot_order_status_id) === 4 &&

                                <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                  <div className="accordion-body ms-2 ps-5 pt-0">
                                    <h6 className="fs-14">Shipped By - {orderInfo.shipping_by}</h6>
                                    <h6 className="fs-14">Expected delivery date - {orderInfo.shipping_expected_date}</h6>
                                    <h6 className="mb-1"> Tracking Number: {orderInfo.shipping_tracking_number}</h6>
                                    <h6 className="mb-1"> <a style={{ color: 'blue' }} target="_blank" href={orderInfo.shipping_tracking_link} rel="noreferrer" >Consignment Tracking Link</a></h6>
                                    <p className="text-muted mb-0">{item.ot_datetime}</p>
                                  </div>
                                </div>
                              }
                            </div>
                          })}

                        </div>

                      </div>



                    </div>

                    <div
                      className="col-md-4 pr-5"
                      style={{ borderLeft: "1px solid #CCC", paddingRight: '20px' }}>
                      <div className="table-responsive table-card">
                        <table className="table table-nowrap align-middle table-borderless mb-0">
                          <thead className="table-light text-muted">
                            <tr>
                              <th scope="col" width="30%"> Product Details </th>
                              <th scope="col" width="15%">
                                Purchase At
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length === 0 ? (
                              <tr>
                                <td colSpan={5}>
                                  <NoRecords />
                                </td>
                              </tr>
                            ) : (
                              rows.order_items.map((row) => {
                                return (
                                  <tr key={`catkey-${row.order_id}`}>
                                    <td>
                                      <div className="d-flex">
                                        <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                                          <img
                                            src="https://5.imimg.com/data5/ES/XU/MY-21701725/car-filter-500x500.jpg"
                                            alt=""
                                            className="img-fluid d-block"
                                          />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                          <h5 className="fs-14">
                                            <a
                                              href="apps-ecommerce-product-details.html"
                                              className="text-body">
                                              {row.item_title}
                                            </a>
                                          </h5>
                                          <p className="text-muted mb-0">
                                            Part Number:{" "}
                                            <span className="fw-medium">
                                              {row.item_number}
                                            </span>
                                          </p>
                                          <p className="text-muted mb-0">
                                            Part QTY:{" "}
                                            <b>{row.item_qty}</b>
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    
                                    <td>
                                      <td className="text-center text-info fw-semibold">
                                        {" "}
                                        {row.item_display_price}{" "} 
                                        
                                      </td>
                                    </td>
                                    
                                  </tr>
                                );
                              })
                            )}



                            <tr className="border-top border-top-dashed">
                             
                              <td colspan="2" className="fw-medium p-0">
                                <table className="table table-borderless mb-0">
                                  <tbody>
                                    <tr>
                                      <td>Sub Total :</td>
                                      <td className="text-end text-success fw-semibold">{`${orderInfo.sub_total_display}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Customer UID :</td>
                                      <td className="text-end ">
                                        {orderInfo.order_uid}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Discount Coupon :</td>
                                      <td className="text-end ">
                                        {orderInfo.discount_copoun}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Discounted Amount :</td>
                                      <td className="text-end text-success">
                                        -
                                        {`${orderInfo.currency} ${orderInfo.discounted_amount}`}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Free Shipping Eligible :</td>
                                      <td className="text-end">
                                        {orderInfo.free_shipping_eligible}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Shipping Charges :</td>
                                      <td className="text-end text-warning">{`${orderInfo.display_shipping_cost}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Shipping By :</td>
                                      <td className="text-end">
                                        {orderInfo.shipping_by}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Payment Method :</td>
                                      <td className="text-end">
                                        {orderInfo.payment_method}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>COD Charges :</td>
                                      <td className="text-end text-warning">{`${orderInfo.display_cod_charges}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Online Payment Vendor :</td>
                                      <td className="text-end">
                                        {orderInfo.online_payment_vendor}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Online Payment ID :</td>
                                      <td className="text-end">
                                        {orderInfo.online_payment_id}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Online Payment Response :</td>
                                      <td className="text-end">
                                        {orderInfo.online_payment_response}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Order Datetime :</td>
                                      <td className="text-end">
                                        {orderInfo.order_datetime}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Grand Total :</td>
                                      <td className="text-end text-success fw-semibold">{`${orderInfo.grand_total_display}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Customer Name :</td>
                                      <td className="text-end  fw-semibold">{`${orderInfo.first_name} ${orderInfo.last_name}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Email Address :</td>
                                      <td className="text-end text-primary">
                                        {orderInfo.email_address}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Mobile Number :</td>
                                      <td className="text-end">{`${orderInfo.country_code} ${orderInfo.mobile_number}`}</td>
                                    </tr>
                                    <tr>
                                      <td>Address :</td>
                                      <td className="text-end">
                                        {orderInfo.address_json && (
                                          <>
                                            {/* <p><strong>{JSON.parse(orderInfo.address_json).company_name}</strong></p> */}
                                            <p>
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).apartment
                                              }
                                              , &nbsp;
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).complete_address
                                              }
                                            </p>
                                            <p>
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).city
                                              }{" "}
                                              -{" "}
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).pincode
                                              }
                                              ,{" "}
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).state
                                              }
                                            </p>
                                            <p>
                                              {
                                                JSON.parse(
                                                  orderInfo.address_json
                                                ).country
                                              }
                                              .
                                            </p>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* //////////////////////////////////end of table 1 ///////////////////////////////////////////////////////// */}
                      </div>
                    </div>
                    <div
                      className="col-md-4 pr-5"
                      style={{ borderLeft: "1px solid #CCC", paddingRight: '20px' }}>
                        <div className="table-responsive table-card">
                        <table className="table table-nowrap align-middle table-borderless mb-0">
                          <thead className="table-light text-muted">
                            <tr>
                              <th scope="col"> Comments </th>
                            </tr>
                          </thead>
                          <tbody>
                              <tr>
                                <td>
                                  <textarea onChange={(e) => setComment(e.target.value)} className="form-control" placeholder="Enter your comment here"></textarea>
                                </td>
                                <td><button  onClick={handleAddComment} type="button" className="btn btn-primary">Add</button></td>
                              </tr>
                              {
                                comments && comments.map((com) => {
                                  return <tr>
                                    <td colspan={2}>
                                      {com.order_comment_text} <br />
                                      <span style={{left: 10, position: 'absolute', color: '#999'}}><small>By {com.user_name}</small></span>
                                      <span style={{right: 5, position: 'absolute' }}><i><small>{com.order_comment_date}</small></i></span>
                                      
                                    </td>
                                  </tr>
                                })
                              }
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
      </div>
      <NewInvoice order_id={order_id} />
      {/* <div ref={printRef} >{orderInfo && <Invoice order={rows} />}</div> */}
      <OrderAssign order_id={order_id} />
    </div>
  );
};

export default OrderDetails;
