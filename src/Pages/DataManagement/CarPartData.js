import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { ConfigContext } from '../../Context/ConfigContext';
import PageTitle from "../../Components/PageTitle";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // Import the xlsx library

const CarPartData = () => {
  const { gdcURL, apiURL, dmURL } = useContext(ConfigContext);
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [downloadsList, setDownloadsList] = useState([]); // New state for downloads list
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermProducts, setSearchTermProducts] = useState('');
  const [searchTermSuppliers, setSearchTermSuppliers] = useState('');
  const [models, setModels] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [series, setSeries] = useState(); 
  const [selectedPCID, setSelectedPCID] = useState();
  
  useEffect(() => {
    // Fetch makes/brands
    axios.get(`${gdcURL}Cars/GetMakes`)
      .then(response => {
        if (response.data.success) {  // Note the spelling change here
          console.log('Makes data:', response.data.data); // Log the data
          setMakes(response.data.data.map(make => ({
            value: make.MFA_ID,
            label: make.MFA_BRAND
          })));
        } else {
          console.error('Error fetching makes:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching makes:', error));
  }, [gdcURL]);

  useEffect(() => {
    if (selectedMake) {
      
      axios.get(`${gdcURL}Cars/GetUniModels?MFAID=${selectedMake}`)
        .then(data => {
         
          setModels(data.data.data);
          setSelectedPCID("");
          setSeries([]);
        })
    }
  }, [selectedMake]);

  
  useEffect(() => {
    console.log("selectedMake", selectedMake)
  }, [selectedMake])
  useEffect(() => {
    if (selectedModel) {
     
      axios.get(`${gdcURL}Cars/GetUniSeries?MFAID=${selectedMake}&MSID=${selectedModel}`)
        .then(data => {
          setSeries(data.data.data); 
        })
    }else{ 
    }
    
  }, [selectedModel]);

  useEffect(() => {
    console.log('Makes state updated:', makes);
  }, [makes]);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title="Parts Data By Car" primary="Home" />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Select Make and Supplier</h4>
                </div>
                <div className="card-body">
                  <div className="row gy-4">
                    <div className="col-md-2" >
                      <label>Makes</label>
                      <Select options={makes} onChange={(e) => setSelectedMake(e.value)}></Select>
                    </div>

                    <div className="col-md-4" >
                      <label>Models</label>
                      <Select options={models} onChange={(e) => setSelectedModel(e.value)}></Select>
                    </div>

                    <div className="col-md-4" >
                      <label>Engine</label>
                      <Select options={series} onChange={(e) => setSelectedPCID(e.value)}></Select>
                    </div>
                    <div className="col-md-2" >
                      <label>Makes</label>
                      <button className='btn btn-primary' type='button' />
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPartData;


