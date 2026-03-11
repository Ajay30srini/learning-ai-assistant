import fitz
from docx import Document as DocxDocument

def parse_pdf(path: str) -> list[dict]:
    doc = fitz.open(path)
    pages = []
    for i in range(len(doc)):
        text = doc.load_page(i).get_text("text")
        pages.append({"page": i + 1, "text": text})
    return pages

def parse_docx(path: str) -> list[dict]:
    d = DocxDocument(path)
    text = "\n".join([p.text for p in d.paragraphs if p.text])
    return [{"page": 1, "text": text}]

def parse_txt(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return [{"page": 1, "text": f.read()}]

def parse_document(path: str, ext: str) -> list[dict]:
    ext = ext.lower()
    if ext == "pdf":
        return parse_pdf(path)
    if ext == "docx":
        return parse_docx(path)
    if ext == "txt":
        return parse_txt(path)
    raise ValueError(f"Unsupported file type: {ext}")