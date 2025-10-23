import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { ConfigContext } from "../../../Context/ConfigContext";
import PageTitle from "../../../Components/PageTitle";
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import axios from 'axios';
import { withTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
const PartPriceChecker = withTranslation()((props) => {
  const { apiURL, token, gdcURL, placeHolderImage } = useContext(ConfigContext);
  const { t } = props;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(false);
  const [limit, setLimit] = useState(5);
  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const [isValidExcelFile, setIsValidExcelFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [csvData, setCsvData] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [theInputKey, setTheInputKey] = useState('inkey100');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startStatus, setStartStatus] = useState(false);
  const [PriceFiles, setPriceFiles] = useState([]);

  const fileTypes = ["CSV"];
  useEffect(() => {
    GetFiles();
  }, [])
  useEffect(() => {
    const storedIsPriceUpdatedValue = Cookies.get("isPriceUpdated");
    if (storedIsPriceUpdatedValue) {
      setIsPriceUpdated(JSON.parse(storedIsPriceUpdatedValue));
    }
  }, []);

  const GetFiles = () => {
    axios.get(
      `${gdcURL}Parts/GetPPCheckedFiles`
    )
    .then((response) => {
      var data = response.data;
      if (response.data.success === true) {
        setPriceFiles(response.data.data);
      } else {
        Swal.fire({
          title: "<strong>Error</strong>",
          html: response.data.message,
          icon: "error",
        });
      }
      
    })
    .catch((error) => {
      
      Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error", });
    });
  }

 

  const resetFileInput = () => {
    let randomString = Math.random().toString(36);
    setTheInputKey(randomString);
  };

  const handleFileChange = (file) => {
    // const file = e.target.files[0];
    setSelectedFile(file);
    setIsValidExcelFile(true);
    return true;
   
  };
  const StartUpdating = (item) => {
    setStartStatus(true);
    var formData = {
      file_name: item.VPF_SOURCE,
      file_id: item.VENDOR_PRICING_FILE_ID
    };
    
    axios.post(`${gdcURL}Parts/StartUpdating`, formData)  // formData goes directly as the request body
      .then((response) => {
        setStartStatus(false);
        GetFiles();
      })
      .catch((error) => {
        setStartStatus(false);
        console.log(error);
        Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error" });
      });
    

  }

  const DeletePriceFile = (item) => {
    setStartStatus(true);
    var formData = {
      file_name: item.VPNC_UPLOADED_FILE,
      file_id: item.VENDOR_PN_CHECKER_ID
    };
    
    axios.post(`${gdcURL}Parts/DeletePriceFile`, formData)  // formData goes directly as the request body
      .then((response) => {
        setStartStatus(false);
        GetFiles();
      })
      .catch((error) => {
        setStartStatus(false);
        console.log(error);
        Swal.fire({ title: <strong>Error</strong>, html: error, icon: "error" });
      });
    
      
  }
  const GetStatus = (item) => {
    if(item.VPNC_STATUS === 0){
      return <button disabled className="btn btn-warning btn-sm">Pending</button>
    }else if(item.VPNC_STATUS === 1){
        return <button type="button" className="btn btn-warning btn-sm">Inprogress</button>
      }else if(item.VPNC_STATUS === 2){
      return <button type="button" className="btn btn-success btn-sm">Ready</button>
    }else if(item.VPNC_STATUS === 3){
      return <button onClick={() => StartUpdating(item)} className="btn btn-danger btn-sm">Failed Try Again</button>
    }
    
  }

  const UploadFile = async () => {
    // const blob = new Blob([csvData], { type: "text/csv" });
    // const blob = selectedFile;
    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    const headers = { 'token': `${token}`, 'Content-Type': 'multipart/form-data' };

    try {
        const response = await axios.post(`${gdcURL}Parts/UploadPriceCheckerFile`, formData, { headers });
        setUploadLoading(false);
        GetFiles();
        console.log("response", response)
        Swal.fire({
          title: `<strong>${response.data.success ? 'Success' : 'Failed'}</strong>`,
          text: response.data.message,
          icon: response.data.success ? 'success' : 'error'
        });
      } catch (error) {
        console.error("Error posting CSV data to API:", error);
      }
      
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={t("Part Number Checker")} primary={`Home`} />

          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-header justify-content-center align-items-center d-flex">
                  <h3 className="d-flex justify-content-center align-items-center">
                    {t("Submit Your Pricing Structure Here.")}
                  </h3>
                </div>
                <div className="card-body">
                
                  <div>
                    <div className=" d-flex justify-content-between align-items-center ml-4">
                      
                      <a className="fs-16" href={process.env.PUBLIC_URL + 'sample_price_file.csv'} download={"sample_price_file.csv"}>
                        <i className="ri-links-fill"></i>
                        {t("Access Sample Pricing Guide")}
                      </a>
                    </div>


                    <div className="dropzone dz-clickable d-flex justify-content-center flex-column align-items-center">
                      <div className="dz-message needsclick d-flex justify-content-center flex-column align-items-center cursor-pointer">
                      <FileUploader className="drop_zone" handleChange={handleFileChange} name="file" types={fileTypes} />
                      </div>
                    </div>
                    
                    <ul
                      className="list-unstyled mb-0" 
                      id="dropzone-preview"
                      style={{ display:'none',visibility: fileName === '' ? 'hidden' : 'visible' }}>
                      <li className="mt-2 dz-processing dz-error dz-complete" id="dropzone-preview-list">
                        <div className="border rounded">
                          <div className="d-flex p-2">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm bg-light rounded">
                                {isValidExcelFile === false ? (
                                  <i className="ri-alert-fill" style={{ position: 'absolute', color: 'red', marginLeft: 20, marginTop: 10 }}></i>
                                ) : null}
                                <center><i className="ri-file-excel-2-line" style={{ fontSize: 28, color: 'green' }}></i></center>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="pt-1">
                                <h5 className="fs-13 mb-1">{fileName}</h5>
                                <p className="fs-13 text-muted mb-0"><strong>{fileSize}</strong></p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ms-3 d-flex justify-content-center align-items-center">
                              <button
                                onClick={() => {
                                  setFileName('');
                                  setFileSize('');
                                  setIsValidExcelFile(false);
                                  resetFileInput();
                                }}
                                className="btn btn-sm btn-outline-danger">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div style={{color: 'red'}} className="mt-2">
                        <h5 style={{color: 'red'}} className="fs-13 mb-1">{t("Note* :")}</h5>
                        <ul  className="text-muted">
                          <li>{t("Kindly provide your pricing details in CSV format.")} </li>
                          <li>{t("Price and MRP columns should contain only number not alphabet or special charecter")}</li>
                          <li>{t("No column should be empty this could cause error or stuck process")}</li>
                        </ul>
                      </div>
                  <div className="d-flex align-items-start">
                  
                    {uploadLoading ? (
                      <button type="button" disabled className="btn btn-default btn-label right ms-auto">
                        <i className="mdi mdi-spin mdi-loading label-icon align-middle fs-16 ms-2"></i> Update Prices
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!isValidExcelFile}
                        onClick={() => {
                          setUploadLoading(true);
                          UploadFile();
                        }}
                        className="btn btn-primary btn-label right ms-auto">
                        <i className="ri-check-line label-icon align-middle fs-16 ms-2"></i> Upload Price List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
              <div className="card-header justify-content-center align-items-center d-flex">
                  <h3 className="d-flex justify-content-center align-items-center">
                    {t("Ready To Download File List")} 
                    <button onClick={() => GetFiles()} className="btn btn-sm btn-success pull-right" style={{paddingTop: '0px',paddingBottom: '0px',paddingLeft: '2px',paddingRight: '2px', right: 10, position: 'absolute'}}><i style={{fontSize: '18px'}} className="ri-refresh-line"></i></button>
                  </h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>File</th>
                          <th>Date Time</th>
                          <th>Status</th>
                          <th><i className="ri-download-line"></i></th>
                          <th><i className="ri-delete-bin-line"></i></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          PriceFiles.map((item) => {
                            return <tr>
                            <td><i className="ri-file-excel-line"></i> {item.VPNC_SOURCE}</td>
                            <td>{item.VPNC_UPLOAD_DATETIME}</td>
                            <td>{GetStatus(item)}</td>
                            {item.VPNC_READY_FILE?<td><a href={`${gdcURL}PNFile/${item.VPNC_READY_FILE}`} disabled className="btn btn-sm btn-success"><i className="ri-download-line"></i></a></td>:<td><button type="button" className="btn btn-sm btn-light"><i className="ri-download-line"></i></button></td>}
                            <td><button onClick={() => DeletePriceFile(item)} className="btn btn-sm btn-danger"><i className="ri-delete-bin-line"></i></button></td>
                          </tr>
                          })
                        }
                        
                      </tbody>
                    </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PartPriceChecker;
