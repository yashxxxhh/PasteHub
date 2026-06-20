# PasteHub

A production-ready code and text snippet sharing platform that lets users create, manage, and share snippets through unique URLs with authentication and syntax highlighting.

---

## What it does

Users can create code or text snippets with a title, content, programming language, visibility, and expiration time. Each paste receives a unique 8-character URL for instant sharing. Registered users can manage their pastes through a personal dashboard, while public snippets can be searched, filtered, and forked by other users.

---

## How it works

Incoming requests are handled by a FastAPI backend and stored in PostgreSQL using SQLAlchemy ORM. Users authenticate using JWT tokens with passwords securely hashed using bcrypt.

When a user creates a paste, the backend generates a unique short ID that becomes its shareable URL. Public pastes can be viewed without authentication, while editing and deleting require ownership verification. The React frontend communicates with the backend through Axios and stores authentication tokens in local storage to maintain user sessions. Expired pastes automatically become inaccessible once their expiration timestamp is reached.

---

## Tech Stack

| Layer | Technology |
|---------|------------------------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | FastAPI + Uvicorn |
| ORM | SQLAlchemy 2 |
| Authentication | JWT (python-jose) + bcrypt |
| Validation | Pydantic v2 |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| Production Server | Nginx |
| Language | Python 3.10+ |