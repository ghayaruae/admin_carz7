import React, { Component } from "react";
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../Components/PageTitle";
import { Link, NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../../Components/Shimmer";
import withRouter from "../../../Utils/withRouter";
import DeliverModal from "./DeliverModal";
import ParentComponent from "./ParentComponent";
import LabelPrint from "./LabelPrint";
import OrderStatusIcons from "../../../Utils/Helper";
import Invoice from "./Invoice";
class OrderDetails extends Component {
  static contextType = ConfigContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      first_name: "",
      part_number: "",
      orderInfo: [],
      orderItems: [],
      rows: [],
      next: false,
      prev: false,
      page: 1,
      total_records: 0,
      total_pages: 0,
      status: false,
      limit: 5,
      timelines: [],
    };
  }

  LoadData() {
    const { apiURL } = this.context;
    const { token } = this.context;
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json", // Set the content type to JSON if needed
    };
    var order_id = this.props.params.order_id;
    /* console.log(`${apiURL}orders/GetOrderDetails?lang=en&order_id=${order_id}`) */
    axios
      .get(
        `${apiURL}orders/GetOrderDetails?lang=en&order_id=${order_id}`,
        headers
      )
      .then((response) => {
        // Handle the API response here
        var data = response.data;
        // var orderInfo = response.data.data.order_info[0];
        // var orderItems = response.data.data.order_items[0];

        console.log("data : ", data);
        if (response.data.success === true) {
          this.setState({
            orderInfo: response.data.data.order_info[0],
            orderItems: response.data.data.order_items[0],
            first_name: response.data.data.order_info[0].first_name,
            part_number: response.data.data.order_items[0].part_number,
            timelines: response.data.data.timelines,
            rows: data.data,
            next: data.next,
            prev: data.prev,
            page: data.page,
            total_records: data.total_records,
            total_pages: data.total_pages,
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
        // Handle any errors that occur during the request
        // console.error('API Error:', error);
        Swal.fire({
          title: <strong>Error</strong>,
          html: error,
          icon: "error",
        });
      });
  }
  componentDidMount() {
    this.LoadData();
  }
  orderShipping = () => {
    var formData = {
      order_id: this.state.order_id,
      shipping_company: this.state.shipping_company,
    };
  };

  handlePrev = (ev) => {
    // console.log(this.state.prev);
    if (this.state.prev === true) {
      this.setState(
        (prevState) => {
          return { page: prevState.page - 1 };
        },
        () => {
          this.LoadData(); // This will log the updated state value
        }
      );
    }
  };
  handleNext = () => {
    if (this.state.next === true) {
      this.setState(
        (prevState) => {
          return { page: prevState.page + 1 };
        },
        () => {
          this.LoadData(); // This will log the updated state value
        }
      );
    }
  };
  handleChange = (e) => {
    // console.log("calling");
    this.setState(
      (prevState) => {
        return { page: parseInt(e.target.value, 10) };
      },
      () => {
        this.LoadData(); // This will log the updated state value
      }
    );
  };

  render() {
    const { placeHolderImageURL } = this.context;
    const { orderInfo, orderItems, rows, part_number, first_name } = this.state;
    const { onDeliverClick } = this.props;

    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <br />
            <PageTitle title={`Order Details`} primary={`Home`} />
            {orderInfo && <Invoice order={this.state.rows} />}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <h5 className="card-title flex-grow-1 mb-0">
                        Order ID {orderInfo.order_id}
                      </h5>
                      <div className="flex-shrink-0">
                        {/* <Link to="apps-invoices-details.html" className="btn btn-success btn-label right btn-sm"><i className="ri-download-2-fill align-middle me-1"></i> Invoice</Link> */}

                        <button
                          type="button"
                          className="btn btn-info btn-label waves-effect right waves-light btn-sm mx-2"
                          data-bs-toggle="modal"
                          id="create-btn"
                          data-bs-target="#showModal"
                          onClick={onDeliverClick}>
                          <i className="  ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                          Shipping
                        </button>
                        <DeliverModal
                          order_id={orderInfo && orderInfo.order_id}
                          first_name={first_name}
                          part_number={part_number}
                        />

                        <LabelPrint  />


                        <button
                          type="button"
                         
                          data-bs-toggle="modal"
                          id="create-btn"
                          data-bs-target="#showPrintLabelModal" 
                          className="btn btn-primary btn-label waves-effect right waves-light btn-sm mx-2">
                          <i className=" ri-printer-line label-icon align-middle fs-16 ms-2"></i>
                          Label Print
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-label waves-effect right waves-light btn-sm mx-2">
                          <i className="ri-mail-check-line label-icon align-middle fs-16 ms-2"></i>{" "}
                          Mail Invoice
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-label waves-effect right waves-light btn-sm mx-2">
                          <i className="ri-download-2-line label-icon align-middle fs-16 ms-2"></i>
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-nowrap align-middle table-borderless mb-0">
                        <thead className="table-light text-muted">
                          <tr>
                            <th scope="col" width="30%">
                              Customer Name
                            </th>
                            <th scope="col" width="20%" className="text-center">
                              Mobile Number
                            </th>

                            <th scope="col" width="30%" className="text-center">
                              {" "}
                              Address
                            </th>
                            <th scope="col" width="20%" className="text-center">
                              Company Name
                            </th>
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
                                </div>
                              </div>
                            </td>
                            <td className="text-center d-flex align-items-start justify-content-center">{`${orderInfo.country_code} ${orderInfo.mobile_number}`}</td>

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
                                    , {JSON.parse(orderInfo.address_json).state}
                                  </p>
                                  <p>
                                    {JSON.parse(orderInfo.address_json).country}
                                    .
                                  </p>
                                </>
                              )}
                            </td>

                            <td className="text-center d-flex align-items-start justify-content-center">
                              {orderInfo.address_json && (
                                <>
                                  <p>
                                    <strong>
                                      {
                                        JSON.parse(orderInfo.address_json)
                                          .company_name
                                      }
                                    </strong>
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
                            {this.state.timelines && this.state.timelines.map((item) => {
                                return <div className="accordion-item border-0">
                                        <div className="accordion-header" id="headingThree">
                                            <a className="accordion-button p-2 shadow-none" data-bs-toggle="collapse" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 avatar-xs">
                                                        <div className="avatar-title bg-success rounded-circle">
                                                            <OrderStatusIcons status={item.ot_order_status_id}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="fs-14 mb-1">{item.ot_order_status_label} -  <span className="fw-normal">{item.ot_datetime}</span></h6>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        {
                                        orderInfo && Number(item.ot_order_status_id) === 4 && 
                                            
                                        <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                            <div className="accordion-body ms-2 ps-5 pt-0">
                                                <h6 className="fs-14">Shipped By - {orderInfo.shipping_by}</h6>
                                                <h6 className="fs-14">Expected delivery date - {orderInfo.shipping_expected_date}</h6>
                                                <h6 className="mb-1"> Tracking Number: {orderInfo.shipping_tracking_number}</h6>
                                                <h6 className="mb-1"> <a style={{color: 'blue'}} target="_blank" href={orderInfo.shipping_tracking_link} rel="noreferrer" >Consignment Tracking Link</a></h6>
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
                        className="col-md-8"
                        style={{ borderLeft: "1px solid #CCC" }}>
                        <div className="table-responsive table-card">
                          <table className="table table-nowrap align-middle table-borderless mb-0">
                            <thead className="table-light text-muted">
                              <tr>
                                <th scope="col" width="30%">
                                  Product Details
                                </th>
                                
                                <th
                                  scope="col"
                                  width="15%"
                                  className="text-center">
                                  Quantity
                                </th>
                                <th scope="col" width="15%">
                                  Purchase At
                                </th>
                                <th
                                  scope="col"
                                  width="10%"
                                  className="text-end">
                                  Total Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.rows.length === 0 ? (
                                <tr>
                                  <td colSpan={5}>
                                    <NoRecords />
                                  </td>
                                </tr>
                              ) : (
                                this.state.rows.order_items.map((row) => {
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
                                                {row.part_title}
                                              </a>
                                            </h5>
                                            <p className="text-muted mb-0">
                                              Part Number:{" "}
                                              <span className="fw-medium">
                                                {row.part_number}
                                              </span>
                                            </p>
                                            <p className="text-muted mb-0">
                                              Part Brand:{" "}
                                              <span className="fw-medium">
                                                {row.part_brand}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      
                                      <td className="text-center">
                                        {row.part_qty}
                                      </td>
                                      <td>
                                        <td className="text-center text-info fw-semibold">
                                          {" "}
                                          {row.item_display_price}{" "}
                                        </td>
                                      </td>
                                      <td className="text-end text-success fw-semibold">{`${orderInfo.currency} ${orderInfo.sub_total}`}</td>
                                    </tr>
                                  );
                                })
                              )}

                             

                              <tr className="border-top border-top-dashed">
                                <td colspan="3"></td>
                                <td colspan="2" className="fw-medium p-0">
                                  <table className="table table-borderless mb-0">
                                    <tbody>
                                      <tr>
                                        <td>Sub Total :</td>
                                        <td className="text-end text-success fw-semibold">{`${orderInfo.currency} ${orderInfo.sub_total}`}</td>
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
                                        <td className="text-end text-warning">{`${orderInfo.currency} ${orderInfo.shipping_charges}`}</td>
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
                                        <td className="text-end text-warning">{`${orderInfo.currency} ${orderInfo.COD_charges}`}</td>
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
                                        <td className="text-end text-success fw-semibold">{`${orderInfo.currency} ${orderInfo.grand_total}`}</td>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(OrderDetails);
