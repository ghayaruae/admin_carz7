import './CouponManagement.css'
import '../../index.css';
import React, { Component } from 'react'
import PageTitle from "../../../Components/PageTitle";
import { TextBox, TextArea, SubmitBtn } from "../../../Components/InputElements";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios';
import { slugGenerator } from '../../../Components/Utility'
import Swal from 'sweetalert2'
import withRouter from '../../../Utils/withRouter';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TableRows, NoRecords } from '../../../Components/Shimmer';
class CouponManagement extends Component {

    static contextType = ConfigContext;
    constructor(props, context) {
        super(props, context);
        if (this.props.params.offer_coupon_id) {
            console.log(this.props.params.offer_coupon_id);
        } else {
            console.log("No PARAMAS: ", this.props.params.offer_coupon_id);
        }

        this.state = {
            editorData: '',
          
            offer_coupon_id: '',
            selectedFile: null,
            rows: [],
            coupon_code: '',
            coupon_type: '',
            coupon_title_en: '',
            coupon_value: '',
            min_purchase_amount: '',
            coupon_expiry: '',
            coupon_short_description: '',
            isViewCoupon: false,
            isLoading: false,

            next: false,
            prev: false,
            page: 1,
            total_records: 0,
            total_pages: 0,
            coupon_slug: '',
            limit: 5,


            program_short_description: '',
            program_long_description: '',
            program_duration: '',
            program_document: '',
            program_fees: '',
            program_type: 1,
            program_picture: '',
            program_slug: '',
            status: false,
            showModal: false
        };



        //    ///////////////////////////////////////this is previous code for reference //////////////////////////////////////////

       /*  const { token } = this.context;
        
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON if needed
            // 'X-Param-Id': `paramId=${offer_coupon_id}`
            'X-Offer-Coupon-Id': `${this.props.params.offer_coupon_id}`, // Add ID with custom header
        };
        const { apiURL } = this.context;
        // console.log("master_program_id: "+ this.props.master_program_id);
        if (this.props.params.offer_coupon_id) {
            this.setState({ offer_coupon_id: this.state.offer_coupon_id });
            axios.get(`${apiURL}Offers/GetCouponInfo?lang=en&offer_coupon_id=${this.props.params.offer_coupon_id}`, { headers }).then((response) => {
                console.log('Taleeeb',response);
                var row = response.data.data[0];
                this.setState({
                    editorData: row.program_long_description,
                    offer_coupon_id: row.offer_coupon_id,
                    
                    coupon_code: row.coupon_code,
                    coupon_type: row.coupon_type,
                    coupon_title_en: row.coupon_title_en,
                    min_purchase_amount: row.min_purchase_amount,
                    coupon_expiry: row.coupon_expiry,
                    coupon_short_description: row.coupon_short_description,
                    coupon_value: row.coupon_value,
                    coupon_slug: row.coupon_slug,

                    program_short_description: row.program_short_description,
                    program_long_description: row.program_long_description,
                    program_duration: row.program_duration,
                    program_document: row.program_document,
                    program_fees: row.program_fees,
                    program_type: row.program_type,
                    program_picture: row.program_picture,
                    program_slug: row.program_slug
                });
            });
        } */
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
    }
    handleSubmit2 = (event) =>{
        event.preventDefault();
    }

    handleFileChange = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
        console.log('Taleeb-file', this.state.selectedFile)
      };

    loadCoupon() {
        const { apiURL } = this.context;
        const { token } = this.context;

        const headers = {
            'token': `${token}`,
            // 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRzeXMiLCJpYXQiOjE3MDA4MTg2ODgsImV4cCI6MTcwMTQyMzQ4OH0.hY7vu96VmCqlq752lb3N3QZJsg__mRpXJyr7x5wcmao',
            'Content-Type': 'application/json', // Set the content type to JSON if needed
        };

        axios
            .get(`${apiURL}Offers/GetCoupons?lang=en`, { params: { limit: this.state.limit, page: this.state.page }, headers })
            .then((response) => {
                // console.log('Taleeb' , response.data); 

                // Handle the API response here
                var data = response.data;



                if (response.data.success === true) {
                    this.setState({
                        rows: data.data,
                        // next: data.next, 
                        // prev: data.prev,
                        // page: data.page,
                        // total_records: data.total_records,
                        // total_pages: data.total_pages,
                        status: true,

                    });

                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    })
                }
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



    handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'coupon_title_en') {

            this.setState({ coupon_slug: slugGenerator(value) });
        }
        this.setState({ [name]: value });
    };

    handleEditorChange = (event, editor) => {
        const data = editor.getData();
        this.setState({ editorData: data, program_long_description: data });
    };


    



    handleViewCoupon = () => {
        this.setState({ isViewCoupon: true }, () => {
            Cookies.set('isViewCoupon', 'true');

            this.loadCoupon();



        })



    }



   

    handleCreateCoupon = () => {
        this.setState({ isViewCoupon: false }, () => {
            Cookies.set('isViewCoupon', 'false');
        })

    }
    handleEditCoupon = (id) => {
        this.setState({isViewCoupon : false}, ()=>{
            Cookies.set('isViewCoupon' , 'false');
            // window.location.reload();
            const { token } = this.context;
        
            const headers = {
                'token': `${token}`,
                'Content-Type': 'application/json', // Set the content type to JSON if needed
                // 'X-Param-Id': `paramId=${offer_coupon_id}`
                'X-Offer-Coupon-Id': `${this.props.params.offer_coupon_id}`, // Add ID with custom header
            };
            const { apiURL } = this.context;
            // console.log("master_program_id: "+ this.props.master_program_id);
            if (this.props.params.offer_coupon_id) {
                this.setState({ offer_coupon_id: this.state.offer_coupon_id });
                axios.get(`${apiURL}Offers/GetCouponInfo?lang=en&offer_coupon_id=${this.props.params.offer_coupon_id}`, { headers }).then((response) => {
                    console.log('Taleeeb',response);
                    var row = response.data.data[0];
                    this.setState({
                        editorData: row.offer_coupon_id,
                        offer_coupon_id: row.offer_coupon_id,
                        
                        coupon_code: row.coupon_code,
                        coupon_type: row.coupon_type,
                        coupon_title_en: row.coupon_title_en,
                        min_purchase_amount: row.min_purchase_amount,
                        coupon_expiry: row.coupon_expiry,
                        coupon_short_description: row.coupon_short_description,
                        coupon_value: row.coupon_value,
                        coupon_slug: row.coupon_slug,
    
                     /*    program_short_description: row.program_short_description,
                        program_long_description: row.program_long_description,
                        program_duration: row.program_duration,
                        program_document: row.program_document,
                        program_fees: row.program_fees,
                        program_type: row.program_type,
                        program_picture: row.program_picture,
                        program_slug: row.program_slug */
                    });
                });
            }

        })
    }

    handleDeleteCoupon = (id) => {
        const { apiURL } = this.context;
        const { token } = this.context;

        const headers = {
        'token': `${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON if needed
        };
        Swal.fire(
            {
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }
        ).then((result) => {
            if (result.isConfirmed) {
                this.setState({status: true});
                const formData = {
                    offer_coupon_id: id
                };
                axios
                .post(`${apiURL}Offers/DeleteCoupon`, formData, {headers})
                .then((response) => {
                    console.log(response);
                    Swal.fire({
                        title: `<strong>${response.data.success === true? 'Success': 'Failed'}</strong>`,
                        text: response.data.message,
                        icon: response.data.success === true? 'success': 'error'
                    })
                    this.setState({status: false});
                    if(response.data.success === true){
                        this.loadCoupon();
                    }
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
        });
    }   

   

    componentDidMount = () => {
        const storedIsViewCoupon = Cookies.get('isViewCoupon');

        if (storedIsViewCoupon) {
            this.setState({ isViewCoupon: JSON.parse(storedIsViewCoupon) });
        }
        this.loadCoupon();

    }



    handleGenerateCoupon = (event) => {
        
        // event.preventDefault();
        const { apiURL } = this.context;
        const { token } = this.context;


      /*   const formData = new FormData();
        formData.append('min_purchase_amount', this.state.min_purchase_amount);
        formData.append('coupon_type', this.state.coupon_type);
        formData.append('coupon_code', this.state.coupon_code);
        formData.append('coupon_value', this.state.coupon_value);
        formData.append('coupon_expiry', this.state.coupon_expiry);
        formData.append('coupon_title_en', this.state.coupon_title_en);
        formData.append('coupon_description_en', this.state.coupon_short_description);
        formData.append('lang', 'en');
        // formData.append('coupon_img', this.state.selectedFile, ); */
        
        const formData = {
            editorData: this.state.editorData,
            // master_program_id: this.state.master_program_id,
            coupon_code: this.state.coupon_code,
            // offer_coupon_id : this.state.offer_coupon_id,
            coupon_type: this.state.coupon_type,
            coupon_title_en: this.state.coupon_title_en,
            min_purchase_amount: this.state.min_purchase_amount,
            coupon_expiry: this.state.coupon_expiry,
            coupon_short_description: this.state.coupon_short_description,
            coupon_value: this.state.coupon_value,
            lang : 'eng'
            
          }; 
          if(this.props.params.offer_coupon_id){
            formData.offer_coupon_id = this.props.params.offer_coupon_id;
          }
        const headers = {
        'token': `${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON if needed
        // 'Content-Type': 'application/x-www-form-urlencoded' // Add ID with custom header 
    };
        
        this.setState({status: true});
        axios
        .post(`${apiURL}Offers/GenerateCoupon?`,  formData, {headers}) 
        .then((response) => {
            // Handle the API response here
            console.log('Response' , response);
            // console.log('formData inside axios :', formData);
            
            if(response.data.success === true){
                if(!this.props.params.offer_coupon_id){
                    this.setState((prevState) => ({
                      /*   editorData : '',
                        offer_coupon_id : '',
                        coupon_code : '',
                        coupon_title_en : '',
                        min_purchase_amount : '',
                        coupon_expiry : '',
                        coupon_short_description : '', */
                        // program_short_title : '',
                        // program_short_description : '',
                        // program_long_description : '',
                        // program_duration : '',
                        // program_document : '',
                        // program_fees : '',
                       coupon_type : '',
                        // program_picture : '',
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
            console.log('API Response:', JSON.stringify(response.data.success));
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
        
    };


    render() {

        const { showModal, isViewCoupon, } = this.state;
        const { placeHolderImageURL } = this.context;
        const {offer_coupon_id} = this.props;
        

        // console.log('Props:', this.props.params.master_program_id)
        // console.log("from render: "+this.props.match.params.master_program_id);
        return (
            <>
                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">


                            <br />
                            <PageTitle title={`Coupon Management`} primary={`Home`} />

                            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////        */}

                            {/* Modal code for generate coupon button start here... */}

                            <div className="modal fade" id="couponAreYouSure" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"   > {/* data-bs-backdrop="static" : this keeps the modal from clicking if clicked anywhere else on the screen
data-bs-keyboard="false" ---> this keep the modal from closing even with the escap key or keyboard */}


                                <div className="modal-dialog ">
                                    <div className="modal-content d-flex justify-content-center align-items-center ">
                                        <div className="modal-header d-flex justify-content-center align-items-center">
                                            <h5 className="modal-title text-warning" id="exampleModalLabel">Are You Sure ?</h5>
                                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                        </div>
                                        <div className="modal-body">
                                            <p>
                                                <strong className='text-warning'>Warning:</strong> You are about to <strong className='text-success'>Generate Coupon</strong> for AutoParts.
                                                This action is irreversible and will affect the displayed prices for users applying this coupon.
                                                Please double-check the new prices before confirming.
                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">NO</button>
                                            <button type="button" className="btn btn-success" onClick={()=>this.handleGenerateCoupon()}  data-bs-dismiss="modal"  /* data-bs-toggle="modal" data-bs-target="#nestedModel" */>YES! Generate The Coupon</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* Modal code for generate coupon button end here... */}
{/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                             {/* Modal code for Update coupon button start here... */}

                             <div className="modal fade" id="couponAreYouSureUpdate" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"   > {/* data-bs-backdrop="static" : this keeps the modal from clicking if clicked anywhere else on the screen
data-bs-keyboard="false" ---> this keep the modal from closing even with the escap key or keyboard */}


                                <div className="modal-dialog ">
                                    <div className="modal-content d-flex justify-content-center align-items-center ">
                                        <div className="modal-header d-flex justify-content-center align-items-center">
                                            <h5 className="modal-title text-warning" id="exampleModalLabel">Are You Sure ?</h5>
                                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                        </div>
                                        <div className="modal-body">
                                            <p>
                                                <strong className='text-warning'>Warning:</strong> You are about to <strong className='text-primary'>Update Coupon</strong> for AutoParts.
                                                This action will affect the displayed price for users applying this coupon.
                                                Please double-check the new price before confirming.
                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">NO</button>
                                            <button type="button" className="btn btn-primary" onClick={()=>this.handleGenerateCoupon()}  data-bs-dismiss="modal"  /* data-bs-toggle="modal" data-bs-target="#nestedModel" */>YES! Update The Coupon</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* Modal code for Update coupon button end here... */}

                            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                            {/* Congratulation Modal code start here... */}
                            {showModal && <div className="modal fade" id="nestedModel" tabIndex={-1} aria-labelledby="nestedModalLabel" aria-hidden="true"   > {/* data-bs-backdrop="static" : this keeps the modal from clicking if clicked anywhere else on the screen
data-bs-keyboard="false" ---> this keep the modal from closing even with the escap key or keyboard */}


                                <div className="modal-dialog ">
                                    <div className="modal-content d-flex justify-content-center align-items-center ">
                                        <div className="modal-header d-flex justify-content-center align-items-center">
                                            <h5 className="modal-title text-success" id="nestedModalLabel">Congratulation !</h5>
                                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-4 d-flex justify-content-center align-items-center">
                                                <lord-icon src="https://cdn.lordicon.com/lupuorrc.json" trigger="loop" colors="primary:#0ab39c,secondary:#405189" style={{ width: '120px', height: '120px' }} />
                                            </div>
                                            <p>
                                                <strong className='text-success'>Great !</strong> You have successfully generated <strong className='text-success'> The Coupon</strong> for AutoParts.

                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-success btn-label right" data-bs-dismiss="modal" onClick={() => this.handleViewCoupon()}  >View Coupons<i className="  ri-gift-2-line label-icon align-middle fs-16 ms-2"></i></button>
                                        </div>
                                    </div>

                                </div>
                            </div>}

                            {/* Congratulations code end here... */}

                            {/* // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}


                            {!isViewCoupon ?                //this is ternary if operator


                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card" >
                                            <div className="card-header align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1">Generate Coupons</h4>
                                                {/* /  <div className="avatar-xs flex-shrink-0"> */}
                                                {/* <NavLink to={`/ProgramsList`} className="avatar-title bg-primary rounded fs-4"> */}
                                                {/* <i className="bx bx-shopping-bag text-info" /> */}
                                                {/* <i className="las la-list"></i> */}
                                                {/* </NavLink> */}
                                                {/* </div> */}
                                                {/* <button type="button" className="btn btn-success  btn-label waves-effect right waves-light" onClick={() => this.handleViewCoupon()}  ><i className="  ri-gift-2-line label-icon align-middle fs-16 ms-2"></i> View Coupons</button> */}
                                                <button onClick={() => this.handleViewCoupon()} className="btn-icon  btn  btn-success"> <i className="las la-list"></i> </button>

                                                {/* */}
                                            </div>
                                            <div className="card-body">
                                    <form  onSubmit={this.handleSubmit2} >
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
                                           {/*  {
                                                this.props.params.master_program_id? <SubmitBtn icon={`ri-save-line`} text={`Update`} type={`primary`} status={this.state.status}/>:  <SubmitBtn  text={`Generate Coupon`} type={`success`} icon={`ri-coupon-3-line`} />
                                                
                                            } */}
                                            { this.props.params.offer_coupon_id ?
                                            <button type='button'  className='btn btn-primary  btn-label waves-effect right waves-light' data-bs-toggle="modal" data-bs-target="#couponAreYouSureUpdate"><i className="ri-coupon-3-line label-icon align-middle fs-16 ms-2"></i>Update Coupon</button>
                                          :  <button type="submit" className="btn btn-success  btn-label waves-effect right waves-light" data-nexttab="v-pills-payment-tab" data-bs-toggle="modal" data-bs-target="#couponAreYouSure" /* disabled={!coupon_title_en || !coupon_type || !coupon_code || !coupon_value || !min_purchase_amount || !coupon_expiry ? true : false} */><i className="ri-coupon-3-line label-icon align-middle fs-16 ms-2"></i> Generate Coupon</button>
                                            
                                            }
                                            </div>
                                    </div>
                                    </form>
                                </div>
                                        </div>
                                    </div>
                                </div>

                                : //this is ternary else operator

                              

                                <div className="row">
                                    <div className="col-lg-12 " >
                                        <div className="card" >
                                            <div className="card-header align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1">Coupon List</h4>
                                                {/* <button type="button" className="btn btn-success btn-label right ms-auto " onClick={() => this.handleCreateCoupon()}>Create<i className="  ri-pencil-line label-icon align-middle fs-16 ms-2" /></button> */}
                                            <button onClick={() => this.handleCreateCoupon()} className="btn-icon  btn  btn-success"> <i className="ri-add-box-line"></i> </button>
                                            

                                            
                                                  
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-striped text-center">
                                                        <thead >
                                                            <tr>



                                                                <th scope="col" width="3%">ID</th>
                                                                <th scope="col" width="10%">Picture</th>
                                                                <th scope='col' width="31%">Title</th>
                                                                <th scope="col" width="10%">Coupon Type</th>
                                                                <th scope="col" width="10%">Coupon Code</th>
                                                                <th scope="col" width="10%">Coupon Value</th>
                                                                <th scope="col" width="10%">Min Purchase</th>
                                                                <th scope="col" width="11%">Coupon Expiry</th>
                                                                <th scope="col" width="5%">Action</th>



                                                            </tr>
                                                        </thead>
                                                        <tbody >
                                                            {

                                                                this.state.rows.length === 0 ?
                                                                    <tr><td colSpan={5}><NoRecords /></td></tr> : this.state.rows.map((row) => {





                                                                        return <tr key={`catkey-${row.offer_coupon_id}`}>
                                                                            <th scope='row'>{row.offer_coupon_id}</th>


                                                                            <td><div><img width={70} height={45} src={''} onError={(event) => {
                                                                                event.target.src = placeHolderImageURL
                                                                            }} alt='image' /></div></td>

                                                                            <td>{row.coupon_title}</td>
                                                                            <td>{row.coupon_type}</td>
                                                                            <td>{row.coupon_code}</td>
                                                                            <td>{row.coupon_value}</td>

                                                                            <td>{row.min_purchase_amount}</td>
                                                                            <td>{row.coupon_expiry}</td>
                                                                            <td><div className='hstack gap-2 mt-4 mt-sm-0'>
                                                            <NavLink to={`/CouponManagement/${row.offer_coupon_id}`}><button type='button' className="btn-icon btn btn-sm btn-outline-primary" onClick={() => this.handleEditCoupon()} > <i className="ri-edit-box-line"></i> </button> </NavLink>
                                                            <button onClick={() => this.handleDeleteCoupon(row.offer_coupon_id)} className="btn-icon btn btn-sm btn-outline-danger"> <i className="ri-delete-bin-line"></i> </button>
                                                            
                                                        </div></td>


                                                                        </tr>
                                                                    })


                                                            }




                                                          

                                                        </tbody>

                                                        {/*     <tfoot className='table-light '>
                                       <tr>
                                            <th colSpan={5} >
                                                <div className="d-flex justify-content-between" >
                                                    <button disabled={this.state.prev === false && this.state.status === false?true:false} type="button" onClick={() => this.handlePrev()} className={`btn btn-warning btn-label waves-effect waves-light`}><i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous</button>
                                                    <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            <small>Total Records: {this.state.total_records} | Total Pages: {this.state.total_pages} | Current Page: {this.state.page}</small>
                                                        }
                                                    </div>
                                                    <div className='col-md-2'>
                                                    <select className="form-select" onChange={(e) => this.handleChange(e)}>
                                                    {Array.from({ length: this.state.total_pages }, (_, i) => (
                                                        <option selected={this.state.page === i+1} key={i} value={i+1}>Page {i+1}</option>
                                                    ))}
                                                    </select>
                                                    </div>
                                                   
                                                 <button disabled={this.state.next === false && this.state.status === false?true:false} type="button" onClick={() => this.handleNext()} className={`btn btn-success btn-label waves-effect right waves-light`}><i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next</button>

                                                 {/* <button disabled={this.state.next === false && this.state.status === false?true:false}  type="button"  onClick={() => this.handleNext()} className="btn btn-success btn-label right ms-auto nexttab nexttab" ><i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next</button>   */}
                                                        {/* </div> 
                                            </th>
                                        </tr> 
                                    </tfoot>  */}

                                                    </table>
                                                </div>

                                                {/*  <!-- Striped Rows --> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                // </div>
                                //  </div>
                                //  </div>




                            }




                        </div>
                    </div>
                </div>
            </>

        )
    }
}

export default withRouter(CouponManagement);