import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ConfigContext } from '../../Context/ConfigContext';
import { useContext } from 'react';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
const PartsInformationUpdate = () => {
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
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [partNumber, setPartNumber] = useState('');
    const [media, setMedia] = useState([]);
    const [ARTID, setARTID] = useState('');

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
        setEditableCriteria([]);
        setMedia([]);
        setARTID(''); // Reset ARTID on new process
        try {
            const response = await axios.get(`${gdcURL}Parts/GetPartCriteria`, {
                params: { SUP_ID: selectedSupplier.value, PART_NUMBER: partNumber }
            });
            if (response.data.success) {
                // remove duplicates based on ART_MEDIA_FILE_NAME
                handleEditCriteria(response.data.data);
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
        console.log("part", part)
        // remove criteria by criteria_id for WVA numbers
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

        setEditableCriteria(Object.values(part.ARTICLE_CRITERIA));
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

            await axios.post(`${gdcURL}Parts/UpdateAllPartCriteria`, {
                criteria: expandedCriteria,
                SUP_ID: selectedSupplier.value,
                PART_NUMBER: partNumber
            });

            Swal.fire({
                icon: 'success',
                title: t('Success'),
                text: t('Criteria updated successfully')
            });
            setShowModal(false);
            // fetchParts(pagination.currentPage);
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




    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className='card-header'>
                                        <h4 className="card-title">{t('Part Criteria Update')}</h4>
                                    </div>
                                    <div className="card-body">
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
                                        {loading ? (
                                            <div className="text-center">
                                                <i className="fa fa-spinner fa-spin fa-3x"></i>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '25%' }}>{t('Criteria (EN)')}</th>
                                                                <th style={{ width: '25%' }}>{t('Value (EN)')}</th>
                                                                <th style={{ width: '25%' }}>{t('Criteria (AR)')}</th>
                                                                <th style={{ width: '25%' }}>{t('Value (AR)')}</th>
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

                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="5" className="text-end">
                                                                    <button className="btn btn-primary btn-sm" onClick={handleSaveCriteria}>
                                                                        <i className="ri-save-line"></i> Save Criteria
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            </tfoot>
                                                    </table>
                                                </div>


                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

};
export default PartsInformationUpdate;
