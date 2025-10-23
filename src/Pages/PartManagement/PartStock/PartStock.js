import React, {Component} from 'react'
import {ConfigContext} from '../../../Context/ConfigContext'
import axios from 'axios';
import Swal from 'sweetalert2'
import PageTitle from "../../../Components/PageTitle";
import { NavLink } from 'react-router-dom';
import {TableRows,NoRecords} from '../../../Components/Shimmer'
import withRouter from '../../../Utils/withRouter';
class PartsStock extends Component {
    static contextType = ConfigContext;
  constructor(props, context) {
    super(props, context);
    /*  if(this.props.params.offer_id){ 
            // console.log(this.props.params.offer_id);
        }else{
            // console.log("No PARAMAS: ",this.props.params.offer_id);
        } */
    this.state = {
      offer_id: "",
      rows: [],
      next: false,
      prev: false,
      page: 1,
      total_records: 0,
      total_pages: 0,
      status: false,
      limit: 5,
      keyword: "",
      initLoading: false,
    };
  }
  
  LoadData() {
    const { apiURL, token } = this.context;
    const headers = { token: `${token}`, "Content-Type": "application/json" };
    /*  if(this.props.params.offer_id){
    this.setState({offer_id:this.state.offer_id}); */
    console.log({
      limit: this.state.limit,
      page: this.state.page,
      keyword: this.state.keyword,
    });
    axios
      .get(
        `${apiURL}Parts/GetParts?lang=en&country_id=255&limit=${this.state.limit}&page=${this.state.page}&keyword=${this.state.keyword}`,
        { headers }
      )
      .then((response) => {
        var data = response.data;
        if (response.data.success === true) {
          this.setState({ rows: data.data, initLoading: false });
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
        this.setState({ initLoading: false });
      })
      .catch((error) => {
        this.setState({ initLoading: false });
        Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error", });
      });
    //  }
  }
  componentDidMount() {
    this.setState({ initLoading: true }, (prevState) => {
      this.LoadData();
    });
  }
  handleDeleteCoupon = (id) => {
    const { apiURL, token } = this.context;
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json", // Set the content type to JSON if needed
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({ status: true });
        const formData = {
          offer_item_id: id,
        };
        axios
          .post(`${apiURL}Offers/DeleteCoupon`, formData, { headers })
          .then((response) => {
            Swal.fire({
              title: `<strong>${
                response.data.success === true ? "Success" : "Failed"
              }</strong>`,
              text: response.data.message,
              icon: response.data.success === true ? "success" : "error",
            });
            this.setState({ status: false });
            if (response.data.success === true) {
              this.LoadData();
            }
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            // console.error('API Error:', error);
            Swal.fire({
              title: <strong>Error</strong>,
              html: error,
              icon: "error",
            });
          });
      }
    });
  };
  UpdatePartStock = (index, part_number, stock_qty) => {
    
    const { apiURL, token } = this.context;
    const headers = { token: `${token}`, "Content-Type": "application/json",  };
    Swal.fire({
      title: "Are you sure?",
      text: "You wanna update this part stock to "+(stock_qty === ''?0:stock_qty),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({ status: true });
        const formData = {
            part_number: part_number,
            stock_qty: stock_qty === ''?0:stock_qty,
        };
        axios
          .post(`${apiURL}Parts/UpdatePartStock`, formData, { headers })
          .then((response) => {
            Swal.fire({ title: `<strong>${ response.data.success === true ? "Success" : "Failed" }</strong>`, text: response.data.message, icon: response.data.success === true ? "success" : "error", });
            this.setState({ status: false });
            if (response.data.success === true) {
                var mRows = this.state.rows;
                mRows[index].stock_qty = stock_qty === ''?0:stock_qty;
                this.setState({rows: mRows});
            }
          })
          .catch((error) => {
            Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error", });
          });
      }
    });
  }
  handlePrev = (ev) => {
    // console.log(this.state.prev);
    if (this.state.prev === true) {
      this.setState(
        (prevState) => {
          return { page: prevState.page - 1 };
        },
        () => {
          this.LoadData(); // This will log the updated state value
        }
      );
    }
  };
  handleNext = () => {
    if (this.state.next === true) {
      this.setState(
        (prevState) => {
          return { page: prevState.page + 1 };
        },
        () => {
          this.LoadData(); // This will log the updated state value
        }
      );
    }
  };
  handleChange = (e) => {
    // console.log("calling");
    this.setState(
      (prevState) => {
        return { page: parseInt(e.target.value, 10) };
      },
      () => {
        this.LoadData(); // This will log the updated state value
      }
    );
  };
  handleQtyInputChange = (index,qty) => {
    
    var mrows = this.state.rows;
    mrows[index].stock_qty = qty;
    this.setState({rows: mrows});
  }
  render() {
    const { placeHolderImageURL } = this.context;
    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <br />
            <PageTitle title={`Manage Parts Stock`} primary={`Home`} />
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    
                    <h4 className="card-title mb-0 flex-grow-1"> Manage Parts Stock </h4>
                    <div className="col-md-4 mr-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="keyword"
                          onKeyUp={(e) => {
                            this.setState({ keyword: e.target.value });
                          }}
                          aria-label="Recipient's username"
                          aria-describedby="button-addon2"
                          placeholder="Search By Part Number"
                        />
                        <button
                          onClick={() => {
                            if (this.state.keyword.length > 3) {
                              this.LoadData();
                            }
                          }}
                          className="btn btn-outline-primary"
                          type="button"
                          id="button-addon2">
                          <i className="ri-search-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped text-left">
                        <thead>
                          <tr>
                            <th scope="col" width="10%">
                              Part Number
                            </th>
                            <th scope="col" width="30%">
                              Part Name
                            </th>
                            <th scope="col" width="10%">
                              Part Brand
                            </th>
                            <th scope="col" width="10%">
                              MRP Price
                            </th>
                            <th scope="col" width="10%">
                              Sale Price
                            </th>
                            <th
                              scope="col"
                              style={{ textAlign: "center" }}
                              width="8%">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.initLoading === true ? (
                            <tr>
                              <td className="text-center" colSpan={15}>
                                Loading...
                              </td>
                            </tr>
                          ) : this.state.rows.length === 0 ? (
                            <tr>
                              <td colSpan={5}>
                                <NoRecords />
                              </td>
                            </tr>
                          ) : (
                            this.state.rows.map((row, index) => {
                              return (
                                <tr key={`part-key-${row.part_number}-index`}>
                                  <th scope="row">{row.part_number}</th>
                                  <td>{row.part_title_en}</td>
                                  <td>{row.part_brand}</td>
                                  <td>{row.part_mrp}</td>
                                  <td className="text-success fw-bold ">
                                    {row.sale_price}
                                  </td>
                                  <td>
                                  <div class="input-group">
                                    <table cellSpacing={0}><tr><td><input type="number" class="form-control-sm text-center" onChange={(e)=>{this.handleQtyInputChange(index,e.target.value)}} value={row.stock_qty} width={50} aria-label="Recipient's username" aria-describedby="button-addon2" /></td><td><button class="btn btn-sm btn-success" type="button" onClick={() => {this.UpdatePartStock(index, row.part_number, row.stock_qty)}} id="button-addon2"><i class="ri-check-line"></i></button></td></tr></table>
                                    
                                    
                                </div>
                                
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>

                        <tfoot className="table-light ">
                          <tr>
                            <th colSpan={15}>
                              <div className="d-flex justify-content-between">
                                <button
                                  disabled={
                                    this.state.prev === false &&
                                    this.state.status === false
                                      ? true
                                      : false
                                  }
                                  type="button"
                                  onClick={() => this.handlePrev()}
                                  className={`btn btn-warning btn-label waves-effect waves-light`}>
                                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />{" "}
                                  Previous
                                </button>
                                <div
                                  className="col-md-4"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  {
                                    <small>
                                      Total Records: {this.state.total_records}{" "}
                                      | Total Pages: {this.state.total_pages} |
                                      Current Page: {this.state.page}
                                    </small>
                                  }
                                </div>
                                <div className="col-md-2">
                                  <select
                                    className="form-select"
                                    onChange={(e) => this.handleChange(e)}>
                                    {Array.from(
                                      { length: this.state.total_pages },
                                      (_, i) => (
                                        <option
                                          selected={this.state.page === i + 1}
                                          key={i}
                                          value={i + 1}>
                                          Page {i + 1}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                               
                                <button
                                  disabled={
                                    this.state.next === false &&
                                    this.state.status === false
                                      ? true
                                      : false
                                  }
                                  type="button"
                                  onClick={() => this.handleNext()}
                                  className="btn btn-success btn-label right ms-auto nexttab nexttab">
                                  <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />{" "}
                                  Next
                                </button>{" "}
                              </div>
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
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

export default withRouter(PartsStock);