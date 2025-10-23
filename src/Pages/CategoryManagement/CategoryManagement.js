import React, { Component, useContext } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../Components/PageTitle";
import { Buffer } from "buffer";
import { NavLink } from "react-router-dom";

import { TableRows, NoRecords } from "../../Components/Shimmer";

class CategoryManagement extends Component {
  static contextType = ConfigContext;
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      next: false,
      prev: false,
      page: 1,
      total_records: 0,
      total_pages: 0,
      status: false,
      limit: 5,
      parent_category: [{name: "Primary Categories", id: 0}],
      category_index: 0,
      rows: [],
      initLoading: false,
    };
  }
  handleSubCategories = (sub_category_id, sub_category_name) => {
    var mparent_category = this.state.parent_category;
    mparent_category.push({name: sub_category_name, id: sub_category_id});
    
    this.setState({
        parent_category: mparent_category,
        category_index: this.state.category_index + 1,
    });
  }
  handlePrevSubCategories = () =>{
    // console.log(this.state.parent_category);
    var mparent_category = this.state.parent_category;
    mparent_category.splice(this.state.category_index, 1);
    this.setState({
        parent_category: mparent_category,
        category_index: this.state.category_index - 1,
    });
    
  }
  LoadData() {
    const { apiURL, token } = this.context;

    const headers = { token: `${token}`, "Content-Type": "application/json", };

    axios
      .get(`${apiURL}Categories/GetCategories?lang=en&parent_category_id=0`, {
        params: { limit: this.state.limit, page: this.state.page },
        headers,
      })
      .then((response) => {
        var data = response.data;
        console.log(data);
        if (response.data.success === true) {
          this.setState({ rows: data.data, status: true, });
        } else {
          Swal.fire({ title: "<strong>Error</strong>", html: response.data.message, icon: "error", });
        }
        this.setState({initLoading: false});
      })
      .catch((error) => {
        this.setState({initLoading: false});
        Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error", });
      });
  }

  componentDidMount() {
    this.setState({initLoading: true}, () =>{
        this.LoadData();
    })
    
  }

  handleCategoryPublishStatus = (index, categories_local_id, categories_local_publish_status) => {
    const { apiURL, token } = this.context;
    const headers = { token: `${token}`, "Content-Type": "application/json",  };
    Swal.fire({
      title: "Are you sure?",
      text: categories_local_publish_status === 1 ?"You wanna unpublish this category for customers":"You wanna publish this category for customers",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: categories_local_publish_status === 1 ?"Yes, unpublish it!":"Yes, publish it",
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({ status: true });
        const formData = {
            categories_local_id: categories_local_id,
            categories_local_publish_status: categories_local_publish_status === 0?1:0,
        };
        console.log("formData", formData)
        axios
          .post(`${apiURL}Categories/UpdateCategoryPublishStatus`, formData, { headers })
          .then((response) => {
            console.log("response", response.data)
            Swal.fire({ title: `<strong>${ response.data.success === true ? "Success" : "Failed" }</strong>`, text: response.data.message, icon: response.data.success === true ? "success" : "error", });
            this.setState({ status: false });
            if (response.data.success === true) {
                var mRows = this.state.rows;
                mRows[index].categories_local_publish_status = categories_local_publish_status === 0?1:0;
                this.setState({rows: mRows});
            }
          })
          .catch((error) => {
            console.log("response",error)
            Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error", });
          });
      }
    });
    //code to publish car parts
  };

  handleFileSelection = () => {};

  unpublishCarParts = () => {

    //code to unpublish car parts
  };

  handlePrev = (ev) => {
    console.log(this.state.prev);
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
    console.log("calling");
    this.setState(
      (prevState) => {
        return { page: parseInt(e.target.value, 10) };
      },
      () => {
        this.LoadData(); // This will log the updated state value
      }
    );
  };

  render() {
    const { placeHolderImageURL } = this.context;

    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <br />
            <PageTitle title={`Category Management`} primary={`Home`} />
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    {
                        this.state.category_index !== 0?
                        <div className="avatar-xs  flex-shrink-0 mr-5">
                            <button type="button" onClick={() => this.handlePrevSubCategories() } className="avatar-title bg-dark rounded fs-4">
                            <i className="ri-arrow-left-line"></i>
                            </button>
                        </div>:<div></div>
                    }
                    
                    <h4 className="card-title mb-0 flex-grow-1">
                      Category Management List
                    </h4>

                    
                    <div className="avatar-xs  flex-shrink-0">
                      <NavLink
                        to={`/ManagePrograms`}
                        className="avatar-title bg-primary rounded fs-4">
                        {/* <i className="bx bx-shopping-bag text-info" /> */}
                        <i className="ri-add-box-line"></i>
                      </NavLink>
                    </div>
                  </div>
                  

                  <div className="card-body">
                    <table className={`table table-bordered table-stripped`}>
                      <thead className="table-light">
                        <tr>
                          <th style={{width: '5%'}}>ID</th>
                          <th style={{width: '10%'}}> Picture</th>
                          <th style={{width: '60%'}}>Title</th>

                          <th style={{width: '35%'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <TableRows colspan={5} rows={this.state.limit} />  */}
                        {
                        this.state.initLoading === true?<tr><td className="text-center" colSpan={15}>Loading...</td></tr>:
                        this.state.rows.length === 0 ? ( <tr> <td colSpan={5}> <NoRecords /> </td> </tr> ) : (
                          this.state.rows.map((row, index) => {
                            
                            return (
                                this.state.parent_category[this.state.category_index].id === row.parent_category_id?
                                <tr key={`catkey-${row.category_id}`}>
                                    <td>{row.category_id}</td>
                                    <td> <div> <img width={60} height={60} src={row.category_picture} onError={(event) => { event.target.src = placeHolderImageURL; }} alt={`${row.category_title}`} /> </div> </td>
                                    <td>{row.category_title}</td>
                                    <td>
                                    <div className="btn-group flex-wrap" role="group" aria-label="Actions">
                                        <button type="button" className={`btn btn-outline-${row.categories_local_publish_status === 0?'success':'warning'} btn-sm custom-toggle`} data-bs-toggle="button" id="publishButton" onClick={() => this.handleCategoryPublishStatus(index, row.categories_local_id, row.categories_local_publish_status) }> {" "} <span className="icon-on ">{row.categories_local_publish_status === 0?'Publish':'Unpublish'} </span> <span className="icon-off "> Unpublish{" "} </span> </button>
                                        <button type="button" className="btn btn-outline-primary btn-sm " id="publishButton" onClick={() => this.handleSubCategories(row.category_id, row.category_title) }> Sub Categories </button>
                                        <button onClick={() => this.handleDeleteProgram( row.master_program_id ) } className="btn-icon btn btn-sm btn-outline-danger "> {" "} <i className="ri-delete-bin-line"></i>{" "} </button>
                                    </div>
                                    </td>
                                </tr>:<div></div>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <th colSpan={5}>
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
                                    Total Records: {this.state.total_records} |
                                    Total Pages: {this.state.total_pages} |
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
                                className={`btn btn-primary btn-label waves-effect right waves-light`}>
                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />{" "}
                                Next
                              </button>
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
    );
  }
}

export default CategoryManagement;
