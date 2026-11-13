import React, { useState } from 'react';
import api from '../services/api';
import SnippetCard from '../components/SnippetCard';

export default function AskAI({ documents, selectedDocId, onInspectDoc, onNavigate }) {
  const [question, setQuestion] = useState('');
  const [activeDocFilter, setActiveDocFilter] = useState(selectedDocId ? String(selectedDocId) : '');
  const [loading, setLoading] = useState(false);
  const [qaResult, setQaResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleQuestions = [
    'What is supervised learning?',
    'What are the standard working hours at Thasmai?',
    'How do transformer architectures process sequential data?',
    'What is the annual leave and paid time off policy?',
    'What is the F1-Score formula?',
    'What is the recipe for chocolate cake?', // Demonstrates the required fallback!
  ];

  const handleAsk = async (qText) => {
    const queryToUse = (qText !== undefined ? qText : question).trim();
    if (!queryToUse) {
      setErrorMsg('Please enter a question.');
      return;
    }

    if (qText) setQuestion(qText);

    setLoading(true);
    setErrorMsg('');
    setQaResult(null);

    try {
      const docId = activeDocFilter ? parseInt(activeDocFilter, 10) : null;
      const res = await api.askQuestion(queryToUse, docId);
      if (res.success) {
        setQaResult(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to process question.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with AI QA service.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Search Header Card */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-robot text-primary"></i>
            Ask AI Document Intelligence
          </h3>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
            TF-IDF + Extractive Synthesis
          </span>
        </div>

        <div className="card-body-clean">
          {/* Document Scope Filter */}
          <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
            <label className="fw-semibold small text-muted">Search Scope:</label>
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: '300px' }}
              value={activeDocFilter}
              onChange={(e) => setActiveDocFilter(e.target.value)}
            >
              <option value="">All Uploaded Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.original_name} ({d.total_pages} {d.total_pages === 1 ? 'page' : 'pages'})
                </option>
              ))}
            </select>
            {documents.length === 0 && (
              <span className="small text-danger">
                <i className="bi bi-exclamation-circle me-1"></i> No documents uploaded yet.
              </span>
            )}
          </div>

          {/* Question Input Box */}
          <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
            <span className="input-group-text bg-white border-end-0 text-primary">
              <i className="bi bi-chat-quote-fill fs-4"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="Ask any question about your uploaded documents..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2"
              type="button"
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill"></i>
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Example Question Chips */}
          <div className="mt-3">
            <div className="small text-muted fw-semibold mb-2">
              <i className="bi bi-lightbulb me-1 text-warning"></i> Try asking:
            </div>
            <div className="example-chips">
              {sampleQuestions.map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  className="chip-btn"
                  onClick={() => handleAsk(sq)}
                  disabled={loading}
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger border-danger-subtle d-flex align-items-center gap-2 rounded-3 shadow-sm">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="modern-card text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <h5 className="fw-bold text-dark">Analyzing Documents...</h5>
          <p className="text-muted small">
            Scanning page-level TF-IDF matrices, evaluating sentence similarities, and synthesizing answer.
          </p>
        </div>
      )}

      {/* Answer Results Box */}
      {qaResult && !loading && (
        <div className="modern-card">
          <div className="card-header-clean">
            <h3>
              <i className="bi bi-check2-circle text-success"></i>
              Query Results & Answer
            </h3>
            <div className="d-flex align-items-center gap-2">
              {qaResult.found && (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                  Confidence Score: {qaResult.confidence}%
                </span>
              )}
            </div>
          </div>

          <div className="card-body-clean">
            {/* If Answer Found */}
            {qaResult.found ? (
              <>
                <div className="qa-answer-box">
                  <div className="qa-answer-header">
                    <span className="badge bg-primary text-white px-2 py-1">
                      <i className="bi bi-stars me-1"></i> Synthesized AI Answer
                    </span>
                    <small className="text-muted">
                      Source: {qaResult.sources.length} document citation(s)
                    </small>
                  </div>
                  <div className="qa-answer-text">
                    "{qaResult.answer}"
                  </div>
                </div>

                {/* Supporting Evidence Snippets & Sources */}
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
                  <i className="bi bi-bookmark-check text-primary"></i>
                  Supporting Text Snippets & Source Citations
                </h5>

                <div className="d-flex flex-column gap-2">
                  {qaResult.sources.map((src, idx) => (
                    <SnippetCard
                      key={idx}
                      documentName={src.document_name}
                      documentId={src.document_id}
                      pageNumber={src.page_number}
                      snippet={src.snippet}
                      score={src.relevance_score}
                      matchedTerms={src.matched_terms}
                      onViewDocument={onInspectDoc}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Fallback requirement: No relevant information found */
              <div className="text-center py-5">
                <div className="display-4 text-warning mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h4 className="fw-bold text-danger mb-2">
                  No relevant information found in the uploaded documents.
                </h4>
                <p className="text-muted small mb-4" style={{ maxWidth: '520px', margin: '0 auto' }}>
                  The question does not match any indexed text passages with sufficient confidence.
                  Try searching with different keywords, asking about general topics within your uploaded documents,
                  or uploading additional PDF files.
                </p>
                <button
                  className="btn btn-outline-primary btn-sm rounded-3 px-3"
                  onClick={() => onNavigate('upload')}
                >
                  <i className="bi bi-upload me-1"></i> Upload More PDFs
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

