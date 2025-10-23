import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';

const ModelManagement = () => {
    const { gdcURL } = useContext(ConfigContext);
    const [carMakes, setCarMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState(null);
    const [carModels, setCarModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCarMakes();
    }, []);

    useEffect(() => {
        if (selectedMake) {
            fetchCarModels();
        }
    }, [selectedMake, page, limit]);

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${gdcURL}Cars/GetMakes`);
            if (response.data.success) {
                setCarMakes(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch car makes");
            }
        } catch (error) {
            console.error('Error fetching car makes:', error);
            Swal.fire({
                title: "Error",
                html: error.message || "Failed to fetch car makes",
                icon: "error",
            });
        }
    };

    const fetchCarModels = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${gdcURL}Cars/GetAllModels`, {
                params: { mfa_id: selectedMake, limit, page },
            });
            if (response.data.sucess) {
                setCarModels(response.data.data);
                setTotalRecords(response.data.totalRecords);
                setTotalPages(Math.ceil(response.data.totalRecords / limit));
            } else {
                throw new Error(response.data.message || "Failed to fetch car models");
            }
        } catch (error) {
            console.error('Error fetching car models:', error);
            Swal.fire({
                title: "Error",
                html: error.message || "Failed to fetch car models",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePageChange = (e) => {
        setPage(parseInt(e.target.value, 10));
    };

    const updateModelStatus = async (modelId, newStatus) => {
        try {
            const response = await axios.post(`${gdcURL}Gen/updateModelStatus`, {
                msId: modelId,
                MODEL_STATUS: newStatus,
            });
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update model status");
            }
        } catch (error) {
            console.error('Error updating model status:', error);
            Swal.fire({
                title: "Error",
                html: error.message || "Failed to update model status",
                icon: "error",
            });
        }
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <div className="card">
                        <div className="card-header align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Model Management</h4>
                            <select
                                className="form-select"
                                onChange={(e) => setSelectedMake(e.target.value)}
                            >
                                <option value="">Select a make</option>
                                {carMakes.map(make => (
                                    <option key={make.value} value={make.value}>
                                        {make.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">Model Name</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="2">Loading...</td></tr>
                                        ) : carModels.length === 0 ? (
                                            <tr><td colSpan="2">No Records Found</td></tr>
                                        ) : (
                                            carModels.map((model) => (
                                                <tr key={model.value}>
                                                    <td>{model.label} - {model.MODEL_STATUS  > 0 ? <span className='badge bg-success'>Active</span> : <span className='badge bg-danger'>Inactive</span>}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={model.MODEL_STATUS === 1}
                                                            onChange={() => {
                                                                const newStatus = model.MODEL_STATUS === 1 ? 0 : 1;
                                                                updateModelStatus(model.value, newStatus);
                                                                setCarModels(prevModels =>
                                                                    prevModels.map(m =>
                                                                        m.value === model.value ? { ...m, MODEL_STATUS: newStatus } : m
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <th colSpan="1">
                                                <div className="d-flex justify-content-between">
                                                    <button
                                                        disabled={page === 1}
                                                        type="button"
                                                        onClick={handlePrev}
                                                        className="btn btn-warning btn-label waves-effect waves-light"
                                                    >
                                                        <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />
                                                        Previous
                                                    </button>
                                                    <div className="col-md-4" style={{ display: "flex", alignItems: "center" }}>
                                                        <small>
                                                            Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}
                                                        </small>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <select
                                                            className="form-select"
                                                            value={page}
                                                            onChange={handlePageChange}
                                                        >
                                                            {Array.from({ length: totalPages }, (_, i) => (
                                                                <option key={i} value={i + 1}>
                                                                    Page {i + 1}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        disabled={page === totalPages}
                                                        type="button"
                                                        onClick={handleNext}
                                                        className="btn btn-primary btn-label waves-effect right waves-light"
                                                    >
                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
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
    );
};

export default ModelManagement; 