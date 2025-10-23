import React, { useRef } from "react";

import Barcode from 'react-barcode';
const LabelPrint = ({onClose, orderInfo}) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();  // Refresh to restore the page after print
  };

  return (
    <div
    className="modal fade"
    id="showPrintLabelModal"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-light p-3">
          <h5 className="modal-title" id="exampleModalLabel"> &nbsp; </h5> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal"></button>
        </div>
        <form className="tablelist-form" autoComplete="off">
          <div className="modal-body">
            

{/** PRINTING CONTENT */}

<div>
      
      {/* Section to be printed */}
      <div ref={printRef} style={{ width: "335px", height: "500px", border: "1px solid #000", padding: "10px", fontFamily: "calibri" }}>
        Return to:
        <br />
        Showroom 6 -51 AJD Building, 5th Street
        <br /> Umm Ramool, Dubai,
        <br />
        United Arab Emirates
        <br />
        <div style={{ height: "10px", width: "335px", marginLeft:'-11px',borderBottom: "1px solid #000" }}></div>
        <br />
        Deliver to:
        <br />
        <h5 className="fs-14">{`${orderInfo.first_name} ${orderInfo.last_name}`}</h5>
       
       
        {orderInfo && orderInfo.address_json && 
          JSON.parse(orderInfo.address_json)
            .apartment
        } , 
        {orderInfo && orderInfo.address_json && 
          JSON.parse(orderInfo.address_json)
            .complete_address
        } , 
{orderInfo && orderInfo.address_json && 
          JSON.parse(orderInfo.address_json)
            .city
        }
        <br />
        {orderInfo && orderInfo.address_json && 
          JSON.parse(orderInfo.address_json)
            .country
        }
       
       
      
        <center>
      
        <Barcode value={`000000000${orderInfo.order_id}`} height={70} />
        </center>
       
      
        <center>
          <img src="https://ghayar.ae/v1/admin/public/img/totheapp.png" width="100" alt="To The App" />
        </center>
      </div>
    </div>
{/** PRINTING CONTENT END */}














          </div>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
               >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-success"
                id="add-btn">
                Print
              </button>
             
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
    
      
  );
};

export default LabelPrint;
