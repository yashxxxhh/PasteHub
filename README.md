# PasteHub

A production-ready code and text snippet sharing platform. Create pastes, share them via unique URLs, and browse public snippets with syntax highlighting.

---

## What It Does

- **Create pastes** — title, content, language, visibility (public/unlisted/private), expiration
- **Share instantly** — every paste gets a unique 8-character URL like `/paste/aB3x9kQm`
- **Syntax highlighting** — Python, JavaScript, Java, C++, Ruby, SQL, JSON, HTML, CSS
- **Authentication** — register, login, JWT-protected routes, bcrypt passwords
- **Dashboard** — stats, recently created/updated pastes per user
- **Search & filter** — search by title, filter by language, sort by date
- **Fork pastes** — duplicate any public/unlisted paste
- **Expiration** — pastes auto-expire after 10 min, 1 hour, 1 day, or 1 week

---

## How It Works

```
Browser  →  React (Vite)  →  Axios  →  FastAPI  →  PostgreSQL
                                          ↑
                                    JWT Auth (jose)
                                    bcrypt passwords
                                    SQLAlchemy ORM
```

**Backend flow:**
1. `POST /api/register` or `/api/login` returns a JWT
2. Frontend stores JWT in `localStorage`, attaches it as `Authorization: Bearer <token>`
3. Protected routes use `get_current_user` dependency — decodes JWT, queries user from DB
4. Public routes use `get_optional_user` — works with or without a token
5. Pastes have a `short_id` (8 random alphanumeric chars) used in URLs
6. Expiration is stored as an absolute UTC timestamp; expired pastes return 410

**Frontend flow:**
1. `AuthContext` holds the current user and token, hydrates from `localStorage` on load
2. `ProtectedRoute` wraps dashboard/edit pages — redirects to `/login` if unauthenticated
3. `pastesService` wraps all Axios calls with typed functions
4. Toasts via `react-hot-toast`, syntax highlighting via `highlight.js` loaded from CDN

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| HTTP client | Axios |
| Backend | FastAPI, Uvicorn |
| ORM | SQLAlchemy 2 |
| Validation | Pydantic v2 |
| Auth | python-jose (JWT), passlib + bcrypt |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Web server | Nginx (production frontend) |

---

## Project Structure

```
pastehub/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, lifespan
│   │   ├── models/
│   │   │   ├── user.py        # User SQLAlchemy model
│   │   │   └── paste.py       # Paste SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── auth.py        # Pydantic schemas for auth
│   │   │   └── paste.py       # Pydantic schemas for pastes
│   │   ├── routers/
│   │   │   ├── auth.py        # POST /register, /login, GET /me
│   │   │   ├── pastes.py      # CRUD + duplicate endpoints
│   │   │   └── dashboard.py   # GET /dashboard, /my-pastes
│   │   ├── auth/
│   │   │   └── jwt.py         # Token creation, decoding, dependencies
│   │   ├── database/
│   │   │   └── session.py     # Engine, SessionLocal, get_db
│   │   └── utils/
│   │       └── helpers.py     # short_id generator, expiry logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Routes
│   │   ├── main.jsx           # Entry point, Toaster
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js         # Axios instance + interceptors
│   │   │   ├── pastes.js      # API call functions
│   │   │   └── constants.js   # Languages, visibilities, helpers
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── paste/
│   │   │   │   ├── PasteCard.jsx
│   │   │   │   ├── PasteEditor.jsx
│   │   │   │   └── CodeViewer.jsx
│   │   │   └── ui/
│   │   │       ├── Skeleton.jsx
│   │   │       └── EmptyState.jsx
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── NewPastePage.jsx
│   │       ├── PasteViewPage.jsx
│   │       ├── EditPastePage.jsx
│   │       ├── ExplorePage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── MyPastesPage.jsx
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Setup

### Docker (recommended)

```bash
git clone https://github.com/yourname/pastehub
cd pastehub

cp .env.example .env
# Edit .env — set a real SECRET_KEY

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Local development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start PostgreSQL, then:
export DATABASE_URL=postgresql://pastehub:pastehub@localhost:5432/pastehub
export SECRET_KEY=dev-secret-key

uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | — | Create account, returns JWT |
| POST | `/api/login` | — | Login, returns JWT |
| GET | `/api/me` | Required | Current user info |

### Pastes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/pastes` | Optional | Create paste |
| GET | `/api/pastes` | Optional | List public pastes (paginated) |
| GET | `/api/pastes/{short_id}` | Optional | Get single paste |
| PUT | `/api/pastes/{short_id}` | Required | Update paste (owner only) |
| DELETE | `/api/pastes/{short_id}` | Required | Delete paste (owner only) |
| POST | `/api/pastes/{short_id}/duplicate` | Optional | Fork a paste |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | Required | Stats + recent pastes |
| GET | `/api/my-pastes` | Required | All user's pastes |

**Query params for `GET /api/pastes`:**
- `page` (default: 1)
- `per_page` (default: 20, max: 100)
- `search` — filter by title
- `language` — filter by language
- `sort` — `latest` or `oldest`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | JWT signing secret — use a long random string |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

Generate a secure key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
