# 🧭 Travel Buddy Backend

This is the backend service for **Travel Buddy**, an AI-powered travel planning application. It handles user accounts, trip creation, itinerary management, and data storage via MongoDB.

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** w/ **Mongoose**
- **CORS** for frontend-backend communication

---

## 🚀 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/CS-546-Group2/travel-buddy-backend.git
cd travel-buddy-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm run dev or npm run start
```

> Runs on [http://localhost:5000](http://localhost:5000) by default.

---

## 🌐 API Connectivity

The backend provides endpoints that the frontend connects to. Example:

```
GET /api/ping
```

Returns a confirmation that the backend is reachable.

---

## 🧱 Planned API Endpoints

| Route               | Method | Description            |
|--------------------|--------|------------------------|
| `/api/ping`        | GET    | Ping the backend       |
| `/api/users/login` | POST   | User login (future)    |
| `/api/users/signup`| POST   | User signup (future)   |
| `/api/trips`       | GET    | Get all user trips     |
| `/api/trips`       | POST   | Create a new trip      |

---

## 👥 Branching Strategy

- `main` – protected, production-ready
- `develop` – active development branch
- `users/<your-name>/<feature>` – for all feature development

### 🛡 PR Rules

- **No direct merges into `main`**
- All PRs must target `develop`
- PRs require **code review and approval**

---

## 🛠 Example Folder Structure

```
travel-buddy-backend/
├── app.js
├── routes/
│   ├── users.js
│   └── trips.js
└── package.json
```

For issues or questions, open a GitHub Issue or contact the team on Slack.
