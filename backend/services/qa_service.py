import re
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database.db import get_db_connection

FALLBACK_MESSAGE = "No relevant information found in the uploaded documents."

def clean_sentence(s: str) -> str:
    """Normalizes sentence spacing and punctuation."""
    s = re.sub(r"\s+", " ", s).strip()
    return s

def split_into_sentences(text: str) -> List[str]:
    """Splits text into meaningful sentences while avoiding spurious splits on abbreviations."""
    if not text:
        return []
    # Replace single line breaks with spaces so multi-line sentences stay intact
    normalized_text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    # Match sentences ending with . ! ? followed by space or double line breaks
    raw_sentences = re.split(r"(?<=[.!?])\s+|\n{2,}", normalized_text)
    sentences = []
    for s in raw_sentences:
        s = clean_sentence(s)
        # Keep sentences with at least 3 words
        if len(s.split()) >= 3:
            sentences.append(s)
    return sentences

def answer_question(question: str, document_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Answers a question based on uploaded PDF documents using TF-IDF retrieval and extractive synthesis.

    Returns:
        dict:
            question (str)
            found (bool)
            answer (str)
            confidence (float)
            sources (list of dicts with document_name, page_number, snippet, similarity)
    """
    question = (question or "").strip()
    if not question:
        return {
            "question": "",
            "found": False,
            "answer": FALLBACK_MESSAGE,
            "confidence": 0.0,
            "sources": []
        }

    conn = get_db_connection()
    cursor = conn.cursor()

    if document_id:
        cursor.execute("""
            SELECT p.id, p.document_id, p.page_number, p.page_text, d.original_name as document_name
            FROM document_pages p
            JOIN documents d ON p.document_id = d.id
            WHERE p.document_id = ?
            ORDER BY p.page_number ASC
        """, (document_id,))
    else:
        cursor.execute("""
            SELECT p.id, p.document_id, p.page_number, p.page_text, d.original_name as document_name
            FROM document_pages p
            JOIN documents d ON p.document_id = d.id
            ORDER BY d.id ASC, p.page_number ASC
        """)

    pages = cursor.fetchall()
    conn.close()

    if not pages:
        return {
            "question": question,
            "found": False,
            "answer": FALLBACK_MESSAGE,
            "confidence": 0.0,
            "sources": []
        }

    # Extract keywords from question
    q_words = [w.lower() for w in re.findall(r"\b[a-zA-Z0-9]{2,}\b", question)]
    # Stop words to discount in manual scoring
    common_stops = {
        "what", "when", "where", "which", "who", "whom", "whose", "why", "how",
        "is", "are", "was", "were", "do", "does", "did", "can", "could", "should",
        "would", "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with"
    }
    content_words = [w for w in q_words if w not in common_stops]
    if not content_words:
        content_words = q_words

    # Collect all sentences from all pages with metadata
    sentence_records = []
    for page in pages:
        p_text = page["page_text"] or ""
        sents = split_into_sentences(p_text)
        for s in sents:
            sentence_records.append({
                "sentence": s,
                "document_id": page["document_id"],
                "document_name": page["document_name"],
                "page_number": page["page_number"]
            })

    if not sentence_records:
        return {
            "question": question,
            "found": False,
            "answer": FALLBACK_MESSAGE,
            "confidence": 0.0,
            "sources": []
        }

    sentence_texts = [r["sentence"] for r in sentence_records]

    # Compute TF-IDF similarities
    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True,
            norm="l2"
        )
        matrix = vectorizer.fit_transform(sentence_texts)
        q_vec = vectorizer.transform([question])
        similarities = cosine_similarity(q_vec, matrix).flatten()
    except Exception:
        # Fallback if vocabulary issues occur
        vectorizer = TfidfVectorizer(ngram_range=(1, 1), stop_words=None)
        try:
            matrix = vectorizer.fit_transform(sentence_texts)
            q_vec = vectorizer.transform([question])
            similarities = cosine_similarity(q_vec, matrix).flatten()
        except Exception:
            similarities = np.zeros(len(sentence_texts))

    # Score each sentence using a hybrid score (TF-IDF similarity + exact keyword density)
    scored_candidates = []
    for i, rec in enumerate(sentence_records):
        tfidf_score = float(similarities[i])
        s_lower = rec["sentence"].lower()

        # Keyword match count
        matched_kw = [kw for kw in content_words if kw in s_lower]
        kw_density = len(matched_kw) / max(len(content_words), 1)

        # Combined hybrid score (0 to 1)
        hybrid_score = (tfidf_score * 0.70) + (kw_density * 0.30)

        if hybrid_score > 0.04 or len(matched_kw) >= 1:
            scored_candidates.append({
                "record": rec,
                "score": hybrid_score,
                "tfidf": tfidf_score,
                "matched_kw": matched_kw
            })

    scored_candidates.sort(key=lambda x: x["score"], reverse=True)

    # Threshold check: if no candidate passes minimal threshold
    if not scored_candidates or scored_candidates[0]["score"] < 0.05:
        # Log query to history
        _log_qa_query(question, 0, None, None, 0.0)
        return {
            "question": question,
            "found": False,
            "answer": FALLBACK_MESSAGE,
            "confidence": 0.0,
            "sources": []
        }

    # Select top unique sentences (avoid near-duplicates)
    chosen_sentences = []
    seen_texts = set()
    sources = []

    for item in scored_candidates:
        sent = item["record"]["sentence"]
        simplified = re.sub(r"[^a-zA-Z0-9]", "", sent.lower())
        if simplified in seen_texts:
            continue
        seen_texts.add(simplified)
        chosen_sentences.append(sent)

        # Group sources
        doc_name = item["record"]["document_name"]
        page_num = item["record"]["page_number"]
        score_pct = round(min(1.0, item["score"] * 1.5) * 100, 1)

        sources.append({
            "document_name": doc_name,
            "document_id": item["record"]["document_id"],
            "page_number": page_num,
            "snippet": sent,
            "relevance_score": score_pct,
            "matched_terms": item["matched_kw"]
        })

        if len(chosen_sentences) >= 3:
            break

    # Build synthesized answer
    top_score = scored_candidates[0]["score"]
    confidence = round(min(98.0, max(45.0, top_score * 120.0)), 1)

    # Combine sentences into a synthesized paragraph
    synthesized_answer = " ".join(chosen_sentences)

    # Deduplicate sources by doc and page
    unique_sources = []
    seen_doc_pages = set()
    for s in sources:
        key = (s["document_name"], s["page_number"])
        if key not in seen_doc_pages:
            seen_doc_pages.add(key)
            unique_sources.append(s)

    # Log query to history
    top_doc = unique_sources[0]["document_name"] if unique_sources else None
    top_page = unique_sources[0]["page_number"] if unique_sources else None
    _log_qa_query(question, len(unique_sources), top_doc, top_page, confidence)

    return {
        "question": question,
        "found": True,
        "answer": synthesized_answer,
        "confidence": confidence,
        "sources": unique_sources
    }

def _log_qa_query(question: str, count: int, top_doc: Optional[str], top_page: Optional[int], confidence: float):
    """Saves query execution to query_history table."""
    try:
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO query_history (query_type, query_text, result_count, top_document, top_page, confidence_score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("qa", question, count, top_doc, top_page, confidence))
        conn.commit()
        conn.close()
    except Exception:
        pass
