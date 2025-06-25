# 🧭 Travel Buddy Backend

This is the backend service for **Travel Buddy**, an AI-powered travel planning application. It handles user accounts, trip creation, itinerary management, and data storage via MongoDB.

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** w/ **Mongoose**

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
npm run dev
```

> Runs on [http://localhost:5000](http://localhost:5000) by default.

---

## 📦 API Endpoints (Preview)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/users/signup` | POST | Create user |
| `/api/users/login` | POST | Login user |
| `/api/trips/` | GET/POST | Get or create trips |
| `/api/trips/:id` | PUT/DELETE | Update or delete trip |

More in progress...

---

## 👥 Branching Model

- `main` – protected, production-ready
- `develop` – default base for PRs
- `users/your-branch-name` – for feature work

> PRs must go into `develop` and require at least one approval.

For issues or questions, open a GitHub Issue or contact the team on Slack.
