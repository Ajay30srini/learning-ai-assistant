# AI Learning Assistant

Full stack learning assistant application.

## Features

- AI Tutor from uploaded documents
- General AI Chatbot
- Quiz Generator
- Quiz scoring system

## Tech Stack

Frontend:
React Native (Expo)

Backend:
FastAPI

AI:
OpenAI
FAISS vector database
Sentence Transformers

Database:
SQLite

## Project Structure

frontend/ → React Native mobile app  
backend/ → FastAPI AI service

## Run Backend

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Run Frontend

cd frontend
npm start