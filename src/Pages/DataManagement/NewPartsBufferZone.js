import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';
import { useContext } from 'react';
import Pagination from 'react-js-pagination';

const NewPartsBufferZone = () => {
  const { gdcURL } = useContext(ConfigContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editableCriteria, setEditableCriteria] = useState([]);

  // New states for picture handling
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedPartForPictures, setSelectedPartForPictures] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchParts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${gdcURL}Parts/GetNewPartNumbers`, {
        params: {
          page,
          limit: pagination.itemsPerPage
        }
      });

      if (response.data.success) {
        setParts(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems,
          itemsPerPage: response.data.pagination.itemsPerPage
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handlePageChange = (pageNumber) => {
    fetchParts(pageNumber);
  };

  const handleApprove = async (partId) => {
    try {
      await axios.post(`${gdcURL}Parts/ApproveNewPartNumber/${partId}`);
      Swal.fire({
        icon: 'success',
        title: t('Success'),
        text: t('Part approved successfully')
      });
      fetchParts(pagination.currentPage);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    }
  };

  const formatCriteria = (criteriaJson, lang = 'en') => {
    try {
      return criteriaJson.map(item => {
        const criteriaName = lang === 'en' ? item.criteria_en : item.criteria_ar;
        const value = lang === 'en' ? item.value_en : item.value_ar;
        return `${criteriaName}: ${value}`;
      }).join(', ');
    } catch (e) {
      return '-';
    }
  };

  const handleEditCriteria = (part) => {
    setSelectedPart(part);
    // Group criteria by criteria_id for WVA numbers
    const groupedCriteria = part.ARTICLE_CRITERIA.reduce((acc, curr) => {
      if (acc[curr.criteria_id]) {
        if (curr.criteria_id === 1182) { // WVA Number
          acc[curr.criteria_id].value_en += `, ${curr.value_en}`;
          acc[curr.criteria_id].value_ar += `, ${curr.value_ar}`;
        }
      } else {
        acc[curr.criteria_id] = { ...curr };
      }
      return acc;
    }, {});
    
    setEditableCriteria(Object.values(groupedCriteria));
    setShowModal(true);
  };

  const handleSaveCriteria = async () => {
    try {
      // Expand WVA numbers back into multiple entries
      const expandedCriteria = editableCriteria.flatMap(criteria => {
        if (criteria.criteria_id === 1182) { // WVA Number
          const values_en = criteria.value_en.split(',').map(v => v.trim());
          const values_ar = criteria.value_ar.split(',').map(v => v.trim());
          return values_en.map((value_en, idx) => ({
            criteria_id: criteria.criteria_id,
            criteria_en: criteria.criteria_en,
            criteria_ar: criteria.criteria_ar,
            value_en: value_en,
            value_ar: values_ar[idx] || value_en
          }));
        }
        return [criteria];
      });

      await axios.post(`${gdcURL}Parts/UpdateNewPartCriteria`, {
        criteria: expandedCriteria,
        PART_BUFFER_ZONE_ID: selectedPart.PART_BUFFER_ZONE_ID
      });

      Swal.fire({
        icon: 'success',
        title: t('Success'),
        text: t('Criteria updated successfully')
      });
      setShowModal(false);
      fetchParts(pagination.currentPage);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...editableCriteria];
    updatedCriteria[index][field] = value;
    setEditableCriteria(updatedCriteria);
  };

  const handleAddCriteria = () => {
    setEditableCriteria([
      ...editableCriteria,
      {
        criteria_id: Date.now(), // Temporary ID for new criteria
        criteria_en: '',
        criteria_ar: '',
        value_en: '',
        value_ar: '',
        isNew: true // Flag to identify new criteria
      }
    ]);
  };

  const handleDeleteCriteria = (index) => {
    Swal.fire({
      title: t('Are you sure?'),
      text: t('This criteria will be deleted'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it!'),
      cancelButtonText: t('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCriteria = editableCriteria.filter((_, i) => i !== index);
        setEditableCriteria(updatedCriteria);
      }
    });
  };

  // Add this useEffect for modal body class
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showModal]);

  // New functions for picture handling
  const handleShowPictures = async (part) => {
    // reset states
    setPictures([]);
    setUploadingPicture(false);
    setUploadProgress(0);
    setDragActive(false);
    setSelectedPartForPictures(part);
    setShowPictureModal(true);
    try {
      const response = await axios.get(`${gdcURL}Parts/GetNewPartPictures`, {
        params: { ART_SUP_ID: part.ART_SUP_ID, ART_ID: part.ART_ID }
      });
      if (response.data.success) {
        setPictures(response.data.data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    }
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('PART_BUFFER_ZONE_ID', selectedPartForPictures.PART_BUFFER_ZONE_ID);

    try {
      setUploadingPicture(true);
      const response = await axios.post(`${gdcURL}Parts/UploadNewPartPicture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setPictures(prev => [...prev, response.data.data]);
        Swal.fire({
          icon: 'success',
          title: t('Success'),
          text: t('Picture uploaded successfully')
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    } finally {
      setUploadingPicture(false);
    }
  };

  const UpdateNewPartStatus = async (partId, status) => {
   
    try {
      const response = await axios.post(`${gdcURL}Parts/UpdateNewPartStatus`,
        { PART_BUFFER_ZONE_ID: partId, ENTRY_STATUS:status }
      );
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: t('Success'),
          text: t('Part status updated successfully')
        });
        fetchParts(pagination.currentPage);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: response.data.message || t('Failed to update part status')
        });
      }
    } catch (error) {
      Swal.fire({  
        icon: 'error',
        title: t('Error'),
        text: error.message || t('Failed to update part status')
      });
    }
  };

  const handleRemovePicture = async (pictureFileName, ART_MEDIA_SUP_ID) => {
    try {
      await Swal.fire({
        title: t('Are you sure?'),
        text: t('This picture will be permanently deleted'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('Yes, delete it!')
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.post(`${gdcURL}Parts/RemoveNewPartPicture`, {
            ART_MEDIA_FILE_NAME: pictureFileName,
            ART_MEDIA_SUP_ID: ART_MEDIA_SUP_ID
          });
          if (response.data.success) {
            setPictures(prev => prev.filter(pic => pic.ART_MEDIA_FILE_NAME !== pictureFileName));
            Swal.fire(t('Deleted!'), t('Picture has been deleted.'), 'success');
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    }
  };

  // Update the picture handling states
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: t('Invalid file type'),
          text: t('Please upload only JPG, PNG or WebP images')
        });
        continue;
      }
      
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: t('File too large'),
          text: t('Maximum file size is 5MB')
        });
        continue;
      }
      
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ART_SUP_ID', selectedPartForPictures.ART_SUP_ID);
    formData.append('ART_ID', selectedPartForPictures.ART_ID);

    try {
      setUploadingPicture(true);
      const response = await axios.post( `${gdcURL}Parts/UploadNewPartPicture`, formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            setUploadProgress(progress);
          }
        }
      );

      if (response.data.success) {
        // reset state after successful upload
        setDragActive(false);
        setUploadProgress(0);
        setPictures(prev => [...prev, response.data.data]);
        setUploadProgress(0);
        Swal.fire({
          icon: 'success',
          title: t('Success'),
          text: t('Picture uploaded successfully')
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message
      });
    } finally {
      setUploadingPicture(false);
      setUploadProgress(0);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      0: { label: 'Pending', class: 'bg-secondary text-white' },
      1: { label: 'Requested', class: 'bg-warning text-dark' },
      2: { label: 'Approved', class: 'bg-success text-white' },
      3: { label: 'Asked For Revision', class: 'bg-info text-white' },
      4: { label: 'Rejected', class: 'bg-danger text-white' }
    };

    const defaultStatus = { label: 'Unknown', class: 'bg-dark text-white' };
    const statusInfo = statusMap[parseInt(status)] || defaultStatus;

    return (
      <span 
        className={`badge rounded-pill ${statusInfo.class}`} 
        style={{ 
          fontSize: '0.75rem',
          padding: '0.35em 0.6em'
        }}
      >
        {t(statusInfo.label)}
      </span>
    );
  };

  const handleRemovePart = async (part) => {
    try {
      const result = await Swal.fire({
        title: t('Are you sure?'),
        text: t('This part will be permanently deleted'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t('Yes, delete it!'),
        cancelButtonText: t('Cancel')
      });

      if (result.isConfirmed) {
        const response = await axios.post(`${gdcURL}Parts/RemoveNewPart`, {
          PART_BUFFER_ZONE_ID: part.PART_BUFFER_ZONE_ID
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: t('Deleted!'),
            text: t('Part has been deleted successfully')
          });
          fetchParts(pagination.currentPage);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message || t('Failed to delete part')
      });
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">{t('New Parts Buffer Zone')}</h4>

                    {loading ? (
                      <div className="text-center">
                        <i className="fa fa-spinner fa-spin fa-3x"></i>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>{t('Part Number')}</th>
                                <th>{t('Brand')}</th>
                                <th>{t('Departments')}</th>
                                <th>{t('Specifications')}</th>
                                <th>{t('Status')}</th>
                                <th>{t('Add Pictures')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parts.map((part) => (
                                <tr key={part.ART_ID}>
                                  <td>{part.ART_ARTICLE_NR}</td>
                                  <td>{part.ART_SUP_BRAND}</td>
                                  <td>{part.PRODUCT_GROUP_EN}</td>
                                  
                                  <td>
                                    <div style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                                      {formatCriteria(part.ARTICLE_CRITERIA)}
                                      <button 
                                        className="btn btn-info btn-sm ml-2 mt-2" style={{ float: 'right' }}
                                        onClick={() => handleEditCriteria(part)}
                                      >
                                        <i className="ri-edit-box-line"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      {getStatusLabel(part.ENTRY_STATUS)}
                                      
                                    </div>
                                  </td>
                                  <td>
                                    <div className="btn-group">
                                      <button 
                                        className="btn btn-primary btn-sm ml-2"
                                        onClick={() => handleShowPictures(part)}
                                      >
                                        <i className="ri-image-line"></i> {t('Pictures')}
                                      </button>
                                      <button 
                                        className="btn btn-info btn-sm ml-2"
                                        onClick={() => UpdateNewPartStatus(part.PART_BUFFER_ZONE_ID, 1)}
                                        disabled={parseInt(part.ENTRY_STATUS) === 1}
                                      >
                                        <i className="ri-check-line"></i> {t('Request For Verify')}
                                      </button>
                                      <button 
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() => handleRemovePart(part)}
                                      >
                                        <i className="ri-delete-bin-line"></i> {t('Delete')}
                                      </button>
                                    </div>
                                   
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {pagination.totalItems > 0 && (
                          <div className="float-right">
                            <Pagination
                              activePage={pagination.currentPage}
                              itemsCountPerPage={pagination.itemsPerPage}
                              totalItemsCount={pagination.totalItems}
                              pageRangeDisplayed={5}
                              onChange={handlePageChange}
                              itemClass="page-item"
                              linkClass="page-link"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`modal fade ${showModal ? 'show d-block' : ''}`} 
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('Edit Specifications')}</h5>
              <button 
                type="button" 
                className="close" 
                onClick={() => setShowModal(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{width: '25%'}}>{t('Criteria (EN)')}</th>
                      <th style={{width: '25%'}}>{t('Value (EN)')}</th>
                      <th style={{width: '25%'}}>{t('Criteria (AR)')}</th>
                      <th style={{width: '25%'}}>{t('Value (AR)')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableCriteria.map((criteria, index) => (
                      <tr key={criteria.criteria_id}>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={criteria.criteria_en}
                            onChange={(e) => handleCriteriaChange(index, 'criteria_en', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={criteria.value_en}
                            onChange={(e) => handleCriteriaChange(index, 'value_en', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={criteria.criteria_ar}
                            onChange={(e) => handleCriteriaChange(index, 'criteria_ar', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={criteria.value_ar}
                            onChange={(e) => handleCriteriaChange(index, 'value_ar', e.target.value)}
                          />
                        </td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteCriteria(index)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleAddCriteria}
              >
                <i className="fas fa-plus"></i> {t('Add Criteria')}
              </button>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                {t('Close')}
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleSaveCriteria}
              >
                {t('Save Changes')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Separate backdrop div */}
      {showModal && (
        <div 
          className="modal-backdrop fade show"
          onClick={() => setShowModal(false)}
        ></div>
      )}

      {/* Modal for pictures */}
      <div 
        className={`modal fade ${showPictureModal ? 'show d-block' : ''}`} 
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('Part Pictures')}</h5>
              <button 
                type="button" 
                className="close" 
                onClick={() => setShowPictureModal(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
                  {/* Upload Area */}
              <div 
                className={`upload-area mb-4 ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: dragActive ? '#f8f9fa' : 'white',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  style={{ display: 'none' }}
                />
                <div onClick={() => document.getElementById('fileInput').click()}>
                  <i className="ri-upload-cloud-2-line" style={{ fontSize: '48px', color: '#6c757d' }}></i>
                  <p>{t('Drag and drop images here or click to select')}</p>
                  <p className="text-muted">{t('Maximum file size: 5MB')}</p>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadingPicture && (
                <div className="mb-4">
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar"
                      style={{ width: `${uploadProgress}%` }}
                      aria-valuenow={uploadProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                </div>
              )}

              {/* Pictures Grid */}
              <div className="row">
                {pictures.map(picture => (
                  <div className="col-md-4 col-sm-6 mb-4" key={picture.ART_MEDIA_FILE_NAME}>
                    <div className="card h-100">
                      <div className="card-img-wrapper" style={{ position: 'relative', paddingTop: '75%' }}>
                        <img 
                          src={`https://dcapi.carz7.com/images/${picture.ART_MEDIA_SUP_ID}/${picture.ART_MEDIA_FILE_NAME}`} 
                          className="card-img-top" 
                          alt={t('Part Picture')}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(`https://dcapi.carz7.com/images/${picture.ART_MEDIA_SUP_ID}/${picture.ART_MEDIA_FILE_NAME}`, '_blank')}
                        />
                      </div>
                      <div className="card-body p-2">
                        <div className="btn-group w-100">
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemovePicture(picture.ART_MEDIA_FILE_NAME, picture.ART_MEDIA_SUP_ID)}
                          >
                            <i className="ri-delete-bin-line"></i> {t('Delete')}
                          </button>
                          <button 
                            className="btn btn-sm btn-info"
                            onClick={() => window.open(`https://dcapi.carz7.com/images/${picture.ART_MEDIA_SUP_ID}/${picture.ART_MEDIA_FILE_NAME}`, '_blank')}
                          >
                            <i className="ri-zoom-in-line"></i> {t('View')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pictures.length === 0 && !uploadingPicture && (
                <div className="text-center text-muted my-5">
                  <i className="ri-image-line" style={{ fontSize: '48px' }}></i>
                  <p>{t('No pictures available')}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowPictureModal(false)}
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Separate backdrop div for pictures modal */}
      {showPictureModal && (
        <div 
          className="modal-backdrop fade show"
          onClick={() => setShowPictureModal(false)}
        ></div>
      )}
    </>
  );
};

export default NewPartsBufferZone;
