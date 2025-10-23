// UploadNewData component for uploading new data files in excel format columns will be new part number, existing part number to UploadNewPartNumber
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import { ConfigContext } from '../../Context/ConfigContext';
import { useContext } from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
const UploadNewData = () => {
  const { gdcURL, apiURL, dmURL } = useContext(ConfigContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [processedResults, setProcessedResults] = useState({
    processed: 0,
    notFoundParts: []
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      // Remove header row and filter empty rows
      const filteredData = data.slice(1).filter(row => row.length > 0);
      setPreviewData(filteredData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: t('Please select a file first')
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${gdcURL}Parts/UploadNewPartNumber`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setProcessedResults({
          processed: response.data.processed,
          notFoundParts: response.data.notFoundParts || []
        });
        setFile(null); // Only reset file selection
        Swal.fire({
          icon: 'success',
          title: t('Success'),
          text: t('Data uploaded successfully')
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: error.message || t('Failed to upload data')
      });
    } finally {
      setLoading(false);
    }
  };
const tableRef = useRef(null);
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
        <div className="row">
            <div className="col-12">
            <div className="card">
                <div className="card-body">
                <h4 className="card-title mb-4">{t('Upload New Part Numbers')}</h4>
                <div style={{ textAlign: 'right', position: 'absolute', right: '50px', top: '20px' }}>
                  <h4><a  href='newPartSample.xlsx'>Download Sample File</a></h4>
                </div>

                <div className="mb-4">
                    <input
                    type="file"
                    className="form-control"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={loading}
                    />
                    <small className="text-muted">
                    {t('Accepted formats')}: .xlsx, .xls
                    </small>
                </div>

                {previewData.length > 0 && (
                  <div className="table-responsive mb-4">
                    <table className="table table-bordered" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>{t('NEW PART NUMBER')}</th>
                          <th>{t('NEW SUP ID')}</th>
                          <th>{t('NEW SUP NAME')}</th>
                          <th>{t('EXISTING PART NUMBER')}</th>
                          <th>{t('EXISTING SUP ID')}</th>
                          <th>{t('Status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>
                              {processedResults.notFoundParts?.includes(String(row[3] || '').replace(/[^a-zA-Z0-9]/g, '')) ? (
                                <span className="badge bg-danger">
                                  {t('Not Found')}
                                </span>
                              ) : processedResults.processed > 0 ? (
                                <span className="badge bg-success">
                                  {t('Found')}
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={5} className="text-end">
                            <strong>{t('Total Rows')}:</strong> {previewData.length}
                          </td>
                          <td>
                            <strong>{t('Total Not Found')}:</strong> {processedResults.notFoundParts?.length || 0}
                          </td>
                        </tr>
                        <tr><td colSpan={6}>
                          {processedResults.notFoundParts?.length > 0 && (
                          <div>
                            {t('Not found parts')}: {processedResults.notFoundParts.join(', ')}
                          </div>
                        )}
                          </td></tr>
                      </tfoot>
                    </table>
                    {/* {previewData.length > 5 && !processedResults.processed && (
                      <div className="text-muted">
                        {t('Showing first 5 rows of')} {previewData.length} {t('rows')}
                      </div>
                    )}
                    {processedResults.processed > 0 && (
                      <div className="alert alert-info">
                        {t('Processed')}: {processedResults.processed} {t('rows')}
                        {processedResults.notFoundParts?.length > 0 && (
                          <div>
                            {t('Not found parts')}: {processedResults.notFoundParts.join(', ')}
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                )}

                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !file} >
                    {loading ? ( <><i className="fa fa-spinner fa-spin"></i> {t('Uploading...')}</> ) : ( t('Upload Data') )}
                </button>
                <DownloadTableExcel
                    filename="users table"
                    sheet="users"
                    currentTableRef={tableRef.current}
                >

                   <button className='btn btn-success'><i className='fa fa-file-excel-o'></i> Export excel </button>

                </DownloadTableExcel>
                </div>
            </div>
            </div>
        </div>
        </div>
                    
    </div>
</div>
  );
};

export default UploadNewData;
