import React, { useState, useContext, useEffect } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import PageTitle from "../../../Components/PageTitle";
import { Bars, Circle, Circles, Audio, Vortex } from 'react-loader-spinner';
import { NoRecords } from '../../../Components/Shimmer';
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const OrderManagement = () => {

    const [rows, setRows] = useState([]);
    const [rowsStat, setRowsStat] = useState([]);
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [page, setPage] = useState(1);
    const [total_records, setTotalRecords] = useState(0);
    const [total_pages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [ordersCount, setOrdersCount] = useState(0);
    const [status, setStatus] = useState(1);
    const [error, setError] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { apiURL, token, placeHolderImageURL } = useContext(ConfigContext);
    
    useEffect(() => {
        LoadData();
    }, [page, limit ])
    const getOrderStat = () => {


        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed
        };
        axios
            .get(`${apiURL}orders/GetOrderStats`, { headers })
            .then((response) => {
                setStatus(false)
                // Handle the API response here
                var data = response.data;
                if (response.data.success === true) {
                    setRowsStat(data.data);
                    setOrdersCount(data.data.today_orders);


                } else {
                    setStatus(false);

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
                setStatus(false);

                Swal.fire({
                    title: <strong>Error</strong>,
                    html: error,
                    icon: 'error'
                })
            });

    }

    const LoadData = () => {

        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed


        };
        axios
            .get(`${apiURL}orders/GetOrders?lang=en`, { params: { limit: limit, page: page, from_date: fromDate, to_date: toDate }, headers })
            .then((response) => {

                // Handle the API response here
                var data = response.data;
                if (response.data.success === true) {
                    setRows(data.data);

                    setNext(data.next)
                    setPrev(data.prev)
                    setPage(data.page)
                    setTotalRecords(data.total_records)
                    setTotalPages(data.total_pages)
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
    useEffect(() => {
        LoadData();
        getOrderStat();

    }, [])
    const handleDeleteCoupon = (id) => {

        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed
        };
        Swal.fire(
            {
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }
        ).then((result) => {
            if (result.isConfirmed) {
                setStatus(true);
                const formData = {
                    order_id: id
                };
                axios
                    .post(`${apiURL}Offers/DeleteCoupon`, formData, { headers })
                    .then((response) => {

                        Swal.fire({
                            title: `<strong>${response.data.success === true ? 'Success' : 'Failed'}</strong>`,
                            text: response.data.message,
                            icon: response.data.success === true ? 'success' : 'error'
                        })
                        setStatus(false);
                        if (response.data.success === true) {
                            LoadData();
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
        });
    }

    const handlePrev = (ev) => {
        // console.log(prev);
        if (prev === true) {
            setPage(prevPage => {
                const newPage = prevPage - 1;
                return newPage;
            });
        }
    }
    const handleNext = () => {

        if (next === true) {
            setPage(prevPage => {
                const newPage = prevPage - +1;
                return newPage;
            });

        }
    }
    const handleChange = (e) => {
        setPage(prevPage => {
            const newPage = parseInt(e.target.value, 10);
            return newPage;
        });
    }
    const renderCustomerLink = (customerId, firstName, lastName) => {
        return (
            <NavLink to={`/CustomerDetails/${customerId}`} className="customer-link">
                {`${firstName} ${lastName}`}
            </NavLink>
        );
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
        saveAs(data, "orders.xlsx");
    }





    return (

        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">

                    <br />
                    <PageTitle title={`Order Management`} primary={`Home`} />
                    {/* //////////////////////////////////////////////////////////////////////// */}


                    <div className="row">

                        <div className="col-xl-3 col-md-6">
                            {/*  <!-- card --> */}
                            <div className="card card-animate">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                Today's Orders</p>

                                        </div>

                                    </div>
                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                        <div>
                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value text-info" data-target={ordersCount}> {rowsStat.today_orders ?? 0}</span>
                                            </h4>

                                            <NavLink to="" className="text-decoration-underline text-muted">View  Order Report</NavLink>
                                        </div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className="avatar-title bg-success-subtle rounded fs-3">
                                                <Audio color="blue" size='1' height={30} width={30} />
                                            </span>
                                        </div>
                                    </div>
                                </div>{/* <!-- end card body --> */}
                            </div>{/* <!-- end card --> */}
                        </div>{/* <!-- end col --> */}

                        <div className="col-xl-3 col-md-6">
                            {/*  <!-- card --> */}
                            <div className="card card-animate">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                Today's Delivered Orders</p>
                                        </div>

                                    </div>
                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                        <div>
                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value text-success" data-target="368">{status ? (<Audio color="green" size='1' height={30} width={30} />) : error ? (<p className="error-message text-warning fs-5">{error}</p>) : rowsStat.today_delivered_orders}</span></h4>
                                            <NavLink to="" className="text-decoration-underline text-muted">View  Delivered Order Report</NavLink>
                                        </div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className="avatar-title bg-info-subtle rounded fs-3">
                                                <Audio color="green" size='1' height={30} width={30} />
                                            </span>
                                        </div>
                                    </div>
                                </div>{/* <!-- end card body --> */}
                            </div>{/* <!-- end card --> */}
                        </div>{/* <!-- end col --> */}
                        <div className="col-xl-3 col-md-6">

                            <div className="card card-animate">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                Pending Orders</p>
                                        </div>

                                    </div>
                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                        <div>
                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value text-danger" data-target="165">{status ? (<Audio color="red" size='1' height={30} width={30} />) : error ? (<p className="error-message text-warning fs-5">{error}</p>) : rowsStat.pending_orders}</span>

                                            </h4>
                                            <NavLink to="" className="text-decoration-underline text-muted">View  Pending Order Report</NavLink>
                                        </div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className="avatar-title bg-primary-subtle rounded fs-3">
                                                <Audio color="red" size='1' height={30} width={30} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="card card-animate">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                Inprocess Orders</p>
                                        </div>

                                    </div>
                                    <div className="d-flex align-items-end justify-content-between mt-4">
                                        <div>
                                            <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value text-primary" data-target="2">{status ? (<Audio color="blue" size='1' height={30} width={30} />) : error ? (<p className="error-message text-warning fs-5">{error}</p>) : rowsStat.inprocess_orders}</span>
                                            </h4>
                                            <NavLink to="" className="text-decoration-underline text-muted">View  Inprocess Order Report</NavLink>
                                        </div>
                                        <div className="avatar-sm flex-shrink-0">
                                            <span className="avatar-title bg-warning-subtle rounded fs-3">
                                                <Audio color="blue" size='1' height={30} width={30} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* //////////////////////////////////////////////////////////////////////////////////// */}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card" >
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Order List</h4>
                                    <div className="d-flex align-items-center ms-auto">
                                        <button onClick={exportToExcel} className="btn btn-success me-4" style={{ minWidth: '150px' }}>Export to Excel</button>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="form-control me-2"
                                            placeholder="From Date"
                                        />
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="form-control me-2"
                                            placeholder="To Date"
                                        />
                                        <button onClick={LoadData} className="btn btn-primary">Filter</button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped text-center ">
                                            <thead className=''>
                                                <tr>



                                                    <th scope="col" width="8%">Order UID</th>

                                                    <th scope='col' width="24%">Order Date</th>
                                                    <th scope='col' width="24%">Customer Name</th>

                                                    <th scope="col" width="30%">Address</th>

                                                    <th scope="col" width="10%">Total</th>

                                                    <th scope="col" width="10%">Country Code</th>
                                                    <th scope="col" width="10%">Mobile No.</th>
                                                    <th scope="col" width="8%">Action</th>



                                                </tr>
                                            </thead>
                                            <tbody className=''>
                                                {

                                                    rows.length === 0 ?
                                                        <tr><td colSpan={5}><NoRecords /></td></tr> : rows.map((row) => {





                                                            return <tr key={`catkey-${row.order_id}`}>
                                                                <NavLink to={`/OrderDetails/${row.order_id}`}><th scope='row' className='text-primary '>{row.order_id}</th></NavLink>





                                                                {/* <NavLink to={`/CustomerDetails/${row.customer_id}`}>  <td className='text-info'>{`${row.first_name} ${row.last_name}`}</td></NavLink> */}
                                                                <td>{row.order_datetime}</td>
                                                                <td className="text-info">
                                                                    {renderCustomerLink(row.customer_id, row.first_name, row.last_name)}
                                                                </td>


                                                                <td className="">{row.address_json && (
                                                                    <>
                                                                        <p><strong>{JSON.parse(row.address_json).company_name}.</strong>&nbsp;
                                                                            {JSON.parse(row.address_json).apartment}, &nbsp;
                                                                            {JSON.parse(row.address_json).complete_address}</p>
                                                                        <p>
                                                                            {JSON.parse(row.address_json).city} - {JSON.parse(row.address_json).pincode}, {JSON.parse(row.address_json).state}&nbsp;

                                                                            {JSON.parse(row.address_json).country}.
                                                                        </p>
                                                                    </>
                                                                )}</td>
                                                                <td className='text-success fw-semibold'>{row.grand_total_display}</td>

                                                                {/* <td>{row.currency}</td> */}
                                                                <td>{row.country_code}</td>
                                                                <td>{row.mobile_number}</td>
                                                                <td><div className='hstack gap-2 mt-4 mt-sm-0 justify-content-center align-items-center'>
                                                                    <NavLink to={`/OrderDetails/${row.order_id}`}><button type="button" className="btn btn-sm btn-soft-primary waves-effect waves-light">Details</button></NavLink>


                                                                </div></td>


                                                            </tr>
                                                        })


                                                }






                                            </tbody>
                                            <tfoot className='table-light'>
                                                <tr>
                                                    <th colSpan={10} >
                                                        <div className="d-flex justify-content-between" >
                                                            <button disabled={prev === false && status === false ? true : false} type="button" onClick={() => handlePrev()} className={`btn btn-warning btn-label waves-effect waves-light`}><i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous</button>
                                                            <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                {
                                                                    <small>Total Records: {total_records} | Total Pages: {total_pages} | Current Page: {page}</small>
                                                                }
                                                            </div>
                                                            <div className='col-md-2'>
                                                                <select className="form-select" onChange={(e) => { setLimit(e.target.value)}}>
                                                                    <option value={10}>Show 10</option>
                                                                    <option value={50}>Show 50</option>
                                                                    <option value={100}>Show 100</option>
                                                                    <option value={200}>Show 200</option>
                                                                    <option value={300}>Show 300</option>
                                                                    <option value={400}>Show 400</option>
                                                                    <option value={500}>Show 500</option>
                                                                    <option value={600}>Show 600</option>
                                                                    <option value={700}>Show 700</option>
                                                                    <option value={800}>Show 800</option>
                                                                    <option value={900}>Show 900</option>
                                                                    <option value={1000}>Show 1000</option>
                                                                </select>
                                                            </div>
                                                            <div className='col-md-2'>
                                                                <select className="form-select" onChange={(e) => handleChange(e)}>
                                                                    {Array.from({ length: total_pages }, (_, i) => (
                                                                        <option selected={page === i + 1} key={i} value={i + 1}>Page {i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <button disabled={next === false && status === false ? true : false} type="button" onClick={() => handleNext()} className={`btn btn-primary btn-label waves-effect right waves-light`}><i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next</button>
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

}

export default OrderManagement;