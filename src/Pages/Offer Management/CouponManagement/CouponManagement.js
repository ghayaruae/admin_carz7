

import React, { Component } from 'react'
import PageTitle from "../../../Components/PageTitle";
import { TextBox, TextArea, SubmitBtn } from "../../../Components/InputElements";
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import { slugGenerator } from '../../../Components/Utility'
import Swal from 'sweetalert2'
import withRouter from '../../../Utils/withRouter';
import { NavLink } from 'react-router-dom';


class CouponManagement extends Component {
    static contextType = ConfigContext;
    constructor(props, context) { 
        super(props, context);
        if(this.props.params.offer_coupon_id){ 
            // console.log(this.props.params.offer_coupon_id);
        }else{
            // console.log("No PARAMAS: ",this.props.params.offer_coupon_id);
        }

        this.state = {
            editorData: '',
            offer_coupon_id:'',
            coupon_code: '',
            coupon_title_en: '',
            coupon_short_description_en: '',
            coupon_img: '',
            coupon_slug: '',
            status: false
          };
          const { token } = this.context;
          const headers = {
              'token': `${token}`,
              'Content-Type': 'application/json', // Set the content type to JSON if needed
              };
          const { apiURL } = this.context;
          // console.log("master_course_id: "+ this.props.master_course_id);
        if(this.props.params.offer_coupon_id){
            this.setState({offer_coupon_id:this.state.offer_coupon_id});
            axios.get(`${apiURL}Offers/GetCouponInfo?offer_coupon_id=${this.props.params.offer_coupon_id}`, {headers}).then((response) => {
               
                var row = response.data.data[0];
                this.setState({
                    editorData : row.course_long_description,
                    offer_coupon_id : row.offer_coupon_id,
                    coupon_code : row.coupon_code,
                    coupon_title_en : row.coupon_title_en,
                    coupon_type : row.coupon_type,
                    coupon_value : row.coupon_value,
                    min_purchase_amount : row.min_purchase_amount,
                    coupon_expiry : row.coupon_expiry,
                    coupon_short_description_en : row.coupon_short_description_en,
                    coupon_long_description_en : row.coupon_long_description_en,
                   
                    coupon_img : row.coupon_img,
                    coupon_slug : row.coupon_slug
                });
            });
        }
      }
      handleInputChange = (event) => {
        const { name, value } = event.target;
        
        if(name === 'offer_coupon_id'){
            
            this.setState({ coupon_slug: slugGenerator(value) });
        }
        this.setState({ [name]: value });
        console.log('name :' ,name , 'value : ', value)  ;
      };
      handleEditorChange = (event, editor) => {
        const data = editor.getData();
        this.setState({ editorData: data,  coupon_long_description_en: data});
      };

      handleSubmit = (event) => {
        event.preventDefault();
        const { apiURL } = this.context;
        const { token } = this.context;

        const formData = {
            
            offer_coupon_id: this.state.offer_coupon_id,
            coupon_code: this.state.coupon_code,
            coupon_title_en: this.state.coupon_title_en,
            coupon_short_description_en: this.state.coupon_short_description_en,
            coupon_long_description_en: this.state.editorData,
            course_duration: this.state.course_duration,
            coupon_img: this.state.coupon_img,
            coupon_slug: this.state.coupon_slug,
            min_purchase_amount : this.state.min_purchase_amount,
            coupon_type : this.state.coupon_type,
            coupon_expiry : this.state.coupon_expiry,
            coupon_value : this.state.coupon_value,
            
          };
          
          const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed
            };
            this.setState({status: true});
            axios
            .post(`${apiURL}Offers/GenerateCoupon`, formData, {headers})
            .then((response) => {
                // console.log("response : " , response);
                this.setState({status: false});
                
                if(response.data.success === true){
                    if(!this.props.params.offer_coupon_id){
                        this.setState((prevState) => ({
                           
                            offer_coupon_id : '',
                            coupon_code : '',
                            coupon_title_en : '',
                            coupon_short_description_en : '',
                            coupon_long_description_en : '',
                            course_duration : '',
                            coupon_img : '',
                            coupon_slug : '',
                            status: false
                        }));
                    }else{
                        this.setState({status: false});
                    }
                    Swal.fire({
                        title: '<strong>Success</strong>',
                        html: response.data.message,
                        icon: 'success'
                      })
                    }else{
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
                        <PageTitle title={`Coupon Management`} primary={`Home`} />
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card" >
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Generate Coupon</h4>
                                        <div className="avatar-xs flex-shrink-0">
                                            <NavLink to={`/CouponList`} className="avatar-title bg-primary rounded fs-4">
                                                {/* <i className="bx bx-shopping-bag text-info" /> */}
                                                <i class="las la-list"></i>
                                            </NavLink>
                                        </div>
                                        
                                    </div>
                                    <div className="card-body">
                                    <form  onSubmit={this.handleSubmit} >
                                    <div className="row gy-4">
                                    <div  className="col-xxl-3 col-md-6">
<label htmlFor="formFile" className="form-label">Select Coupon Image</label>
<input className="form-control" type="file" id="formFile" aria-describedby="inputGroupFileAddon04"  aria-label="Upload" onChange={this.handleFileChange}/>
</div> 
                                    <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_title_en' name='coupon_title_en' label='Coupon Title' hint='Enter Coupon Title' value={this.state.coupon_title_en} change={this.handleInputChange} />
        </div>

                                         <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_type' name='coupon_type' label='Coupon Type' hint='Enter Coupon Type' value={this.state.coupon_type} change={this.handleInputChange} />
        </div>

                                        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_code' name='coupon_code' label='Coupon Code' hint='Enter Coupon Code' value={this.state.coupon_code} change={this.handleInputChange} />
        </div>
                                        
        <div className="col-xxl-3 col-md-6">
            <TextBox type='number' id='coupon_value' name='coupon_value' label='Coupon Value' hint='Enter Coupon Value' value={this.state.coupon_value} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-6">
            <TextBox type='number' id='min_purchase_amount' name='min_purchase_amount' label='Minimum Purchase Amount' hint='Enter Minimum Purchase Amount' value={this.state.min_purchase_amount} change={this.handleInputChange} />
        </div>
        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='coupon_expiry' name='coupon_expiry' label='Coupon Expiry' hint='Enter date in YYYY-MM-DD format' value={this.state.coupon_expiry} change={this.handleInputChange} />
        </div>

        <div className="col-xxl-3 col-md-12">
            <TextArea type='text' id='coupon_short_description' name='coupon_short_description' label='Coupon Short Description' hint='Enter Short Description' value={this.state.coupon_short_description} change={this.handleInputChange} />
        </div>
                                 
                                        <div className="col-xxl-3 col-md-6">
                                             {
                                                this.props.params.offer_coupon_id? <SubmitBtn icon={`ri-coupon-3-line`} text={`Update Coupon`} type={`primary`} status={this.state.status}/>:  <SubmitBtn  text={`Generate Coupon`} type={`success`} icon={`ri-coupon-3-line`} status={this.state.status} />
                                                
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


    )};
}  
export default withRouter(CouponManagement);