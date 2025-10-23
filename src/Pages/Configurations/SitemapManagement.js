import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ConfigContext } from '../../Context/ConfigContext';
import PageTitle from "../../Components/PageTitle";
import { SubmitBtn } from "../../Components/InputElements";
import Swal from 'sweetalert2';

const SitemapManagement = () => {
    const { gdcURL, token } = useContext(ConfigContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${gdcURL}Gen/getSitemapsJobs`, {
                headers: { 'token': token }
            });
            setJobs(response.data.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            Swal.fire('Error', 'Failed to fetch sitemap jobs', 'error');
        }
    };

    const generateSitemap = async () => {
        
        setLoading(true);
        try {
            const response = await axios.get(`${gdcURL}Gen/generateSitemaps`, {
                headers: { 'token': token }
            });
            Swal.fire('Success', response.data.message, 'success');
            fetchJobs();
        } catch (error) {
            console.error('Error generating sitemap:', error);
            Swal.fire('Error', 'Failed to generate sitemap', 'error');
        }
        setLoading(false);
    };

    const cancelJob = async (jobId) => {
        try {
            await axios.delete(`${gdcURL}Gen/cancelSitemapJob/${jobId}`, {
                headers: { 'token': token }
            });
            Swal.fire('Success', 'Job cancelled successfully', 'success');
            fetchJobs();
        } catch (error) {
            console.error('Error cancelling job:', error);
            Swal.fire('Error', 'Failed to cancel job', 'error');
        }
    };

    const getJobStatus = (job) => {
        if (typeof job.status === 'string') {
            return job.status;
        } else if (typeof job.status === 'object') {
            return JSON.stringify(job.status);
        }
        return 'Unknown';
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <PageTitle title="Sitemap Management" primary="Home" />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Sitemap Generation</h4>
                                </div>
                                <div className="card-body">
                                    {/* <SubmitBtn 
                                        icon="mdi mdi-sitemap" 
                                        text="Generate Sitemap" 
                                        type="primary" 
                                        // status={loading} 
                                        onClick={()=>generateSitemap()}
                                    /> */}
                                    <button onClick={()=>generateSitemap()} type="button" className={`btn btn-primary  btn-label waves-effect right waves-light float-right`}><i className={`mdi mdi-sitemap label-icon align-middle fs-16 ms-2`} /> Generate Sitemap</button>
                                    <div className="mt-4">
                                        <h5>Sitemap Jobs</h5>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Job ID</th>
                                                    <th>Status</th>
                                                    <th>Created At</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobs.map(job => (
                                                    <tr key={job.id}>
                                                        <td>{job.id}</td>
                                                        <td>{getJobStatus(job)}</td>
                                                        <td>{new Date(job.createdAt).toLocaleString()}</td>
                                                        <td>
                                                            {getJobStatus(job) !== 'completed' && getJobStatus(job) !== 'failed' && (
                                                                <button 
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => cancelJob(job.id)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
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

export default SitemapManagement;
