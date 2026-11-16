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
    setUploadProgressText('Extracting text page-by-page with PyMuPDF and indexing vectors...');

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
    <div className="d-flex flex-column gap-4" style={{ minWidth: 0, width: '100%' }}>
      {/* Notifications */}
      {errorMsg && (
        <div className="alert alert-danger border-danger-subtle d-flex align-items-center gap-2 rounded-3 shadow-sm py-2 px-3 m-0">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <span className="flex-grow-1 fw-medium small">{errorMsg}</span>
          <button className="btn-close btn-sm" onClick={() => setErrorMsg('')}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success border-success-subtle d-flex align-items-center gap-2 rounded-3 shadow-sm py-2 px-3 m-0">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span className="flex-grow-1 fw-medium small">{successMsg}</span>
          <button className="btn-close btn-sm" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Main Upload Card */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-cloud-arrow-up-fill text-primary"></i>
            Upload PDF Document
          </h3>
          <button
            className="btn btn-sm btn-outline-primary rounded-3 d-flex align-items-center gap-2 fw-semibold px-3"
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
            className={`upload-dropzone-modern ${dragActive ? 'drag-active' : ''}`}
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

            <div className="upload-icon-circle">
              <i className="bi bi-file-earmark-arrow-up"></i>
            </div>
            <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.2rem' }}>
              {selectedFile ? selectedFile.name : 'Drag & drop your PDF here, or browse files'}
            </h4>
            <p className="text-muted small mb-3">
              {selectedFile
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready for automated extraction`
                : 'Supports multi-page digital PDF files up to 25 MB'}
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap small text-muted">
              <span><i className="bi bi-shield-check text-success me-1"></i> Client-Side Validation</span>
              <span><i className="bi bi-cpu text-primary me-1"></i> PyMuPDF Text Extraction</span>
              <span><i className="bi bi-database-check text-info me-1"></i> SQLite Persistence</span>
            </div>
          </div>

          {/* Selected File Preview Strip */}
          {selectedFile && (
            <div className="file-preview-strip">
              <div className="d-flex align-items-center gap-3 min-w-0">
                <i className="bi bi-file-earmark-pdf-fill text-danger fs-2 flex-shrink-0"></i>
                <div className="min-w-0">
                  <div className="fw-bold text-dark text-truncate">{selectedFile.name}</div>
                  <div className="small text-muted">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; PDF Document
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-3 px-3"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm rounded-3 px-4 fw-bold d-flex align-items-center gap-2 shadow-sm"
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
            <div className="mt-3 text-center text-primary p-2 bg-light rounded-3 border">
              <span className="spinner-grow spinner-grow-sm text-primary me-2" role="status"></span>
              <span className="fw-semibold small">{uploadProgressText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Indexed Document Library Preview */}
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
            <div className="table-responsive-clean">
              <table className="custom-table-clean">
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
                        <div className="doc-name-cell">
                          <i className="bi bi-file-earmark-pdf-fill text-danger fs-5 flex-shrink-0"></i>
                          <span className="doc-name-text" title={doc.original_name}>
                            {doc.original_name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold">
                          {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                        </span>
                      </td>
                      <td className="text-muted small">{doc.formatted_size}</td>
                      <td className="text-muted small">{(doc.total_words || 0).toLocaleString()}</td>
                      <td className="text-muted small">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary rounded-start-2 px-2"
                            onClick={() => onInspectDoc(doc.id)}
                            title="Inspect page text"
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          <button
                            className="btn btn-outline-danger rounded-end-2 px-2"
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
            <div className="text-center py-5 text-muted">
              <i className="bi bi-folder-x fs-2 d-block mb-2"></i>
              <p className="mb-0 small">No documents in the repository yet. Upload a PDF above to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
