# NewsWave — AI-Powered Real-Time News Aggregation & Trend Analysis System

**NewsWave** is a full-stack academic final-year web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). The system automatically retrieves newly available news articles from live RSS feeds and News APIs, performs intelligent NLP analysis (duplicate detection, category classification, sentiment analysis, dynamic trending topics extraction), and presents interactive SaaS dashboards for users and administrators.

---

## Key Features

1. **Automated Multi-Source News Ingestion**: Background scheduler automatically queries RSS feeds (BBC, TechCrunch, ESPN, Reuters, Wired, CNBC, etc.) and optional `NewsAPI.org` endpoints without requiring manual input.
2. **Duplicate Story Detection**: TF-IDF & String Similarity algorithms calculate headline similarity scores (threshold > 0.72) to flag duplicate coverage across publishers.
3. **AI News Category Classifier**: Machine learning keyword vector classifier automatically categorizes stories into 8 standard domains (*Technology, Business, Sports, Health, Science, Entertainment, World, Environment*) with confidence scoring (78% - 98%).
4. **Sentiment Analysis Engine**: VADER-based sentiment analysis engine computing Positive, Neutral, and Negative sentiment labels along with numeric compound scores (-1.0 to +1.0).
5. **Dynamic Trending Topic Discovery**: Time-weighted TF-IDF bigram and keyword frequency analysis across rolling timeframes (Today, 7 Days, 30 Days) to dynamically generate trending topic ranks.
6. **SaaS Dashboard & Interactive Analytics**: Built with React 18, Vite, Tailwind CSS, Lucide icons, and Recharts charts.
7. **Role-Based Access Control (RBAC)**: JWT authentication supporting `USER` and `ADMIN` roles, password hashing using bcrypt, and protected admin operations.

---

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React Icons, Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB (via Mongoose ORM)
- **AI/ML & NLP Engine**: `natural` (TF-IDF & Cosine Similarity), `sentiment` (VADER sentiment analysis), `string-similarity`
- **News Parser**: `rss-parser`, `axios`

---

## Project Structure

```
newswave/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Connection (db.js)
│   │   ├── controllers/     # REST API Controllers (auth, news, category, bookmark, analytics, admin)
│   │   ├── middleware/      # JWT Auth & Error Handlers
│   │   ├── models/          # Mongoose Schemas (User, Article, Bookmark, Category, TrendingTopic, Notification)
│   │   ├── routes/          # Express Routes
│   │   ├── services/        # AI/ML & News Ingestion Services (newsService, duplicateService, classificationService, sentimentService, trendingService)
│   │   ├── tasks/           # Scheduled Background News Fetcher Timer (newsFetcher.js)
│   │   ├── utils/           # Database Seed Utility (seed.js)
│   │   ├── app.js           # Express App Configuration
│   │   └── server.js        # Server Boot script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Components (Navbar, Sidebar, NewsCard, FeaturedNews, AIInsightCard, TrendingCard, ChartCard)
│   │   ├── context/         # AuthContext.jsx
│   │   ├── pages/           # All 16 Application Pages
│   │   ├── services/        # Axios API Client (api.js)
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Quick Start & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB installed locally OR a MongoDB Atlas cluster URI.

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/newswave
JWT_SECRET=newswave_super_secret_jwt_key_2026_academic_project
JWT_EXPIRE=30d
NEWS_FETCH_INTERVAL_MINUTES=15
NEWS_API_KEY=
CORS_ORIGIN=http://localhost:5173
```

Seed initial database categories and default Admin user:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```
Backend server will run at `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Vite development server will run at `http://localhost:5173`.

---

## Default Credentials

### Administrator Account
- **Email**: `admin@newswave.com`
- **Password**: `AdminPassword123!`
- **Role**: `ADMIN`

### Standard User Account
- Click **Register** on the website to create any normal user account.

---

## REST API Documentation Summary

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register a new account | Public |
| `/api/auth/login` | `POST` | Authenticate user & return JWT | Public |
| `/api/auth/me` | `GET` | Get logged-in user profile | Protected |
| `/api/news` | `GET` | Get paginated news with search & filters | Public |
| `/api/news/featured` | `GET` | Get top featured headline story | Public |
| `/api/news/:id` | `GET` | Get article details & AI analysis | Public |
| `/api/news/trending` | `GET` | Get dynamic trending topics | Public |
| `/api/news/refresh` | `POST` | Trigger manual news refresh | Public |
| `/api/categories` | `GET` | Get category list with article counts | Public |
| `/api/bookmarks` | `GET` / `POST` | Manage user bookmarks | Protected |
| `/api/analytics/overview` | `GET` | Get DB statistics overview | Public |
| `/api/analytics/categories` | `GET` | Category distribution data for charts | Public |
| `/api/analytics/sentiment` | `GET` | Sentiment ratio distribution | Public |
| `/api/analytics/activity` | `GET` | Daily news activity timeline | Public |
| `/api/admin/users` | `GET` / `PUT` / `DELETE` | User account administration | Admin |
| `/api/admin/news/:id` | `DELETE` | Delete news records | Admin |
