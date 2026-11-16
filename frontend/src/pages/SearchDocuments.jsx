import React, { useState } from 'react';
import api from '../services/api';
import SnippetCard from '../components/SnippetCard';

export default function SearchDocuments({ documents, onInspectDoc, onNavigate }) {
  const [query, setQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [topK, setTopK] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleKeywords = [
    'Supervised learning',
    'Self-attention transformers',
    'Working hours IST',
    'Paid time off PTO',
    'F1-Score Precision Recall',
    'Full-disk encryption BitLocker',
    'Non-disclosure agreements NDA',
  ];

  const handleSearch = async (term) => {
    const searchTerm = (term !== undefined ? term : query).trim();
    if (!searchTerm) {
      setErrorMsg('Please enter keywords or a search phrase.');
      return;
    }

    if (term) setQuery(term);

    setLoading(true);
    setErrorMsg('');
    setSearchResults(null);

    try {
      const docId = selectedDocId ? parseInt(selectedDocId, 10) : null;
      const res = await api.searchDocuments(searchTerm, docId, topK);
      if (res.success) {
        setSearchResults(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to complete search.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with search backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ minWidth: 0, width: '100%' }}>
      {/* Search Input Card */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-search text-primary"></i>
            TF-IDF Document Content Search
          </h3>
          <span className="badge bg-light text-muted border small">
            Sublinear TF &bull; N-gram (1,2) Cosine Similarity
          </span>
        </div>

        <div className="card-body-clean">
          {/* Scope and Top-K Filters */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-8">
              <label className="fw-semibold small text-muted mb-1">Target Document Scope:</label>
              <select
                className="form-select form-select-sm rounded-3"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
              >
                <option value="">All Uploaded Documents ({documents.length})</option>
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.original_name} ({d.total_pages} {d.total_pages === 1 ? 'page' : 'pages'})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="fw-semibold small text-muted mb-1">Maximum Snippets (Top-K):</label>
              <select
                className="form-select form-select-sm rounded-3"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value, 10))}
              >
                <option value={5}>Top 5 Matches</option>
                <option value={10}>Top 10 Matches</option>
                <option value={20}>Top 20 Matches</option>
              </select>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden border">
            <span className="input-group-text bg-white border-0 text-primary ps-3">
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 ps-1"
              placeholder="Search keywords, phrases, policies, or technical terms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ fontSize: '1rem' }}
            />
            {query && (
              <button
                className="btn btn-white border-0 text-muted"
                onClick={() => setQuery('')}
                type="button"
                title="Clear input"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
            <button
              className="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2"
              type="button"
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-funnel"></i>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Keywords Chips */}
          <div className="mt-3">
            <div className="small text-muted fw-semibold mb-2">
              <i className="bi bi-tag-fill me-1 text-primary"></i> Popular search phrases:
            </div>
            <div className="example-chips">
              {sampleKeywords.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  className="chip-btn"
                  onClick={() => handleSearch(kw)}
                  disabled={loading}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 shadow-sm">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="modern-card text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h6 className="fw-bold text-dark">Executing TF-IDF Cosine Search...</h6>
          <p className="text-muted small">Computing term frequencies and vector similarities across pages.</p>
        </div>
      )}

      {/* Search Results Display */}
      {searchResults && !loading && (
        <div className="modern-card">
          <div className="card-header-clean">
            <h3>
              <i className="bi bi-card-text text-primary"></i>
              Search Results
            </h3>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              Found {searchResults.total_matches} matching snippet(s) for "{searchResults.query}"
            </span>
          </div>

          <div className="card-body-clean">
            {searchResults.total_matches > 0 ? (
              <div className="d-flex flex-column gap-2">
                {searchResults.results.map((res, idx) => (
                  <SnippetCard
                    key={idx}
                    documentName={res.document_name}
                    documentId={res.document_id}
                    pageNumber={res.page_number}
                    snippet={res.snippet}
                    score={res.similarity_score}
                    matchedTerms={res.matched_terms}
                    onViewDocument={onInspectDoc}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5 px-3">
                <div className="display-5 text-muted mb-2">
                  <i className="bi bi-file-earmark-x"></i>
                </div>
                <h5 className="fw-bold text-dark mb-1">
                  No matching text snippets found for "{searchResults.query}".
                </h5>
                <p className="text-muted small mb-3">
                  Try broader keywords or ensure the relevant document has been uploaded.
                </p>
                <button
                  className="btn btn-outline-primary btn-sm rounded-3 px-3"
                  onClick={() => onNavigate('upload')}
                >
                  <i className="bi bi-upload me-1"></i> Upload More Documents
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
