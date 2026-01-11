# Finance Tracker

A full-stack application for tracking personal finances, including expenses and income, with a dashboard for visualization.

## Technology Stack

### Frontend
- **Framework**: React (Create React App)
- **Language**: TypeScript
- **UI Library**: Material UI (@mui/material)
- **Routing**: React Router
- **State Management**: React Hooks

### Backend
- **Framework**: Next.js (used as API)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)

*Note: The project folder name mentions NestJS, but the actual implementation uses Next.js for the backend.*

## Features

- **User Authentication**: Secure Login, Registration, and Password Reset.
- **Dashboard**: Overview of financial status.
- **Expense & Income Tracking**: Manage entries with categories, amounts, and dates.
- **Data Persistence**: Robust PostgreSQL database.

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running

## Environment Configuration

### Backend
Create a `.env` file in the `backend` directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
JWT_SECRET=your_secure_random_string
```

## Getting Started

### 1. Database Setup

Ensure your PostgreSQL server is running.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Initialize and setup the database
npm run db:setup
```

### 2. Running the Backend

```bash
# From backend directory
npm run dev
```
The backend API will typically run on `http://localhost:3000` (or similar, check console output).

### 3. Running the Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```
The frontend application will open on `http://localhost:3001` (or next available port).

## Project Structure

- `frontend/`: React application source code.
- `backend/`: Next.js application source code acting as the API layer.
