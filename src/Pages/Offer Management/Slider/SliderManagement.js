import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import { slugGenerator } from '../../../Components/Utility';
import Swal from 'sweetalert2';
import PageTitle from "../../../Components/PageTitle";
import { TextBox, SubmitBtn } from "../../../Components/InputElements";
import { NavLink } from 'react-router-dom';

const SliderManagement = () => {
    const { slider_id } = useParams(); // Use useParams to get slider_id
    const { token, apiURL } = useContext(ConfigContext);
    const [sliderData, setSliderData] = useState({
        slider_id: '',
        slider_position: '',
        slider_web_url: '',
        slider_app_url: '',
        country_id: '',
        slider_image_path: '',
        slider_slug: '',
        status: false,
    });
    const [lang, setLang] = useState('en');

    useEffect(() => {
        if (slider_id) {
            axios.get(`${apiURL}Home/GetSliderInfo?slider_id=${slider_id}`, {
                headers: { 'token': `${token}`, 'Content-Type': 'application/json' }
            }).then((response) => {
                const row = response.data.data[0];
                setSliderData({
                    ...sliderData,
                    slider_id: row.slider_id,
                    slider_position: row.slider_position,
                    slider_web_url: row.slider_web_url,
                    slider_app_url: row.slider_app_url,
                    country_id: row.country_id,
                    slider_image_path: row.slider_image_path,
                    slider_slug: row.slider_slug
                });
                setLang(row.lang || 'en');
            });
        }
    }, [slider_id, apiURL, token]); // Dependency array

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const imageName = file.name;
        setSliderData({ ...sliderData, slider_image_path: file, slider_image_path_name: imageName });
        console.log('slider_image_path :', file);
        console.log('image name :', imageName);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'slider_id') {
            setSliderData({ ...sliderData, slider_slug: slugGenerator(value) });
        }
        setSliderData({ ...sliderData, [name]: value });
        console.log('name :', name, 'value', value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('slider_image_path', sliderData.slider_image_path);
        formData.append('slider_web_url', sliderData.slider_web_url);
        formData.append('slider_app_url', sliderData.slider_app_url);
        formData.append('slider_position', sliderData.slider_position);
        formData.append('country_id', sliderData.country_id);
        formData.append('lang', lang);
        if(slider_id){
            formData.append('slider_id', slider_id);
        }
        const headers = {
            'token': `${token}`,
            'Content-Type': 'multipart/form-data',
        };

        setSliderData({ ...sliderData, status: true });
        axios.post(`${apiURL}Home/CreateSlider`, formData, { headers })
            .then((response) => {
                setSliderData({ ...sliderData, status: false });
                if (response.data.success) {
                    if (!slider_id) {
                        setSliderData({
                            slider_id: '',
                            slider_position: '',
                            slider_web_url: '',
                            slider_app_url: '',
                            country_id: '',
                            slider_image_path: null,
                            slider_slug: '',
                            status: false
                        });
                    }
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
                setSliderData({ ...sliderData, status: false });
                Swal.fire({
                    title: '<strong>Error</strong>',
                    html: error,
                    icon: 'error'
                });
            });
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <PageTitle title={`Slider Management`} primary={`Home`} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Manage Slider</h4>
                                    <div className="avatar-xs flex-shrink-0">
                                        <NavLink to={`/SliderList`} className="avatar-title bg-primary rounded fs-4">
                                            <i className="las la-list"></i>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row gy-4">
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='file' accept="image/*" id='slider_image_path' name='slider_image_path' label='Slider Image' hint='Enter Slider Image' change={handleFileInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='text' id='slider_web_url' name='slider_web_url' label='Web Redirect URL' hint='Enter Web Redirect URL' value={sliderData.slider_web_url} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='text' id='slider_app_url' name='slider_app_url' label='App Redirect URL' hint='Enter App Redirect URL' value={sliderData.slider_app_url} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='text' id='slider_position' name='slider_position' label='Slider Position' hint='Enter Slider Position' value={sliderData.slider_position} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='text' id='country_id' name='country_id' label='Country ID' hint='Enter Country ID' value={sliderData.country_id} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <label htmlFor="basiInput" className="form-label">Select Language</label>
                                                <select onChange={(e) => setLang(e.target.value)} className="form-select mb-6" aria-label="Default select example" value={lang}>
                                                    <option value="en">English</option>
                                                    <option value="ar">Arabic</option>
                                                </select>
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                {
                                                    slider_id ? <SubmitBtn icon={` ri-file-upload-line`} text={`Publish Slider`} type={`primary`} status={sliderData.status} /> : <SubmitBtn text={`Publish Slider`} type={`success`} icon={` ri-file-upload-line`} />
                                                }
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

export default SliderManagement;