# Learning Application – RAG Chatbot POC

## Project Overview

This project demonstrates a **Proof of Concept (POC)** for an AI-powered learning assistant that can answer questions from uploaded course documents.

The system uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded documents and generate accurate answers with source references.

---

# Objective

The goal of this POC is to enable students to:

• Upload course documents
• Ask questions about the content
• Receive contextual answers
• View the source text from the document

---

# Features

## 1️⃣ Course Document Upload

Users can upload learning materials in the following formats:

* PDF
* DOCX
* TXT

The documents are automatically parsed and indexed.

---

## 2️⃣ Intelligent Chatbot

Users can ask questions related to uploaded course materials.

The system retrieves relevant sections from the document and generates an answer using an AI model.

---

## 3️⃣ Source Text Highlight

The system returns the source text chunk used to generate the answer.

This enables the frontend to highlight the relevant portion of the document.

---

## 4️⃣ Question Logging

All user questions and answers are stored in a database for monitoring and analysis.

---

# Technology Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Frontend         | Streamlit (Demo UI)            |
| Backend          | FastAPI                        |
| Vector Database  | FAISS                          |
| Embeddings       | sentence-transformers (MiniLM) |
| LLM              | OpenAI API                     |
| Database         | SQLite                         |
| Document Parsing | PyMuPDF, python-docx           |
| API Testing      | Swagger UI                     |

---

# System Architecture

User
↓
Chat UI
↓
FastAPI Backend
↓
Document Upload
↓
Document Parser
↓
Text Chunking
↓
Embedding Generation
↓
FAISS Vector Database
↓
User Question
↓
Query Embedding
↓
Vector Search
↓
OpenAI LLM
↓
Answer Generation
↓
Answer + Source Text

---

# Folder Structure

```
learning_rag_backend/
│
├── app/
│   ├── api/
│   │   ├── routes_upload.py
│   │   ├── routes_chat.py
│   │   └── routes_health.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── logger.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── crud.py
│   │
│   ├── rag/
│   │   ├── parser.py
│   │   ├── chunker.py
│   │   ├── embeddings.py
│   │   ├── vector_store_faiss.py
│   │   └── qa.py
│   │
│   └── storage/
│
├── demo_ui/
│   └── streamlit_app.py
│
├── requirements.txt
├── .env
└── README.md
```

---

# Installation Guide

### Step 1 – Create virtual environment

```bash
python -m venv venv
```

Activate environment

Windows:

```bash
venv\Scripts\activate
```

---

### Step 2 – Install dependencies

```bash
pip install -r requirements.txt
```

---

### Step 3 – Configure environment variables

Create `.env` file:

```
OPENAI_API_KEY=your_api_key
FAISS_DIR=app/storage/faiss_index
UPLOAD_DIR=app/storage/uploads
```

---

# Running the Application

### Start backend

```
uvicorn app.main:app --reload
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

### Start Streamlit UI

```
streamlit run demo_ui/streamlit_app.py
```

Open:

```
http://localhost:8501
```

---

# API Endpoints

### Upload Document

POST `/upload`

Upload a course document.

---

### Chat with Documents

POST `/chat`

Example request:

```
{
 "question": "What is classification in machine learning?",
 "session_id": "user1"
}
```

---

### Health Check

GET `/health`

---

# Cost Analysis

| Component       | Technology            | Cost |
| --------------- | --------------------- | ---- |
| Embeddings      | sentence-transformers | Free |
| Vector Database | FAISS                 | Free |
| Backend         | FastAPI               | Free |
| Database        | SQLite                | Free |
| LLM             | OpenAI API            | Paid |

Estimated cost for small usage:

1000 questions ≈ $2–$5

---

# Future Improvements

• Multi-user document management
• Pinecone vector database
• Advanced highlighting in UI
• Authentication system
• Full React frontend

---

# Conclusion

This project demonstrates how **RAG architecture can power intelligent learning assistants** that allow students to interactively explore course materials.
