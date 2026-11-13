import os
import re
import pymupdf
from werkzeug.utils import secure_filename

# Max file size: 25 Megabytes
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = {"pdf"}

class PDFProcessingError(Exception):
    """Custom exception raised when PDF processing fails."""
    pass

def is_allowed_file(filename: str) -> bool:
    """Checks if the uploaded file has a valid .pdf extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_pdf_content(file_path: str) -> None:
    """
    Validates that the file exists, has a valid size, and starts with the '%PDF' magic header.
    """
    if not os.path.exists(file_path):
        raise PDFProcessingError("The specified file does not exist on disk.")

    file_size = os.path.getsize(file_path)
    if file_size == 0:
        raise PDFProcessingError("Uploaded file is empty (0 bytes).")

    if file_size > MAX_FILE_SIZE_BYTES:
        raise PDFProcessingError(f"File size exceeds the maximum limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.")

    with open(file_path, "rb") as f:
        header = f.read(5)
        if not header.startswith(b"%PDF"):
            raise PDFProcessingError("Invalid file signature. Uploaded file is not a valid PDF document.")

def extract_pdf_data(file_path: str):
    """
    Extracts text page by page from a PDF document using PyMuPDF.

    Returns:
        dict containing:
            total_pages (int)
            pages (list of dicts with page_number, text, word_count, char_count)
            has_text (bool)
    """
    validate_pdf_content(file_path)

    try:
        doc = pymupdf.open(file_path)
    except Exception as e:
        raise PDFProcessingError(f"Unable to parse PDF document: {str(e)}")

    if doc.is_encrypted:
        doc.close()
        raise PDFProcessingError("Password-protected or encrypted PDF documents are not supported.")

    total_pages = len(doc)
    if total_pages == 0:
        doc.close()
        raise PDFProcessingError("The PDF document contains 0 pages.")

    pages_data = []
    total_characters = 0

    for page_idx in range(total_pages):
        page = doc.load_page(page_idx)
        raw_text = page.get_text("text") or ""

        # Normalize whitespace while preserving line structure
        cleaned_text = re.sub(r"\r\n", "\n", raw_text)
        cleaned_text = re.sub(r"[ \t]+", " ", cleaned_text).strip()

        words = cleaned_text.split()
        word_count = len(words)
        char_count = len(cleaned_text)
        total_characters += char_count

        pages_data.append({
            "page_number": page_idx + 1,
            "text": cleaned_text,
            "word_count": word_count,
            "char_count": char_count
        })

    doc.close()

    return {
        "total_pages": total_pages,
        "pages": pages_data,
        "has_text": total_characters > 0,
        "total_characters": total_characters
    }

