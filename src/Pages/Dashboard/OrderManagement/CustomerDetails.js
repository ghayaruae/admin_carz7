import React, { Component } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import PageTitle from "../../../Components/PageTitle";
import { NavLink } from 'react-router-dom';
import { TableRows, NoRecords } from '../../../Components/Shimmer'
import withRouter from '../../../Utils/withRouter';
class CustomerDetails extends Component {
    static contextType = ConfigContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeTab: "overview-tab", // Initial active tab
            customerInfo: [],
            orderItems: [],
            rows: [],
            rows1: [],
            rows2: [],
            next: false,
            prev: false,
            page: 1,
            total_records: 0,
            total_pages: 0,
            status: false,
            limit: 10,
        };
    }
    LoadData() {
        const { apiURL } = this.context;
        const { token } = this.context;
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed


        };
        var customer_id = this.props.params.customer_id;
        /* console.log(`${apiURL}orders/GetCustomerDetails?lang=en&customer_id=${customer_id}`) */
        axios
            .get(`${apiURL}orders/GetCustomerProfile?customer_id=${customer_id}`, { params: { limit: this.state.limit, page: this.state.page }, headers })
            .then((response) => {

                // Handle the API response here
                var data = response.data;

                // var orderInfo = response.data.data.order_info[0];
                // var orderItems = response.data.data.order_items[0];

                console.log("data : ", data);
                if (response.data.success === true) {
                    this.setState({
                        customerInfo: response.data.data.customer_info[0],
                        rows: data.data.orders,
                        rows1: data.data.cart,
                        rows2: data.data.wishlist,
                        next: data.next,
                        prev: data.prev,
                        page: data.page,
                        total_records: data.total_records,
                        total_pages: data.total_pages
                    });

                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    })
                }
            })

            .catch((error) => {
                // Handle any errors that occur during the request
                // console.error('API Error:', error);
                Swal.fire({
                    title: <strong>Error</strong>,
                    html: error,
                    icon: 'error'
                })
            });

    }
    componentDidMount() {
        this.LoadData();
    }

    handlePrev = (ev) => {
        // console.log(this.state.prev);
        if (this.state.prev === true) {
            this.setState((prevState) => {
                return { page: prevState.page - 1 };
            }, () => {
                this.LoadData(); // This will log the updated state value
            });
        }
    }
    handleNext = () => {

        if (this.state.next === true) {
            this.setState((prevState) => {
                return { page: prevState.page + 1 };
            }, () => {
                this.LoadData(); // This will log the updated state value
            });
        }
    }
    handleChange = (e) => {
        // console.log("calling");
        this.setState((prevState) => {
            return { page: parseInt(e.target.value, 10) };
        }, () => {
            this.LoadData(); // This will log the updated state value
        });
    }

    handleTabClick = (tabId) => {
        this.setState({ activeTab: tabId });
    };

    render() {
        const { placeHolderImageURL } = this.context;
        const { customerInfo, orderItems, rows, activeTab, tabId } = this.state;
        // console.log('rows :::' , rows)

        return (

            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <br />
                        <PageTitle title={`Customer Details`} primary={`Home`} />
                        <br />
                        <div className="profile-foreground position-relative mx-n4 mt-n4">
                            <div className="profile-wid-bg">
                                <img src="https://themesbrand.com/velzon/html/saas/assets/images/profile-bg.jpg" alt="" className="profile-wid-img" />
                            </div>
                        </div>

                        <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                            <div className="row g-4">
                                <div className="col-auto">
                                    <div className="avatar-lg">
                                        <img src="https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg" alt="user-img" className="img-thumbnail rounded-circle" />
                                    </div>
                                </div>
                                {/* <!--end col--> */}
                                <div className="col">
                                    <div className="p-2">
                                        <h3 className="text-white mb-1">{`${customerInfo.first_name} ${customerInfo.last_name}`}</h3>
                                        <p className="text-white text-opacity-100">{customerInfo.email_address}</p>
                                        <p className="text-white text-opacity-100">{`${customerInfo.country_code} ${customerInfo.mobile_number}`}</p>
                                        {/* <div className="hstack text-white-50 gap-1">
                                        <div className="me-2"><i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>California,
                                            United States</div>
                                        <div><i className="ri-building-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>Themesbrand
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                                {/* <!--end col--> */}
                                <div className="col-12 col-lg-auto order-last order-lg-0">
                                    <div className="row text text-white-50 text-center">
                                        <div className="col-lg-6 col-4">
                                            <div className="p-2">
                                                <h4 className="text-white mb-1">100</h4>
                                                <p className="fs-14 mb-0">Total Order</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-4">
                                            <div className="p-2">
                                                <h4 className="text-white mb-1">5</h4>
                                                <p className="fs-14 mb-0">Pending Order</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!--end col--> */}

                            </div>
                            {/* <!--end row--> */}
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div>
                                    <div className="d-flex profile-wrapper">
                                        {/* <!-- Nav tabs --> */}
                                        <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link fs-14 active " data-bs-toggle="tab" href="#overview-tab" role="tab">
                                                    <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Customer Info</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link fs-14 " data-bs-toggle="tab" href="#activities" role="tab">
                                                    <i className="ri-list-unordered d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Orders</span>
                                                </a>
                                            </li>
                                            {/* <li className="nav-item">
                                                <a className="nav-link fs-14" data-bs-toggle="tab" href="#projects" role="tab">
                                                    <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Cart</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link fs-14" data-bs-toggle="tab" href="#documents" role="tab">
                                                    <i className="ri-folder-4-line d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Whish List</span>
                                                </a>
                                            </li> */}
                                        </ul>

                                        <div className="flex-shrink-0">
                                            <a href="pages-profile-settings.html" className="btn btn-success"><i className="ri-edit-box-line align-bottom"></i> Edit Profile</a>
                                        </div>
                                    </div>
                                    {/* <!-- Tab panes --> */}
                                    <div className="tab-content pt-4 text-muted">
                                        <div className="tab-pane active" id="overview-tab" role="tabpanel">
                                            <div className="row">
                                                <div className="col-xxl-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title mb-5">Complete Your Profile</h5>
                                                            <div className="progress animated-progress custom-progress progress-label">
                                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                                                                    <div className="label">30%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title mb-3">Info</h5>
                                                            <div className="table-responsive">
                                                                <table className="table table-borderless mb-0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Full Name :</th>
                                                                            <td className="text-muted">{`${customerInfo.first_name} ${customerInfo.last_name}`}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Mobile :</th>
                                                                            <td className="text-muted">{`${customerInfo.country_code} ${customerInfo.mobile_number}`}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">E-mail :</th>
                                                                            <td className="text-muted">{customerInfo.email_address}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Password :</th>
                                                                            <td className="text-muted">{customerInfo.password}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Customer Status :</th>
                                                                            <td className="text-muted">{customerInfo.customer_status}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Created Date :</th>
                                                                            <td className="text-muted">{customerInfo.created_date}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Registered From :</th>
                                                                            <td className="text-muted">{customerInfo.registered_from}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="ps-0" scope="row">Last Login From :</th>
                                                                            <td className="text-muted">{customerInfo.last_login_from}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>{/* <!-- end card body --> */}
                                                    </div>{/* <!-- end card --> */}

                                                </div>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-4">Portfolio</h5>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            <div>
                                                                <a href="javascript:void(0);" className="avatar-xs d-block">
                                                                    <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                                        <i className="ri-github-fill"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <a href="javascript:void(0);" className="avatar-xs d-block">
                                                                    <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                                        <i className="ri-global-fill"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <a href="javascript:void(0);" className="avatar-xs d-block">
                                                                    <span className="avatar-title rounded-circle fs-16 bg-success">
                                                                        <i className="ri-dribbble-fill"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <a href="javascript:void(0);" className="avatar-xs d-block">
                                                                    <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                                        <i className="ri-pinterest-fill"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>{/* <!-- end card body --> */}
                                                </div>{/* <!-- end card --> */}

                                                {/* ////////////////////////////////////////////////order Tab///////////////////////////////////// */}
                                            </div>

                                        </div>

                                        <div className="tab-pane fade" id="activities" role="tabpanel">

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="card" >
                                                        <div className="card-header align-items-center d-flex">

                                                            <h4 className="card-title mb-0 flex-grow-1">Order History</h4>



                                                        </div>
                                                        <div className="card-body">
                                                            <div className="table-responsive">
                                                                <table className="table table-striped text-center ">
                                                                    <thead className=''>
                                                                        <tr>



                                                                            <th scope="col" width="10%">Order ID</th>
                                                                            <th scope="col" width="10%">Order UID</th>







                                                                            <th scope="col" width="15%">Shipping By</th>
                                                                            <th scope="col" width="15%">Payment Method</th>
                                                                            <th scope='col' width="15%">Sub Total</th>
                                                                            <th scope="col" width="15%">Grand Total</th>
                                                                            <th scope="col" width="20%">Order Date</th>



                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className=''>
                                                                        {

                                                                            this.state.rows.length === 0 ?
                                                                                <tr><td colSpan={5}><NoRecords /></td></tr> : this.state.rows.map((row) => {





                                                                                    return <tr key={`catkey-${row.order_id}`}>
                                                                                        <NavLink to={`/OrderDetails/${row.order_id}`}><th scope='row' className='text-primary '>{row.order_id}</th></NavLink>





                                                                                        {/* <NavLink to={`/CustomerDetails/${row.customer_id}`}>  <td className='text-info'>{`${row.first_name} ${row.last_name}`}</td></NavLink> */}

                                                                                        <td className="text-info">

                                                                                            {row.order_uid}
                                                                                        </td>



                                                                                        <td className="">
                                                                                            {row.shipping_by}
                                                                                        </td>
                                                                                        <td className="">
                                                                                            {row.payment_method}
                                                                                        </td>
                                                                                        <td className='text-success fw-semibold'>{row.sub_total_display}</td>
                                                                                        <td className='text-success fw-semibold'>{row.grand_total_display}</td>

                                                                                        {/* <td>{row.currency}</td> */}
                                                                                        <td>{row.order_datetime}</td>



                                                                                    </tr>
                                                                                })


                                                                        }






                                                                    </tbody>
                                                                    <tfoot className='table-light'>
                                                                        <tr>
                                                                            <th colSpan={10} >
                                                                                <div className="d-flex justify-content-between" >
                                                                                    <button disabled={this.state.prev === false && this.state.status === false ? true : false} type="button" onClick={() => this.handlePrev()} className={`btn btn-warning btn-label waves-effect waves-light`}><i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous</button>
                                                                                    <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        {
                                                                                            <small>Total Records: {this.state.total_records} | Total Pages: {this.state.total_pages} | Current Page: {this.state.page}</small>
                                                                                        }
                                                                                    </div>
                                                                                    <div className='col-md-2'>
                                                                                        <select className="form-select" onChange={(e) => this.handleChange(e)}>
                                                                                            {Array.from({ length: this.state.total_pages }, (_, i) => (
                                                                                                <option selected={this.state.page === i + 1} key={i} value={i + 1}>Page {i + 1}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </div>
                                                                                    <button disabled={this.state.next === false && this.state.status === false ? true : false} type="button" onClick={() => this.handleNext()} className={`btn btn-primary btn-label waves-effect right waves-light`}><i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next</button>
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
                            </div>
                        </div>


                        {/* ///////////////////////////////////////////// */}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CustomerDetails);