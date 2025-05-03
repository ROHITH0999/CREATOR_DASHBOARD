# 📊 Creator Dashboard

A full-stack MERN web application for content creators to manage their profiles, earn credit points, and interact with aggregated content from social platforms. Includes user roles (User/Admin), credit tracking, a personalized content feed, and admin analytics.

---

## 🚀 Features

### 🔐 User Authentication
- JWT-based register/login system
- Role-based access (User & Admin)

### 💳 Credit Points System
- Earn points for:
  - Daily login
  - Completing profile
  - Interacting with feed (saving/sharing/reporting)
- Dashboard displays current credits
- Admin panel to view and modify user balances

### 📰 Feed Aggregator
- Integrates with **Twitter**, **Reddit**, and **LinkedIn** (via public APIs)
- Scrollable feed with:
  - Save content
  - Share content (copy/simulate)
  - Report inappropriate posts

### 📈 Dashboards
- **User Dashboard**:
  - Credit stats
  - Saved content
  - Recent activity log
- **Admin Dashboard**:
  - User analytics
  - Feed interaction reports

---

## 🧰 Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | React.js, Tailwind CSS       |
| Backend      | Node.js, Express.js          |
| Database     | MongoDB Atlas                |
| Auth         | JSON Web Tokens (JWT)        |
| Deployment   | Firebase Hosting (Frontend), Google Cloud Run (Backend) |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/creator-dashboard.git
cd creator-dashboard
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file and add your environment variables:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the server:

```bash
npm start
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev  # for Vite
```

Or

```bash
npm run start  # for Create React App
```

---

## ☁️ Deployment

### Frontend
```bash
npm run build
firebase deploy
```

### Backend
Deployed on Google Cloud Run.

---

## 📄 License

This project is for educational purposes. All APIs and external content are used under respective fair use/public terms.

---

## 👤 Author

- Name: Rohith T R
- Project: Assignment 1 – Creator Dashboard
