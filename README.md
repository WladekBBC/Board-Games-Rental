# Board Games Rental

Board Games Rental is a full-stack application for managing a board game rental business. It combines a Next.js frontend with a NestJS backend and a MySQL database, and it is designed to run locally or in Docker.

## Overview

- Browse and search board games
- Add, edit, and remove games for authorized users
- Manage rentals and returns
- Register and sign in users
- Manage users and permissions from the admin experience
- Support real-time updates over WebSockets

## Architecture

- Frontend: React + Next.js + TypeScript + Tailwind CSS
- Backend: NestJS + TypeScript + TypeORM + MySQL
- Authentication: JWT-based auth with role/permission checks
- Delivery: Docker Compose for local development and production-style orchestration

## Project structure

```text
.
├── front/                # Next.js frontend application
│   ├── src/              # App routes, components, contexts, and UI logic
│   ├── public/           # Static assets
│   └── package.json
├── rental-api/           # NestJS backend API
│   ├── src/              # Controllers, services, modules, guards, DTOs
│   └── package.json
├── nginx/                # Reverse proxy configuration
├── docker-compose.yml    # Full stack orchestration
└── README.md
```

## Requirements

- Node.js 20+ recommended
- npm 10+
- Docker Desktop or Docker Engine with Docker Compose
- MySQL (or the provided Docker services)

## Environment variables

Copy the example file at the repository root and fill in the values:

```bash
cp .env.example .env
```

The application expects:

- Database settings: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_SYNCHRONIZE
- JWT settings: JWT_SEC, AD_EMAIL, AD_PASS
- API settings: PORT, NODE_ENV, ORIGIN_HOST
- Frontend settings: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL

## Installation

### Backend

```bash
cd rental-api
npm install
```

### Frontend

```bash
cd front
npm install
```

## Running locally

### With Docker Compose

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- phpMyAdmin: http://localhost:8081

### Without Docker

Start the backend:

```bash
cd rental-api
npm run start:dev
```

Start the frontend:

```bash
cd front
npm run dev
```

## Scripts

### Backend

- npm run build
- npm run start:dev
- npm run lint
- npm run test

### Frontend

- npm run dev
- npm run build
- npm run start
- npm run lint

## Production build

```bash
cd front && npm run build
cd ../rental-api && npm run build
```

## Docker

The repository includes Dockerfiles for both the frontend and backend, plus a Compose file for the complete stack.

## Testing

```bash
cd rental-api && npm run test
```

## Linting and formatting

```bash
cd front && npm run lint
cd ../rental-api && npm run lint
```

## Troubleshooting

- If the API cannot connect to MySQL, verify that the database container is healthy and the DB_* variables match the running instance.
- If authentication fails, ensure JWT_SEC matches in both the backend environment and the deployed runtime.
- If the frontend cannot reach the API, verify NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL.

## Known limitations

- The project is currently configured for a single MySQL instance and does not yet include advanced observability or CI/CD pipelines.
- Admin bootstrap depends on the AD_EMAIL and AD_PASS variables being present.

## Authors

- Vladys Berezhnyi
- Tymoteusz Huszcza
