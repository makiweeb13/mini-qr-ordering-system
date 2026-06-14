# RestaurantMenu — QR Ordering System

A full-stack QR menu ordering system built with Node.js, React, Express, Prisma, and MySQL.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router 7, Tailwind CSS 4, Vite 8 |
| Backend | Express 5, TypeScript |
| Runtime | Node.js >= 20 |
| Auth | Better Auth (email/password) |
| Database | MySQL via Prisma ORM |
| Package Manager | pnpm |

## Quick Start

```bash
pnpm install
pnpm dev
```

The root `dev` script (`pnpm --filter api seed && pnpm -r --parallel dev`) seeds the admin user, then starts both API and frontend in parallel.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`npm install -g pnpm`)
- **WSL** (Ubuntu recommended) with **MySQL** installed natively (`sudo apt install mysql-server`)<br>or MySQL accessible on `localhost:3306` by other means

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd mini-qr-ordering-system
pnpm install
```

### 2. Configure environment

Copy the template and adjust if needed:

```bash
# apps/api/.env is pre-configured for local MySQL with root + no password
# Only needed if your MySQL settings differ:
#   DATABASE_URL=mysql://user:password@localhost:3306/qr_ordering
#   BETTER_AUTH_SECRET=your-random-secret-here
```

Generate a random secret:

```bash
openssl rand -hex 32
# Paste the output into BETTER_AUTH_SECRET in apps/api/.env
```

### 3. Create the database

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS qr_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

> If your root user requires a password: `mysql -u root -p`

### 4. Apply the database schema

```bash
cd apps/api
npx prisma db push
```

> Alternatively, for a migration-based setup: `npx prisma migrate dev --name init`

### 5. Start the dev server

```bash
pnpm dev
```

This seeds the admin account (`admin@restaurant.com` / `admin123`) and starts both the API and frontend in parallel.

> The root `dev` script is defined as: `pnpm --filter api seed && pnpm -r --parallel dev`

## Access

| Page | URL | Description |
|------|-----|-------------|
| Menu | http://localhost:5173/ | Customer QR menu |
| Login | http://localhost:5173/login | Admin login |
| Dashboard | http://localhost:5173/admin | Admin dashboard |
| Orders | http://localhost:5173/admin/orders | Order management |
| Prisma Studio | http://localhost:5555/ | Database GUI (run `pnpm prisma:studio`) |

## Admin Credentials

- **Email:** `admin@restaurant.com`
- **Password:** `admin123`

## Project Structure

```
mini-qr-ordering-system/
├── apps/
│   ├── api/                # Express backend
│   │   ├── prisma/
│   │   │   └── schema.prisma    # Database models
│   │   ├── src/
│   │   │   ├── lib/auth.ts      # Better Auth config
│   │   │   ├── prisma.ts        # Prisma client
│   │   │   ├── routes/          # API routes
│   │   │   ├── seed.ts          # Admin seed script
│   │   │   ├── app.ts           # Express app setup
│   │   │   └── server.ts        # Entry point
│   │   └── .env                 # Environment variables
│   └── web/                # React frontend
│       └── src/
│           ├── components/
│           ├── context/
│           └── pages/
└── package.json            # Root workspace config
```

## Prisma Commands

| Command | Description |
|---------|-------------|
| `pnpm prisma:generate` | Regenerate Prisma client after schema changes |
| `pnpm prisma:migrate` | Create and apply a new migration |
| `pnpm prisma:studio` | Open Prisma Studio at http://localhost:5555 |

## Visual Identity

- **Brand color:** `#D4380D` (Tropical Filipino red-orange)
- **Accent:** `#F5A623` (warm gold)
- **Background:** Cream, brown accents
- **Fonts:** Plus Jakarta Sans (headings), Inter (body)
