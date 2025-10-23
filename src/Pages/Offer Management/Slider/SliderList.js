import React, { useContext, useEffect, useState } from 'react'; // Updated import
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import PageTitle from "../../../Components/PageTitle";
import { NavLink } from 'react-router-dom';
import { TableRows, NoRecords } from '../../../Components/Shimmer';

const SliderList = () => { // Changed to functional component
    const { apiURL, token, placeHolderImageURL } = useContext(ConfigContext); // Use context
    const [rows, setRows] = useState([]); // State for rows
    const [next, setNext] = useState(false); // State for next
    const [prev, setPrev] = useState(false); // State for prev
    const [page, setPage] = useState(1); // State for page
    const [totalRecords, setTotalRecords] = useState(0); // State for total records
    const [totalPages, setTotalPages] = useState(0); // State for total pages
    const [status, setStatus] = useState(false); // State for status
    const limit = 5; // Limit is constant

    const LoadData = () => { // LoadData function
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };
        axios
            .get(`${apiURL}Home/GetSliders?lang=en`, { params: { limit, page }, headers })
            .then((response) => {
                var data = response.data;
                console.log('response.data :', data);
                if (response.data.success === true) {
                    setRows(data.data);
                    setNext(data.next);
                    setPrev(data.prev);
                    setPage(data.page);
                    setTotalRecords(data.total_records);
                    setTotalPages(data.total_pages);
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: <strong>Error</strong>,
                    html: error,
                    icon: 'error'
                });
            });
    };

    useEffect(() => { // useEffect to load data on mount
        LoadData();
    }, [page]); // Dependency on page

    const handleDelete = (id) => {
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setStatus(true);
                const formData = { slider_id: id };
                axios
                    .post(`${apiURL}Home/DeleteSlider`, formData, { headers })
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
                            title: <strong>Error</strong>,
                            html: error,
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const handlePrev = () => {
        if (prev === true) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (next === true) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleChange = (e) => {
        setPage(parseInt(e.target.value, 10));
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <PageTitle title={`Slider List`} primary={`Home`} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Slider List</h4>
                                    <div className="avatar-xs flex-shrink-0">
                                        <NavLink to={`/SliderManagement`} className="avatar-title bg-primary rounded fs-4">
                                            <i className="ri-add-box-line"></i>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped text-center">
                                            <thead>
                                                <tr>
                                                    <th scope="col" width="3%">ID</th>
                                                    <th scope="col" width="16%">Picture</th>
                                                    <th scope='col' width="31%">Web URL</th>
                                                    <th scope="col" width="10%">App URL</th>
                                                    <th scope="col" width="10%">Position</th>
                                                    <th scope="col" width="10%">Country ID</th>
                                                    <th scope="col" width="10%">Language</th>
                                                    <th scope="col" width="10%">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    rows.length === 0 ?
                                                        <tr><td colSpan={5}><NoRecords /></td></tr> : rows.map((row) => {
                                                            return <tr key={`catkey-${row.slider_id}`}>
                                                                <th scope='row'>{row.slider_id}</th>
                                                                <td><div><img width={70} height={45} src={`https://ghayar.ae/v1/admin/public/img/sliders/${row.slider_image_path}`} onError={(event) => {
                                                                    event.target.src = placeHolderImageURL
                                                                }} alt='image' /></div></td>
                                                                <td>{row.slider_web_url}</td>
                                                                <td>{row.slider_app_url}</td>
                                                                <td>{row.slider_position}</td>
                                                                <td>{row.country_id}</td>
                                                                <td>{row.lang}</td>
                                                                <td>
                                                                    <div className='hstack gap-2 mt-4 mt-sm-0 justify-content-center align-items-center'>
                                                                        <NavLink to={`/SliderManagement/${row.slider_id}`}>
                                                                            <button type='button' className="btn-icon btn btn-sm btn-outline-primary">
                                                                                <i className="ri-edit-box-line"></i>
                                                                            </button>
                                                                        </NavLink>
                                                                        <button onClick={() => handleDelete(row.slider_id)} className="btn-icon btn btn-sm btn-outline-danger">
                                                                            <i className="ri-delete-bin-line"></i>
                                                                        </button>
                                                                    </div>
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
    );
};

export default SliderList; // Export functional component