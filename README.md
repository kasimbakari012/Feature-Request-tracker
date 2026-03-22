FIND THE .SQL FILE IN BACKEND FOLDER AND SCREENSHOTS IN FRONTEND FOLDER STRUCTURES.
backend/README.md

# Feature Request Tracker API

A clean REST API for managing feature requests built with Node.js, Express.js, and MySQL.

## Tech Stack

- Node.js
- Express.js
- MySQL
- dotenv
- cors
- mysql2

## Features

- Get all feature requests
- Get a single feature request by ID
- Create a new feature request
- Update an existing feature request
- Update only feature status
- Delete a feature request
- Filter requests by status
- Proper validation and error handling

## Project Structure

```text
backend/
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  └─ featureController.js
│  ├─ middlewares/
│  │  ├─ asyncHandler.js
│  │  ├─ errorHandler.js
│  │  ├─ validateFeature.js
│  │  └─ validateStatus.js
│  ├─ routes/
│  │  └─ featureRoutes.js
│  ├─ app.js
│  └─ server.js
├─ .env
├─ package.json
└─ README.md

Prerequisites
Node.js 18+
MySQL 8+
npm
Installation
cd backend
npm install
Environment Variables

Create a .env file in the backend/ folder:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=feature_tracker

If your MySQL server uses a password, set it in DB_PASSWORD.

Database Setup

Create the database and table using the SQL file provided in the project root.

Example:

CREATE DATABASE feature_tracker;
USE feature_tracker;

CREATE TABLE features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low',
    status ENUM('Open', 'In Progress', 'Completed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
Running the API
npm run dev

The API will run at:

http://localhost:5000
API Endpoints
Health Check
GET /
Feature Requests
GET    /api/features
GET    /api/features/:id
POST   /api/features
PUT    /api/features/:id
PATCH  /api/features/:id/status
DELETE /api/features/:id
Filter by Status
GET /api/features?status=Open
GET /api/features?status=In%20Progress
GET /api/features?status=Completed
Example Request Body
Create Feature
{
  "title": "Export reports as CSV",
  "description": "Allow users to download reports in CSV format.",
  "priority": "High",
  "status": "Open"
}
Update Status
{
  "status": "In Progress"
}
Validation Rules
title is required
priority must be one of:
Low
Medium
High
status must be one of:
Open
In Progress
Completed
Error Handling

The API returns consistent JSON error responses, for example:

{
  "message": "Feature not found"
}
Scripts
npm run dev
Notes
All SQL queries use parameterized statements.
The API is structured for maintainability and easy extension.
Designed to connect cleanly with the React frontend.

---

## `frontend/README.md`

```md
# Feature Request Tracker UI

A responsive React dashboard for managing feature requests.

## Tech Stack

- React
- Vite
- Axios
- CSS
- HTML5
- JavaScript

## Features

- Responsive dashboard layout
- Sidebar navigation
- Search feature requests
- Create new requests
- Edit existing requests
- Delete with confirmation modal
- Update request status inline
- Filter by status
- Loading state
- Toast notifications
- Empty states
- Clean, accessible UI

## Project Structure

```text
frontend/
├─ src/
│  ├─ api/
│  │  └─ api.js
│  ├─ components/
│  │  ├─ ConfirmModal.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ FeatureFilter.jsx
│  │  ├─ FeatureForm.jsx
│  │  ├─ FeatureList.jsx
│  │  ├─ ListSkeleton.jsx
│  │  ├─ LoadingSpinner.jsx
│  │  └─ Toast.jsx
│  ├─ layouts/
│  │  ├─ Sidebar.jsx
│  │  ├─ StatCard.jsx
│  │  └─ Topbar.jsx
│  ├─ services/
│  │  └─ api.js
│  ├─ styles/
│  │  └─ global.css
│  ├─ App.jsx
│  └─ main.jsx
├─ .env
├─ package.json
└─ README.md

Prerequisites
Node.js 18+
npm
Backend API running on http://localhost:5000
Installation
cd frontend
npm install
Environment Variables

Create a .env file in the frontend/ folder:

VITE_API_URL=http://localhost:5000/api/features

for future deployments change the backend API URL to actual domain.

Running the Frontend
npm run dev

The app will run at:

http://localhost:5173
Available Screens
Dashboard
Add Feature
Feature List
How It Works
Open the dashboard.
Add a new feature request using the form.
Edit any existing request.
Update the status directly from the list.
Filter requests by status.
Search by title using the top bar.
Delete a request with confirmation.
API Integration

The frontend communicates with the backend using Axios.

Base URL
import.meta.env.VITE_API_URL
Supported API Actions
GET all features
POST a feature
PUT a feature
PATCH feature status
DELETE a feature
Responsive Design

This UI is designed to work across:

Desktop
Tablet
Mobile

The sidebar collapses on smaller screens and navigation remains accessible.

Accessibility

This project includes:

Semantic HTML
ARIA labels where needed
Keyboard-friendly controls
Clear focusable buttons and inputs
Toast and dialog announcements
Scripts
npm run dev
npm run build
npm run preview

Screenshots

screenshots in a folder :

frontend/screenshots/

Suggested screenshots:

Dashboard overview
Add feature form
Feature list with filters
Delete confirmation modal
Mobile view
Demo Video

Record a short walkthrough showing:

Adding a feature
Editing a feature
Changing status
Filtering by status
Deleting a feature
pagination

TROUBLESHOOTING. 
API not loading

Make sure the backend is running and VITE_API_URL is correct.

Blank page
Check the browser console and confirm npm run dev started successfully.

Styles not appearing

Ensure src/styles/global.css is imported in main.jsx.

Author
Kasim Ismail Bakari
Phone Number: +255774830895.
