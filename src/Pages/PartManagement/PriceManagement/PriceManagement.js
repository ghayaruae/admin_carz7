import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { ConfigContext } from "../../../Context/ConfigContext";
import PageTitle from "../../../Components/PageTitle";
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import axios from 'axios';
import { withTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
const PriceManagement = withTranslation()((props) => {
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
  const [brand, setBrand] = useState('');

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
      `${gdcURL}Parts/GetPriceFiles`
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

  const handleDrop = (acceptedFiles) => {
    setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, ...acceptedFiles]);
  };

  const handleUpdatePrices = () => {
    setIsPriceUpdated(true);
    Cookies.set("isPriceUpdated", "true");
  };

  const handleFinish = () => {
    setIsPriceUpdated(false);
    Cookies.set("isPriceUpdated", false);
  };

  const resetFileInput = () => {
    let randomString = Math.random().toString(36);
    setTheInputKey(randomString);
  };

  const handleFileChange = (file) => {
    // Handle file upload along with brand
    console.log('Brand:', brand);
    console.log('File:', file);
    // Add your file upload logic here
    setSelectedFile(file);
    setIsValidExcelFile(true);
    return true;
    if (file) {
      const { name, size } = file;
      const fileSizeInMB = size / (1024 * 1024);
      const fileExtension = name.split('.').pop().toLowerCase();
      setCsvData("");
      setFileName(name);
      setFileSize(`${fileSizeInMB.toFixed(2)} MB`);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        if (
          workbook.Sheets[workbook.SheetNames[0]]["A1"].v !== "price_mrp" ||
          workbook.Sheets[workbook.SheetNames[0]]["B1"].v !== "price" ||
          workbook.Sheets[workbook.SheetNames[0]]["C1"].v !== "part_number" || fileExtension !== 'xlsx'
        ) {
          setIsValidExcelFile(false);
          return false;
        } else {
          setIsValidExcelFile(true);
        }

        const datacsvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        setCsvData(datacsvData);
      };

      reader.readAsArrayBuffer(file);
    }
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
      file_name: item.VPF_SOURCE,
      file_id: item.VENDOR_PRICING_FILE_ID
    };
    

    const headers = { 'token': `${token}`, 'Content-Type': ' application/x-www-form-urlencoded', };
        
        axios
            .post(`${gdcURL}Parts/DeletePriceFile`, formData, { headers })
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
    if(item.VPF_STATUS === 0){
      return <button disabled={startStatus} onClick={() => StartUpdating(item)} className="btn btn-primary btn-sm">Start</button>
    }else if(item.VPF_STATUS === 1){
      return <button disabled className="btn btn-warning btn-sm">Inprocess</button>
    }else if(item.VPF_STATUS === 2){
      return <button type="button" className="btn btn-success btn-sm">Updated</button>
    }else if(item.VPF_STATUS === 3){
      return <button onClick={() => StartUpdating(item)} className="btn btn-danger btn-sm">Failed Try Again</button>
    }
    
  }

  const UploadFile = async () => {
    if (!brand || brand === '') {
     
      Swal.fire({
                title: "<strong>Error</strong>",
                html: "Brand is required",
                icon: "error",
              });
      return false;
    }
    // const blob = new Blob([csvData], { type: "text/csv" });
    // const blob = selectedFile;
    const formData = new FormData();
    formData.append("csvFile", selectedFile);
    formData.append('brand', brand);
    
    const headers = { 'token': `${token}`, 'Content-Type': 'multipart/form-data' };

    try {
      const response = await axios.post(`${gdcURL}Parts/UploadPriceFile`, formData, { headers });
      setUploadLoading(false);
      GetFiles();
      Swal.fire({
        title: `<strong>${response.data.success === true ? 'Success' : 'Failed'}</strong>`,
        text: response.data.message,
        icon: response.data.success === true ? 'success' : 'error'
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
          <PageTitle title={t("Price Management")} primary={`Home`} />

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
                        <div className="mb-3">
                          <input
                          type="text"
                          name="brand"
                          className="form-control"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Enter Brand"
                          style={{ marginBottom: '10px' }}
                        />
                        </div>
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
                    {t("Uploaded Prices List")} 
                    <button onClick={() => GetFiles()} className="btn btn-sm btn-success pull-right" style={{paddingTop: '0px',paddingBottom: '0px',paddingLeft: '2px',paddingRight: '2px', right: 10, position: 'absolute'}}><i style={{fontSize: '18px'}} className="ri-refresh-line"></i></button>
                  </h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>File</th>
                          <th>Brand</th>
                          <th>Date Time</th>
                          <th>Status</th>
                          <th><i className="ri-delete-bin-line"></i></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          PriceFiles.map((item) => {
                            return <tr>
                            <td><i className="ri-file-excel-line"></i> {item.VPF_SOURCE}</td>
                            <td>{item.VPF_BRAND}</td>
                            <td>{item.VPF_DATETIME}</td>
                            <td>{GetStatus(item)}</td>
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

export default PriceManagement;
