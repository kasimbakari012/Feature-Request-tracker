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
Author

Kasim Ismail Bakari