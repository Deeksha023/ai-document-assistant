import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database.db import get_db_connection
from services.pdf_service import (
    is_allowed_file,
    validate_pdf_content,
    extract_pdf_data,
    PDFProcessingError,
    MAX_FILE_SIZE_BYTES
)

document_bp = Blueprint("documents", __name__, url_prefix="/api/documents")

def format_file_size(size_bytes: int) -> str:
    """Formats file size into human-readable string (KB/MB)."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

@document_bp.route("/upload", methods=["POST"])
def upload_document():
    """
    Handles PDF document upload, validation, text extraction, and storage in SQLite.
    """
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part in the request."}), 400

    file = request.files["file"]

    if not file or file.filename == "":
        return jsonify({"success": False, "error": "No file selected for upload."}), 400

    original_name = file.filename
    if not is_allowed_file(original_name):
        return jsonify({
            "success": False,
            "error": "Invalid file type. Only PDF documents (.pdf) are allowed."
        }), 400

    # Ensure upload directory exists
    uploads_dir = current_app.config.get("UPLOAD_FOLDER")
    os.makedirs(uploads_dir, exist_ok=True)

    # Generate unique safe filename
    base_name = secure_filename(original_name)
    unique_suffix = uuid.uuid4().hex[:8]
    saved_filename = f"{unique_suffix}_{base_name}"
    file_path = os.path.join(uploads_dir, saved_filename)

    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to save file: {str(e)}"}), 500

    # Validate file size
    file_size = os.path.getsize(file_path)
    if file_size > MAX_FILE_SIZE_BYTES:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({
            "success": False,
            "error": f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
        }), 400

    # Extract text from PDF
    try:
        extraction_result = extract_pdf_data(file_path)
    except PDFProcessingError as ppe:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"success": False, "error": str(ppe)}), 422
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"success": False, "error": f"Unexpected error during PDF extraction: {str(e)}"}), 500

    # Save to SQLite in a transaction
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO documents (filename, original_name, file_path, file_size, total_pages, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            saved_filename,
            original_name,
            file_path,
            file_size,
            extraction_result["total_pages"],
            "processed"
        ))
        document_id = cursor.lastrowid

        # Insert extracted pages
        for page in extraction_result["pages"]:
            cursor.execute("""
                INSERT INTO document_pages (document_id, page_number, page_text, word_count, char_count)
                VALUES (?, ?, ?, ?, ?)
            """, (
                document_id,
                page["page_number"],
                page["text"],
                page["word_count"],
                page["char_count"]
            ))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"success": False, "error": f"Database insertion failed: {str(e)}"}), 500

    conn.close()

    return jsonify({
        "success": True,
        "message": f"Successfully processed and indexed '{original_name}'.",
        "document": {
            "id": document_id,
            "filename": saved_filename,
            "original_name": original_name,
            "file_size": file_size,
            "formatted_size": format_file_size(file_size),
            "total_pages": extraction_result["total_pages"],
            "has_text": extraction_result["has_text"],
            "total_characters": extraction_result["total_characters"]
        }
    }), 201

@document_bp.route("/import-samples", methods=["POST"])
def import_sample_documents():
    """
    Imports the bundled sample PDF documents for instant testing and demonstration.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    samples_dir = os.path.join(base_dir, "sample_docs")
    uploads_dir = current_app.config.get("UPLOAD_FOLDER")
    os.makedirs(uploads_dir, exist_ok=True)

    if not os.path.exists(samples_dir):
        return jsonify({"success": False, "error": "Sample documents directory not found."}), 404

    sample_files = [f for f in os.listdir(samples_dir) if f.lower().endswith(".pdf")]
    if not sample_files:
        return jsonify({"success": False, "error": "No sample PDF documents found."}), 404

    imported_docs = []
    conn = get_db_connection()

    for filename in sample_files:
        src_path = os.path.join(samples_dir, filename)
        file_size = os.path.getsize(src_path)

        # Check if already imported by original_name
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM documents WHERE original_name = ?", (filename,))
        existing = cursor.fetchone()
        if existing:
            continue

        unique_suffix = uuid.uuid4().hex[:8]
        saved_filename = f"{unique_suffix}_{secure_filename(filename)}"
        dest_path = os.path.join(uploads_dir, saved_filename)

        with open(src_path, "rb") as sf, open(dest_path, "wb") as df:
            df.write(sf.read())

        try:
            extraction = extract_pdf_data(dest_path)
            cursor.execute("""
                INSERT INTO documents (filename, original_name, file_path, file_size, total_pages, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                saved_filename,
                filename,
                dest_path,
                file_size,
                extraction["total_pages"],
                "processed"
            ))
            doc_id = cursor.lastrowid

            for p in extraction["pages"]:
                cursor.execute("""
                    INSERT INTO document_pages (document_id, page_number, page_text, word_count, char_count)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    doc_id,
                    p["page_number"],
                    p["text"],
                    p["word_count"],
                    p["char_count"]
                ))

            imported_docs.append({
                "id": doc_id,
                "original_name": filename,
                "total_pages": extraction["total_pages"]
            })
        except Exception as e:
            if os.path.exists(dest_path):
                os.remove(dest_path)
            continue

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Successfully imported {len(imported_docs)} sample document(s).",
        "imported": imported_docs
    }), 200

@document_bp.route("", methods=["GET"])
def get_documents():
    """
    Returns a list of all uploaded documents and their metadata.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT d.id, d.filename, d.original_name, d.file_size, d.total_pages,
               d.uploaded_at, d.status,
               COALESCE(SUM(p.word_count), 0) as total_words
        FROM documents d
        LEFT JOIN document_pages p ON d.id = p.document_id
        GROUP BY d.id
        ORDER BY d.uploaded_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    documents = []
    for r in rows:
        documents.append({
            "id": r["id"],
            "filename": r["filename"],
            "original_name": r["original_name"],
            "file_size": r["file_size"],
            "formatted_size": format_file_size(r["file_size"]),
            "total_pages": r["total_pages"],
            "uploaded_at": r["uploaded_at"],
            "status": r["status"],
            "total_words": r["total_words"]
        })

    return jsonify({"success": True, "count": len(documents), "documents": documents}), 200

@document_bp.route("/<int:doc_id>", methods=["GET"])
def get_document_details(doc_id: int):
    """
    Returns detailed metadata and page-by-page text for a single document.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
    doc = cursor.fetchone()

    if not doc:
        conn.close()
        return jsonify({"success": False, "error": "Document not found."}), 404

    cursor.execute("""
        SELECT id, page_number, page_text, word_count, char_count
        FROM document_pages
        WHERE document_id = ?
        ORDER BY page_number ASC
    """, (doc_id,))
    pages = cursor.fetchall()
    conn.close()

    pages_list = []
    for p in pages:
        pages_list.append({
            "id": p["id"],
            "page_number": p["page_number"],
            "page_text": p["page_text"],
            "word_count": p["word_count"],
            "char_count": p["char_count"]
        })

    return jsonify({
        "success": True,
        "document": {
            "id": doc["id"],
            "filename": doc["filename"],
            "original_name": doc["original_name"],
            "file_size": doc["file_size"],
            "formatted_size": format_file_size(doc["file_size"]),
            "total_pages": doc["total_pages"],
            "uploaded_at": doc["uploaded_at"],
            "status": doc["status"],
            "pages": pages_list
        }
    }), 200

@document_bp.route("/<int:doc_id>", methods=["DELETE"])
def delete_document(doc_id: int):
    """
    Deletes a document from the database and removes the physical file from disk.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
    doc = cursor.fetchone()

    if not doc:
        conn.close()
        return jsonify({"success": False, "error": "Document not found."}), 404

    file_path = doc["file_path"]
    original_name = doc["original_name"]

    try:
        cursor.execute("DELETE FROM document_pages WHERE document_id = ?", (doc_id,))
        cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "error": f"Failed to delete document from database: {str(e)}"}), 500

    conn.close()

    # Safely remove file from uploads folder
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    return jsonify({
        "success": True,
        "message": f"Document '{original_name}' and its indexed pages were successfully deleted."
    }), 200
