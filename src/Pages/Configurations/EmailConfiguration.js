import React, { Component } from 'react'
import PageTitle from "../../Components/PageTitle";
import { TextBox, TextArea, SubmitBtn } from "../../Components/InputElements";
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import withRouter from '../../Utils/withRouter';


class EmailConfiguration extends Component {
    static contextType = ConfigContext;
    constructor(props, context) {
        super(props, context);

        this.state = {


            email_user_name: '',
            email_address: '',
            email_user_password: '',
            email_host: '',
            email_port: '',

            offer_slug: '',
            status: false
        };
        this.LoadEditInfo();
    }
    componentDidMount() {

    }
    LoadEditInfo = () => {
        const { token } = this.context;
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed
        };
        const { apiURL } = this.context;
        // console.log("master_course_id: "+ this.props.master_course_id);

        axios.get(`${apiURL}Configuration/GetEmailConfiguration`, { headers }).then((response) => {

            var row = response.data.config

            this.setState({
                email_user_name: row.email_user_name,
                email_address: row.email_address,
                email_user_password: row.email_user_password,
                email_host: row.email_host,
                email_port: row.email_port,


            });
        });

    }


    handleInputChange = (event) => {

        const { name, value, files } = event.target;

        this.setState({ [name]: value });


    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { apiURL } = this.context;
        const { token } = this.context;

        //    const formData = new FormData();
        var formData = {
            email_address: this.state.email_address,
            email_user_password: this.state.email_user_password,
            email_user_name: this.state.email_user_name,
            email_host: this.state.email_host,
            email_port: this.state.email_port,
            lang: 'en',

        };
        const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
        this.setState({ status: true });
        axios
            .post(`${apiURL}Configuration/UpdateEmailConfiguration`, formData, { headers })
            .then((response) => {
               
 this.setState({ status: false });
                if (response.data.success === true) {
                    Swal.fire({
                        title: '<strong>Success</strong>',
                        html: response.data.message,
                        icon: 'success'
                    })
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    })
                }
                // console.log('API Response:', JSON.stringify(response.data.success));
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
    render() {

        return (
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <br />
                        <PageTitle title={`Email Configuration`} primary={`Home`} />
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card" >
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Configure Email</h4>
                                        <div className="avatar-xs flex-shrink-0">

                                        </div>

                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit} >
                                            <div className="row gy-4">
                                                <div className="col-xxl-3 col-md-6">
                                                    <TextBox type='text' email id='email_user_name' name='email_user_name' label='User Name ' value={this.state.email_user_name} change={this.handleInputChange} />
                                                </div>
                                                <div className="col-xxl-3 col-md-6">
                                                    <TextBox type='text' id='email_user_password' name='email_user_password' label='Password'  value={this.state.email_user_password} change={this.handleInputChange} />
                                                </div>


                                                <div className="col-xxl-3 col-md-6">
                                                    <TextBox type='email' id='email_address' name='email_address' label='Email Address'  value={this.state.email_address} change={this.handleInputChange} />
                                                </div>






                                                <div className="col-xxl-3 col-md-6 ">
                                                    <TextBox type='text' email id='email_host' name='email_host' label='Email Host'  value={this.state.email_host} change={this.handleInputChange} />
                                                </div>
                                                <div className="col-xxl-3 col-md-6 ">
                                                    <TextBox type='text' email id='email_port' name='email_port' label='Email Port'  value={this.state.email_port} change={this.handleInputChange} />
                                                </div>







                                                <div className="col-xxl-3 col-md-12 "></div>
                                                <div className="col-xxl-3 col-md-6">

                                                    <SubmitBtn icon={` mdi mdi-spin mdi-cog-outline fs-18`} text={`Update Configuration`} type={`primary`} status={this.state.status} />



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


        )
    };
}
export default withRouter(EmailConfiguration);