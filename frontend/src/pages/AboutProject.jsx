import React from 'react';

export default function AboutProject() {
  return (
    <div className="d-flex flex-column gap-4" style={{ minWidth: 0, width: '100%' }}>
      {/* Overview Hero Card */}
      <div className="modern-card p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="p-3 bg-primary-subtle text-primary rounded-3 fs-2 flex-shrink-0">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <div>
            <div className="badge bg-primary text-white mb-1">PROJECT ID: P07</div>
            <h3 className="fw-bold m-0 text-dark">DocuMind AI – Document Assistant</h3>
            <p className="text-muted m-0 small">
              THASMAI INFOTECH Internship Technical Talent Assessment
            </p>
          </div>
        </div>

        <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: '0.94rem' }}>
          <strong>DocuMind AI</strong> is an enterprise-grade document intelligence platform designed to eliminate
          tedious manual reading across lengthy multi-page PDF documents. The application ingests documents, performs
          structured page-by-page text extraction with <strong>PyMuPDF</strong>, calculates <strong>TF-IDF vector representations</strong> with
          Scikit-Learn, and supports conversational question answering with verifiable page citations, relevance scores, and strict fallback protection.
        </p>
      </div>

      {/* Architecture & Engineering Pillars */}
      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
              <i className="bi bi-filetype-jsx fs-4"></i>
              <span>Frontend Architecture</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>React 18 Single Page Application</li>
              <li>Vite build tool with instant HMR</li>
              <li>Bootstrap 5.3 & Bootstrap Icons</li>
              <li>Custom CSS design tokens</li>
              <li>Asynchronous REST API client</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
              <i className="bi bi-filetype-py fs-4"></i>
              <span>Backend REST APIs</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>Python Flask micro-framework</li>
              <li>Flask-CORS cross-origin access</li>
              <li>Werkzeug secure file handling</li>
              <li>Modular Blueprints (Docs, Search, QA, Stats)</li>
              <li>Comprehensive error handling</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-info fw-bold">
              <i className="bi bi-database-fill fs-4"></i>
              <span>Database & Storage</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>SQLite embedded relational DB</li>
              <li>Foreign key constraints & cascade delete</li>
              <li>Indexed page contents table</li>
              <li>Query execution history log</li>
              <li>Non-executable PDF storage</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-danger fw-bold">
              <i className="bi bi-file-earmark-pdf-fill fs-4"></i>
              <span>PDF Extraction Engine</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>PyMuPDF (fitz) C-level parser</li>
              <li>Page-by-page sequential parsing</li>
              <li>Whitespace & line-break normalization</li>
              <li>Binary %PDF magic byte validation</li>
              <li>Word and character metrics</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-warning fw-bold">
              <i className="bi bi-cpu-fill fs-4"></i>
              <span>Search & Vectorization</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>Scikit-Learn TfidfVectorizer</li>
              <li>Sublinear term-frequency scaling</li>
              <li>Unigram + Bigram (1,2) token n-grams</li>
              <li>Cosine similarity matrix computation</li>
              <li>Dynamic match token highlighting</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-purple fw-bold" style={{ color: '#7c3aed' }}>
              <i className="bi bi-robot fs-4"></i>
              <span>QA & Synthesis</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>Two-tier page & sentence ranking</li>
              <li>Hybrid TF-IDF + Keyword density scoring</li>
              <li>Grounded extractive sentence synthesis</li>
              <li>Confidence percentage calibration</li>
              <li>Mandatory no-answer fallback protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Information Cards: Core Principles */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-calculator text-primary"></i>
            Retrieval & Retrieval-Augmented Synthesis Principles
          </h3>
        </div>
        <div className="card-body-clean">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark">Term Frequency - Inverse Document Frequency (TF-IDF)</h6>
              <p className="small text-muted">
                TF-IDF weights words based on how frequently they appear in a specific document page while penalizing
                common words that appear across all documents. Sublinear TF applies logarithmic scaling:
              </p>
              <div className="p-3 bg-light rounded-3 font-monospace small border">
                TF(t, d) = 1 + log(f(t, d)) &nbsp; [for f(t, d) &gt; 0]<br />
                IDF(t, D) = log((1 + |D|) / (1 + DF(t, D))) + 1<br />
                TF-IDF(t, d) = TF(t, d) &times; IDF(t, D)
              </div>
            </div>

            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark">Cosine Similarity Ranking</h6>
              <p className="small text-muted">
                Evaluates the cosine of the angle between the query vector and document page vectors in high-dimensional feature space,
                producing a normalized score between 0 and 1:
              </p>
              <div className="p-3 bg-light rounded-3 font-monospace small border">
                Cosine Similarity(q, d) = (q &bull; d) / (||q||<sub>2</sub> &times; ||d||<sub>2</sub>)<br />
                Match Confidence (%) = min(1.0, Score) &times; 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author & Project Verification Card */}
      <div className="modern-card p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h5 className="fw-bold text-dark mb-1">Developer & Assessment Information</h5>
            <div className="text-muted small">
              <strong>Candidate:</strong> K DEEKSHA &bull; <strong>Assessment ID:</strong> P07 (AI Document Assistant)
            </div>
            <div className="text-muted small">
              <strong>Organization:</strong> THASMAI INFOTECH Technical Talent Assessment
            </div>
          </div>
          <div className="d-flex gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle p-2">
              <i className="bi bi-check-circle-fill me-1"></i> End-to-End Verified
            </span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle p-2">
              <i className="bi bi-shield-lock-fill me-1"></i> 100% Offline & Private
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
