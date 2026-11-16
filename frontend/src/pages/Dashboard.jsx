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
  isOnline,
  onRefresh,
}) {
  return (
    <div className="d-flex flex-column gap-4" style={{ minWidth: 0, width: '100%' }}>
      {/* A. Dashboard Header */}
      <div className="dashboard-header-panel">
        <div className="dashboard-header-text">
          <h2>Executive Dashboard</h2>
          <p>Real-time document processing metrics, repository overview, and query intelligence</p>
        </div>

        <div className="dashboard-header-actions">
          {/* Flask Backend Connected Status */}
          <div className={`status-badge ${isOnline ? 'status-online' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
            <span className={isOnline ? 'status-pulse' : 'badge bg-danger p-1 rounded-circle'}></span>
            <span>{isOnline ? 'Flask Backend Connected' : 'Backend Disconnected'}</span>
          </div>

          {/* Sync Button */}
          {onRefresh && (
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 py-2 rounded-3 bg-white"
              onClick={onRefresh}
              title="Synchronize Live Metrics"
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span className="d-none d-sm-inline">Sync</span>
            </button>
          )}

          {/* Upload PDF Button */}
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-bold shadow-sm"
            onClick={() => onNavigate('upload')}
          >
            <i className="bi bi-cloud-arrow-up-fill"></i>
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* B. Four Statistics Cards (exact .statistics-grid class) */}
      <div className="statistics-grid">
        <StatCard
          label="Total Documents"
          value={stats.total_documents || 0}
          desc="Uploaded & verified PDFs"
          icon="bi-files"
          variant="blue"
        />
        <StatCard
          label="Pages Extracted"
          value={stats.total_pages || 0}
          desc="Granular page-by-page index"
          icon="bi-layers-fill"
          variant="purple"
        />
        <StatCard
          label="Total Words"
          value={stats.total_words || 0}
          desc="Tokenized & vectorized"
          icon="bi-file-earmark-word"
          variant="emerald"
        />
        <StatCard
          label="Queries Executed"
          value={stats.total_queries || 0}
          desc="TF-IDF searches & AI questions"
          icon="bi-lightning-charge-fill"
          variant="amber"
        />
      </div>

      {/* C. Full-Width Horizontal Welcome Banner */}
      <div className="welcome-banner-horizontal">
        <div className="welcome-banner-content">
          <h3>
            <i className="bi bi-stars text-warning"></i>
            Welcome to DocuMind AI
          </h3>
          <p>
            Your intelligent document assistant. Upload PDF documents, extract information,
            search content and get answers with source references.
          </p>
        </div>

        <div className="welcome-banner-actions">
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
            Search Documents
          </button>
          <button
            className="btn btn-warning text-dark fw-bold px-3 py-2 rounded-3 d-flex align-items-center gap-2 ms-lg-1"
            onClick={onImportSamples}
            disabled={importingSamples}
            title="Preloads AI Handbook & Company Policy sample PDFs"
          >
            <i className={`bi ${importingSamples ? 'bi-arrow-repeat spin' : 'bi-magic'}`}></i>
            {importingSamples ? 'Importing...' : 'Load Sample Documents'}
          </button>
        </div>
      </div>

      {/* D & E. Two-Column Lower Grid (exact .dashboard-lower-grid class) */}
      <div className="dashboard-lower-grid">
        {/* D. Recent Documents (approx 65% width) */}
        <div className="modern-card">
          <div className="card-header-clean">
            <h3>
              <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
              Recent Documents
            </h3>
            <button
              className="btn btn-sm btn-link text-primary text-decoration-none fw-semibold p-0"
              onClick={() => onNavigate('documents')}
            >
              View All ({stats.total_documents || 0}) <i className="bi bi-arrow-right-short fs-5 align-middle"></i>
            </button>
          </div>

          <div className="card-body-clean p-0">
            {recentDocs && recentDocs.length > 0 ? (
              <div className="table-responsive-clean">
                <table className="custom-table-clean">
                  <thead>
                    <tr>
                      <th>Document</th>
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
                          <div className="doc-name-cell">
                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-5 flex-shrink-0"></i>
                            <span
                              className="doc-name-text"
                              title={doc.original_name}
                            >
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
                        <td className="text-muted small">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary px-3 py-1 rounded-3"
                            onClick={() => onInspectDoc(doc.id)}
                            title="Inspect extracted page text"
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 px-3">
                <div className="display-6 text-muted mb-2">
                  <i className="bi bi-folder-x"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">No Documents Uploaded Yet</h6>
                <p className="text-muted small mb-3">
                  Upload your first PDF or click below to load sample demo documents.
                </p>
                <button
                  className="btn btn-sm btn-primary rounded-3 px-3 py-2 fw-bold"
                  onClick={onImportSamples}
                  disabled={importingSamples}
                >
                  <i className="bi bi-magic me-1"></i> Load Sample Documents
                </button>
              </div>
            )}
          </div>
        </div>

        {/* E. Recent Query Activity (approx 35% width) */}
        <div className="modern-card">
          <div className="card-header-clean">
            <h3>
              <i className="bi bi-clock-history text-primary fs-5"></i>
              Recent Query Activity
            </h3>
            <span className="badge bg-light text-muted border">Live Feed</span>
          </div>

          <div className="card-body-clean">
            {recentQueries && recentQueries.length > 0 ? (
              <div className="activity-feed-list">
                {recentQueries.map((q) => {
                  const isSuccess = q.result_count > 0;
                  return (
                    <div key={q.id} className="activity-item">
                      <div className="activity-item-header">
                        <span
                          className={`badge ${
                            q.query_type === 'qa'
                              ? 'bg-purple-subtle text-primary border border-primary-subtle'
                              : 'bg-info-subtle text-info-emphasis border border-info-subtle'
                          }`}
                          style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}
                        >
                          {q.query_type === 'qa' ? 'AI Question' : 'TF-IDF Search'}
                        </span>

                        <span
                          className={`status-pill ${
                            isSuccess ? 'status-pill-success' : 'status-pill-warning'
                          }`}
                        >
                          <i className={`bi ${isSuccess ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`}></i>
                          {isSuccess ? 'Match Found' : 'No Matches'}
                        </span>
                      </div>

                      <div className="activity-query-text" title={q.query_text}>
                        "{q.query_text}"
                      </div>

                      <div className="activity-item-footer">
                        <span>
                          {isSuccess ? (
                            <span className="text-secondary">
                              <i className="bi bi-file-earmark-text me-1 text-primary"></i>
                              {q.top_document} (p.{q.top_page})
                            </span>
                          ) : (
                            <span className="text-muted">No relevant passage</span>
                          )}
                        </span>
                        <span>
                          {new Date(q.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="fs-3 text-muted mb-2">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">No Query Activity</h6>
                <p className="text-muted small">
                  Ask questions or search keywords to view the live activity stream.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
