1. GitHub Project Structure

feature-tracker/
│
├─ backend/
│   ├─ src/
│   │   ├─ config/
│   │   │   └─ db.js
│   │   ├─ controllers/
│   │   │   └─ featureController.js
│   │   ├─ routes/
│   │   │   └─ featureRoutes.js
│   │   ├─ app.js
│   │   └─ server.js
│   ├─ package.json
│   └─ README.md
│
├─ frontend/
│   ├─ src/
│   │   ├─ App.jsx
│   │   └─ main.jsx
│   ├─ package.json
│   └─ README.md
│
├─ feature_tracker.sql
└─ README.md

# Feature Tracker App

A small full-stack web application to track feature requests.

## Tech Stack

- Frontend: React.js + Vite
- Backend: Node.js + Express.js
- Database: MySQL
- HTTP Client: Axios

## Features

- View all feature requests
- Add a new feature
- Edit a feature
- Delete a feature
- Update feature status
- Filter feature requests by status

## Setup Instructions

### 1. Database

```bash
# Import the SQL file
mysql -u root -p < feature_tracker.sql

2. Backend
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000

3. Frontend
cd frontend
npm install
npm install axios
npm run dev
# App runs on http://localhost:5173

4. Usage
Open frontend in browser
Add, edit, delete features
Change status using dropdown
Filter features using the filter dropdown


---

# 3️⃣ Git Commit Strategy

```bash
git init
git add .
git commit -m "Initial full-stack feature tracker setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main