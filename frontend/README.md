
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