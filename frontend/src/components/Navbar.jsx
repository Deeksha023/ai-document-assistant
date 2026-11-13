import React from 'react';

const PAGE_METADATA = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'Overview of indexed PDF documents, processing metrics, and query analytics',
  },
  upload: {
    title: 'Upload Documents',
    subtitle: 'Upload PDF files for automated text extraction, page parsing, and TF-IDF indexing',
  },
  documents: {
    title: 'My Documents Repository',
    subtitle: 'Manage uploaded PDFs, inspect page breakdowns, and delete documents',
  },
  'ask-ai': {
    title: 'Ask AI & Document QA',
    subtitle: 'Ask questions across document contents with exact page references and synthesized answers',
  },
  search: {
    title: 'Deep Document Search',
    subtitle: 'Search keywords and phrases using Scikit-Learn TF-IDF cosine similarity',
  },
  about: {
    title: 'About AI Document Assistant',
    subtitle: 'Technical specifications, architecture details, and THASMAI INFOTECH assignment scope',
  },
};

export default function Navbar({ activePage, setActivePage, isOnline, onRefresh, toggleMobile }) {
  const meta = PAGE_METADATA[activePage] || {
    title: 'AI Document Assistant',
    subtitle: 'THASMAI INFOTECH Internship Technical Talent Assessment (P07)',
  };

  return (
    <header className="app-navbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-secondary d-lg-none"
          onClick={toggleMobile}
          aria-label="Toggle Navigation"
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        <div className="page-title-wrap">
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Backend health status badge */}
        <div className={`status-badge ${isOnline ? 'status-online' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
          <span className={isOnline ? 'status-pulse' : 'badge bg-danger p-1 rounded-circle'}></span>
          <span>{isOnline ? 'Flask Backend Connected' : 'Backend Disconnected'}</span>
        </div>

        {/* Refresh button */}
        <button
          className="btn btn-outline-light text-secondary border rounded-3 btn-sm d-flex align-items-center gap-1"
          onClick={onRefresh}
          title="Refresh Data"
        >
          <i className="bi bi-arrow-clockwise"></i>
          <span className="d-none d-md-inline">Sync</span>
        </button>

        {/* Quick Upload Action */}
        {activePage !== 'upload' && (
          <button
            className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2 fw-semibold px-3"
            onClick={() => setActivePage('upload')}
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline">Upload PDF</span>
          </button>
        )}
      </div>
    </header>
  );
}

