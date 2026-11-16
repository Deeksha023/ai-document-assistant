import React, { useState } from 'react';

export default function MyDocuments({
  documents,
  onInspectDoc,
  onDeleteDoc,
  onNavigate,
  onImportSamples,
  importingSamples,
}) {
  const [filterText, setFilterText] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.original_name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="d-flex flex-column gap-4" style={{ minWidth: 0, width: '100%' }}>
      {/* Search & Actions Bar */}
      <div className="modern-card p-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '480px' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Filter documents by title..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {filterText && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setFilterText('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            <span className="badge bg-light text-secondary border px-2 py-1 flex-shrink-0 small">
              {filteredDocs.length} of {documents.length}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-2 px-3 fw-semibold"
              onClick={onImportSamples}
              disabled={importingSamples}
            >
              <i className="bi bi-magic"></i>
              {importingSamples ? 'Importing...' : 'Load Sample Documents'}
            </button>
            <button
              className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2 fw-bold px-3 shadow-sm"
              onClick={() => onNavigate('upload')}
            >
              <i className="bi bi-cloud-arrow-up-fill"></i>
              Upload New PDF
            </button>
          </div>
        </div>
      </div>

      {/* Document Grid / Cards */}
      {filteredDocs.length > 0 ? (
        <div className="row g-3">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="col-12 col-md-6 col-xl-4">
              <div className="modern-card h-100 d-flex flex-column">
                <div className="card-body-clean flex-grow-1">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="p-2 bg-danger-subtle text-danger rounded-3 fs-3 flex-shrink-0">
                      <i className="bi bi-file-earmark-pdf-fill"></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h5
                        className="fw-bold mb-1 text-truncate text-dark"
                        title={doc.original_name}
                        style={{ fontSize: '0.98rem' }}
                      >
                        {doc.original_name}
                      </h5>
                      <span className="badge bg-light text-secondary border small">
                        Doc ID: #{doc.id}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold">
                      <i className="bi bi-layers me-1"></i>
                      {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                      <i className="bi bi-hdd me-1"></i>
                      {doc.formatted_size}
                    </span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      <i className="bi bi-file-text me-1"></i>
                      {(doc.total_words || 0).toLocaleString()} words
                    </span>
                  </div>

                  <div className="small text-muted mb-1">
                    <i className="bi bi-calendar3 me-1"></i>
                    Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-light border-top d-flex align-items-center justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-3 px-3"
                    onClick={() => onInspectDoc(doc.id)}
                  >
                    <i className="bi bi-eye"></i> View Text
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold shadow-sm"
                      onClick={() => onNavigate('ask-ai', doc.id)}
                      title="Ask AI questions grounded in this document"
                    >
                      <i className="bi bi-robot"></i> Ask AI
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-3 px-2"
                      onClick={() => onDeleteDoc(doc.id, doc.original_name)}
                      title="Delete document and pages"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="modern-card text-center py-5 px-3">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-folder-x"></i>
          </div>
          <h5 className="fw-bold text-dark">No Documents Found</h5>
          <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
            {filterText
              ? `No documents matched "${filterText}". Try clearing your search filter.`
              : 'Your repository is currently empty. Upload your first PDF or click below to load pre-built sample documents.'}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {filterText ? (
              <button className="btn btn-outline-secondary btn-sm rounded-3 px-3" onClick={() => setFilterText('')}>
                Clear Filter
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-sm rounded-3 px-3 fw-bold"
                  onClick={() => onNavigate('upload')}
                >
                  <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload PDF
                </button>
                <button
                  className="btn btn-outline-primary btn-sm rounded-3 px-3 fw-semibold"
                  onClick={onImportSamples}
                  disabled={importingSamples}
                >
                  <i className="bi bi-magic me-1"></i> Import Samples
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
