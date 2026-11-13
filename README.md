# AI Document Assistant (Project ID: P07)

> **THASMAI INFOTECH Internship Technical Talent Assessment**  
> **Role Track:** Senior Full-Stack Developer & AI Engineer  
> **Evaluation ID:** P07 – AI Document Assistant  
> **Architecture:** Decoupled REST Architecture (React.js Frontend + Python Flask Backend + SQLite Database + PyMuPDF + Scikit-Learn TF-IDF Retrieval)

---

## 1. Executive Summary & Objective

The **AI Document Assistant (P07)** is an enterprise-grade web application engineered to ingest multi-page PDF documents, extract text on a granular page-by-page basis, construct an inverted TF-IDF term matrix, and provide an interactive search and question-answering interface.

The application answers natural language queries with verifiable document citations (exact document name and page number), extracts high-relevance text snippets with highlighted keywords, computes match confidence percentages, and enforces strict fallback handling:
> *"No relevant information found in the uploaded documents."*

The application runs **100% locally** with zero external API dependencies or paid subscription keys.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | `18.3.1` | Declarative component UI and responsive SPA routing |
| **Build Tool** | Vite | `6.x` | Ultra-fast HMR and optimized production bundle |
| **UI Styling** | Bootstrap & Custom CSS | `5.3.3` | Clean SaaS layout, royal blue/slate color palette |
| **Icons** | Bootstrap Icons | `1.11.3` | Intuitive contextual iconography |
| **Backend Framework** | Python Flask | `3.1.3` | Lightweight REST API server with Blueprint modularity |
| **CORS Middleware** | Flask-CORS | `6.0.5` | Secure cross-origin resource sharing |
| **Database** | SQLite3 | Native | Embedded ACID relational persistence |
| **PDF Extraction** | PyMuPDF (`fitz`) | `2.1.0` | High-speed C-native text & page layout parsing |
| **Text Vectorization** | Scikit-Learn | `1.8.0` | TF-IDF Vectorizer with sublinear scaling |
| **Similarity Metric** | Scikit-Learn | `1.8.0` | Vector space Cosine Similarity calculation |

---

## 3. System Architecture

```
                          ┌─────────────────────────────────────────┐
                          │         React Frontend (Vite)           │
                          │   Dashboard | Upload | Docs | Ask AI    │
                          └────────────────────┬────────────────────┘
                                               │ REST API (JSON / FormData)
                                               ▼
                          ┌─────────────────────────────────────────┐
                          │           Flask Backend Server          │
                          │        (http://127.0.0.1:5000)          │
                          └──────┬─────────────┬─────────────┬──────┘
                                 │             │             │
                ┌────────────────┘             │             └────────────────┐
                ▼                              ▼                              ▼
    ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
    │  PDF Service (PyMuPDF)│      │ TF-IDF Search & QA    │      │  SQLite DB Storage    │
    │  - %PDF Magic check   │      │  - Sublinear TF-IDF   │      │  - documents          │
    │  - Page-by-page text  │      │  - Cosine Similarity  │      │  - document_pages     │
    │  - Sanitized storage  │      │  - Sentence synthesis │      │  - query_history      │
    └───────────────────────┘      └───────────────────────┘      └───────────────────────┘
```

### Retrieval & Question-Answering Pipeline:
1. **Document Ingestion**: Uploaded PDF is validated (extension `.pdf`, size $\le 25\text{MB}$, magic bytes `%PDF-`).
2. **Text Extraction**: PyMuPDF iterates through every page, extracts raw text, cleans formatting, and records word/character counts.
3. **Database Insertion**: Metadata is stored in `documents` and page texts are stored in `document_pages` with foreign key relations.
4. **TF-IDF Indexing**:
   - $\text{TF}(t, d) = 1 + \log(f(t, d))$ for $f(t, d) > 0$
   - $\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + \text{DF}(t, D)}\right) + 1$
   - $\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t, D)$
5. **Two-Tier Question Answering**:
   - **Tier 1 (Page Rank)**: Evaluates page relevance via cosine similarity with the question vector.
   - **Tier 2 (Sentence Rank & Synthesis)**: Splits top passages into sentences, scores each with hybrid lexical + TF-IDF density, and synthesizes an extractive answer.
6. **No-Answer Fallback**: If the maximum candidate score fails the confidence threshold ($< 5\%$), the engine safely returns:
   *"No relevant information found in the uploaded documents."*

---

## 4. Project Folder Structure

```
ai_doc_assistant/
│
├── backend/
│   ├── database/
│   │   ├── schema.sql                 # SQLite schema definitions & indexes
│   │   ├── db.py                      # Database connection and init routines
│   │   └── ai_doc_assistant.db        # SQLite database file
│   │
│   ├── routes/
│   │   ├── document_routes.py         # Upload, list, inspect, delete, import samples
│   │   ├── search_routes.py           # TF-IDF keyword & phrase search
│   │   ├── qa_routes.py               # Question answering & query history
│   │   └── dashboard_routes.py        # Analytics, page count & recent activity
│   │
│   ├── services/
│   │   ├── pdf_service.py             # PyMuPDF extraction, validation, word counts
│   │   ├── search_service.py          # Scikit-learn TF-IDF search & snippet highlighting
│   │   └── qa_service.py              # Sentence scoring, synthesis & fallback handler
│   │
│   ├── sample_docs/                   # Bundled sample PDFs for instant 1-click evaluation
│   │   ├── AI_and_Machine_Learning_Handbook.pdf
│   │   └── Thasmai_Company_Policy_2026.pdf
│   │
│   ├── uploads/                       # Storage for uploaded PDF files
│   ├── app.py                         # Flask application factory, CORS & static serving
│   ├── requirements.txt               # Backend Python dependencies
│   ├── create_samples.py              # Generator for sample PDFs
│   └── test_backend.py                # Automated end-to-end integration test suite
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx            # Responsive navigation sidebar with badge counts
│   │   │   ├── Navbar.jsx             # Top bar with backend health indicator
│   │   │   ├── Notification.jsx       # Success / Error / Warning toast alerts
│   │   │   ├── StatCard.jsx           # Dashboard metric cards
│   │   │   ├── SnippetCard.jsx        # Search match card with keyword highlighting
│   │   │   └── DocumentModal.jsx      # Page-by-page text inspector modal
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Statistics, quick action hero, recent logs
│   │   │   ├── UploadDocuments.jsx    # Drag-and-drop uploader with validation
│   │   │   ├── MyDocuments.jsx        # Document repository table with filters
│   │   │   ├── AskAI.jsx              # Question answering interface with sources
│   │   │   ├── SearchDocuments.jsx    # TF-IDF deep text search
│   │   │   └── AboutProject.jsx       # Technical architecture & math foundations
│   │   │
│   │   ├── services/
│   │   │   └── api.js                 # Centralized REST API client
│   │   │
│   │   ├── App.jsx                    # Root state coordinator
│   │   ├── App.css                    # SaaS design system & component styles
│   │   ├── index.css                  # Global variables & typography
│   │   └── main.jsx                   # React 18 DOM mount point
│   │
│   ├── index.html                     # HTML5 shell with Google Fonts & Bootstrap 5
│   ├── package.json                   # Frontend dependencies & scripts
│   └── vite.config.js                 # Vite dev proxy configuration
│
└── README.md                          # Comprehensive documentation & evaluation guide
```

---

## 5. Step-by-Step Setup Guide (Running in VS Code)

### Prerequisites:
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: v18+ (Tested on Node.js v24)
- **Visual Studio Code**

---

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File > Open Folder...** and select `c:\ai_doc_assistant`.
3. Open a new terminal in VS Code: `Terminal > New Terminal` (Ctrl + `~`).

---

### Step 2: Set Up and Run the Flask Backend
In your VS Code terminal:

```powershell
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the automated verification test suite
python test_backend.py

# Start the Flask Backend Server
python app.py
```

The terminal will display:
```
* Running on http://127.0.0.1:5000
Starting AI Document Assistant Backend on http://127.0.0.1:5000
```
Backend health check is available at: `http://127.0.0.1:5000/api/health`.

---

### Step 3: Run the React Frontend (in a 2nd Terminal)
Open a second terminal in VS Code (`Terminal > New Terminal` or the `+` split button):

```powershell
# Navigate to frontend directory
cd frontend

# Install node packages (if not already installed)
npm install

# Start Vite React development server
npm run dev
```

The terminal will display:
```
  VITE v6.x ready in 350 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open `http://localhost:3000` in Google Chrome or Microsoft Edge.

> **Bonus Single-Server Mode**: If you run `npm run build` inside `frontend`, the Flask backend at `http://127.0.0.1:5000` serves both the frontend SPA and all REST APIs simultaneously!

---

## 6. Demonstration Walkthrough (2–3 Minute Script)

Use this script during your technical talent presentation:

### Phase 1: Dashboard & System Health (0:00 - 0:40)
1. Navigate to `http://localhost:3000`.
2. Highlight the **top navbar status pill**: shows `"Flask Backend Connected"` in green with a live heartbeat pulse.
3. Show the **Executive Dashboard**: displays Total Documents, Pages Extracted, Words Indexed, and Queries Executed.
4. Point out the **"Load Sample Documents"** one-click button. Click it:
   - System immediately imports `AI_and_Machine_Learning_Handbook.pdf` and `Thasmai_Company_Policy_2026.pdf`.
   - Metrics update live: 6 pages extracted, 1,200+ words tokenized!

### Phase 2: PDF Upload & Text Extraction (0:40 - 1:15)
1. Click **Upload Documents** in the sidebar.
2. Demonstrate the modern drag-and-drop zone. Mention the security validations:
   - File extension check (`.pdf` only)
   - 25 MB size boundary
   - Binary header `%PDF-` signature check
   - Non-executable sandbox storage
3. Click **"View"** on `AI_and_Machine_Learning_Handbook.pdf`:
   - Inspect the **Document Modal**: browse Page 1, Page 2, Page 3 text extracted via PyMuPDF.
   - Show word count per page and the "Copy Text" button.

### Phase 3: TF-IDF Content Search (1:15 - 1:50)
1. Click **Search Documents** in the sidebar.
2. Click the quick chip **"Self-attention transformers"** or type `"transformers attention mechanism"`.
3. Click **Search**:
   - Displays ranked match cards.
   - Top result points directly to `AI_and_Machine_Learning_Handbook.pdf`, **Page 2**, with a high similarity percentage.
   - The snippet highlights matched tokens (`transformers`, `attention`) using `<mark>` badges.

### Phase 4: Ask AI & Strict No-Answer Handling (1:50 - 2:30)
1. Click **Ask AI** in the sidebar.
2. Ask: *"What are the standard working hours at Thasmai?"*
   - Returns synthesized answer: *"Standard working hours at Thasmai Infotech are 9:30 AM to 6:30 PM Indian Standard Time (IST), Monday through Friday..."*
   - Displays **Source**: `Thasmai_Company_Policy_2026.pdf`, **Page 1**, with a 97% relevance score.
3. Now test the **Mandatory Fallback**:
   - Ask: *"What is the recipe for chocolate cake?"*
   - Returns the exact prompt-specified fallback message:  
     **"No relevant information found in the uploaded documents."**
4. Conclude by opening the **About Project** page to show the mathematical formulation and architecture.

---

## 7. Database Schema (SQLite)

### Table: `documents`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Auto-incrementing unique identifier |
| `filename` | TEXT NOT NULL | Sanitized unique storage filename on disk |
| `original_name` | TEXT NOT NULL | Original upload filename provided by user |
| `file_path` | TEXT NOT NULL | Absolute disk path to stored PDF |
| `file_size` | INTEGER NOT NULL | File size in bytes |
| `total_pages` | INTEGER NOT NULL | Total page count extracted via PyMuPDF |
| `uploaded_at` | DATETIME | Timestamp of ingestion (UTC/Local) |
| `status` | TEXT | Processing status (`processed`, `error`) |

### Table: `document_pages`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Page record ID |
| `document_id` | INTEGER NOT NULL | Foreign key referencing `documents(id)` (ON DELETE CASCADE) |
| `page_number` | INTEGER NOT NULL | 1-indexed document page number |
| `page_text` | TEXT NOT NULL | Cleaned extracted plain text of the page |
| `word_count` | INTEGER | Word count on this page |
| `char_count` | INTEGER | Character count on this page |

### Table: `query_history`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Query record ID |
| `query_type` | TEXT NOT NULL | Type of query: `'search'` or `'qa'` |
| `query_text` | TEXT NOT NULL | The user's input search query or question |
| `result_count` | INTEGER | Number of matching snippets found |
| `top_document` | TEXT | Name of top-ranked document match |
| `top_page` | INTEGER | Page number of top-ranked document match |
| `confidence_score` | REAL | Confidence percentage score (0.0 to 100.0) |
| `created_at` | DATETIME | Timestamp of execution |

---

## 8. REST API Reference

| Endpoint | Method | Payload / Params | Description |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | None | Service heartbeat and uptime check |
| `/api/documents/upload` | `POST` | `multipart/form-data` (`file`) | Uploads PDF, validates, extracts pages, stores in DB |
| `/api/documents/import-samples` | `POST` | None | Ingests bundled sample PDFs for instant testing |
| `/api/documents` | `GET` | None | Returns list of all uploaded documents with metadata |
| `/api/documents/<id>` | `GET` | None | Retrieves detailed metadata and all page texts for document |
| `/api/documents/<id>` | `DELETE` | None | Cascades deletion of pages, document record, and disk file |
| `/api/search` | `POST` | `{"query": str, "document_id": int, "top_k": int}` | Executes TF-IDF cosine similarity search across pages |
| `/api/qa/ask` | `POST` | `{"question": str, "document_id": int}` | Synthesizes answer with confidence and source citations |
| `/api/qa/history` | `GET` | None | Returns recent search and question history log |
| `/api/dashboard/stats` | `GET` | None | Aggregated counts for documents, pages, words, queries |

---

## 9. 10-Day Development Plan

| Day | Milestone | Key Deliverables & Outcomes |
| :---: | :--- | :--- |
| **Day 1** | Requirement Analysis & Architecture | Drafted technical specs, defined REST API contracts, established folder structure. |
| **Day 2** | Database & Environment Setup | Configured SQLite schema, foreign key cascade constraints, verified Python 3.13 & Node.js environments. |
| **Day 3** | PyMuPDF Extraction Engine | Implemented `pdf_service.py`, `%PDF` magic byte validation, page-by-page text parser, whitespace normalizer. |
| **Day 4** | TF-IDF Search Engine | Built `search_service.py` using Scikit-Learn `TfidfVectorizer`, sublinear TF, and cosine similarity ranking. |
| **Day 5** | Question Answering & Synthesis | Built `qa_service.py` with two-tier sentence ranking, hybrid scoring, and strict no-answer fallback. |
| **Day 6** | Flask REST API Endpoints | Developed modular blueprints: `document_routes`, `search_routes`, `qa_routes`, `dashboard_routes`. |
| **Day 7** | React Component Foundation | Scaffolded Vite React application, created SaaS layout, responsive Sidebar, Navbar, and StatCard components. |
| **Day 8** | Frontend Page Development | Implemented Dashboard, Upload Dropzone, My Documents table, Search, Ask AI, and About Project pages. |
| **Day 9** | End-to-End Integration & Testing | Linked React fetch client to Flask API, created automated test suite `test_backend.py`, generated sample PDFs. |
| **Day 10** | UI Polishing, Documentation & Viva Prep | Fine-tuned responsive styles, wrote comprehensive README, verified demo script, prepared viva Q&A. |

---

## 10. Known Limitations & Future Improvements

### Known Limitations:
1. **Scanned / Image-Only PDFs**: PyMuPDF extracts native text streams. Scanned PDFs (pure images of text without an embedded OCR layer) return empty text.
2. **Tabular Data Complexities**: Multi-column tables inside PDFs are extracted as serialized text streams; complex cell relationships are not reconstructed as relational tables.

### Future Improvements:
1. **Local OCR Pipeline (Tesseract / EasyOCR)**: Integrate Tesseract OCR as a fallback pipeline for scanned document pages so image-based PDFs are automatically converted into searchable text.
2. **Dense Vector Embeddings & Hybrid RAG**: Augment the TF-IDF lexical search with an open-source local embedding model (e.g. `sentence-transformers/all-MiniLM-L6-v2`) and ChromaDB/FAISS for hybrid dense-sparse retrieval (BM25 + Semantic Embeddings).
3. **Local LLM Integration (Ollama / Llama.cpp)**: Allow users to connect a local quantized LLM (e.g. Llama 3 or Mistral 7B) through Ollama for generative multi-paragraph synthesis while maintaining 100% data privacy.

---

## 11. Technical Viva Questions & Simple Answers

**Q1: What is the difference between PyMuPDF and PyPDF2?**  
*Answer:* PyMuPDF (fitz) is built on MuPDF, a high-performance C rendering library. It is significantly faster (up to 10–20x) than pure Python libraries like PyPDF2, handles complex fonts and layout streams accurately, and supports granular page-by-page extraction.

**Q2: What is TF-IDF and how does it work in this project?**  
*Answer:* TF-IDF stands for Term Frequency-Inverse Document Frequency. Term Frequency (TF) measures how often a word appears in a specific document page. Inverse Document Frequency (IDF) discounts ubiquitous words (like "the", "document") that appear in almost all pages. Multiplying them highlights words that are distinctively informative for a specific passage.

**Q3: How does the system compute similarity between a question and document pages?**  
*Answer:* Both the user question and document pages are converted into normalized numerical vectors in a shared TF-IDF feature space. We then compute the Cosine Similarity (the dot product of the normalized vectors), which measures the angle between them regardless of document length.

**Q4: How does the application prevent hallucinations or irrelevant answers?**  
*Answer:* The QA engine uses strict extractive synthesis grounded in the top-ranked sentences from the uploaded text. If the maximum similarity score falls below the required confidence threshold ($< 5\%$), the system refuses to guess and outputs: *"No relevant information found in the uploaded documents."*

**Q5: What security measures are implemented for PDF uploads?**  
*Answer:* 
1. Filename sanitization via Werkzeug `secure_filename()` and unique UUID prefixes to prevent directory traversal.
2. File size capping at 25 MB to protect server memory.
3. Binary header validation checking for the `%PDF-` signature.
4. Uploaded files are strictly parsed as read-only binary text streams, never executed as scripts.

**Q6: Why use SQLite instead of MongoDB or PostgreSQL for this assessment?**  
*Answer:* SQLite is self-contained, serverless, zero-configuration, and ACID-compliant. It stores the data locally in a single file (`ai_doc_assistant.db`), ensuring the project can be cloned and run instantly by any evaluator without provisioning database servers or docker containers.

