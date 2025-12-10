# Task Tracker

This is a simple backend application to teach basic, service-centric, architecture. Built with Node.js, Express, and PostgresSQL with the following principles:
  - Layered architecture (controllers → services → models)

  - Domain validation in services

  - Soft-delete (deleted_at)

  - JWT authentication

  - Centralized error model

  - RESTful CRUD + PATCH semantics

## Features

- User signup & login (JWT-based auth)

- Auth-protected task endpoints

- Create, read, update (PATCH merge rules), delete (soft delete)

- Separation of concerns:

  - Controllers: request → service → response

  - Services: validation + domain logic

  - Models: SQL only

- Error handling middleware mapping domain errors → clean JSON responses

## 📂 Project Structure
```
server/
  controllers/
  services/
  models/
  middleware/
  routes/
  server.js
```
Architecture rules
  - Controllers: no validation, no business logic

  - Services: all validation + domain logic, throw domain errors

  - Models: SQL only, return null when appropriate

  - Middleware: JWT auth only

  - Error handler: converts domain errors → HTTP JSON

## 🛠 Prerequisites

You need the following installed:

### Node.js (v18+ recommended)
Check:
```
node -v
```
### PostgreSQL (local installation)
On macOS, this is typically installed via:

  - Homebrew: brew install postgresql

  - Postgres.app: GUI installer

Start Postgres locally:
```
brew services start postgresql
```

Verify Postgres is running:
```
psql postgres
```

## ⚙️ Environment Setup

Create a .env file in the root of the project.

The required variables will look like this (you will fill in actual values later):
```
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

Notes:
  - DATABASE_URL uses standard Postgres connection format.

  - JWT_SECRET should be a long random string.

  - PORT can be any available port.

  ## 📦 Install Dependencies

Inside the project root:
```
npm install
```

## ▶️ Start the Server
Development (with auto-reload, if you added nodemon):
```
npm run dev
```
Production-style run:
```
npm start
```

The server will start on the port defined in .env (default: 3000).

## 🔐 Authentication

The app uses JWT Bearer tokens.
Clients must include:
```
Authorization: Bearer <token>
```

The auth middleware extracts the user ID and attaches:
```
req.user = { id }
```