import React from 'react';
import StatCard from '../components/StatCard';

export default function Dashboard({
  stats,
  recentDocs,
  recentQueries,
  onNavigate,
  onInspectDoc,
  onImportSamples,
  importingSamples,
}) {
  return (
    <div className="d-flex flex-direction-column gap-4">
      {/* Welcome / Quick Action Banner */}
      <div
        className="p-4 rounded-4 text-white position-relative overflow-hidden shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)',
        }}
      >
        <div className="position-relative" style={{ zIndex: 2, maxWidth: '720px' }}>
          <div className="badge bg-white text-primary mb-2 px-3 py-1 fw-bold">
            <i className="bi bi-award-fill me-1"></i> THASMAI INFOTECH TALENT ASSESSMENT (P07)
          </div>
          <h2 className="fw-bold mb-2 text-white">AI Document Assistant & Retrieval System</h2>
          <p className="mb-4 text-white-50" style={{ fontSize: '0.96rem' }}>
            Upload PDFs, extract text page-by-page with PyMuPDF, search with TF-IDF cosine similarity,
            and query document intelligence with verifiable source citations and page numbers.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-light text-primary fw-bold px-3 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
              onClick={() => onNavigate('upload')}
            >
              <i className="bi bi-cloud-arrow-up-fill"></i>
              Upload PDF
            </button>
            <button
              className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2"
              onClick={() => onNavigate('ask-ai')}
            >
              <i className="bi bi-robot"></i>
              Ask AI Question
            </button>
            <button
              className="btn btn-outline-light fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2"
              onClick={() => onNavigate('search')}
            >
              <i className="bi bi-search"></i>
              TF-IDF Search
            </button>
            <button
              className="btn btn-warning text-dark fw-bold px-3 py-2 rounded-3 d-flex align-items-center gap-2"
              onClick={onImportSamples}
              disabled={importingSamples}
              title="Loads AI Handbook & Company Policy sample PDFs"
            >
              <i className={`bi ${importingSamples ? 'bi-arrow-repeat spin' : 'bi-magic'}`}></i>
              {importingSamples ? 'Importing Samples...' : 'Load Sample Documents'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Total Documents"
            value={stats.total_documents || 0}
            desc="Uploaded & parsed PDFs"
            icon="bi-files"
            variant="blue"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Pages Extracted"
            value={stats.total_pages || 0}
            desc="Page-by-page index"
            icon="bi-layers-fill"
            variant="purple"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Total Words"
            value={(stats.total_words || 0).toLocaleString()}
            desc="Tokenized & vectorized"
            icon="bi-file-earmark-word"
            variant="emerald"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Queries Executed"
            value={stats.total_queries || 0}
            desc="Search & QA interactions"
            icon="bi-lightning-charge-fill"
            variant="amber"
          />
        </div>
      </div>

      {/* Two-Column Content Grid */}
      <div className="row g-4">
        {/* Left: Recent Documents */}
        <div className="col-12 col-lg-7">
          <div className="modern-card h-100">
            <div className="card-header-clean">
              <h3>
                <i className="bi bi-file-earmark-pdf text-primary"></i>
                Recent Documents
              </h3>
              <button
                className="btn btn-sm btn-link text-primary text-decoration-none fw-semibold"
                onClick={() => onNavigate('documents')}
              >
                View All ({stats.total_documents || 0}) <i className="bi bi-arrow-right"></i>
              </button>
            </div>
            <div className="card-body-clean p-0">
              {recentDocs && recentDocs.length > 0 ? (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Pages</th>
                        <th>Size</th>
                        <th>Uploaded</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocs.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                              <span className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                                {doc.original_name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                            </span>
                          </td>
                          <td>{doc.formatted_size}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary px-2 py-1"
                              onClick={() => onInspectDoc(doc.id)}
                              title="Inspect extracted pages"
                            >
                              <i className="bi bi-eye me-1"></i> Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 px-3">
                  <div className="display-6 text-muted mb-3">
                    <i className="bi bi-folder-x"></i>
                  </div>
                  <h6 className="fw-bold">No Documents Uploaded Yet</h6>
                  <p className="text-muted small mb-3">
                    Upload your first PDF or click below to load pre-configured sample documents.
                  </p>
                  <button
                    className="btn btn-sm btn-primary rounded-3 px-3 py-2 fw-semibold"
                    onClick={onImportSamples}
                    disabled={importingSamples}
                  >
                    <i className="bi bi-magic me-1"></i> Load Sample Documents
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Recent Query Activity */}
        <div className="col-12 col-lg-5">
          <div className="modern-card h-100">
            <div className="card-header-clean">
              <h3>
                <i className="bi bi-clock-history text-secondary"></i>
                Recent Query Activity
              </h3>
              <span className="badge bg-light text-muted border">Live Feed</span>
            </div>
            <div className="card-body-clean">
              {recentQueries && recentQueries.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {recentQueries.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 bg-light rounded-3 border d-flex flex-column gap-1"
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          className={`badge ${
                            q.query_type === 'qa'
                              ? 'bg-purple-subtle text-primary border border-primary-subtle'
                              : 'bg-info-subtle text-info-emphasis border border-info-subtle'
                          }`}
                          style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                          {q.query_type === 'qa' ? 'AI Question' : 'TF-IDF Search'}
                        </span>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(q.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </div>
                      <div className="fw-semibold text-truncate text-dark" style={{ fontSize: '0.88rem' }}>
                        "{q.query_text}"
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-muted small mt-1">
                        <span>
                          {q.result_count > 0 ? (
                            <span className="text-success">
                              <i className="bi bi-check-circle me-1"></i>
                              {q.top_document} (p.{q.top_page})
                            </span>
                          ) : (
                            <span className="text-warning">
                              <i className="bi bi-dash-circle me-1"></i> No matches
                            </span>
                          )}
                        </span>
                        {q.confidence_score > 0 && (
                          <span className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>
                            {q.confidence_score}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="fs-3 text-muted mb-2">
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <h6 className="fw-bold text-muted">No Query Activity</h6>
                  <p className="text-muted small">
                    Ask questions or search keywords to populate activity logs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

