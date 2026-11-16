# DocuMind AI – AI Document Assistant (P07)

> **THASMAI INFOTECH Internship Technical Talent Assessment**  
> **Project ID:** P07 – AI Document Assistant  
> **Author:** K DEEKSHA  

---

## 1. Project Title
**DocuMind AI (P07)** – A full-stack document intelligence and retrieval web application that enables users to upload PDF documents, extract text page-by-page, perform TF-IDF keyword search, and ask questions through an interactive conversational chat interface with verifiable page citations.

---

## 2. Project Overview
**DocuMind AI** is designed to eliminate tedious manual reading across multi-page PDF documents. Users can upload standard PDF files, which the system validates, parses, and indexes page-by-page. Using Scikit-Learn TF-IDF vectorization and cosine similarity, the application retrieves relevant text passages and synthesizes direct answers to natural language questions with source document names and page numbers.

If a query does not match any content in the uploaded documents, the application returns a clear, standard message:
> *"No relevant information found in the uploaded documents."*

The application runs entirely locally with zero external paid APIs, cloud dependencies, or subscription keys.

---

## 3. Key Features

- **Executive SaaS Dashboard**
  - Live metric counters in a responsive 4-card grid: Total Documents, Pages Extracted, Words Processed, and Queries Run.
  - Compact full-width horizontal welcome banner with quick-action buttons.
  - Balanced two-column lower layout (65% Recent Documents table and 35% Live Query Activity feed with color-coded status pills).
  - One-click sample document importer (`AI_and_Machine_Learning_Handbook.pdf` and `Thasmai_Company_Policy_2026.pdf`) for instant evaluation.

- **Conversational AI Chat Interface (Ask AI)**
  - Interactive chat stream with distinct user message bubbles and assistant response bubbles.
  - Two-tier retrieval ranking (page-level filter followed by sentence-level scoring).
  - Synthesizes direct extractive answers citing Document Name and exact Page Number.
  - Expandable evidence snippets with keyword matching tags.
  - Scope selector dropdown (`All Documents` vs specific PDF) and clear chat history action.
  - Fallback protection: Displays *"No relevant information found in the uploaded documents."* when similarity falls below the confidence threshold.

- **PDF Document Upload & Validation**
  - Drag-and-drop file upload zone with active hover states.
  - Accepts standard PDF documents up to 25 MB.
  - Validates file extensions (`.pdf`) and binary magic byte headers (`%PDF-`).
  - Filename sanitization using `secure_filename()` with unique UUID prefixes to prevent directory traversal.
  - Safe, non-executable local file storage.

- **Page-by-Page Text Extraction**
  - High-performance text parsing using **PyMuPDF (`fitz`)**.
  - Normalizes text spacing while preserving line and page boundaries.
  - Automatically records word counts and character counts per page.

- **TF-IDF Keyword & Content Search**
  - Sublinear Term Frequency (TF) and Inverse Document Frequency (IDF) vectorization using Scikit-Learn.
  - Cosine similarity ranking across page segments.
  - Snippet generation with highlighted matching terms and relevance percentages.
  - Scope filter and Top-K matches selector (5, 10, 20).

- **Document Management Repository**
  - Real-time search filter by document title.
  - View all indexed documents with page count, file size, word count, and upload date.
  - Page-by-page document reader modal to inspect extracted raw text.
  - Cascade deletion: Removes database records, extracted page text, and the physical PDF file.

- **Dark Navy Sidebar & Navigation**
  - Categorized navigation sections: `MAIN`, `DOCUMENTS`, `INTELLIGENCE`, and `INFORMATION`.
  - Active blue glow pill indicators, live document count badge, and mobile drawer support.

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | `18.3.1` | Modular Single Page Application (SPA) |
| **Build Tool** | Vite | `6.x` | Fast development server & optimized production build |
| **UI Framework** | Bootstrap | `5.3.3` | Clean layout, responsive grid, and modern typography |
| **Icons** | Bootstrap Icons | `1.11.3` | Contextual icons throughout the interface |
| **Backend** | Python Flask | `3.1.3` | REST API framework with modular Blueprints |
| **CORS** | Flask-CORS | `6.0.5` | Cross-Origin Resource Sharing handling |
| **Database** | SQLite3 | Native | Embedded ACID relational persistence |
| **PDF Extraction** | PyMuPDF (`fitz`) | `2.1.0` | C-level fast PDF text and layout parsing |
| **Search & Retrieval**| Scikit-Learn | `1.8.0` | TF-IDF Vectorizer and Cosine Similarity calculation |
| **Numerical Processing**| NumPy / SciPy | `2.4.5` / `1.17.1` | Efficient array operations and matrix math |

---

## 5. System Architecture

The application uses a decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                     │
│      Dashboard | Upload | My Docs | Ask AI | Search         │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API Calls (JSON / FormData)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Python Flask REST API Server                │
│                     (http://127.0.0.1:5000)                 │
└──────────────┬───────────────┬───────────────┬──────────────┘
               │               │               │
               ▼               ▼               ▼
      ┌────────────────┐┌──────────────┐┌──────────────┐
      │  PDF Service   ││TF-IDF Search ││  SQLite DB   │
      │   (PyMuPDF)    ││   & QA Svc   ││ (Persistent) │
      └────────────────┘└──────────────┘└──────────────┘
```

1. **Frontend**: React components manage application state and communicate asynchronously with the backend using the native `fetch` API (`frontend/src/services/api.js`).
2. **Backend**: Flask organizes routes into modular blueprints (`documents`, `search`, `qa`, `dashboard`). Business logic is encapsulated in dedicated service modules.
3. **Database**: SQLite stores metadata and extracted text across relational tables with foreign keys and cascade delete support.

---

## 6. Project Folder Structure

```
ai-document-assistant/
│
├── .gitignore                         # Excludes node_modules, dist, __pycache__, DB files
├── README.md                          # Project documentation and setup guide
│
├── backend/
│   ├── app.py                         # Flask application factory, CORS and route registration
│   ├── requirements.txt               # Backend Python package requirements
│   ├── test_backend.py                # Automated backend test suite
│   ├── create_samples.py              # Script to generate sample demo PDFs
│   │
│   ├── database/
│   │   ├── db.py                      # Database connection and table initialization
│   │   └── schema.sql                 # SQLite schema definitions
│   │
│   ├── routes/
│   │   ├── dashboard_routes.py        # Analytics and statistics endpoints
│   │   ├── document_routes.py         # Upload, list, inspect, delete, import samples
│   │   ├── qa_routes.py               # Question answering & query history endpoints
│   │   └── search_routes.py           # TF-IDF keyword search endpoints
│   │
│   ├── services/
│   │   ├── pdf_service.py             # PyMuPDF text extraction and validation
│   │   ├── qa_service.py              # Sentence scoring, synthesis & fallback handler
│   │   └── search_service.py          # TF-IDF vectorizer and cosine similarity ranking
│   │
│   ├── sample_docs/                   # Bundled sample demonstration PDFs
│   │   ├── AI_and_Machine_Learning_Handbook.pdf
│   │   └── Thasmai_Company_Policy_2026.pdf
│   │
│   └── uploads/                       # Physical storage folder for uploaded PDFs
│       └── .gitkeep
│
└── frontend/
    ├── index.html                     # HTML entry point with Bootstrap CDN
    ├── package.json                   # Frontend npm dependencies and scripts
    ├── package-lock.json
    ├── vite.config.js                 # Vite development proxy configuration
    │
    └── src/
        ├── App.jsx                    # Root state coordinator
        ├── App.css                    # SaaS design system and component styles
        ├── index.css                  # Global variables and typography
        ├── main.jsx                   # React DOM render entry point
        │
        ├── components/
        │   ├── DocumentModal.jsx      # Page-by-page document text reader modal
        │   ├── Navbar.jsx             # Top bar with backend connectivity status
        │   ├── Notification.jsx       # Toast alert component
        │   ├── Sidebar.jsx            # Categorized navigation sidebar with badge counts
        │   ├── SnippetCard.jsx        # Search result card with highlighted keywords
        │   └── StatCard.jsx           # Dashboard metric card
        │
        ├── pages/
        │   ├── AboutProject.jsx       # Project specifications and details
        │   ├── AskAI.jsx              # Conversational chat interface with citations
        │   ├── Dashboard.jsx          # Metric cards, quick actions, recent logs
        │   ├── MyDocuments.jsx        # Document repository table with filters
        │   ├── SearchDocuments.jsx    # TF-IDF keyword search page
        │   └── UploadDocuments.jsx    # Drag-and-drop upload zone with validation
        │
        └── services/
            └── api.js                 # Centralized REST API client
```

---

## 7. Installation and Setup

### Prerequisites
- **Python**: Version `3.10` or higher (tested on Python 3.13)
- **Node.js**: Version `18` or higher (tested on Node.js v24)
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deeksha023/ai-document-assistant.git
   cd ai-document-assistant
   ```

2. **Set up the Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 8. How to Run the Project

For local development, run the backend and frontend in separate terminals.

### Terminal 1 – Run Backend (Flask):
```bash
cd backend
python app.py
```
- Server starts at: **`http://127.0.0.1:5000`**
- Health check: **`http://127.0.0.1:5000/api/health`**

### Terminal 2 – Run Frontend (React Vite):
```bash
cd frontend
npm run dev
```
- Web application opens at: **`http://localhost:3000`**

*(Note: In development, Vite automatically proxies API requests from `http://localhost:3000/api` to `http://127.0.0.1:5000/api`.)*

---

## 9. Application Screenshots

| Page | Description | Screenshot Preview |
| :--- | :--- | :---: |
| **Executive Dashboard** | 4-Card statistics grid, welcome banner, recent documents, and query feed. | ![Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=Dashboard+View) |
| **Upload Documents** | Drag-and-drop PDF uploader with file validation and progress indicator. | ![Upload Screenshot](https://via.placeholder.com/800x450.png?text=Upload+Documents+View) |
| **Document Reader Modal** | Granular page-by-page text inspection and word counts. | ![Document Modal Screenshot](https://via.placeholder.com/800x450.png?text=Document+Inspector+Modal) |
| **TF-IDF Search** | Keyword and phrase search with matched token highlighting. | ![Search Screenshot](https://via.placeholder.com/800x450.png?text=TF-IDF+Search+Results) |
| **Ask AI Chat** | Conversational chat interface with confidence score and page citations. | ![Ask AI Screenshot](https://via.placeholder.com/800x450.png?text=Ask+AI+Question+Answering) |

*(Note: Replace placeholder image links with actual screenshots of your running instance as needed.)*

---

## 10. API Documentation

| Method | Endpoint | Description | Request Body / Params |
| :---: | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and server status | None |
| `GET` | `/api/dashboard/stats` | Aggregated statistics & recent activity | None |
| `POST` | `/api/documents/upload` | Upload and index a new PDF | `multipart/form-data` (`file`) |
| `POST` | `/api/documents/import-samples` | Ingest bundled sample demonstration PDFs | None |
| `GET` | `/api/documents` | Retrieve all indexed documents | None |
| `GET` | `/api/documents/<id>` | Retrieve full document details and page texts | None |
| `DELETE`| `/api/documents/<id>` | Delete document, page texts, and physical file | None |
| `POST` | `/api/search` | Execute TF-IDF search across documents | `{"query": str, "document_id": int, "top_k": int}` |
| `POST` | `/api/qa/ask` | Ask a question and receive synthesized answer | `{"question": str, "document_id": int}` |
| `GET` | `/api/qa/history` | Retrieve recent query logs | None |

---

## 11. Database Structure

The project uses an embedded **SQLite** database (`backend/database/ai_doc_assistant.db`) initialized automatically from `schema.sql`.

### Tables:

1. **`documents`**
   - `id`: Integer primary key (auto-increment).
   - `filename`: Unique sanitized filename on disk.
   - `original_name`: User's original uploaded filename.
   - `file_path`: Storage path of the PDF.
   - `file_size`: Size of the file in bytes.
   - `total_pages`: Total pages extracted.
   - `uploaded_at`: Upload timestamp (`CURRENT_TIMESTAMP`).
   - `status`: Processing state (`processed`, `error`).

2. **`document_pages`**
   - `id`: Integer primary key (auto-increment).
   - `document_id`: Foreign key referencing `documents(id)` with `ON DELETE CASCADE`.
   - `page_number`: 1-indexed page number.
   - `page_text`: Extracted and cleaned page text.
   - `word_count`: Total word count on this page.
   - `char_count`: Total character count on this page.

3. **`query_history`**
   - `id`: Integer primary key (auto-increment).
   - `query_type`: Type of query (`'search'` or `'qa'`).
   - `query_text`: User question or search keywords.
   - `result_count`: Number of matching passages found.
   - `top_document`: Name of best-matching document.
   - `top_page`: Page number of best match.
   - `confidence_score`: Relevance score percentage.
   - `created_at`: Query execution timestamp.

---

## 12. Testing

An automated integration test script is included to verify the backend pipeline end-to-end.

To run the test suite:
```bash
cd backend
python test_backend.py
```

### What the test suite verifies:
1. Health check endpoint responsiveness (`GET /api/health`).
2. Programmatic generation and upload of a multi-page PDF (`POST /api/documents/upload`).
3. Correct page extraction count via PyMuPDF.
4. Document listing and metadata retrieval (`GET /api/documents`).
5. TF-IDF search accuracy with token matching (`POST /api/search`).
6. Relevant Question Answering with page citations (`POST /api/qa/ask`).
7. **Irrelevant Question Fallback Verification**: Confirms that non-matching questions strictly return *"No relevant information found in the uploaded documents."*
8. Document deletion and cleanup verification (`DELETE /api/documents/<id>`).

---

## 13. Known Limitations

1. **Scanned / Image-Only PDFs**: Text extraction relies on PyMuPDF reading digital text streams. Scanned PDFs containing only raster images without an embedded OCR layer will not yield searchable text.
2. **Complex Table Geometry**: Multi-column tables are extracted as plain text streams rather than fully reconstructed two-dimensional relational tables.

---

## 14. Future Enhancements

1. **Optical Character Recognition (OCR) Integration**: Add a local OCR pipeline (such as Tesseract OCR) to automatically detect and extract text from scanned image PDFs.
2. **Dense Semantic Embeddings & Hybrid RAG**: Augment lexical TF-IDF search with lightweight local embeddings (e.g., `all-MiniLM-L6-v2`) and a vector store for hybrid lexical-semantic retrieval.

---

## 15. Project Demonstration

Follow these steps for a 2-minute demonstration:

1. **Start both servers** and open `http://localhost:3000`. Confirm the green **"Flask Backend Connected"** badge appears in the top navigation bar.
2. **Import Sample Documents**: Click **"Load Sample Documents"** on the Dashboard. This immediately imports two bundled PDFs:
   - `AI_and_Machine_Learning_Handbook.pdf`
   - `Thasmai_Company_Policy_2026.pdf`
3. **Inspect Document Text**: Navigate to **My Documents** and click **"View Text"** on a document to open the page-by-page reader modal.
4. **Run a Search Query**: Navigate to **Search Documents**, enter `"transformers attention mechanism"`, and review the ranked snippets with highlighted matching words and page badges.
5. **Ask a Valid Question**: Navigate to **Ask AI** and query:
   - *"What are the standard working hours at Thasmai?"*  
   - Observe the conversational assistant bubble citing **Page 1** of `Thasmai_Company_Policy_2026.pdf`.
6. **Verify Fallback Behavior**: In **Ask AI**, ask an unrelated query:
   - *"What is the recipe for chocolate cake?"*  
   - Observe the required fallback card:  
     **"No relevant information found in the uploaded documents."**

---

## 16. Author Information

- **Author:** K DEEKSHA  
- **GitHub:** [@Deeksha023](https://github.com/Deeksha023)  
- **Project:** THASMAI INFOTECH Internship Technical Talent Assessment (P07 – AI Document Assistant)
