import React, { useState, useEffect, useContext } from 'react';
import PageTitle from "../../Components/PageTitle";
import { TextBox, SubmitBtn } from "../../Components/InputElements";
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withRouter from '../../Utils/withRouter';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PolicyManagement = () => {
    const { token, apiURL } = useContext(ConfigContext);
    const [pageName, setPageName] = useState('');
    const [pageContent, setPageContent] = useState('');
    const [status, setStatus] = useState(false);
    const [pageId, setPageID] = useState(null);
    const [page, setPage] = useState(0);
    const [lang, setLang] = useState('en');
    const [pageOptions, setPageOptions] = useState([]);

    useEffect(() => {
        setPageName("");
        setPageID(0);
        setPage('');
        setPageContent('');
        LoadPagesList();

    }, [lang]);


    useEffect(() => {

    }, [pageId])
    const LoadPagesList = () => {
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };

        axios.get(`${apiURL}Home/GetPagesList?lang=${lang}`, { headers })
            .then((response) => {
                if (response.data.success) {
                    setPageOptions(response.data.data);

                }
            });
    };

    // useEffect(() => {
    //     LoadPolicyInfo();
    // }, [pageId]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'page_name') {
            setPageName(value);
        }
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setPageContent(data);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            page_id: pageId,
            page_content: pageContent,
            page_name: pageName,
            lang: lang,
        };
        const headers = { 'token': `${token}`, 'Content-Type': 'application/x-www-form-urlencoded' };
        setStatus(true);

        axios.post(`${apiURL}Home/UpdatePage`, formData, { headers })
            .then((response) => {
                setStatus(false);
                if (response.data.success) {
                    LoadPagesList();
                    Swal.fire({
                        title: '<strong>Success</strong>',
                        html: response.data.message,
                        icon: 'success'
                    });

                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    });
                }
            })
            .catch((error) => {
                setStatus(false);
                Swal.fire({
                    title: '<strong>Error</strong>',
                    html: error.message,
                    icon: 'error'
                });
            });
    };
    const [content, setContent] = useState('');

    const handleChange = (value) => {
        setContent(value);
        setPageContent(value)
    };
    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <PageTitle title={`Page Content Management`} primary={`Home`} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Page Content Management</h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row gy-4">
                                            <div className="col-xxl-12 col-md-12">
                                                <select
                                                    onChange={(e) => {
                                                        setLang(e.target.value);

                                                        setPage('');
                                                        setPageID(0);
                                                        setPageContent('');
                                                        setPageName('');
                                                    }}
                                                    className='form-control'
                                                    value={lang}
                                                >

                                                    <option value="en">English</option>
                                                    <option value="ar">Arabic</option>
                                                </select>
                                            </div>
                                            <div className="col-xxl-12 col-md-12">
                                                <select
                                                    onChange={(e) => {
                                                        const selectedOption = pageOptions.find(option => option.page === e.target.value);
                                                        setPage(e.target.value);
                                                        setPageID(selectedOption?.page_id || '');
                                                        setPageContent(selectedOption?.page_content || '');
                                                        setPageName(selectedOption?.page_name || '');
                                                    }}
                                                    className='form-control'
                                                    value={page}
                                                >
                                                    {pageId === 0 && <option selected={true} >Select Page</option>}
                                                    {pageOptions.map(option => (
                                                        <option key={option.page_id} value={option.page}>
                                                            {option.page_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-xxl-12 col-md-12">
                                                <label>Page Title</label>
                                                <input
                                                    type="text"
                                                    name="page_name"
                                                    className="form-control"
                                                    value={pageName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-xxl-12 col-md-12">
                                                <label>Policy Content</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={pageContent}
                                                    onChange={handleChange}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'], // Text styling
                                                            [{ color: [] }, { background: [] }], // Font color and background
                                                            [{ align: [] }],
                                                            ['clean'], // Remove formatting
                                                        ],
                                                    }}
                                                />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <SubmitBtn icon={`mdi mdi-spin mdi-cog-outline fs-18`} text={`Update Policy`} type={`primary`} status={status} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyManagement; 
