import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';

const MakeManagement = () => {
    const { gdcURL } = useContext(ConfigContext);
    const [carMakes, setCarMakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarMakes();
    }, []);

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${gdcURL}Gen/GetAllMakes`, {
                params: { type: 'All' }
            });
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
        } finally {
            setLoading(false);
        }
    };

    const updateMakeStatus = async (makeId, newStatus) => {
        try {
            const response = await axios.post(`${gdcURL}Gen/UpdateMakeStatus`, {
                MFA_ID:makeId,
                MAKE_STATUS: newStatus,
            });
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update make status");
            }
        } catch (error) {
            console.error('Error updating make status:', error);
            Swal.fire({
                title: "Error",
                html: error.message || "Failed to update make status",
                icon: "error",
            });
        }
    };

    const handleTransfer = (makeId) => {
        // Implement transfer logic here
        console.log(`Transfer make with ID: ${makeId}`);
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <div className="card">
                        <div className="card-header align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Make Management</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">MFA ID</th>
                                            <th scope="col">Make Name</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3">Loading...</td></tr>
                                        ) : carMakes.length === 0 ? (
                                            <tr><td colSpan="3">No Records Found</td></tr>
                                        ) : (
                                            carMakes.map((make) => (
                                                <tr key={make.MFA_ID}>
                                                    <td>{make.MFA_ID}</td>
                                                    <td>{make.MFA_BRAND}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={make.MAKE_STATUS === 1}
                                                            onChange={() => {
                                                                const newStatus = make.MAKE_STATUS === 1 ? 0 : 1;
                                                                updateMakeStatus(make.MFA_ID, newStatus);
                                                                setCarMakes(prevMakes =>
                                                                    prevMakes.map(m =>
                                                                        m.MFA_ID === make.MFA_ID ? { ...m, MAKE_STATUS: newStatus } : m
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{
                                                        make.TRANSFER_STATUS === 1?
                                                        <button type="button"  onClick={() => handleTransfer(make.value)} className="btn btn-secondary" >Reload </button>
                                                        :<button type="button" onClick={() => handleTransfer(make.value)} className="btn btn-primary" >Transfer </button>
                                                        }
                                                        
                                                            
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
    );
};

export default MakeManagement; 