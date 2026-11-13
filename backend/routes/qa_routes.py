from flask import Blueprint, request, jsonify
from services.qa_service import answer_question, FALLBACK_MESSAGE
from database.db import get_db_connection

qa_bp = Blueprint("qa", __name__, url_prefix="/api/qa")

@qa_bp.route("/ask", methods=["POST"])
def ask_question():
    """
    Submits a question to the QA engine.
    Body JSON:
        - question (str, required)
        - document_id (int, optional)
    """
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "success": False,
            "error": "Question cannot be empty."
        }), 400

    document_id = data.get("document_id")
    if document_id is not None:
        try:
            document_id = int(document_id)
        except ValueError:
            document_id = None

    qa_result = answer_question(question=question, document_id=document_id)

    return jsonify({
        "success": True,
        "data": qa_result
    }), 200

@qa_bp.route("/history", methods=["GET"])
def get_query_history():
    """
    Returns the recent search and question history.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, query_type, query_text, result_count, top_document, top_page,
               confidence_score, created_at
        FROM query_history
        ORDER BY created_at DESC
        LIMIT 25
    """)
    rows = cursor.fetchall()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "query_type": r["query_type"],
            "query_text": r["query_text"],
            "result_count": r["result_count"],
            "top_document": r["top_document"],
            "top_page": r["top_page"],
            "confidence_score": r["confidence_score"],
            "created_at": r["created_at"]
        })

    return jsonify({
        "success": True,
        "count": len(history),
        "history": history
    }), 200

