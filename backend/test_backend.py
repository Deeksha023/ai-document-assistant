"""
End-to-end Backend Test Suite for AI Document Assistant
"""
import io
import json
import pymupdf
from app import app
from database.db import get_db_connection

def create_sample_pdf_bytes():
    """Generates an in-memory sample 2-page PDF about AI for automated testing."""
    doc = pymupdf.open()

    # Page 1
    p1 = doc.new_page()
    p1_text = (
        "Artificial Intelligence and Machine Learning Overview\n\n"
        "Machine Learning is a subset of artificial intelligence that focuses on building applications "
        "that learn from data and improve their accuracy over time without being explicitly programmed. "
        "Supervised learning algorithms use labeled datasets to train algorithms to classify data or predict outcomes accurately. "
        "Common supervised learning algorithms include linear regression, decision trees, and support vector machines. "
        "Unsupervised learning analyzes and clusters unlabeled datasets to discover hidden patterns."
    )
    p1.insert_text((50, 72), p1_text, fontsize=12)

    # Page 2
    p2 = doc.new_page()
    p2_text = (
        "Deep Learning and Natural Language Processing\n\n"
        "Deep learning is a specialized branch of machine learning based on artificial neural networks with representation learning. "
        "Transformers are deep learning architectures introduced in 2017 that utilize self-attention mechanisms to process sequential data. "
        "Large language models rely heavily on transformer architectures for text understanding, summarization, and generation. "
        "TF-IDF or Term Frequency-Inverse Document Frequency is a traditional numerical statistic intended to reflect how important a word is to a document."
    )
    p2.insert_text((50, 72), p2_text, fontsize=12)

    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def run_tests():
    print("==================================================")
    print("RUNNING BACKEND TEST SUITE: AI DOCUMENT ASSISTANT")
    print("==================================================")

    client = app.test_client()

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. Health check passed.")

    # 2. Upload sample PDF
    pdf_bytes = create_sample_pdf_bytes()
    data = {
        "file": (io.BytesIO(pdf_bytes), "sample_ai_overview.pdf")
    }
    res = client.post("/api/documents/upload", data=data, content_type="multipart/form-data")
    assert res.status_code == 201, f"Upload failed: {res.status_code} - {res.get_json()}"
    upload_json = res.get_json()
    doc_id = upload_json["document"]["id"]
    print(f"[PASS] 2. Upload passed. Doc ID: {doc_id}, Pages: {upload_json['document']['total_pages']}")
    assert upload_json["document"]["total_pages"] == 2

    # 3. Retrieve list of documents
    res = client.get("/api/documents")
    assert res.status_code == 200
    docs_json = res.get_json()
    assert docs_json["count"] >= 1
    print(f"[PASS] 3. Document listing passed. Total docs: {docs_json['count']}")

    # 4. Search query
    search_payload = {"query": "supervised learning labeled datasets"}
    res = client.post("/api/search", json=search_payload)
    assert res.status_code == 200
    search_json = res.get_json()
    assert search_json["data"]["total_matches"] > 0
    top_result = search_json["data"]["results"][0]
    print(f"[PASS] 4. TF-IDF Search passed! Top match doc: '{top_result['document_name']}', Page: {top_result['page_number']}, Score: {top_result['similarity_score']}%")

    # 5. Question Answering: relevant question
    qa_payload = {"question": "What is supervised learning?"}
    res = client.post("/api/qa/ask", json=qa_payload)
    assert res.status_code == 200
    qa_json = res.get_json()["data"]
    assert qa_json["found"] is True
    print(f"[PASS] 5a. QA Answer: \"{qa_json['answer']}\"")
    print(f"      Confidence: {qa_json['confidence']}%, Sources: {len(qa_json['sources'])}")
    assert len(qa_json["sources"]) > 0

    # 6. Question Answering: irrelevant question (fallback requirement)
    irrelevant_qa = {"question": "What is the recipe for a chocolate cake with strawberry frosting?"}
    res = client.post("/api/qa/ask", json=irrelevant_qa)
    assert res.status_code == 200
    irr_json = res.get_json()["data"]
    print(f"[PASS] 5b. Irrelevant QA test passed. Returned message: \"{irr_json['answer']}\"")
    assert irr_json["answer"] == "No relevant information found in the uploaded documents."
    assert irr_json["found"] is False

    # 7. Dashboard stats
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    stats = res.get_json()["stats"]
    print(f"[PASS] 6. Dashboard stats: {stats['total_documents']} docs, {stats['total_pages']} pages, {stats['total_queries']} queries logged.")
    assert stats["total_documents"] >= 1

    # 8. Clean up / Delete document
    res = client.delete(f"/api/documents/{doc_id}")
    assert res.status_code == 200
    print(f"[PASS] 7. Delete document passed.")

    # Verify deletion
    res = client.get(f"/api/documents/{doc_id}")
    assert res.status_code == 404
    print("[PASS] 8. Verified document no longer exists.")

    print("\nALL 8 BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()

