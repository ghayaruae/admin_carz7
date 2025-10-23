
import '../../../index.css';
import React, { Component } from 'react'
import PageTitle from "../../../Components/PageTitle";
import { TextBox, TextArea, SubmitBtn } from "../../../Components/InputElements";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import { slugGenerator } from '../../../Components/Utility'
import Swal from 'sweetalert2'
import withRouter from '../../../Utils/withRouter';
import { NavLink } from 'react-router-dom';


class PromoManagement extends Component {
    static contextType = ConfigContext;
    constructor(props, context) { 
        super(props, context);
        if(this.props.params.promo_id){ 
            // console.log(this.props.params.promo_id);
        }else{
            // console.log("No PARAMAS: ",this.props.params.promo_id);
        }

        this.state = {
            
            promo_id:'',
            promo_position: '',
            promo_web_url: '',
            promo_app_url: '',
            country_id : '',
            selectedFiles : [],
           
            promo_image_path: '',
            promo_slug: '',
            status: false
          };
          const { token } = this.context;
          const headers = {
              'token': `${token}`,
              'Content-Type': 'application/json', // Set the content type to JSON if needed
              };
          const { apiURL } = this.context;
          // console.log("master_course_id: "+ this.props.master_course_id);
        if(this.props.params.promo_id){
            this.setState({promo_id:this.state.promo_id});
            axios.get(`${apiURL}Home/GetPromoInfo?promo_id=${this.props.params.promo_id}`, {headers}).then((response) => {
               
                var row = response.data.data[0];
                console.log('row' );
                this.setState({
                   
                    promo_id : row.promo_id,
                    promo_position : row.promo_position,
                    promo_web_url : row.promo_web_url,
                    promo_app_url : row.promo_app_url,
                    country_id : row.country_id,
                    promo_image_path : row.promo_image_path,
                    promo_slug : row.promo_slug
                });
            });
        }
      }
      handleInputChange21 = (event) => {
      
        let {promo_image_path} = this.state;
       promo_image_path =  event.target.files[0];
       this.setState({promo_image_path});
        console.log ('promo_image_path :', promo_image_path) 
      };
    
      handleInputChange = (event) => {
        
        const {name, value, files} = event.target;
       if(name === 'promo_id'){
            
            this.setState({ promo_slug: slugGenerator(value) });
        }
       
        this.setState({ [name]: value }); 
        console.log('name :' ,name, 'value' , value);
        
       
      };
     
      handleSubmit = (event) => {
        event.preventDefault();
        const { apiURL } = this.context;
        const { token } = this.context;

     
        const formData = new FormData();
           formData.append('promo_image_path', event.target.promo_image_path.files[0]);
           formData.append('promo_web_url', this.state.promo_web_url);
           formData.append('promo_app_url', this.state.promo_app_url);
           formData.append('promo_position', this.state.promo_position);
           formData.append('country_id', this.state.country_id);
         
           formData.append('lang', 'en'); 
           
        

          const headers = {
            'token': `${token}`,
         
            'Content-Type': 'multipart/form-data',    
        };
            this.setState({status: true});
            axios
            .post(`${apiURL}Home/CreatePromo`, formData, {headers})
            .then((response) => {
            //   console.log('create response : ' , response.data);
            this.setState({status: false});
                if(response.data.success === true){
                    if(!this.props.params.promo_id){
                        this.setState((prevState) => ({
                            promo_id : '',
                            promo_position : '',
                            promo_web_url : '',
                            promo_app_url : '',
                            country_id : '',
                            promo_image_path : null,
                            promo_slug : '',
                            // lang : '',
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
                        <PageTitle title={`Promo Management`} primary={`Home`} />
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card" >
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Manage Promo</h4>
                                        <div className="avatar-xs flex-shrink-0">
                                            <NavLink to={`/PromoList`} className="avatar-title bg-primary rounded fs-4">
                                                {/* <i className="bx bx-shopping-bag text-info" /> */}
                                                <i className="las la-list"></i>
                                            </NavLink>
                                        </div>
                                        
                                    </div>
                                    <div className="card-body">
                                    <form  onSubmit={this.handleSubmit} >
                                    <div className="row gy-4">
                                   
                            <div className="col-xxl-3 col-md-6">
                             <TextBox type='file'  accept="image/*" id='promo_image_path' name='promo_image_path' label='Promo Image' hint='Enter Promo Image'   /* value={this.state.promo_image_path} */    change={this.handleInputChange21} />
        </div>
                                    <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='promo_web_url' name='promo_web_url' label='Web Redirect URL' hint='Enter Web Redirect URL' value={this.state.promo_web_url} change={this.handleInputChange} />
        </div>

                                         <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='promo_app_url' name='promo_app_url' label='App Redirect URL' hint='Enter App Redirect URL' value={this.state.promo_app_url} change={this.handleInputChange} />
        </div>

                                        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' email id='promo_position' name='promo_position' label='Promo Position' hint='Enter Promo Position' value={this.state.promo_position} change={this.handleInputChange} />
        </div>
      
        <div className="col-xxl-3 col-md-6 ">
            <TextBox type='text' id='country_id' name='country_id' label='Country ID' hint='Enter Country ID' value={this.state.country_id} change={this.handleInputChange} />
            </div>
                                        
        <div className="col-xxl-3 col-md-6 ">
             
        <label  htmlFor="basiInput" className="form-label">Select Language</label>
    <select className="form-select mb-6 " aria-label="Default select example" defaultValue="Select Language">
{/* <option selected>Select Language</option> */}
<option value="1">English</option>
<option value="2">Arabic</option>

</select>

        </div> 
      


       
           
            <div className="col-xxl-3 col-md-12 "></div>
            <div className="col-xxl-3 col-md-6">
                                             {
                                                this.props.params.promo_id? <SubmitBtn icon={` ri-file-upload-line`} text={`Update Promo`} type={`primary`} status={this.state.status}/>:  <SubmitBtn  text={`Publish Promo`} type={`success`} icon={` ri-file-upload-line`}  />
                                                
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
export default withRouter(PromoManagement);