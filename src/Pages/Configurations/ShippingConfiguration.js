import React, { useContext, useEffect, useState } from 'react';
import PageTitle from "../../Components/PageTitle";
import { TextBox, SubmitBtn } from "../../Components/InputElements";
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withRouter from '../../Utils/withRouter';

const ShippingConfiguration = () => {
    const { token, apiURL } = useContext(ConfigContext);

    const [codMaxLimit, setCodMaxLimit] = useState('');
    const [codCharges, setCodCharges] = useState('');
    const [codMinLimit, setCodMinLimit] = useState('');
    const [freeShippingMaxLimit, setFreeShippingMaxLimit] = useState('');
    const [freeShippingMinLimit, setFreeShippingMinLimit] = useState('');
    const [localShippingCharges, setLocalShippingCharges] = useState('');
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        LoadEditInfo();
    }, []);

    const LoadEditInfo = () => {
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };

        axios.get(`${apiURL}Configuration/GetShippingConfiguration`, { headers }).then((response) => {
            var row = response.data.data;
            setCodMaxLimit(row.cod_max_limit);
            setCodCharges(row.cod_charges);
            setCodMinLimit(row.cod_min_limit);
            setFreeShippingMaxLimit(row.free_shipping_max_limit);
            setFreeShippingMinLimit(row.free_shipping_min_limit);
            setLocalShippingCharges(row.local_shipping_charges);
            setLoading(false);
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'cod_max_limit':
                setCodMaxLimit(value);
                break;
            case 'cod_charges':
                setCodCharges(value);
                break;
            case 'cod_min_limit':
                setCodMinLimit(value);
                break;
            case 'free_shipping_max_limit':
                setFreeShippingMaxLimit(value);
                break;
            case 'free_shipping_min_limit':
                setFreeShippingMinLimit(value);
                break;
            case 'local_shipping_charges':
                setLocalShippingCharges(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            cod_charges: codCharges,
            cod_min_limit: codMinLimit,
            cod_max_limit: codMaxLimit,
            free_shipping_max_limit: freeShippingMaxLimit,
            free_shipping_min_limit: freeShippingMinLimit,
            local_shipping_charges: localShippingCharges,
            lang: 'en',
        };
        const headers = { 'token': `${token}`, 'Content-Type': 'application/x-www-form-urlencoded' };
        setStatus(true);

        axios.post(`${apiURL}Configuration/UpdateShippingConfiguration`, formData, { headers })
            .then((response) => {
                setStatus(false);
                if (response.data.success === true) {
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
                    <PageTitle title={`Shipping Configuration`} primary={`Home`} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Configure Shipping</h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                    <fieldset disabled={loading?"disabled":""}>
                                        <div className="row gy-4">
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='number' id='cod_max_limit' name='cod_max_limit' label='COD Maximum Limit ' value={codMaxLimit} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='number' id='cod_min_limit' name='cod_min_limit' label='COD Minimum Limit' value={codMinLimit} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='number' id='cod_charges' name='cod_charges' label='COD Charges' value={codCharges} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6"></div>
                                            <div className="col-xxl-3 col-md-6">
                                               <TextBox type='number' id='free_shipping_max_limit' name='free_shipping_max_limit' label='Free Shipping Maximum Limit' value={freeShippingMaxLimit} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                                <TextBox type='number' id='free_shipping_min_limit' name='free_shipping_min_limit' label='Free Shipping Minimum Limit' value={freeShippingMinLimit} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6">
                                             <TextBox type='number' id='local_shipping_charges' name='local_shipping_charges' label='Local Shipping Charges' value={localShippingCharges} change={handleInputChange} />
                                            </div>
                                            <div className="col-xxl-3 col-md-6"></div>
                                            <div className="col-xxl-3 col-md-6"></div>
                                            <div className="col-xxl-3 col-md-6"></div>
                                            <div className="col-xxl-3 col-md-6 content-justify-end">
                                                <SubmitBtn icon={`mdi mdi-spin mdi-cog-outline fs-18`} text={`Update Configuration`} type={`primary`} status={status} />
                                            </div>
                                        </div>
                                        </fieldset>
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

export default ShippingConfiguration;