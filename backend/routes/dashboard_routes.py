from flask import Blueprint, jsonify
from database.db import get_db_connection

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

def format_file_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

@dashboard_bp.route("/stats", methods=["GET"])
def get_dashboard_stats():
    """
    Returns high-level analytics for the dashboard:
      - total documents
      - total pages processed
      - total queries answered
      - total words indexed
      - recent documents
      - recent queries
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*) as doc_count,
               COALESCE(SUM(total_pages), 0) as total_pages,
               COALESCE(SUM(file_size), 0) as total_bytes
        FROM documents
    """)
    doc_stats = cursor.fetchone()

    cursor.execute("SELECT COALESCE(SUM(word_count), 0) as total_words FROM document_pages")
    word_stats = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as query_count FROM query_history")
    query_stats = cursor.fetchone()

    cursor.execute("""
        SELECT id, original_name, file_size, total_pages, uploaded_at
        FROM documents
        ORDER BY uploaded_at DESC
        LIMIT 5
    """)
    recent_docs = cursor.fetchall()

    cursor.execute("""
        SELECT id, query_type, query_text, result_count, top_document, top_page,
               confidence_score, created_at
        FROM query_history
        ORDER BY created_at DESC
        LIMIT 6
    """)
    recent_queries = cursor.fetchall()

    conn.close()

    total_bytes = doc_stats["total_bytes"] if doc_stats else 0

    return jsonify({
        "success": True,
        "stats": {
            "total_documents": doc_stats["doc_count"] if doc_stats else 0,
            "total_pages": doc_stats["total_pages"] if doc_stats else 0,
            "total_words": word_stats["total_words"] if word_stats else 0,
            "total_queries": query_stats["query_count"] if query_stats else 0,
            "total_storage_bytes": total_bytes,
            "total_storage_formatted": format_file_size(total_bytes)
        },
        "recent_documents": [
            {
                "id": r["id"],
                "original_name": r["original_name"],
                "file_size": r["file_size"],
                "formatted_size": format_file_size(r["file_size"]),
                "total_pages": r["total_pages"],
                "uploaded_at": r["uploaded_at"]
            }
            for r in recent_docs
        ],
        "recent_queries": [
            {
                "id": q["id"],
                "query_type": q["query_type"],
                "query_text": q["query_text"],
                "result_count": q["result_count"],
                "top_document": q["top_document"],
                "top_page": q["top_page"],
                "confidence_score": q["confidence_score"],
                "created_at": q["created_at"]
            }
            for q in recent_queries
        ]
    }), 200

