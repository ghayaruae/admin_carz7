import React, {Component} from 'react'
import {ConfigContext} from '../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import PageTitle from "../../Components/PageTitle";
import { NavLink } from 'react-router-dom';
import {TableRows,NoRecords} from '../../Components/Shimmer'
import Select from 'react-select';
class ShippingCompanies extends Component {
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
          limit: 20,
          initLoading: true,
          keyword: '',
          companies: [],
         
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
        .get(`${apiURL}Configuration/GetCountries?lang=en`,{ params: { keyword: this.state.keyword, limit: this.state.limit, page: this.state.page }, headers })
        .then((response) => {
         
            var data = response.data;
            if(response.data.success === true){
                this.setState({
                    keyword: '',
                    rows: data.data,
                    next: data.next, 
                    prev: data.prev,
                    page: data.page,
                    total_records: data.total_records,
                    total_pages: data.total_pages,
                    initLoading: false
                });
            }else{
                this.setState({initLoading: false});
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

    LoadCompanies () {
        const { apiURL } = this.context;
        const { token } = this.context;
        const headers = { 'token': `${token}`, 'Content-Type': 'application/json', };
        axios
        .get(`${apiURL}Configuration/GetShippingCompanies?lang=en`,{ params: { limit: this.state.limit, page: this.state.page }, headers })
        .then((response) => {
           
            var data = response.data;
            
            if(response.data.success === true){
                this.setState({ companies: data.data }, ()=>{
                    console.log('Companies',this.state.companies);
                });
            }else{
                Swal.fire({ title: '<strong>Error</strong>', html: response.data.message, icon: 'error' })
            }
        })
        .catch((error) => {
            Swal.fire({ title: <strong>Error</strong>, html: error, icon: 'error' })
        });  
    }
    componentDidMount(){
        this.setState({initLoading: true}, (prevState) => {
            this.LoadCompanies();
            this.LoadData();
        })
        
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
    UpdateCompany = (country_id, company) => {
        const { apiURL, token } = this.context;
        const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
        this.setState({ status: true });
        axios
        .post(`${apiURL}Configuration/UpdateCountrysShippingCompany`, {country_id: country_id, shipping_company: company}, { headers })
        .then((response) => {
            console.log('create response : ', response);
            this.setState({status : false});
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
        render(){
            const {placeHolderImageURL} = this.context;
        
            return (
                
                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <br />
                            <PageTitle title={`Shipping Companies`} primary={`Home`} />
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card" >
                                        <div className="card-header align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1">Countries List</h4>
                                            <div className='col-md-4 mr-2'>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" onKeyUp={(e)=>{this.setState({keyword:e.target.value }, (prevState) => {if(e.target.value.length > 3){this.LoadData()}})}} aria-label="Recipient's username" aria-describedby="button-addon2" placeholder='Search Country By Name' />
                                                    <button className="btn btn-outline-primary" type="button" id="button-addon2"><i className="ri-search-line"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                        <div className="table-responsive">
                                                    <table className="table table-striped text-center">
                                                        <thead >
                                                            <tr>
                                                                <th scope="col" width="10%">Country ID</th>
                                                                <th scope="col" width="50%">Country Name</th>
                                                                <th scope='col' width="10%">Country Code</th>
                                                                <th scope="col" width="20%">Company</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody >
                                                            {
                                                                this.state.initLoading === true? <TableRows />:
                                                                this.state.rows.length === 0 ?
                                                                    <tr><td colSpan={5}><NoRecords /></td></tr> : this.state.rows.map((row) => {
                                                                        return <tr key={`catkey-${row.country_id}`}>
                                                                            <th scope='row'>{row.country_id}</th>
                                                                            <td>{row.country}</td>
                                                                            <td>{row.country_alpha1_code}</td>
                                                                            <td><Select onChange={(e) => { this.UpdateCompany(row.country_id, e.value)}} placeholder={row.shipping_company || 'Select'} options={this.state.companies}/></td>
                                                                          
                                                                        </tr>
                                                                    })


                                                            }




                                                          

                                                        </tbody>

                                                        <tfoot className='table-light'>
                                        <tr>
                                            <th colSpan={10} >
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
                                                    <button disabled={this.state.next === false && this.state.status === false?true:false} type="button" onClick={() => this.handleNext()} className={`btn btn-primary btn-label waves-effect right waves-light`}><i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next</button>
                                                </div>
                                            </th>
                                        </tr>
                                    </tfoot>

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

export default ShippingCompanies;