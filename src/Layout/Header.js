import React from 'react'
import  {  NavLink } from 'react-router-dom'
const Header = () =>{

  const handleLogout =()=>{
    localStorage.removeItem('token');
   
  }

    return (<div>
        <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/* LOGO */}
              <div className="navbar-brand-box horizontal-logo">
                <NavLink to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={`${process.env.REACT_APP_BASE_URL}assets/car7_transparent_logo.png`} alt="" height={82} />
                  </span>
                  <span className="logo-lg">
                    <img src={`${process.env.REACT_APP_BASE_URL}assets/car7_transparent_logo.png`} alt="" height={67} />
                  </span>
                </NavLink>
                <NavLink to='/' className="logo logo-light">
                  <span className="logo-sm">
                    <img src={`${process.env.REACT_APP_BASE_URL}assets/car7_transparent_logo.png`} alt="" height={32} />
                  </span>
                  <span className="logo-lg">
                    <img src={`${process.env.REACT_APP_BASE_URL}assets/car7_transparent_logo.png`} alt="" height={27} />
                  </span>
                </NavLink>
              </div>
              <button type="button" className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger" id="topnav-hamburger-icon">
                <span className="hamburger-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
              {/* App Search*/}
              <form className="app-search d-none d-md-block">
                <div className="position-relative">
                  <input type="text" className="form-control" placeholder="Search..." autoComplete="off" id="search-options" /* defaultValue */ />
                  <span className="mdi mdi-magnify search-widget-icon" />
                  <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" id="search-close-options" />
                </div>
                <div className="dropdown-menu dropdown-menu-lg" id="search-dropdown">
                  <div data-simplebar style={{maxHeight: '320px'}}>
                    {/* item*/}
                    <div className="dropdown-header">
                      <h6 className="text-overflow text-muted mb-0 text-uppercase">Recent Searches</h6>
                    </div>
                    <div className="dropdown-item bg-transparent text-wrap">
                      <a href="index.html" className="btn btn-soft-secondary btn-sm rounded-pill">how to setup <i className="mdi mdi-magnify ms-1" /></a>
                      <a href="index.html" className="btn btn-soft-secondary btn-sm rounded-pill">buttons <i className="mdi mdi-magnify ms-1" /></a>
                    </div>
                    {/* item*/}
                    <div className="dropdown-header mt-2">
                      <h6 className="text-overflow text-muted mb-1 text-uppercase">Pages</h6>
                    </div>
                    {/* item*/}
                    <a href={`/`} className="dropdown-item notify-item">
                      <i className="ri-bubble-chart-line align-middle fs-18 text-muted me-2" />
                      <span>Analytics Dashboard</span>
                    </a>
                    {/* item*/}
                    <a href={`/`} className="dropdown-item notify-item">
                      <i className="ri-lifebuoy-line align-middle fs-18 text-muted me-2" />
                      <span>Help Center</span>
                    </a>
                    {/* item*/}
                    <a href={`/`} className="dropdown-item notify-item">
                      <i className="ri-user-settings-line align-middle fs-18 text-muted me-2" />
                      <span>My account settings</span>
                    </a>
                    {/* item*/}
                    <div className="dropdown-header mt-2">
                      <h6 className="text-overflow text-muted mb-2 text-uppercase">Members</h6>
                    </div>
                    <div className="notification-list">
                      {/* item */}
                      <a href={`/`} className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img src={`${process.env.REACT_APP_BASE_URL}assets/images/users/avatar-2.jpg`} className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                          <div className="flex-grow-1">
                            <h6 className="m-0">Angela Bernier</h6>
                            <span className="fs-11 mb-0 text-muted">Manager</span>
                          </div>
                        </div>
                      </a>
                      {/* item */}
                      <a href={`/`} className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img src={`${process.env.REACT_APP_BASE_URL}assets/images/users/avatar-3.jpg`} className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                          <div className="flex-grow-1">
                            <h6 className="m-0">David Grasso</h6>
                            <span className="fs-11 mb-0 text-muted">Web Designer</span>
                          </div>
                        </div>
                      </a>
                      {/* item */}
                      <a href={`/`} className="dropdown-item notify-item py-2">
                        <div className="d-flex">
                          <img src={`${process.env.REACT_APP_BASE_URL}assets/images/users/avatar-5.jpg`} className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                          <div className="flex-grow-1">
                            <h6 className="m-0">Mike Bunch</h6>
                            <span className="fs-11 mb-0 text-muted">React Developer</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="text-center pt-3 pb-1">
                    <a href="pages-search-results.html" className="btn btn-primary btn-sm">View All Results <i className="ri-arrow-right-line ms-1" /></a>
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex align-items-center">
              <div className="dropdown d-md-none topbar-head-dropdown header-item">
                <button type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" id="page-header-search-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="bx bx-search fs-22" />
                </button>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0" aria-labelledby="page-header-search-dropdown">
                  <form className="p-3">
                    <div className="form-group m-0">
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                        <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify" /></button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              
              <div className="dropdown ms-sm-3 header-item topbar-user">
                <button type="button" className="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="d-flex align-items-center">
                    <img className="rounded-circle header-profile-user" src={`${process.env.REACT_APP_BASE_URL}assets/images/widget-img.png`} alt="Header Avatar" />
                    <span className="text-start ms-xl-2">
                      <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">Super Admin</span>
                      <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">Founder</span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  {/* item*/}
                   <h6 className="dropdown-header">Welcome Super Admin!</h6>
                  {/* <a className="dropdown-item" href="pages-profile.html"><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" /> <span className="align-middle">Profile</span></a>
                  <a className="dropdown-item" href="apps-chat.html"><i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1" /> <span className="align-middle">Messages</span></a>
                  <a className="dropdown-item" href="apps-tasks-kanban.html"><i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1" /> <span className="align-middle">Taskboard</span></a>
                  <a className="dropdown-item" href="pages-faqs.html"><i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1" /> <span className="align-middle">Help</span></a> */}
                  <div className="dropdown-divider" />
                  {/* <a className="dropdown-item" href="pages-profile.html"><i className="mdi mdi-wallet text-muted fs-16 align-middle me-1" /> <span className="align-middle">Balance : <b>$5971.67</b></span></a>
                  <a className="dropdown-item" href="pages-profile-settings.html"><span className="badge bg-success-subtle text-success mt-1 float-end">New</span><i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1" /> <span className="align-middle">Settings</span></a>
                  <a className="dropdown-item" href="auth-lockscreen-basic.html"><i className="mdi mdi-lock text-muted fs-16 align-middle me-1" /> <span className="align-middle">Lock screen</span></a> */}
                  <NavLink className="dropdown-item" to="/Login" onClick={handleLogout}><i className="mdi mdi-logout text-muted fs-16 align-middle me-1" /> <span className="align-middle" data-key="t-logout">Logout</span></NavLink> 
                   </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* removeNotificationModal */}
      <div id="removeNotificationModal" className="modal fade zoomIn" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="NotificationModalbtn-close" />
              </div>
              <div className="modal-body">
                <div className="mt-2 text-center">
                  <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style={{width: '100px', height: '100px'}} />
                  <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <h4>Are you sure ?</h4>
                    <p className="text-muted mx-4 mb-0">Are you sure you want to remove this Notification ?</p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                  <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn w-sm btn-danger" id="delete-notification">Yes, Delete It!</button>
                </div>
              </div>
            </div>{/* /.modal-content */}
          </div>{/* /.modal-dialog */}
        </div>{/* /.modal */}
        {/* ========== App Menu ========== */}
        <div className="app-menu navbar-menu">
          {/* LOGO */}
          <div className="navbar-brand-box">
            {/* Dark Logo*/}
            <a href="index.html" className="logo logo-dark">
              <span className="logo-sm">
                <img src={`${process.env.REACT_APP_BASE_URL}assets/images/logo-sm.png`} alt="" height={22} />
              </span>
              <span className="logo-lg">
                <img src={`${process.env.REACT_APP_BASE_URL}assets/images/logo-dark.png`} alt="" height={17} />
              </span>
            </a>
            {/* Light Logo*/}
            <a href="index.html" className="logo logo-light">
              <span className="logo-sm">
                <img src={`${process.env.REACT_APP_BASE_URL}assets/images/logo-sm.png`} alt="" height={22} />
              </span>
              <span className="logo-lg">
                <img src={`${process.env.REACT_APP_BASE_URL}assets/images/logo-light.png`} alt="" height={17} />
              </span>
            </a>
            <button type="button" className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
              <i className="ri-record-circle-line" />
            </button>
          </div>
          <div id="scrollbar">
            <div className="container-fluid ">
              <div id="two-column-menu">
              </div>
             
              <ul className="navbar-nav " id="navbar-nav">
                <li className="menu-title "><span data-key="t-menu">Menu</span></li>
              

                <li className="nav-item nav-sm">
                  <NavLink to={`/OrderManagement`} className="nav-link menu-link "  >
                    <i className="ri-apps-2-line" /> <span className='fw-semibold' data-key="t-dashboards">Dashboard</span>
                  </NavLink>
                </li> 

                
                <li className="nav-item nav-sm">
                  <NavLink to={`CategoryManagement`} className="nav-link menu-link "  >
                    <i className="ri-dashboard-2-line" /> <span className='fw-semibold' data-key="t-dashboards">Category Management</span>
                  </NavLink>
                </li> 



                <li className="nav-item nav-sm">
                  <a className="nav-link menu-link " href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarApps">
                    <i className="ri-apps-2-line" /> <span className='fw-semibold' data-key="t-apps">Parts Management</span>
                  </a>
                  <div className="collapse menu-dropdown" id="sidebarApps">
                    <ul className="nav nav-sm flex-column">
                    <li className="nav-item nav-sm">
                      <NavLink to={`PriceManagement`} className="nav-link" data-key="t-mailbox">Price Management</NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`PartPriceChecker`} className="nav-link" data-key="t-mailbox">Part Number Checker </NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`HideParts`} className="nav-link " data-key="t-mailbox">Hide Parts</NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`PartsStock`} className="nav-link " data-key="t-mailbox">Parts Stock</NavLink>
                    </li>

                    <li className="nav-item nav-sm" >
                      <NavLink to={`SupplierManagement`} className="nav-link " data-key="t-mailbox">Supplier Management</NavLink>
                    </li>
                   
                  
                    </ul>
                  </div>
                </li>
               

                <li className="nav-item nav-sm">
                  <a className="nav-link menu-link " href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarApps">
                    <i className="ri-apps-2-line" /> <span className='fw-semibold' data-key="t-apps">Offer Management</span>
                  </a>
                  <div className="collapse menu-dropdown" id="sidebarApps">
                    <ul className="nav nav-sm flex-column">
                      
                    <li className="nav-item">
                        <a href="#sidebarEmail" className="nav-link" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarEmail" data-key="t-email">
                          Coupons
                        </a>
                        <div className="collapse menu-dropdown" id="sidebarEmail">
                          <ul className="nav nav-sm flex-column">
                            <li className="nav-item">
                              <NavLink to={`CouponManagement`} className="nav-link" data-key="t-mailbox"> Manage Coupons </NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink to={`CouponList`} className="nav-link" data-key="t-mailbox">Coupon List </NavLink>
                            </li>
                          </ul>
                        </div>
                      </li>



                      <li className="nav-item">
                        <a href="#sidebarEmail" className="nav-link" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarEmail" data-key="t-email">
                          Sliders
                        </a>
                        <div className="collapse menu-dropdown" id="sidebarEmail">
                          <ul className="nav nav-sm flex-column">
                            <li className="nav-item">
                              <NavLink to={`SliderManagement`} className="nav-link" data-key="t-mailbox"> Manage Sliders </NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink to={`SliderList`} className="nav-link" data-key="t-mailbox">Sliders List </NavLink>
                            </li>
                          </ul>
                        </div>
                      </li>
                     

                     

                      <li className="nav-item">
                        <NavLink to="#sidebarEmail" className="nav-link" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarEmail" data-key="t-email">
                          Promos
                        </NavLink>
                        <div className="collapse menu-dropdown" id="sidebarEmail">
                          <ul className="nav nav-sm flex-column">
                            <li className="nav-item">
                              <NavLink to={`PromoManagement`} className="nav-link" data-key="t-mailbox"> Manage Promos</NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink to={`PromoList`} className="nav-link" data-key="t-mailbox"> Promos List </NavLink>
                            </li>
                          </ul>
                        </div>
                      </li>

                      <li className="nav-item">
                        <a href="#sidebarEmail" className="nav-link" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarEmail" data-key="t-email">
                          Offers
                        </a>
                        <div className="collapse menu-dropdown" id="sidebarEmail">
                          <ul className="nav nav-sm flex-column">
                            <li className="nav-item">
                              <NavLink to={`OfferManagement`} className="nav-link" data-key="t-mailbox"> Manage Offers </NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink to={`OfferList`} className="nav-link" data-key="t-mailbox">Offer List </NavLink>
                            </li>
                          </ul>
                        </div>
                      </li>

                     
                      
                    </ul>
                  </div>
                </li>
                <li className="nav-item nav-sm">
                  <a className="nav-link menu-link " href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarApps">
                    <i className="ri-apps-2-line" /> <span className='fw-semibold' data-key="t-apps">Reports</span>
                  </a>
                  <div className="collapse menu-dropdown" id="sidebarApps">
                    <ul className="nav nav-sm flex-column">
                    <li className="nav-item nav-sm">
                      <NavLink to={`OrderManagement`} className="nav-link" data-key="t-mailbox">  Sales Report</NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`OrderManagement`} className="nav-link " data-key="t-mailbox">Trends Analytics</NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`OrderManagement`} className="nav-link " data-key="t-mailbox"> Customer Bahivoural Anylatics</NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`OrderManagement`} className="nav-link " data-key="t-mailbox">  Sales Predictive Report</NavLink>
                    </li>
                    <li className="nav-item nav-sm" >
                      <NavLink to={`OrderManagement`} className="nav-link " data-key="t-mailbox">  Demand Predictive Report </NavLink>
                    </li>
                  
                    </ul>
                  </div>
                </li>

                <li className="nav-item nav-sm">
                  <a className="nav-link menu-link " href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarApps">
                    <i className="mdi mdi-spin mdi-cog-outline fs-22" /> <span className='fw-semibold' data-key="t-apps">Configurations</span>
                  </a>
                  <div className="collapse menu-dropdown" id="sidebarApps">
                    <ul className="nav nav-sm flex-column">
                      
                    <li className="nav-item nav-sm" >
                      <NavLink to={`EmailConfiguration`} className="nav-link " data-key="t-mailbox"> Email Configurations </NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`ShippingConfiguration`} className="nav-link" data-key="t-mailbox"> Shipping Configurations </NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`GeneralConfiguration`} className="nav-link" data-key="t-mailbox"> General Configurations </NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`ShippingCompanies`} className="nav-link" data-key="t-mailbox"> Shipping Companies </NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`ShippingDimensions`} className="nav-link" data-key="t-mailbox"> Shipping Dimensions </NavLink>
                    </li>
                    <li className="nav-item nav-sm">
                      <NavLink to={`SitemapManagement`} className="nav-link" data-key="t-mailbox"> Sitemap Management </NavLink>
                    </li>
                    
                    <li>
                    <NavLink to="/PageManagement" className="nav-link">Page Management</NavLink>
                    </li>
                    <li>
                    <NavLink to="/UserManagement" className="nav-link">User Management</NavLink>
                    </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item nav-sm">
                  <a className="nav-link menu-link " href="#sidebarDataManagement" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarDataManagement">
                    <i className="ri-database-2-line" /> <span className='fw-semibold' data-key="t-data-management">Data Management</span>
                  </a>
                  <div className="collapse menu-dropdown" id="sidebarDataManagement">
                    <ul className="nav nav-sm flex-column">
                      <li className="nav-item nav-sm">
                        <NavLink to={`PartsDataByModel`} className="nav-link" data-key="t-parts-data-by-model">Parts Data By Model</NavLink>
                      </li>
                      <li className="nav-item nav-sm">
                        <NavLink to={`PartsDataByModelUsed`} className="nav-link" data-key="t-parts-data-by-model">Used Parts Data By Model</NavLink>
                      </li>
                      <li className="nav-item nav-sm">
                        <NavLink to={`ProductsManagement`} className="nav-link" data-key="t-parts-data-by-model">Products Management</NavLink>
                      </li>
                      
                      <li className="nav-item nav-sm">
                        <NavLink to={`SupplierManagement`} className="nav-link" data-key="t-supplier-management">Supplier Management</NavLink>
                      </li>
                      <li className="nav-item nav-sm"> <NavLink to={`MakeManagement`} className="nav-link" data-key="t-supplier-management">Make Management</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`ModelManagement`} className="nav-link" data-key="t-supplier-management">Model Management</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`ProductPositionsManagement`} className="nav-link" data-key="t-supplier-management">Products Positions Management</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`OEDataManagement`} className="nav-link" data-key="t-supplier-management">OE Data Management</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`UploadNewData`} className="nav-link" data-key="t-supplier-management">Upload New Part Number</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`NewPartsBufferZone`} className="nav-link" data-key="t-supplier-management">New Parts Buffer Zone</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`VerifyNewParts`} className="nav-link" data-key="t-supplier-management">Verify New Parts</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`PartMediaManagement`} className="nav-link" data-key="t-supplier-management">Part Media Management</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`NewPCDataTransfer`} className="nav-link" data-key="t-supplier-management">New PC Data Transfer</NavLink> </li>
                      <li className="nav-item nav-sm"> <NavLink to={`PartsInformationUpdate`} className="nav-link" data-key="t-supplier-management">Parts Information Update</NavLink> </li>
                    </ul>
                  </div>
                </li>

                   
                        
              
                   
             



              </ul>
              
            </div>
            {/* Sidebar */}
          </div>
          <div className="sidebar-background" />
        </div>
        {/* Left Sidebar End */}
        {/* Vertical Overlay*/}
        <div className="vertical-overlay" />
      </div>
    );
}


export default Header;
