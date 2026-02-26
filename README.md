# LearnLog

A web application designed to give students a dedicated space to write, share, and reflect on what they're learning.

Built with [Astro](https://astro.build) (frontend) and [Payload CMS v3](https://payloadcms.com) (backend), using PostgreSQL as the database.

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v8 or higher
- A PostgreSQL database (e.g. [Supabase](https://supabase.com))

---

## Getting Started

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/UndergradMartinC/LearnLog.git
cd LearnLog
npm install
```

### 2. Set up the backend environment

Create `backend/.env` with the following contents:

```
DATABASE_URI=your-supabase-connection-string
PAYLOAD_SECRET=your-secret-key
```

### 3. Run database migrations

This creates all the required tables in your database:

```bash
npm run payload -w backend -- migrate
```

### 4. Start the backend

```bash
npm run dev:backend
```

The Payload admin panel will be available at `http://localhost:3000/admin`. On first run, you will be prompted to create an admin user.

### 5. Start the frontend

In a separate terminal:

```bash
npm run dev:frontend
```

The Astro frontend will be available at `http://localhost:4321`.

### Run both at the same time

```bash
npm run dev
```

---
