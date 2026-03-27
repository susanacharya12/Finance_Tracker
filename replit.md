# Finance Tracker

A full-stack personal finance tracking application with a React + Vite frontend and a Django REST API backend.

## Architecture

- **Frontend**: React 18 + Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Django 6 + Django REST Framework, JWT authentication (simplejwt), django-cors-headers
- **Database**: SQLite (`db.sqlite3`)
- **Auth**: JWT tokens (access: 1 hour, refresh: 7 days)

## Project Layout

```
/
├── src/                  # React frontend source
│   ├── App.jsx           # Root component with routing
│   ├── pages/            # Login, Register, Dashboard, Transactions, Categories
│   ├── contexts/         # AuthContext for JWT state management
│   ├── layouts/          # AppLayout (protected app shell)
│   ├── routes/           # ProtectedRoute, PublicRoute guards
│   └── api/              # Axios API client
├── finance_tracker/      # Django project config (settings, urls, wsgi)
├── users/                # Custom user model app
├── transactions/         # Transaction model/API app
├── categories/           # Category model/API app
├── profiles/             # User profile app
├── manage.py             # Django management script
├── vite.config.js        # Vite config (port 5000, proxy to :8000)
└── db.sqlite3            # SQLite database
```

## Development Workflows

- **Frontend**: `npm run dev` — Vite dev server on port 5000 (webview)
- **Backend**: `python manage.py runserver localhost:8000` — Django dev server on port 8000 (console)

## Key Configuration

- Vite proxies `/api/*` requests to `http://localhost:8000`
- Django `ALLOWED_HOSTS = ['*']` and `CORS_ALLOW_ALL_ORIGINS = True` for dev
- Frontend host: `0.0.0.0`, port `5000`, `allowedHosts: true` for Replit proxy
- Backend host: `localhost`, port `8000`

## API Endpoints

- `POST /api/token/` — obtain JWT token pair
- `POST /api/token/refresh/` — refresh access token
- `POST /api/register/` — user registration (users app)
- `/api/categories/` — categories CRUD
- `/api/transactions/` — transactions CRUD

## Dependencies

### Python
- django, djangorestframework, djangorestframework-simplejwt, django-cors-headers, Pillow, gunicorn

### Node
- react, react-dom, react-router-dom, axios, vite, tailwindcss, postcss, autoprefixer
