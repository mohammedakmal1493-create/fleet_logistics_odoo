# FLEETFLOW – Modular Fleet & Logistics Management System

## Overview
FleetFlow is a complete, production-ready full-stack web application designed for comprehensive logistics operations, ensuring that vehicles, trips, drivers, fuel operations, and financial analysis are efficiently managed. 

Built with React.js (Frontend) and Node.js + Express (Backend) leveraging a centralized PostgreSQL Database.

## Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

## Database Setup
1. Create a PostgreSQL user `postgres` with password `postgres` (or change backend `.env`).
2. Run the `g:/Logistics/database/schema.sql` script into PostgreSQL to create the db and tables.
   - Command line: `psql -U postgres -f g:/Logistics/database/schema.sql` (after setting your PG password, or run queries manually via pgAdmin).

## Backend
1. Open a terminal and navigate to `backend` folder:
   `cd g:/Logistics/backend`
2. Start the backend Node server securely:
   `npm start` or `node server.js`
   
The backend connects to PostgreSQL via credentials set in `backend/.env`. The backend uses JWT authentication on port `5000`.

## Frontend
1. Open a terminal and navigate to the `frontend` folder:
   `cd g:/Logistics/frontend`
2. Run the React application locally:
   `npm start`

The frontend communicates with the backend via `http://localhost:5000` set directly in axios.

## Testing Out The System
1. Go to `http://localhost:3000` via web browser.
2. Register a new user with the Role `Manager`.
3. You will be redirected to Login. Sign in with the newly created credentials.
4. As `Manager`, you have access to the Command Center (Dashboard). 
5. Navigate to Vehicle Registry and Trips Dispatcher to use the features.
6. Remember: Try creating another user via `/register` with role `Dispatcher` to see Role-Based Access Control physically limit access domains!
