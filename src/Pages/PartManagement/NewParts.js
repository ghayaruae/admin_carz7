import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { ConfigContext } from "../../Context/ConfigContext"; 
import Swal from 'sweetalert2'; 
import axios from 'axios';
import { withTranslation } from "react-i18next"; 
import PageTitle from "../../Components/PageTitle";
import Select from 'react-select';

const NewParts = withTranslation()((props) => {
  const { apiURL, token, gdcURL } = useContext(ConfigContext);
  const { t } = props;  
  const [isValidExcelFile, setIsValidExcelFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(""); 
  const [selectedFile, setSelectedFile] = useState(""); 
  const [uploadLoading, setUploadLoading] = useState(false); 
  const [PriceFiles, setPriceFiles] = useState([]);
  const fileTypes = ["CSV"];

  const [existingPartNumber, setExistingPartNumber] = useState("");
  const [existingPartNumberBrand, setExistingPartNumberBrand] = useState("");
  const [existingPartInfo, setExistingPartInfo] = useState([]);
  const [newPartNumber, setNewPartNumber] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [criteria, setCriteria] = useState([ // New state for criteria
    {
      value_ar: "",
      value_en: "",
      criteria_ar: "",
      criteria_en: "",
      criteria_id: Date.now() // temporary ID
    }
  ]);
  const [oemNumbers, setOemNumbers] = useState([{
    ARL_BRA_BRAND: "",
    ARL_DISPLAY_NR: "",
    ARL_SEARCH_NUMBER: ""
  }]);

  const GetExistigPartInfo = () => {
    axios.get(
      `${gdcURL}Parts/GetNewPartInformationByNumber?part_number=${existingPartNumber}&sup_id=${existingPartNumberBrand}`
    )
    .then((response) => {
      if (response.data.success === true) {
        const data = response.data.info[0];
        console.log('Received data:', data);

        // Parse ARTICLE_CRITERIA if it's a string, otherwise use as is
        let parsedCriteria;
        try {
          parsedCriteria = typeof data.ARTICLE_CRITERIA === 'string' 
            ? JSON.parse(data.ARTICLE_CRITERIA) 
            : data.ARTICLE_CRITERIA;
        } catch (error) {
          console.error('Error parsing criteria:', error);
          parsedCriteria = [];
        }

        // Update the criteria state with the parsed data
        setCriteria(parsedCriteria || []);

        // Parse OEM_NUMBERS if it's a string, otherwise use as is
        let parsedOemNumbers;
        try {
          parsedOemNumbers = typeof data.OEM_NUMBERS === 'string'
            ? JSON.parse(data.OEM_NUMBERS)
            : data.OEM_NUMBERS;
        } catch (error) {
          console.error('Error parsing OEM numbers:', error);
          parsedOemNumbers = [];
        }

        // Update the OEM numbers state with the parsed data
        setOemNumbers(parsedOemNumbers || []);
  
        // Update the rest of the part info
        setExistingPartInfo(data);
      } else {
        Swal.fire({
          title: t("Error"),
          html: response.data.message,
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error('API Error:', error);
      Swal.fire({
        title: t("Error"),
        html: error.message,
        icon: "error",
      });
    });
  }

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${gdcURL}Suppliers/GetSuppliers`);
        if (response.data) {
          const formattedSuppliers = response.data.data.map(supplier => ({
            value: supplier.SUP_ID,
            label: supplier.SUP_BRAND,
            data: supplier // Keep all supplier data
          }));
          setSuppliers(formattedSuppliers);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        Swal.fire({
          title: "Error",
          text: "Failed to load suppliers",
          icon: "error"
        });
      }
    };

    fetchSuppliers();
  }, [gdcURL]);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={t("Add New Part Number")} primary={`Home`} />

          
            <form>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="newPartNumber" className="form-label">{t("New Part Number")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="newPartNumber"
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="partNumber" className="form-label">{t("Existing Part Number")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="partNumber"
                    value={existingPartNumber}
                    onChange={(e) => setExistingPartNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">{t("Brand")}</label>
                  <Select
                    id="brand"
                    value={suppliers.find(option => option.value === existingPartNumberBrand)}
                    onChange={(selectedOption) => {
                      setExistingPartNumberBrand(selectedOption.value);
                      console.log("Selected Supplier:", selectedOption.value);
                      // You can also access other supplier data if needed
                      // selectedOption.data contains all supplier information
                    }}
                    options={suppliers}
                    isSearchable={true}
                    placeholder={t("Select a brand...")}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-12">
                  <button
                      type="button"
                      className="btn btn-primary"
                      onClick={GetExistigPartInfo}
                  >
                      {t("Get Existing Part Info")}
                  </button>
                  <hr />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="level" className="form-label">{t("Level")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="level"
                    value={existingPartInfo.STR_LEVEL}
                    onChange={(e) => setExistingPartInfo({ ...existingPartInfo, STR_LEVEL: e.target.value })}
                  />
                </div>
              </div>

              
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nodeNameEn" className="form-label">{t("Node Name (EN)")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nodeNameEn"
                    value={existingPartInfo.STR_NODE_NAME_EN}
                    onChange={(e) => setExistingPartInfo({ ...existingPartInfo, STR_NODE_NAME_EN: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nodeNameAr" className="form-label">{t("Node Name (AR)")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nodeNameAr"
                    value={existingPartInfo.STR_NODE_NAME_AR}
                    onChange={(e) => setExistingPartInfo({ ...existingPartInfo, STR_NODE_NAME_AR: e.target.value })}
                  />
                </div>
              </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="pathEn" className="form-label">{t("Path (EN)")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="pathEn"
                        value={existingPartInfo.STR_PATH_EN}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, STR_PATH_EN: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="pathAr" className="form-label">{t("Path (AR)")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="pathAr"
                        value={existingPartInfo.STR_PATH_AR}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, STR_PATH_AR: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artId" className="form-label">{t("ART ID")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artId"
                        value={existingPartInfo.ART_ID}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_ID: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="ptId" className="form-label">{t("PT ID")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="ptId"
                        value={existingPartInfo.PT_ID}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, PT_ID: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">

                        <label htmlFor="productGroupEn" className="form-label">{t("Product Group (EN)")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="productGroupEn"
                        value={existingPartInfo.PRODUCT_GROUP_EN}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, PRODUCT_GROUP_EN: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="productGroupAr" className="form-label">{t("Product Group (AR)")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="productGroupAr"
                        value={existingPartInfo.PRODUCT_GROUP_AR}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, PRODUCT_GROUP_AR: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artSupId" className="form-label">{t("ART SUP ID")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artSupId"
                        value={existingPartInfo.ART_SUP_ID}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_SUP_ID: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artSupBrand" className="form-label">{t("ART SUP Brand")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artSupBrand"
                        value={existingPartInfo.ART_SUP_BRAND}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_SUP_BRAND: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artArticleNr" className="form-label">{t("ART Article Number")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artArticleNr"
                        value={existingPartInfo.ART_ARTICLE_NR}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_ARTICLE_NR: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artSearchNumber" className="form-label">{t("ART Search Number")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artSearchNumber"
                        value={existingPartInfo.ART_SEARCH_NUMBER}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_SEARCH_NUMBER: e.target.value })}
                        />
                    </div>
                </div>
                {/* <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="oemNumbers" className="form-label">{t("OEM Numbers")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="oemNumbers"
                        value={existingPartInfo.OEM_NUMBERS}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, OEM_NUMBERS: e.target.value })} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="articleCriteria" className="form-label">{t("Article Criteria")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="articleCriteria"
                        value={existingPartInfo.ARTICLE_CRITERIA}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ARTICLE_CRITERIA: e.target.value })}
                        />
                    </div>
                </div> */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="artType" className="form-label">{t("ART Type")}</label>
                        <input
                        type="text"
                        className="form-control"
                        id="artType"
                        value={existingPartInfo.ART_TYPE}
                        onChange={(e) => setExistingPartInfo({ ...existingPartInfo, ART_TYPE: e.target.value })}
                        />
                    </div>
                </div>
                
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">{t("Article Criteria")}</label>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>{t("Criteria EN")}</th>
                          <th>{t("Value EN")}</th>
                          <th>{t("Criteria AR")}</th>
                          <th>{t("Value AR")}</th>
                          <th>{t("Actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {criteria.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.criteria_en}
                                onChange={(e) => {
                                  const newCriteria = [...criteria];
                                  newCriteria[index].criteria_en = e.target.value;
                                  setCriteria(newCriteria);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.value_en}
                                onChange={(e) => {
                                  const newCriteria = [...criteria];
                                  newCriteria[index].value_en = e.target.value;
                                  setCriteria(newCriteria);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.criteria_ar}
                                onChange={(e) => {
                                  const newCriteria = [...criteria];
                                  newCriteria[index].criteria_ar = e.target.value;
                                  setCriteria(newCriteria);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.value_ar}
                                onChange={(e) => {
                                  const newCriteria = [...criteria];
                                  newCriteria[index].value_ar = e.target.value;
                                  setCriteria(newCriteria);
                                }}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  const newCriteria = criteria.filter((_, i) => i !== index);
                                  setCriteria(newCriteria);
                                }}
                              >
                                {t("Remove")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      setCriteria([
                        ...criteria,
                        {
                          value_ar: "",
                          value_en: "",
                          criteria_ar: "",
                          criteria_en: "",
                          criteria_id: Date.now() // temporary ID
                        }
                      ]);
                    }}
                  >
                    {t("Add Criteria")}
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">{t("OEM Numbers")}</label>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>{t("Brand")}</th>
                          <th>{t("Display Number")}</th>
                          <th>{t("Search Number")}</th>
                          <th>{t("Actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oemNumbers.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.ARL_BRA_BRAND}
                                onChange={(e) => {
                                  const newOemNumbers = [...oemNumbers];
                                  newOemNumbers[index].ARL_BRA_BRAND = e.target.value;
                                  setOemNumbers(newOemNumbers);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.ARL_DISPLAY_NR}
                                onChange={(e) => {
                                  const newOemNumbers = [...oemNumbers];
                                  newOemNumbers[index].ARL_DISPLAY_NR = e.target.value;
                                  setOemNumbers(newOemNumbers);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.ARL_SEARCH_NUMBER}
                                onChange={(e) => {
                                  const newOemNumbers = [...oemNumbers];
                                  newOemNumbers[index].ARL_SEARCH_NUMBER = e.target.value;
                                  setOemNumbers(newOemNumbers);
                                }}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  const newOemNumbers = oemNumbers.filter((_, i) => i !== index);
                                  setOemNumbers(newOemNumbers);
                                }}
                              >
                                {t("Remove")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      setOemNumbers([
                        ...oemNumbers,
                        {
                          ARL_BRA_BRAND: "",
                          ARL_DISPLAY_NR: "",
                          ARL_SEARCH_NUMBER: ""
                        }
                      ]);
                    }}
                  >
                    {t("Add OEM Number")}
                  </button>
                </div>
              </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <button
                        type="submit"
                        className="btn btn-success"
                        onClick={(e) => {
                            e.preventDefault();
                            // Handle form submission logic here
                            Swal.fire({
                                title: t("Success"),
                                text: t("New part number added successfully!"),
                                icon: "success",
                            });
                        }}
                    >
                        {t("Submit New Part Number")}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default NewParts;
