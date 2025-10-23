import React, { Component } from 'react'
import PageTitle from "../../../Components/PageTitle";
import { TextBox, TextArea, SubmitBtn } from "../../../Components/InputElements";
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import { slugGenerator } from '../../../Components/Utility'
import Swal from 'sweetalert2'
import withRouter from '../../../Utils/withRouter';
import { NavLink } from 'react-router-dom';


class OfferManagement extends Component {
    static contextType = ConfigContext;
    constructor(props, context) { 
        super(props, context);

        this.state = {
            
            offer_id:this.props.params.offer_id?this.props.params.offer_id:'',
            offer_link_web: '',
            offer_title_en: '',
            offer_title_ar: '',
            offer_link_mob : '',
            country_id : 255,
            selectedFiles : undefined,
            currentFile : undefined,
            offer_banner_name : '',
            imageName : '',
           
            offer_banner: '',
            offer_slug: '',
            status: false
          };
          this.LoadEditInfo();
      }
      componentDidMount(){
        
      }
      LoadEditInfo = () => {
        const { token } = this.context;
          const headers = { 'token': `${token}`, 'Content-Type': 'application/json', };
          const { apiURL } = this.context;
          // console.log("master_course_id: "+ this.props.master_course_id);
        if(this.props.params.offer_id){
            axios.get(`${apiURL}Home/GetOfferInfo?offer_id=${this.props.params.offer_id}`, {headers}).then((response) => {
               
                var row = response.data.data[0];
              
                this.setState({
                    offer_link_web : row.offer_link_web,
                    offer_title_en : row.offer_title_en,
                    offer_title_ar : row.offer_title_ar,
                    offer_link_mob : row.offer_link_mob,
                    country_id : row.country_id,
                    offer_banner : row.offer_banner,
                    offer_slug : row.offer_slug
                });
            });
        }
      }
      handleFileInputChange = (event) => {
      
       let {offer_banner1} = this.state;
         
       offer_banner1 =  event.target.files[0];
       const imageName = event.target.files[0].name;

       this.setState({offer_banner1});
       this.setState({offer_banner_name : imageName})
      };
    
      handleInputChange = (event) => {
        
        const {name, value, files} = event.target;
       if(name === 'offer_id'){
            
            this.setState({ offer_slug: slugGenerator(value) });
        }
       
        this.setState({ [name]: value }); 
        
       
      };
     
      handleSubmit = (event) => {
        event.preventDefault();
        const { apiURL } = this.context;
        const { token } = this.context;

    //    const formData = new FormData();
        var formData = {
            offer_title_en:this.state.offer_title_en,
            offer_title_ar:this.state.offer_title_ar,
            offer_link_web:this.state.offer_link_web,
            offer_link_mob:this.state.offer_link_mob,
            country_id:this.state.country_id,
            lang:'en',
            offer_banner: event.target.offer_banner.files[0]??'',
            offer_id: this.state.offer_id
        };
          const headers = { 'token': `${token}`, 'Content-Type': 'multipart/form-data', };
            this.setState({status: true});
            axios
            .post(`${apiURL}Home/CreateOffer`, formData, {headers})
            .then((response) => {
              console.log('create response : ' , response.data);
                
                if(response.data.success === true){
                    if(this.state.offer_id===''){
                        this.setState((prevState) => ({
                            offer_link_web : '',
                            offer_title_en : '',
                            offer_title_ar : '',
                            offer_link_mob : '',
                            offer_banner : null,
                            offer_slug : '',
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
                        <PageTitle title={`Offer Management`} primary={`Home`} />
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card" >
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Manage Offer</h4>
                                        <div className="avatar-xs flex-shrink-0">
                                            <NavLink to={`/OfferList`} className="avatar-title bg-primary rounded fs-4">
                                                {/* <i className="bx bx-shopping-bag text-info" /> */}
                                                <i className="las la-list"></i>
                                            </NavLink>
                                        </div>
                                        
                                    </div>
                                    <div className="card-body">
                                    <form  onSubmit={this.handleSubmit} >
                                    <div className="row gy-4">
                                   
                            <div className="col-xxl-3 col-md-6">
                             <TextBox type='file'  accept="image/*" id='offer_banner' name='offer_banner' label='Offer Banner' hint='Enter Offer Banner'     /* value={this.state.offer_banner} */    change={this.handleFileInputChange} />
        </div>

        <div className="col-xxl-3 col-md-6 " style={{visibility: 'hidden'}}>
             
             <label  htmlFor="basiInput" className="form-label">Select Language</label>
         <select className="form-select mb-6 " aria-label="Default select example" defaultValue="Select Language">
     {/* <option selected>Select Language</option> */}
     <option value="1">English</option>
     <option value="2">Arabic</option>
     
     </select>
     
             </div> 
                                    <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='offer_title_en' name='offer_title_en' label='Offer Title English' hint='Enter Offer Title English' value={this.state.offer_title_en} change={this.handleInputChange} />
        </div>

                                         <div className="col-xxl-3 col-md-6">
            <TextBox type='text' id='offer_title_ar' name='offer_title_ar' label='Offer Title Arabic' hint='Enter Offer Title Arabic' value={this.state.offer_title_ar} change={this.handleInputChange} />
        </div>

                                        <div className="col-xxl-3 col-md-6">
            <TextBox type='text' email id='offer_link_web' name='offer_link_web' label='Offer Web Link ' hint='Enter Offer Web Link' value={this.state.offer_link_web} change={this.handleInputChange} />
        </div>
                                      
      
        <div className="col-xxl-3 col-md-6 ">
            <TextBox type ='text' email id='offer_link_mob' name='offer_link_mob' label='Offer Mobile Link' hint='Enter Offer Mobile Link' value={this.state.offer_link_mob} change={this.handleInputChange} />
            </div>
        
                                        
      
      


       
           
            <div className="col-xxl-3 col-md-12 "></div>
            <div className="col-xxl-3 col-md-6">
                                             {
                                                this.props.params.offer_id? <SubmitBtn icon={` ri-file-upload-line`} text={`Update Offer`} type={`primary`} status={this.state.status}/>:  <SubmitBtn  text={`Publish Offer`} type={`success`} icon={` ri-file-upload-line`} />
                                                
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
export default withRouter(OfferManagement);