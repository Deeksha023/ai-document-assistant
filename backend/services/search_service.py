import re
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database.db import get_db_connection

def tokenize_query(query: str) -> List[str]:
    """Extracts alphanumeric words from query for keyword highlighting."""
    return [w.lower() for w in re.findall(r"\b\w{2,}\b", query)]

def extract_best_snippet(text: str, query_tokens: List[str], max_len: int = 240) -> str:
    """
    Finds the most relevant excerpt/snippet within a page text containing the query tokens.
    """
    if not text:
        return "No text available on this page."

    sentences = re.split(r"(?<=[.!?])\s+", text)
    if not sentences or len(sentences) == 1:
        # Fall back to sliding window or start of text
        if len(text) <= max_len:
            return text
        # Find first token occurrence
        lower_text = text.lower()
        first_idx = len(text)
        for token in query_tokens:
            pos = lower_text.find(token)
            if pos != -1 and pos < first_idx:
                first_idx = pos
        start = max(0, first_idx - 60)
        end = min(len(text), start + max_len)
        snippet = text[start:end].strip()
        prefix = "..." if start > 0 else ""
        suffix = "..." if end < len(text) else ""
        return f"{prefix}{snippet}{suffix}"

    # Score each sentence by matching token count
    best_score = -1
    best_idx = 0
    for idx, sentence in enumerate(sentences):
        lower_sent = sentence.lower()
        score = sum(1 for tok in query_tokens if tok in lower_sent)
        if score > best_score:
            best_score = score
            best_idx = idx

    # Assemble snippet around best sentence
    chosen = sentences[best_idx]
    if len(chosen) < max_len and best_idx + 1 < len(sentences):
        chosen += " " + sentences[best_idx + 1]
    if len(chosen) < max_len and best_idx - 1 >= 0:
        chosen = sentences[best_idx - 1] + " " + chosen

    if len(chosen) > max_len:
        chosen = chosen[:max_len] + "..."

    return chosen.strip()

def search_documents(query: str, document_id: Optional[int] = None, top_k: int = 10) -> Dict[str, Any]:
    """
    Executes TF-IDF text search across document pages in SQLite.

    Returns:
        dict:
            query (str)
            total_matches (int)
            results (list of matches with doc name, page, score, snippet)
    """
    query = (query or "").strip()
    if not query:
        return {"query": "", "total_matches": 0, "results": []}

    conn = get_db_connection()
    cursor = conn.cursor()

    if document_id:
        cursor.execute("""
            SELECT p.id as page_id, p.document_id, p.page_number, p.page_text, p.word_count,
                   d.original_name as document_name, d.uploaded_at
            FROM document_pages p
            JOIN documents d ON p.document_id = d.id
            WHERE p.document_id = ?
            ORDER BY p.page_number ASC
        """, (document_id,))
    else:
        cursor.execute("""
            SELECT p.id as page_id, p.document_id, p.page_number, p.page_text, p.word_count,
                   d.original_name as document_name, d.uploaded_at
            FROM document_pages p
            JOIN documents d ON p.document_id = d.id
            ORDER BY d.id ASC, p.page_number ASC
        """)

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"query": query, "total_matches": 0, "results": []}

    corpus = [row["page_text"] if row["page_text"] else "" for row in rows]

    # Check if corpus has any non-empty text
    if not any(text.strip() for text in corpus):
        return {"query": query, "total_matches": 0, "results": []}

    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True,
            norm="l2"
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([query])
    except Exception:
        # Fallback if vocabulary is empty or query only contains stop words
        vectorizer = TfidfVectorizer(ngram_range=(1, 1), stop_words=None)
        try:
            tfidf_matrix = vectorizer.fit_transform(corpus)
            query_vec = vectorizer.transform([query])
        except Exception:
            return {"query": query, "total_matches": 0, "results": []}

    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    query_tokens = tokenize_query(query)

    ranked_indices = np.argsort(similarities)[::-1]
    results = []

    for idx in ranked_indices:
        score = float(similarities[idx])
        row = rows[idx]
        page_text = row["page_text"] or ""

        # If TF-IDF cosine similarity is above zero, or direct token overlap exists
        matched_tokens = [tok for tok in query_tokens if tok in page_text.lower()]
        
        if score > 0.005 or len(matched_tokens) > 0:
            snippet = extract_best_snippet(page_text, query_tokens)
            # Re-normalize score between 0 and 100 for display
            display_score = round(min(1.0, max(score, (len(matched_tokens) * 0.15))) * 100, 1)

            results.append({
                "page_id": row["page_id"],
                "document_id": row["document_id"],
                "document_name": row["document_name"],
                "page_number": row["page_number"],
                "similarity_score": display_score,
                "raw_score": round(score, 4),
                "snippet": snippet,
                "matched_terms": matched_tokens[:5],
                "word_count": row["word_count"]
            })

        if len(results) >= top_k:
            break

    # Save to query history
    try:
        conn = get_db_connection()
        top_doc = results[0]["document_name"] if results else None
        top_page = results[0]["page_number"] if results else None
        top_score = results[0]["similarity_score"] if results else 0.0
        conn.execute("""
            INSERT INTO query_history (query_type, query_text, result_count, top_document, top_page, confidence_score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("search", query, len(results), top_doc, top_page, top_score))
        conn.commit()
        conn.close()
    except Exception:
        pass

    return {
        "query": query,
        "total_matches": len(results),
        "results": results
    }

