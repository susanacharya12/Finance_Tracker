# Finance Tracker

A full-stack personal finance tracking web application built with **React + Vite** on the frontend and **Django REST Framework** on the backend. Track your income and expenses, organize transactions by category, and get a clear view of your financial health.

---

## Features

- **Authentication** — Register and log in securely using JWT tokens
- **Email Verification (OTP)** — New accounts must verify their email with a 6-digit OTP before logging in
- **Forgot Password (OTP)** — Reset your password via a 6-digit OTP sent to your email
- **Dashboard** — Overview of net balance, total income, total expenses, and category count
- **This Month** — Monthly income vs. expense breakdown at a glance
- **Top Expenses** — Visual progress bars showing your highest-spending categories
- **Transactions** — Add, edit, and delete income/expense transactions
- **Search & Filter** — Filter transactions by type, search by note, and pick a specific month
- **CSV Export** — Download your filtered transactions as a spreadsheet
- **Categories** — Create and manage income/expense categories
- **Profile** — View and edit your username, phone number, and change your password

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |

### Backend
| Tool | Purpose |
|------|---------|
| Django 6 | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication |
| django-cors-headers | CORS handling |
| Pillow | Image processing |
| SQLite | Database |

---

## Project Structure

```
Finance_Tracker/
├── src/                        # React frontend
│   ├── api/
│   │   └── axios.js            # Axios instance with JWT interceptors
│   ├── contexts/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── layouts/
│   │   └── AppLayout.jsx       # Sidebar + top bar layout
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx     # OTP email verification
│   │   ├── ForgotPassword.jsx  # Request password reset OTP
│   │   ├── ResetPassword.jsx   # Submit OTP + new password
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Categories.jsx
│   │   └── Profile.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── finance_tracker/            # Django project settings
│   ├── settings.py
│   └── urls.py
├── users/                      # Custom user model, auth, OTP
│   ├── models.py               # CustomUser + OTPVerification
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── utils.py                # OTP generation & email sending
├── transactions/               # Transaction model & API
├── categories/                 # Category model & API
├── manage.py
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+

### 1. Clone the repository
```bash
git clone https://github.com/susanacharya12/Finance_Tracker.git
cd Finance_Tracker
```

### 2. Install Python dependencies
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow gunicorn
```

### 3. Run database migrations
```bash
python manage.py migrate
```

### 4. Install frontend dependencies
```bash
npm install
```

### 5. Start the backend
```bash
python manage.py runserver localhost:8000
```

### 6. Start the frontend (in a new terminal)
```bash
npm run dev
```

The app will be available at **http://localhost:5000**

---

## Email / OTP Setup

By default, OTP emails are printed to the **console** (development mode). To send real emails via SMTP, set these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_BACKEND` | Set to `smtp` to enable real email sending | `smtp` |
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_HOST_USER` | Your email address | `you@gmail.com` |
| `EMAIL_HOST_PASSWORD` | App password or SMTP password | `abc123xyz` |
| `DEFAULT_FROM_EMAIL` | From address shown in emails | `Finance Tracker <noreply@example.com>` |

> **Gmail tip**: Use an [App Password](https://myaccount.google.com/apppasswords) instead of your regular password.

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/token/` | No | Obtain JWT access & refresh tokens |
| POST | `/api/token/refresh/` | No | Refresh access token |
| POST | `/api/users/` | No | Register new user (sends OTP) |
| GET/PATCH | `/api/users/me/` | Yes | Get or update current user profile |
| POST | `/api/change-password/` | Yes | Change password (authenticated) |
| POST | `/api/verify-email/` | No | Verify email with OTP |
| POST | `/api/resend-otp/` | No | Resend OTP (registration or password reset) |
| POST | `/api/forgot-password/` | No | Request a password reset OTP |
| POST | `/api/reset-password/` | No | Reset password using OTP |
| GET/POST | `/api/categories/` | Yes | List or create categories |
| GET/PUT/DELETE | `/api/categories/{id}/` | Yes | Retrieve, update, or delete a category |
| GET/POST | `/api/transactions/` | Yes | List or create transactions |
| GET/PUT/DELETE | `/api/transactions/{id}/` | Yes | Retrieve, update, or delete a transaction |

### Authentication header (for protected endpoints)
```
Authorization: Bearer <access_token>
```

---

## OTP Flow

### Registration
1. User submits registration form → account created with `is_active = False`
2. 6-digit OTP sent to email (valid for **10 minutes**)
3. User visits `/verify-email`, enters OTP → account activated
4. User can now log in

### Forgot Password
1. User visits `/forgot-password`, enters email
2. OTP sent to email (valid for **10 minutes**)
3. User visits `/reset-password`, enters OTP + new password
4. Password updated, user can log in with new password

---

## User Model

The app uses a custom user model with **email as the login field** (not username).

| Field | Type | Notes |
|-------|------|-------|
| email | EmailField | Unique, used for login |
| username | CharField | Display name |
| phone_number | CharField | Optional |
| profile_picture | ImageField | Optional |
| role | CharField | `user` or `admin` |
| is_active | BooleanField | `False` until email is verified |

---

## License

This project is open source and available under the [MIT License](LICENSE).
