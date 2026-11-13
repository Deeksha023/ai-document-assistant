import React from 'react';

export default function AboutProject() {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Overview Hero */}
      <div className="modern-card p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="p-3 bg-primary-subtle text-primary rounded-3 fs-2">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <div>
            <div className="badge bg-primary text-white mb-1">PROJECT ID: P07</div>
            <h3 className="fw-bold m-0">AI Document Assistant</h3>
            <p className="text-muted m-0 small">
              Developed for THASMAI INFOTECH Internship Technical Talent Assessment
            </p>
          </div>
        </div>

        <p className="text-secondary leading-relaxed">
          The <strong>AI Document Assistant (P07)</strong> is a production-grade full-stack web application
          engineered to ingest multi-page PDF documents, perform structured page-by-page text extraction,
          index text using Scikit-Learn TF-IDF vector representations, and provide natural language question answering
          with precise document citations, confidence scoring, and explicit no-answer handling.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
              <i className="bi bi-filetype-jsx fs-4"></i>
              <span>Frontend Architecture</span>
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>React 18 Single Page Application</li>
              <li>Vite build tool with HMR</li>
              <li>Bootstrap 5.3 & Bootstrap Icons</li>
              <li>Vanilla modern CSS design system</li>
              <li>Asynchronous REST API fetch client</li>
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
              <li>Python Flask RESTful micro-framework</li>
              <li>Flask-CORS cross-origin access</li>
              <li>Werkzeug secure file handling</li>
              <li>Modular Blueprints (Documents, Search, QA, Stats)</li>
              <li>Comprehensive error handling & JSON responses</li>
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
              <li>SQLite relational embedded database</li>
              <li>Foreign key constraints with cascade deletes</li>
              <li>Indexed page contents table</li>
              <li>Query execution analytics & history log</li>
              <li>Physical filesystem PDF storage</li>
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
              <li>PyMuPDF (fitz) high-speed parser</li>
              <li>Multi-page sequential text extraction</li>
              <li>Whitespace & line-break normalization</li>
              <li>Magic byte validation (%PDF header check)</li>
              <li>Page word and character accounting</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2 text-warning fw-bold">
              <i className="bi bi-cpu-fill fs-4"></i>
              <span>Search & Retrieval</span>
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
              <li>Extractive sentence synthesis</li>
              <li>Confidence percentage calibration</li>
              <li>Mandatory no-answer fallback protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mathematical Principles */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-calculator text-primary"></i>
            Mathematical Principles: TF-IDF & Cosine Similarity
          </h3>
        </div>
        <div className="card-body-clean">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark">Term Frequency - Inverse Document Frequency</h6>
              <p className="small text-muted">
                TF-IDF quantifies the importance of term <em>t</em> in document passage <em>d</em> relative
                to corpus <em>D</em>. Sublinear TF applies logarithmic scaling to dampen word frequency dominance:
              </p>
              <div className="p-3 bg-light rounded-3 font-monospace small border">
                TF(t, d) = 1 + log(f(t, d)) &nbsp; [for f(t, d) &gt; 0]<br />
                IDF(t, D) = log((1 + |D|) / (1 + DF(t, D))) + 1<br />
                TF-IDF(t, d) = TF(t, d) &times; IDF(t, D)
              </div>
            </div>

            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark">Vector Space Cosine Similarity</h6>
              <p className="small text-muted">
                Measures the cosine angle between query vector <strong>q</strong> and document passage vector <strong>d</strong>,
                producing an angle-based metric normalized between 0 and 1:
              </p>
              <div className="p-3 bg-light rounded-3 font-monospace small border">
                Cosine Similarity(q, d) = (q &bull; d) / (||q||<sub>2</sub> &times; ||d||<sub>2</sub>)<br />
                Similarity Score (%) = min(1.0, Score) &times; 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Validation Highlights */}
      <div className="modern-card">
        <div className="card-header-clean">
          <h3>
            <i className="bi bi-shield-lock-fill text-success"></i>
            Security, Validation & Robustness Safeguards
          </h3>
        </div>
        <div className="card-body-clean">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-file-earmark-check text-success me-1"></i> File Validation
                </div>
                <div className="small text-muted">
                  Strict .pdf extension verification, 25MB file size boundary, and binary '%PDF' magic byte header check.
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-slash-circle text-danger me-1"></i> Path Sanitization
                </div>
                <div className="small text-muted">
                  UUID prefix generation + Werkzeug secure_filename() prevents path traversal attacks.
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-shield-x text-warning me-1"></i> No Execution Policy
                </div>
                <div className="small text-muted">
                  Uploaded files are solely parsed as read-only binary streams through PyMuPDF; never executed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

