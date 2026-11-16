import React from 'react';

export default function SnippetCard({
  documentName,
  pageNumber,
  snippet,
  score,
  matchedTerms = [],
  onViewDocument,
  documentId,
}) {
  // Highlight matched terms inside the snippet
  const renderHighlightedSnippet = (text, terms) => {
    if (!terms || terms.length === 0 || !text) return text;

    const escapedTerms = terms
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter((t) => t.length > 1);

    if (escapedTerms.length === 0) return text;

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = terms.some((term) => term.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={index} className="match-highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="snippet-card-modern">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2 min-w-0">
          <i className="bi bi-file-earmark-pdf-fill text-danger fs-5 flex-shrink-0"></i>
          <span className="fw-bold text-dark text-truncate" style={{ fontSize: '0.88rem' }} title={documentName}>
            {documentName}
          </span>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '0.72rem' }}>
            Page {pageNumber}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {score !== undefined && (
            <span
              className={`badge ${
                score >= 70
                  ? 'bg-success-subtle text-success border border-success-subtle'
                  : score >= 40
                  ? 'bg-primary-subtle text-primary border border-primary-subtle'
                  : 'bg-secondary-subtle text-secondary border border-secondary-subtle'
              }`}
              style={{ fontSize: '0.74rem' }}
            >
              Match: {score}%
            </span>
          )}
          {onViewDocument && documentId && (
            <button
              className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-semibold small"
              onClick={() => onViewDocument(documentId, pageNumber)}
              title="Inspect page text in modal"
            >
              Inspect <i className="bi bi-arrow-right-short"></i>
            </button>
          )}
        </div>
      </div>

      <div className="snippet-text-box">
        {renderHighlightedSnippet(snippet, matchedTerms)}
      </div>

      {matchedTerms && matchedTerms.length > 0 && (
        <div className="mt-1 d-flex align-items-center gap-1 flex-wrap">
          <small className="text-muted me-1" style={{ fontSize: '0.72rem' }}>
            Terms matched:
          </small>
          {matchedTerms.map((term, i) => (
            <span key={i} className="badge bg-light text-dark border me-1" style={{ fontSize: '0.68rem' }}>
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
