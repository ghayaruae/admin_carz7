import React, {Component} from 'react'
import {ConfigContext} from '../../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import PageTitle from "../../../Components/PageTitle";
import { NavLink } from 'react-router-dom';
import {TableRows,NoRecords} from '../../../Components/Shimmer'
class CouponList extends Component {
    static contextType = ConfigContext;
    constructor(props) {
        super(props);
        this.state = {
          rows: [],
          next: false,
          prev: false,
          page:1,
          total_records: 0,
          total_pages: 0,
          status: false,
          limit: 5,
        };
    }
    LoadData () {
        const { apiURL } = this.context;
        const { token } = this.context;
        const headers = {
        'token': `${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON if needed
        
        
        };
        axios
        .get(`${apiURL}Offers/GetCoupons?lang=en`,{ params: { limit: this.state.limit, page: this.state.page }, headers })
        .then((response) => {
           
            // Handle the API response here
            var data = response.data;
            if(response.data.success === true){
                this.setState({
                    rows: data.data,
                    next: data.next, 
                    prev: data.prev,
                    page: data.page,
                    total_records: data.total_records,
                    total_pages: data.total_pages
                });
            }else{
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
    componentDidMount(){
        this.LoadData();
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
                       
                        Swal.fire({
                            title: `<strong>${response.data.success === true? 'Success': 'Failed'}</strong>`,
                            text: response.data.message,
                            icon: response.data.success === true? 'success': 'error'
                        })
                        this.setState({status: false});
                        if(response.data.success === true){
                            this.LoadData();
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

        handlePrev = (ev) => {
            // console.log(this.state.prev);
            if(this.state.prev === true){
                this.setState((prevState) => {
                    return { page: prevState.page - 1 };
                  }, () => {
                    this.LoadData(); // This will log the updated state value
                  });
            }
        }
        handleNext = () => {
        
            if(this.state.next === true){
                this.setState((prevState) => {
                    return { page: prevState.page + 1 };
                  }, () => {
                    this.LoadData(); // This will log the updated state value
                  });
            }
        }
        handleChange = (e) => {
            // console.log("calling");
            this.setState((prevState) => {
                return { page: parseInt(e.target.value, 10) };
              }, () => {
                this.LoadData(); // This will log the updated state value
              });
        }

        render(){
            const {placeHolderImageURL} = this.context;
        
            return (
                
                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <br />
                            <PageTitle title={`Coupon List`} primary={`Home`} />
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card" >
                                        <div className="card-header align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1">Coupon List</h4>
                                            {/* <div className='col-md-4 mr-2'>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" />
                                                    <button className="btn btn-outline-primary" type="button" id="button-addon2"><i className="ri-search-line"></i></button>
                                                </div>
                                            </div>
                                            <div style={{width: '10px'}}></div> */} 
                                            <div className="avatar-xs  flex-shrink-0">
                                                <NavLink to={`/CouponManagement`} className="avatar-title bg-primary rounded fs-4">
                                                    {/* <i className="bx bx-shopping-bag text-info" /> */}
                                                    <i className="ri-add-box-line"></i>
                                                </NavLink>
                                            </div>
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
                                                                            <td><div className='hstack gap-2 mt-4 mt-sm-0 justify-content-center align-items-center'>
                                                            <NavLink to={`/CouponManagement/${row.offer_coupon_id}`}><button type='button' className="btn-icon btn btn-sm btn-outline-primary" > <i className="ri-edit-box-line"></i> </button> </NavLink>
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
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default CouponList;