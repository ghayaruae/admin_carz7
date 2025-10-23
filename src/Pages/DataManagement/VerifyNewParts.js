import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';
import Pagination from 'react-js-pagination';

const VerifyNewParts = () => {
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

  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedPartForPictures, setSelectedPartForPictures] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // NEW: Row-specific loading state for Approve & status update
  const [loadingPartId, setLoadingPartId] = useState(null);

  const fetchParts = async (page = 1, itemsPerPage = pagination.itemsPerPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`${gdcURL}Parts/GetNewPartNumbers`, {
        params: { page, limit: itemsPerPage }
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
      Swal.fire({ icon: 'error', title: t('Error'), text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParts(); }, []);

  const handlePageChange = (pageNumber) => { fetchParts(pageNumber); };

  const formatCriteria = (criteriaJson, lang = 'en') => {
    try {
      return criteriaJson.map(item => {
        const criteriaName = lang === 'en' ? item.criteria_en : item.criteria_ar;
        const value = lang === 'en' ? item.value_en : item.value_ar;
        return `${criteriaName}: ${value}`;
      }).join(', ');
    } catch (e) { return '-'; }
  };

  const handleEditCriteria = (part) => {
    setSelectedPart(part);
    const groupedCriteria = part.ARTICLE_CRITERIA.reduce((acc, curr) => {
      if (acc[curr.criteria_id]) {
        if (curr.criteria_id === 1182) {
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
      const expandedCriteria = editableCriteria.flatMap(criteria => {
        if (criteria.criteria_id === 1182) {
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

      Swal.fire({ icon: 'success', title: t('Success'), text: t('Criteria updated successfully') });
      setShowModal(false);
      fetchParts(pagination.currentPage);
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('Error'), text: error.message });
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
      { criteria_id: Date.now(), criteria_en: '', criteria_ar: '', value_en: '', value_ar: '', isNew: true }
    ]);
  };

  const handleDeleteCriteria = (index) => {
    Swal.fire({
      title: t('Are you sure?'),
      text: t('This criteria will be deleted'),
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it!'), cancelButtonText: t('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        setEditableCriteria(editableCriteria.filter((_, i) => i !== index));
      }
    });
  };

  // approve/reject/revision unified loading logic
  const UpdateNewPartStatus = async (partId, status) => {
    setLoadingPartId(partId); // show loading only for this row
    try {
      const response = await axios.post(`${gdcURL}Parts/UpdateNewPartStatus`, {
        PART_BUFFER_ZONE_ID: partId,
        ENTRY_STATUS: status
      });

      if (response.data.success) {
        Swal.fire({ icon: 'success', title: t('Success'), text: t('Part status updated successfully') });
        await fetchParts(pagination.currentPage);
      } else {
        Swal.fire({ icon: 'error', title: t('Error'), text: response.data.message || t('Failed to update part status') });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('Error'), text: error.message || t('Failed to update part status') });
    } finally {
      setLoadingPartId(null);
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
    const sInfo = statusMap[parseInt(status)] || { label: 'Unknown', class: 'bg-dark text-white' };
    return (
      <span className={`badge rounded-pill ${sInfo.class}`} style={{ fontSize: '0.75rem', padding: '0.35em 0.6em' }}>
        {t(sInfo.label)}
      </span>
    );
  };

  const handleRemovePart = async (part) => {
    try {
      const result = await Swal.fire({
        title: t('Are you sure?'),
        text: t('This part will be permanently deleted'),
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
        confirmButtonText: t('Yes, delete it!'), cancelButtonText: t('Cancel')
      });

      if (result.isConfirmed) {
        const response = await axios.post(`${gdcURL}Parts/RemoveNewPart`, { PART_BUFFER_ZONE_ID: part.PART_BUFFER_ZONE_ID });
        if (response.data.success) {
          Swal.fire({ icon: 'success', title: t('Deleted!'), text: t('Part has been deleted successfully') });
          fetchParts(pagination.currentPage);
        }
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('Error'), text: error.message || t('Failed to delete part') });
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setPagination((prev) => ({ ...prev, itemsPerPage: newItemsPerPage }));
    fetchParts(1, newItemsPerPage);
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{t('Verify New Part Numbers')}</h4>
                {loading ? (
                  <div className="text-center"><i className="fa fa-spinner fa-spin fa-3x"></i></div>
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
                            <th>{t('Actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parts.map(part => (
                            <tr key={part.ART_ID}>
                              <td>{part.ART_ARTICLE_NR}</td>
                              <td>{part.ART_SUP_BRAND}</td>
                              <td>{part.PRODUCT_GROUP_EN}</td>
                              <td>
                                <div style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                                  {formatCriteria(part.ARTICLE_CRITERIA)}
                                  <button className="btn btn-info btn-sm ml-2 mt-2" style={{ float: 'right' }}
                                    onClick={() => handleEditCriteria(part)}>
                                    <i className="ri-edit-box-line"></i>
                                  </button>
                                </div>
                              </td>
                              <td>{getStatusLabel(part.ENTRY_STATUS)}</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    {t('Actions')} <i className="mdi mdi-chevron-down"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button className="dropdown-item" onClick={() => UpdateNewPartStatus(part.PART_BUFFER_ZONE_ID, 3)}
                                        disabled={part.ENTRY_STATUS === 2}>
                                        <i className="ri-error-warning-line"></i> {t('Ask For Revision')}
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => UpdateNewPartStatus(part.PART_BUFFER_ZONE_ID, 4)}
                                        disabled={![1, 3].includes(parseInt(part.ENTRY_STATUS))}>
                                        <i className="ri-close-circle-line"></i> {t('Reject')}
                                      </button>
                                    </li>
                                    <li>
                                      <button 
                                        className="dropdown-item d-flex align-items-center"
                                        onClick={() => UpdateNewPartStatus(part.PART_BUFFER_ZONE_ID, 2)}
                                        disabled={parseInt(part.ENTRY_STATUS) === 2 || loadingPartId === part.PART_BUFFER_ZONE_ID}
                                      >
                                        {loadingPartId === part.PART_BUFFER_ZONE_ID ? (
                                          <>
                                            <i className="fa fa-spinner fa-spin me-2"></i> {t('Approving...')}
                                          </>
                                        ) : (
                                          <>
                                            <i className="ri-checkbox-circle-line me-2"></i> {t('Approve')}
                                          </>
                                        )}
                                      </button>
                                    </li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li>
                                      <button className="dropdown-item text-danger" onClick={() => handleRemovePart(part)}>
                                        <i className="ri-delete-bin-line"></i> {t('Delete')}
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row align-items-center">
                      {pagination.totalItems > 0 && (
                        <div className="col-md-4">
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
                      {pagination.totalItems > 0 && (
                        <div className="col-md-4">
                          <strong>{t('Total Items')}:</strong> {pagination.totalItems}
                        </div>
                      )}
                      <div className="col-md-4">
                        <strong>{t('Show')}:</strong>
                        <select className="form-select form-select-sm"
                          value={pagination.itemsPerPage}
                          onChange={handleItemsPerPageChange}>
                          {[5,10,25,50,100,200,400].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyNewParts;
