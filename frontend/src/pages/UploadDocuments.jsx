import React, { useState, useRef } from 'react';
import api from '../services/api';

export default function UploadDocuments({
  onUploadSuccess,
  onImportSamples,
  importingSamples,
  documents,
  onDeleteDoc,
  onInspectDoc,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file format. Please upload a standard PDF (.pdf) file.');
      return;
    }

    const maxSize = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxSize) {
      setErrorMsg('File size exceeds the 25 MB upload limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a PDF document to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadProgressText('Extracting text with PyMuPDF and indexing pages...');

    try {
      const response = await api.uploadDocument(selectedFile);
      if (response.success) {
        setSuccessMsg(
          `Successfully processed "${response.document.original_name}"! ${response.document.total_pages} page(s) extracted.`
        );
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setErrorMsg(response.error || 'Failed to upload document.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during document upload.');
    } finally {
      setUploading(false);
      setUploadProgressText('');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Notifications */}
      {errorMsg && (
        <div className="alert alert-danger border-danger-subtle d-flex align-items-center gap-2 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <span className="flex-grow-1">{errorMsg}</span>
          <button className="btn-close" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success border-success-subtle d-flex align-items-center gap-2 rounded-3 shadow-sm">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span className="flex-grow-1">{successMsg}</span>
          <button className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Main Upload Card */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-cloud-arrow-up-fill text-primary"></i>
            Upload New PDF Document
          </h3>
          <button
            className="btn btn-sm btn-outline-primary rounded-3 d-flex align-items-center gap-2"
            onClick={onImportSamples}
            disabled={importingSamples}
          >
            <i className="bi bi-magic"></i>
            {importingSamples ? 'Loading...' : 'Import Sample PDFs'}
          </button>
        </div>

        <div className="card-body-clean">
          {/* Drag & Drop Zone */}
          <div
            className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="dropzone-icon">
              <i className="bi bi-file-earmark-arrow-up"></i>
            </div>
            <div className="dropzone-title">
              {selectedFile ? selectedFile.name : 'Choose a PDF file or drag & drop it here'}
            </div>
            <div className="dropzone-sub">
              {selectedFile
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready for extraction`
                : 'Click to browse your local computer for PDF files'}
            </div>

            <div className="dropzone-specs">
              <span>
                <i className="bi bi-check2-circle text-success"></i> PDF files up to 25 MB
              </span>
              <span>
                <i className="bi bi-check2-circle text-success"></i> Automated page-by-page extraction
              </span>
              <span>
                <i className="bi bi-check2-circle text-success"></i> Instant TF-IDF indexing
              </span>
            </div>
          </div>

          {/* Action Row */}
          {selectedFile && (
            <div className="mt-4 p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>
                <div>
                  <div className="fw-bold">{selectedFile.name}</div>
                  <small className="text-muted">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Type: PDF
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-3"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-3 px-4 fw-bold d-flex align-items-center gap-2"
                  onClick={handleUploadSubmit}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload"></i>
                      <span>Start Extraction</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="mt-3 text-center text-primary">
              <div className="spinner-grow spinner-grow-sm text-primary me-2" role="status"></div>
              <small className="fw-semibold">{uploadProgressText}</small>
            </div>
          )}
        </div>
      </div>

      {/* Document Library Preview */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-collection text-secondary"></i>
            Indexed Documents ({documents.length})
          </h3>
          <span className="text-muted small">Managed in SQLite database</span>
        </div>

        <div className="card-body-clean p-0">
          {documents && documents.length > 0 ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Pages</th>
                    <th>Size</th>
                    <th>Words Extracted</th>
                    <th>Uploaded Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                          <span className="fw-semibold">{doc.original_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                        </span>
                      </td>
                      <td>{doc.formatted_size}</td>
                      <td>{(doc.total_words || 0).toLocaleString()}</td>
                      <td>
                        <small className="text-muted">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </small>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => onInspectDoc(doc.id)}
                            title="Inspect text"
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => onDeleteDoc(doc.id, doc.original_name)}
                            title="Delete document"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <p className="mb-0">No documents in the repository yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

