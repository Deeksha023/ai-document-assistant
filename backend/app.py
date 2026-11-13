import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from database.db import init_db
from routes.document_routes import document_bp
from routes.search_routes import search_bp
from routes.qa_routes import qa_bp
from routes.dashboard_routes import dashboard_bp

def create_app():
    """Application factory for AI Document Assistant backend."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(os.path.dirname(base_dir), "frontend", "dist")

    # If frontend has been built, configure Flask to serve static files
    if os.path.exists(dist_dir):
        app = Flask(__name__, static_folder=dist_dir, static_url_path="")
    else:
        app = Flask(__name__)

    uploads_dir = os.path.join(base_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    app.config["UPLOAD_FOLDER"] = uploads_dir
    app.config["MAX_CONTENT_LENGTH"] = 30 * 1024 * 1024  # 30 MB max request payload

    # Enable CORS for frontend cross-origin requests
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize SQLite schema
    with app.app_context():
        init_db()

    # Register API Blueprints
    app.register_blueprint(document_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(qa_bp)
    app.register_blueprint(dashboard_bp)

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "AI Document Assistant Backend",
            "version": "1.0.0"
        }), 200

    # Serve built React frontend if dist exists
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
        elif os.path.exists(os.path.join(dist_dir, "index.html")):
            return send_from_directory(dist_dir, "index.html")
        else:
            return jsonify({
                "message": "AI Document Assistant API is running. Frontend dev server is available at http://localhost:3000."
            })

    # Global error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        # If API route, return JSON
        from flask import request
        if request.path.startswith("/api/"):
            return jsonify({"success": False, "error": "API endpoint not found."}), 404
        # Otherwise fallback to index.html for SPA routing
        if os.path.exists(os.path.join(dist_dir, "index.html")):
            return send_from_directory(dist_dir, "index.html")
        return jsonify({"success": False, "error": "Endpoint not found."}), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({"success": False, "error": "File size exceeds maximum upload limit of 25 MB."}), 413

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "error": "An internal server error occurred."}), 500

    return app

app = create_app()

if __name__ == "__main__":
    print("Starting AI Document Assistant Backend on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
