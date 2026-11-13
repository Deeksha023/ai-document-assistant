import React, { useState, useEffect } from 'react';

export default function DocumentModal({ doc, initialPage = 1, onClose }) {
  const [selectedPageNum, setSelectedPageNum] = useState(initialPage);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedPageNum(initialPage);
  }, [initialPage, doc]);

  if (!doc) return null;

  const pages = doc.pages || [];
  const currentPage = pages.find((p) => p.page_number === selectedPageNum) || pages[0] || {};

  const handleCopyText = () => {
    if (currentPage.page_text) {
      navigator.clipboard.writeText(currentPage.page_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-custom">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-primary-subtle text-primary rounded-3 fs-4">
              <i className="bi bi-file-earmark-pdf-fill"></i>
            </div>
            <div>
              <h5 className="m-0 fw-bold">{doc.original_name}</h5>
              <div className="text-muted small d-flex gap-3 mt-1">
                <span>
                  <i className="bi bi-layers me-1"></i>
                  {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                </span>
                <span>
                  <i className="bi bi-hdd me-1"></i>
                  {doc.formatted_size || `${(doc.file_size / 1024).toFixed(1)} KB`}
                </span>
                <span>
                  <i className="bi bi-calendar3 me-1"></i>
                  {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-custom">
          {/* Page Selector Tabs */}
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold small text-muted">Jump to Page:</span>
              <div className="btn-group btn-group-sm">
                {pages.map((p) => (
                  <button
                    key={p.page_number}
                    type="button"
                    className={`btn ${
                      selectedPageNum === p.page_number ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedPageNum(p.page_number)}
                  >
                    Page {p.page_number}
                  </button>
                ))}
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="small text-muted">
                {currentPage.word_count || 0} words &bull; {currentPage.char_count || 0} characters
              </span>
              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleCopyText}
              >
                <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`}></i>
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* Extracted Page Text Box */}
          <div
            className="bg-light p-3 rounded-3 border font-monospace"
            style={{
              fontSize: '0.88rem',
              whiteSpace: 'pre-wrap',
              minHeight: '260px',
              maxHeight: '380px',
              overflowY: 'auto',
              lineHeight: '1.7',
              color: '#1e293b',
            }}
          >
            {currentPage.page_text || 'No text extracted on this page.'}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="bi bi-shield-check text-success me-1"></i> Extracted via PyMuPDF (fitz)
          </small>
          <button className="btn btn-secondary btn-sm px-4" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

