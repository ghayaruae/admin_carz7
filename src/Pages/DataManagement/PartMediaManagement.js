import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';
import Select from 'react-select';

const PartMediaManagement = () => {
  const { gdcURL } = useContext(ConfigContext);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [partNumber, setPartNumber] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false); // New state for upload loading
  const [ARTID, setARTID] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
  // Fetch suppliers list on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${gdcURL}Suppliers/GetSuppliers`);
        if (res.data.success && Array.isArray(res.data.data)) {
          setSuppliers(res.data.data.map(sup => ({
            value: sup.SUP_ID,
            label: sup.SUP_BRAND
          })));
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, [gdcURL]);

  const handleProcess = async () => {
    if (!selectedSupplier || !partNumber) {
      Swal.fire({ icon: 'warning', title: 'Please select supplier and enter part number.' });
      return;
    }
    setLoading(true);
    setMedia([]); 
    setARTID(''); // Reset ARTID on new process
    try {
      const response = await axios.get(`${gdcURL}Parts/GetExistingPartPictures`, {
        params: { SUP_ID: selectedSupplier.value, PART_NUMBER: partNumber }
      });
      if (response.data.success) {
        // remove duplicates based on ART_MEDIA_FILE_NAME
        const uniqueMedia = response.data.data.reduce((acc, current) => {
          const x = acc.find(item => item.ART_MEDIA_FILE_NAME === current.ART_MEDIA_FILE_NAME);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setMedia(uniqueMedia);
        setARTID(response.data.ART_ID || '');
      } else {
        setMedia([]);
        Swal.fire({ icon: 'info', title: 'No media found for this part.' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePicture = async (ART_MEDIA_ID, ART_MEDIA_FILE_NAME, ART_MEDIA_SUP_ID) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This picture will be permanently deleted',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });
      if (result.isConfirmed) {
        const response = await axios.post(`${gdcURL}Parts/RemoveNewPartPicture`, {
          ART_MEDIA_FILE_NAME,
          ART_MEDIA_SUP_ID,
          ART_MEDIA_ID
        });
        if (response.data.success) {
          setMedia(prev => prev.filter(pic => pic.ART_MEDIA_FILE_NAME !== ART_MEDIA_FILE_NAME));
          Swal.fire('Deleted!', 'Picture has been deleted.', 'success');
        }
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  const processFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'warning', title: 'Please select a valid image file.' });
      return;
    }

    if (!selectedSupplier || !partNumber) {
      Swal.fire({ icon: 'warning', title: 'Select supplier and part number first.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ART_SUP_ID', selectedSupplier.value);
    formData.append('ART_ID', ARTID);

    try {
      setUploadLoading(true); // Set upload loading to true
      const response = await axios.post(`${gdcURL}Parts/UploadNewPartPicture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setMedia(prev => [...prev, response.data.data]);
        Toast.fire({ icon: "success", title: "Picture uploaded successfully" });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    } finally {
      setUploadLoading(false); // Reset upload loading
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    await processFileUpload(file);
    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadLoading) { // Only set drag over if not uploading
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (uploadLoading) return; // Prevent drop during upload
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFileUpload(file);
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container mt-4">
          <h4>Part Media Management</h4>
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Supplier</label>
              <Select
                options={suppliers}
                value={selectedSupplier}
                onChange={setSelectedSupplier}
                placeholder="Select Supplier"
                isClearable
              />
            </div>
            <div className="col-md-4">
              <label>Part Number</label>
              <input
                className="form-control"
                value={partNumber}
                onChange={e => setPartNumber(e.target.value)}
                placeholder="Enter Part Number"
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={handleProcess} disabled={loading}>
                {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Process'}
              </button>
            </div>
          </div>

          {media && (
            <div className="row">
              <div className="col-12">
                <h5>Media List</h5>
                <div className="row">
                  {media.map(pic => (
                    (pic.ART_MEDIA_TYPE === 'JPEG' || pic.ART_MEDIA_TYPE === 'PNG' || pic.ART_MEDIA_TYPE === 'GIF' || pic.ART_MEDIA_TYPE === 'WEBP' || pic.ART_MEDIA_TYPE === 'JPG')  && (<div className="col-md-3 mb-4" key={pic.ART_MEDIA_FILE_NAME}>
                      <div className="card">
                        <img
                          src={`https://dcapi.carz7.com/images/${pic.ART_MEDIA_SUP_ID}/${pic.ART_MEDIA_FILE_NAME}`}
                          alt="Part"
                          className="card-img-top"
                          style={{ height: 180, objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => window.open(`https://dcapi.carz7.com/images/${pic.ART_MEDIA_SUP_ID}/${pic.ART_MEDIA_FILE_NAME}`, '_blank')}
                        />
                        <div className="card-body p-2 text-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemovePicture(pic.ART_MEDIA_ID, pic.ART_MEDIA_FILE_NAME, pic.ART_MEDIA_SUP_ID)}
                          >
                            <i className="ri-delete-bin-line"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>)
                  ))}
                  {ARTID && (
                    <div className="col-md-3 mb-4">
                      <div 
                        className="card h-100 d-flex align-items-center justify-content-center" 
                        style={{ 
                          minHeight: 180,
                          opacity: uploadLoading ? 0.7 : 1,
                          pointerEvents: uploadLoading ? 'none' : 'auto'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {uploadLoading ? (
                          // Loading state
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: 180,
                            color: '#0d6efd'
                          }}>
                            <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 10 }}></i>
                            <div style={{ fontSize: 14 }}>Uploading...</div>
                          </div>
                        ) : (
                          // Upload area
                          <>
                            <label 
                              className={`btn btn-outline-primary w-100 m-0 ${isDragOver ? 'btn-primary' : ''}`}
                              style={{ 
                                height: 180, 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                backgroundColor: isDragOver ? '#0d6efd' : 'transparent',
                                color: isDragOver ? 'white' : '#0d6efd',
                                border: isDragOver ? '2px dashed #fff' : '1px solid #0d6efd',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <i 
                                className="ri-upload-cloud-2-line" 
                                style={{ fontSize: 32, marginBottom: 8 }}
                              ></i>
                              <div style={{ fontSize: 14, textAlign: 'center' }}>
                                {isDragOver ? 'Drop image here' : 'Click to upload or drag & drop'}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleUpload}
                                disabled={uploadLoading}
                              />
                            </label>
                            <div 
                              className="text-center" 
                              style={{ 
                                fontSize: 12, 
                                color: '#888',
                                position: 'absolute',
                                bottom: 10
                              }}
                            >
                              Add New Image
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {media.length === 0 && !loading && (
            <div className="alert alert-info mt-4" role="alert">
              No media found. Please process to view or add images.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartMediaManagement;
