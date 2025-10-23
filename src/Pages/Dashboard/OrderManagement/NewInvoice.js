import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom"; // Use this to get route params
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../../Components/PageTitle";
import { Link, NavLink } from "react-router-dom";
import { TableRows, NoRecords } from "../../../Components/Shimmer";
import DeliverModal from "./DeliverModal";
import ParentComponent from "./ParentComponent";
import LabelPrint from "./LabelPrint";
import OrderStatusIcons from "../../../Utils/Helper";
import Invoice from "./Invoice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrderAssign from './OrderAssign';
import QRCode from 'qrcode';
import { useTranslation } from "react-i18next";
const NewInvoice = ({order_id}) => {
    const { apiURL, token, placeHolderImageURL } = useContext(ConfigContext);
    
    const dir = "rtl";
    // Separate state variables
    const [first_name, setFirstName] = useState("");
    const [part_number, setPartNumber] = useState("");
    const [address, setAddress] = useState([]);
    const [orderInfo, setOrderInfo] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [rows, setRows] = useState([]);
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [page, setPage] = useState(1);
    const [total_records, setTotalRecords] = useState(0);
    const [total_pages, setTotalPages] = useState(0);
    const [status, setStatus] = useState(false);
    const [limit, setLimit] = useState(5);
    const [timelines, setTimelines] = useState([]);
    const [comments, setComments] = useState([]);
    const printRef = useRef();
    const {t} = useTranslation();
    const [qrCodeURL, setQrCodeURL] = useState('');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    useEffect(() => {
        QRCode.toDataURL('https://ghayar.com')
        .then(url => {
            setQrCodeURL(url);
            console.log(url)
        })
        .catch(err => {
            console.error(err)
        })

    }, [])
    const handleDownloadPdf = async () => {
      try {
        setIsGeneratingPdf(true);
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        });
        
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
        pdf.save(`order-${order_id}.pdf`);
      } catch (error) {
        console.error('PDF generation failed:', error);
        Swal.fire({
          title: "Error",
          text: "Failed to generate PDF. Please try again.",
          icon: "error"
        });
      } finally {
        setIsGeneratingPdf(false);
      }
    };
    const handleEmailModalOpen = () => {
      setEmailAddress(orderInfo.email_address || "");
      setShowEmailModal(true);
    };
    const handleEmailModalClose = () => {
      setShowEmailModal(false);
      setEmailAddress("");
    };
    const handleEmailInvoice = async () => {
      try {
        setIsSendingEmail(true);
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        });
        
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
        
        // Create a Blob from the PDF
        const pdfBlob = pdf.output('blob');
        
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('order_id', order_id);
        formData.append('email', emailAddress);
        formData.append('pdf_file', pdfBlob, `order-${order_id}.pdf`);

        const response = await axios.post(
          `${apiURL}Orders/SendInvoiceEmail`,
          formData,
          {
            headers: {
              token: token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          handleEmailModalClose();
          Swal.fire({
            title: "Success",
            text: "Invoice has been sent successfully",
            icon: "success"
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Email sending failed:', error);
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to send invoice email. Please try again.",
          icon: "error"
        });
      } finally {
        setIsSendingEmail(false);
      }
    };
    const LoadData = () => {
      const headers = {
        token: `${token}`,
        "Content-Type": "application/json",
      };
  
      axios
        .get(`${apiURL}orders/GetOrderDetails?lang=en&order_id=${order_id}`, headers)
        .then((response) => {
          const data = response.data;
          if (data.success === true) {
            // Update individual state variables
            setOrderInfo(data.data.order_info[0]);
            setOrderItems(data.data.order_items);
            setFirstName(data.data.order_info[0].first_name);
            setAddress(JSON.parse(data.data.order_info[0].address_json));
            setPartNumber(data.data.order_items[0].part_number);
            setTimelines(data.data.timelines);
            setRows(data.data);
            setNext(data.next);
            setPrev(data.prev);
            setPage(data.page);
            setTotalRecords(data.total_records);
            setTotalPages(data.total_pages);
            
          } else {
            Swal.fire({
              title: "<strong>Error</strong>",
              html: data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: error.toString(),
            icon: "error",
          });
        });
    };
  
    
  
    useEffect(() => {
      LoadData();
    }, [order_id]);
  
    const handlePrev = () => {
      if (prev) {
        setPage((prevPage) => prevPage - 1);
        LoadData();
      }
    };
  return (
    <main>
      
      <div className="main-content">
         <div className="page-content">
         
          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn btn-warning btn-label waves-effect right waves-light btn-sm mx-2"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
            >
                <i className="ri-download-2-line label-icon align-middle fs-16 ms-2"></i>
              {isGeneratingPdf ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating PDF...
                </>
              ) : (
                'Download PDF'
              )}
            </button>
            
            <button
            type="button"
            className="btn btn-success btn-label waves-effect right waves-light btn-sm mx-2"
            onClick={handleEmailModalOpen}>
            <i className="ri-mail-check-line label-icon align-middle fs-16 ms-2"></i>{" "}
            Mail Invoice
            </button>
          </div>
          
                      
          {/* Email Modal */}
          {showEmailModal && (
            <>
              <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Send Invoice Email</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={handleEmailModalClose}
                        disabled={isSendingEmail}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="emailAddress" className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailAddress"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          disabled={isSendingEmail}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleEmailModalClose}
                        disabled={isSendingEmail}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleEmailInvoice}
                        disabled={isSendingEmail || !emailAddress}
                      >
                        {isSendingEmail ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="modal-backdrop fade show" 
                style={{ zIndex: 1040 }}
                onClick={handleEmailModalClose}
              ></div>
            </>
          )}
          
          <div ref={printRef} style={{
            background: 'white',
            padding: '20px',
            margin: '0 auto'
          }}>
            <div className="col-lg-9">
              <div
                className="tab-pane fade show active"
                id="address"
                role="tabpanel">
                <div className="order-content">
                  
                  
                  <div className="order-table-container text-center" style={{marginTop: '50px'}}>
                    <div className="order-summary">
                      <table style={{width: '100%'}}>
                        <tr>
                          <td
                            className="text-left align-top"
                            style={{ width: "40%" }}>
                            <h5>Shipping Address</h5>
                            <b>
                              {orderInfo.first_name} {orderInfo.last_name}
                            </b>
                            <p
                              className="xw-50"
                              style={{ fontFamily: "arial" }}>
                              <i>
                                {" "}
                                {address.complete_address} <br />
                                {address.Street} {orderInfo.city} -{" "}
                                {address.country} <br />{" "}
                                {orderInfo.mobile_number} <br />{" "}
                                {orderInfo.email_address}{" "}
                              </i>
                            </p>
                          </td>
                          <td
                            className="text-left align-top"
                            style={{ width: "30%", textTransform: 'uppercase', textAlign: 'center' }}>
                            <h5>Payment Method</h5>
                            {orderInfo.payment_method === "COD" ? (
                              <b>Cash on delivery</b>
                            ) : (
                              <b>{orderInfo.payment_method}</b>
                            )}
                            <img src={qrCodeURL} alt="QR Code" />
                          </td>
                          <td
                            className="text-left align-top"
                            style={{ width: "40%" }}>
                            <div className="align-right">
                              <h5>Order Summary</h5>
                              <table>
                                <tr> <td>Sub Total</td> <th>: {orderInfo.sub_total_display}</th> </tr>
                                <tr> <td>Shipping Charges	</td> <th>: {orderInfo.display_shipping_cost}</th> </tr>
                               

                                {
                                  orderInfo.payment_method === 'cod' && orderInfo.cod_applicable === 1 && <tr> <td>COD Charges</td> <th>: {orderInfo.display_cod_charges}</th> </tr>
                                }
                                <tr> <td>Grand Total</td> <th>: {orderInfo.grand_total_display}</th> </tr>
                                
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className="order-summary">
                      <table className="table table-cart">
                        <thead>
                          <tr>
                            
                            <th className="product-col">Product</th>
                            <th className="price-col">Price</th>
                            <th className="qty-col">Quantity</th>
                            <th className="text-right">Sub Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item) => {
                            return (
                              <tr className="product-row" key={item.order_item_id}>
                                
                                <td className="product-col text-left">
                                  <h5 className="product-title">
                                  {item.item_title} - {item.item_number} <br />
                                  
                                  </h5>
                                </td>
                                <td>{item.item_display_price}</td>
                                <td>
                                  <div className="product-single-qty">
                                    <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                                      <span className="input-group-btn input-group-prepend">
                                      {item.item_qty}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right">
                                  <span className="subtotal-price">{(item.item_qty * item.item_price).toFixed(2)}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
  
}

export default NewInvoice;
