from flask import Blueprint, request, jsonify
from services.search_service import search_documents

search_bp = Blueprint("search", __name__, url_prefix="/api/search")

@search_bp.route("", methods=["POST"])
def perform_search():
    """
    Executes a TF-IDF text search across uploaded document pages.
    Body JSON:
        - query (str, required)
        - document_id (int, optional)
        - top_k (int, optional, default: 10)
    """
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({
            "success": False,
            "error": "Search query cannot be empty."
        }), 400

    document_id = data.get("document_id")
    if document_id is not None:
        try:
            document_id = int(document_id)
        except ValueError:
            document_id = None

    top_k = data.get("top_k", 10)
    try:
        top_k = max(1, min(int(top_k), 50))
    except ValueError:
        top_k = 10

    results = search_documents(query=query, document_id=document_id, top_k=top_k)

    return jsonify({
        "success": True,
        "data": results
    }), 200

