import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';

const OEDataManagement = () => {
    const { gdcURL } = useContext(ConfigContext);
    const [carMakes, setCarMakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarMakes();
    }, []);

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${gdcURL}Gen/GetAllMakes`, {});
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


    const handleTransfer = async (brand, makeId) => {
      
        try {
            const response = await axios.post(`${gdcURL}Gen/OEStartSolrDataTransfer`, { brand:brand, mfa_id: makeId });
            if (response.data.success) {
                fetchCarMakes();
                Swal.fire({
                    title: "Success",
                    text: "Data transfer initiated successfully.",
                    icon: "success",
                });
                
            } else {
                throw new Error(response.data.message || "Failed to initiate data transfer");
            }
        } catch (error) {
            console.error('Error during data transfer:', error);
            Swal.fire({
                title: "Error",
                html: error.message || "Failed to initiate data transfer",
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
                            <h4 className="card-title mb-0 flex-grow-1">Transfer OE Data to Search Engine By Makes</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">MFA ID</th>
                                            <th scope="col">Make Name</th> 
                                            <th scope="col">JOB ID</th> 
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
                                                make.MAKE_STATUS === 1 && <tr key={make.MFA_ID}>
                                                    <td>{make.MFA_ID}</td>
                                                    <td>{make.MFA_BRAND}</td>
                                                    <td>{make.SOLAR_JOB_ID}</td>
                                                    
                                                    <td>
                                                        {
                                                            make.SOLAR_TRANSFER_STATUS === 0 && <button type="button" onClick={() => handleTransfer(make.MFA_BRAND, make.MFA_ID)} className="btn btn-primary" >Transfer OE Data to Solar </button>
                                                        }
                                                        {
                                                            make.SOLAR_TRANSFER_STATUS === 1 && <button type="button"  disabled className="btn btn-warning" >Inprocess </button>
                                                        }
                                                        {
                                                            make.SOLAR_TRANSFER_STATUS === 2 && <button type="button"    onClick={() => handleTransfer(make.MFA_BRAND, make.MFA_ID)} className="btn btn-succes" >Completed </button>
                                                        }

                                                        {
                                                            make.SOLAR_TRANSFER_STATUS === 3 && <button type="button"  onClick={() => handleTransfer(make.MFA_BRAND, make.MFA_ID)} className="btn btn-danger" >Failed Try Again </button>
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

export default OEDataManagement; 