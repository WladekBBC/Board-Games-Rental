# Board Games Rental

A full-stack application for managing a board game rental business. Built with **Next.js 14** (App Router), **NestJS 11**, **TypeORM**, and **MySQL**, featuring JWT authentication, role-based access control, and real-time WebSocket updates.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BOARD GAMES RENTAL - SYSTEM ARCHITECTURE             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                 │
│  │   Frontend   │────▶│    Nginx     │────▶│   Backend    │                 │
│  │  (Next.js)   │     │ (Reverse     │     │  (NestJS)    │                 │
│  │  Port: 3000  │     │  Proxy)      │     │  Port: 8080  │                 │
│  └──────────────┘     └──────────────┘     └──────┬───────┘                 │
│                                                   │                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────▼───────┐                 │
│  │  WebSocket   │────▶│   Socket.IO  │◀───▶│   MySQL      │                 │
│  │  (Real-time) │     │  Gateway     │     │  Port: 3306  │                 │
│  └──────────────┘     └──────────────┘     └──────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer        | Technology              | Version |
| ------------ | ----------------------- | ------- |
| **Frontend** | Next.js (App Router)    | 14.2.x  |
|              | React                   | 18.3.x  |
|              | TypeScript              | 5.x     |
|              | Tailwind CSS            | 3.3.x   |
|              | Radix UI / Headless UI  | Latest  |
| **Backend**  | NestJS                  | 11.0.x  |
|              | TypeORM                 | 0.3.x   |
|              | MySQL (mysql2)          | 3.14.x  |
|              | Socket.IO               | 4.8.x   |
|              | JWT (@nestjs/jwt)       | 11.0.x  |
| **DevOps**   | Docker / Docker Compose | Latest  |
|              | Nginx (Alpine)          | Latest  |
| **Tooling**  | ESLint (flat config)    | 9.x     |
|              | Prettier                | 3.4.x   |
|              | Jest                    | 29.7.x  |

---

## Project Structure

```
board-games-rental/
├── .dockerignore               # Docker ignore patterns
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore patterns
├── docker-compose.yml          # Full stack orchestration
├── docker-envs/                # Docker-specific environment files
│   ├── back.env                # Backend env for Docker
│   └── mysql.env               # MySQL env for Docker
├── nginx/                      # Nginx reverse proxy config
│   └── nginx.conf
├── front/                      # Next.js Frontend Application
│   ├── .env.example            # Frontend env template
│   ├── .eslintrc.json          # ESLint config (Next.js)
│   ├── next.config.js          # Next.js configuration
│   ├── next.config.mjs         # Additional Next.js config (images)
│   ├── package.json
│   ├── postcss.config.js       # PostCSS config
│   ├── tailwind.config.js      # Tailwind config (JS)
│   ├── tailwind.config.ts      # Tailwind config (TS)
│   ├── tsconfig.json           # TypeScript config
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── public/                 # Static assets
│   └── src/
│       ├── app/                # App Router pages
│       │   ├── actions.ts      # Server actions (cookies)
│       │   ├── globals.css     # Global styles
│       │   ├── layout.tsx      # Root layout (server)
│       │   ├── layout.client.tsx # Root layout (client)
│       │   ├── page.tsx        # Home page
│       │   ├── games/          # Games management page
│       │   ├── rentals/        # Rentals management page
│       │   ├── users/          # Users management page
│       │   ├── login/          # Login page
│       │   └── register/       # Register page
│       ├── components/         # React components
│       │   ├── Game/           # Game components (form, list, single)
│       │   ├── Helpers/        # Reusable UI components
│       │   ├── HomePage/       # Home page components
│       │   ├── Login/          # Login form
│       │   ├── Messages/       # Toast/notification components
│       │   ├── Navbar/         # Navigation components
│       │   └── Rental/         # Rental components (form, list)
│       ├── contexts/           # React Context providers
│       │   ├── AuthContext.tsx     # Authentication state
│       │   ├── GamesContext.tsx    # Games state + WebSocket
│       │   ├── LanguageContext.tsx # i18n (PL/UA/EN/JA)
│       │   ├── LoadingContext.tsx  # Global loading state
│       │   ├── RentalsContext.tsx  # Rentals state + WebSocket
│       │   ├── ThemeContext.tsx    # Dark/Light mode
│       │   └── UsersContext.tsx    # Users management state
│       ├── interfaces/         # TypeScript interfaces
│       │   ├── api.ts          # API types & request helper
│       │   ├── game.ts         # Game interface
│       │   ├── perms.ts        # Permissions enum
│       │   ├── rental.ts       # Rental interface
│       │   └── user.ts         # User interface
│       ├── lib/                # Utilities
│       │   ├── env.ts          # Env helpers
│       │   ├── i18n/           # Translations
│       │   └── utils/          # Image utilities
│       ├── middleware.ts       # Next.js middleware
│       └── types/              # Context types
│           ├── authContext.ts
│           ├── gameContext.ts
│           ├── rentalContext.ts
│           └── usersContext.ts
├── rental-api/                 # NestJS Backend API
│   ├── .env.example            # Backend env template
│   ├── eslint.config.mjs       # ESLint flat config
│   ├── nest-cli.json           # NestJS CLI config
│   ├── package.json
│   ├── tsconfig.json           # TypeScript config (strict)
│   ├── tsconfig.build.json     # Build TS config
│   ├── Dockerfile              # Multi-stage Docker build
│   └── src/
│       ├── main.ts             # Application bootstrap
│       ├── app.module.ts       # Root module
│       ├── cors.ts             # CORS configuration
│       ├── config/
│       │   └── env.ts          # Environment configuration
│       ├── auth/               # Authentication module
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   └── dto/
│       │       └── auth.dto.ts
│       ├── user/               # User management
│       │   ├── user.controller.ts
│       │   ├── user.service.ts
│       │   ├── user.module.ts
│       │   ├── dto/
│       │   │   └── user.dto.ts
│       │   └── entities/
│       │       └── user.entity.ts
│       ├── game/               # Game management
│       │   ├── game.controller.ts
│       │   ├── game.service.ts
│       │   ├── game.module.ts
│       │   ├── game.gateway.ts    # WebSocket gateway
│       │   ├── dto/
│       │   │   ├── create-game.dto.ts
│       │   │   └── update-game.dto.ts
│       │   └── entities/
│       │       └── game.entity.ts
│       ├── rental/             # Rental management
│       │   ├── rental.controller.ts
│       │   ├── rental.service.ts
│       │   ├── rental.module.ts
│       │   ├── rental.gateway.ts  # WebSocket gateway
│       │   ├── dto/
│       │   │   └── create-rental.dto.ts
│       │   └── entities/
│       │       └── rental.entity.ts
│       ├── guards/             # Auth & permission guards
│       │   ├── auth.guard.ts
│       │   └── perms.guard.ts
│       ├── decorators/
│       │   └── permissions.decorator.ts
│       ├── enums/
│       │   └── permissions.enum.ts
│       └── types/              # Type definitions
│           ├── express.d.ts
│           ├── gateway.ts
│           └── jwt-payload.ts
└── README.md                   # This file
```

---

## Requirements

- **Node.js**: 20+ (LTS recommended)
- **npm**: 10+
- **Docker**: Desktop or Engine with Compose plugin
- **MySQL**: 8.0+ (or use Docker service)

---

## Environment Variables

### Quick Start

```bash
# 1. Copy root template
cp .env.example .env

# 2. Edit .env with your values (at minimum change JWT_SEC and AD_PASS)
# 3. For local frontend development:
cp front/.env.example front/.env.local

# 4. For local backend development:
cp rental-api/.env.example rental-api/.env
```

### Complete Variable Reference

| Variable                                   | Description                              | Required | Default                 | Used By  |
| ------------------------------------------ | ---------------------------------------- | -------- | ----------------------- | -------- |
| **Database**                               |                                          |          |                         |          |
| `DB_HOST`                                  | MySQL host                               | Yes      | `localhost`             | Backend  |
| `DB_PORT`                                  | MySQL port                               | Yes      | `3306`                  | Backend  |
| `DB_USER`                                  | MySQL user                               | Yes      | `root`                  | Backend  |
| `DB_PASS`                                  | MySQL password                           | Yes      | `root`                  | Backend  |
| `DB_NAME`                                  | Database name                            | Yes      | `rental`                | Backend  |
| `DB_SYNCHRONIZE`                           | Auto-sync schema (`true`/`false`)        | No       | `true`                  | Backend  |
| **Backend Server**                         |                                          |          |                         |          |
| `PORT`                                     | Backend HTTP port                        | No       | `8080`                  | Backend  |
| `NODE_ENV`                                 | Environment (`development`/`production`) | No       | `development`           | Backend  |
| `ORIGIN_HOST`                              | Comma-separated CORS origins             | No       | See `.env.example`      | Backend  |
| **Authentication**                         |                                          |          |                         |          |
| `JWT_SEC`                                  | JWT signing secret (min 32 chars!)       | **YES**  | -                       | Backend  |
| `JWT_EXPIRES_IN`                           | Token TTL (e.g., `30d`, `24h`)           | No       | `30d`                   | Backend  |
| `AD_EMAIL`                                 | Bootstrap admin email                    | No       | -                       | Backend  |
| `AD_PASS`                                  | Bootstrap admin password                 | No       | -                       | Backend  |
| **Frontend (Public - exposed to browser)** |                                          |          |                         |          |
| `NEXT_PUBLIC_API_URL`                      | Backend REST API URL                     | Yes      | `http://localhost:8080` | Frontend |
| `NEXT_PUBLIC_WS_URL`                       | Backend WebSocket URL                    | Yes      | `http://localhost:8080` | Frontend |

### Docker-Specific Variables

Create `docker-envs/back.env` and `docker-envs/mysql.env` from the templates. Key differences:

| Variable      | Docker Value                                | Reason                           |
| ------------- | ------------------------------------------- | -------------------------------- |
| `DB_HOST`     | `db`                                        | Service name in docker-compose   |
| `DB_PASS`     | `root`                                      | Must match `MYSQL_ROOT_PASSWORD` |
| `NODE_ENV`    | `production`                                | Production optimizations         |
| `ORIGIN_HOST` | `http://localhost:3000,http://localhost...` | Allow all local origins          |

> **Security**: Never commit `.env` files. Use `.env.example` templates only. Generate strong secrets: `openssl rand -base64 32`

---

## Installation & Running

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker compose up --build

# Detached mode
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove volumes (clean DB)
docker compose down -v
```

**Services available at:**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081

### Option 2: Local Development (No Docker)

#### Backend

```bash
cd rental-api
npm install
cp .env.example .env
# Edit .env with your MySQL connection details
npm run start:dev
```

#### Frontend

```bash
cd front
npm install
cp .env.example .env.local
# Edit .env.local if backend runs on non-standard port
npm run dev
```

---

## Available Scripts

### Backend (`rental-api/`)

| Script                | Description                      |
| --------------------- | -------------------------------- |
| `npm run build`       | Compile TypeScript to `dist/`    |
| `npm run start`       | Run compiled production build    |
| `npm run start:dev`   | Run with hot reload (watch mode) |
| `npm run start:debug` | Run with debugger attached       |
| `npm run start:prod`  | Run production build             |
| `npm run lint`        | Run ESLint with auto-fix         |
| `npm run format`      | Format with Prettier             |
| `npm run test`        | Run unit tests (Jest)            |
| `npm run test:watch`  | Run tests in watch mode          |
| `npm run test:cov`    | Run tests with coverage          |
| `npm run test:e2e`    | Run e2e tests                    |

### Frontend (`front/`)

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start development server             |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Run production build                 |
| `npm run lint`  | Run Next.js ESLint                   |

---

## Docker Deployment

### Dockerfiles

Both applications use **multi-stage builds** for minimal production images:

- **Frontend**: `node:20-alpine` builder → `node:20-alpine` runner with standalone output
- **Backend**: `node:20-alpine` builder → `node:20-alpine` runner with compiled `dist/`

### Docker Compose Services

| Service      | Image                              | Ports       | Depends On            |
| ------------ | ---------------------------------- | ----------- | --------------------- |
| `nginx`      | `nginx:alpine`                     | `80:80`     | `frontend`, `backend` |
| `frontend`   | Build from `front/Dockerfile`      | `3000:3000` | `backend`             |
| `backend`    | Build from `rental-api/Dockerfile` | `8080:8080` | `db` (healthy)        |
| `db`         | `mysql:8.0`                        | `3306:3306` | -                     |
| `phpmyadmin` | `phpmyadmin`                       | `8081:80`   | `db`                  |

### Nginx Routing (`nginx/nginx.conf`)

| Path          | Proxies To                                    |
| ------------- | --------------------------------------------- |
| `/`           | `frontend:3000`                               |
| `/api/`       | `backend:8080`                                |
| `/socket.io/` | `backend:8080/socket.io/` (WebSocket upgrade) |

---

## Testing

```bash
# Backend unit tests
cd rental-api && npm run test

# Backend e2e tests
cd rental-api && npm run test:e2e

# Backend coverage
cd rental-api && npm run test:cov
```

---

## Code Quality

### Linting & Formatting

```bash
# Frontend
cd front && npm run lint

# Backend (ESLint flat config + Prettier)
cd rental-api && npm run lint
cd rental-api && npm run format
```

### TypeScript Configuration

- **Backend**: Strict mode enabled (`strict: true`, `noImplicitAny: true`)
- **Frontend**: Next.js default strict config with path aliases (`@/*` → `src/*`)

---

## Security Considerations

1. **JWT Secret**: Must be ≥32 random characters in production
2. **CORS**: Configured via `ORIGIN_HOST` - restrict to your domains
3. **Database**: `DB_SYNCHRONIZE=false` in production (use migrations)
4. **Admin Bootstrap**: Requires `AD_EMAIL` + `AD_PASS` - change defaults!
5. **Cookies**: HTTP-only, Secure (prod), SameSite=Lax
6. **WebSocket Auth**: Token validated on connection

---

## Troubleshooting

| Issue                          | Solution                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Backend can't connect to MySQL | Check `DB_HOST`/`DB_PORT` match running instance; ensure `db` container is healthy |
| Auth fails / 401               | Verify `JWT_SEC` matches in all environments; check token expiration               |
| Frontend can't reach API       | Verify `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` point to backend             |
| WebSocket connection fails     | Check Nginx `/socket.io/` proxy config; verify CORS origins                        |
| Admin not created              | Ensure `AD_EMAIL` and `AD_PASS` are set; check backend logs on startup             |
| Schema out of sync             | Set `DB_SYNCHRONIZE=false` and run migrations manually in production               |

---

## Production Build

```bash
# Frontend
cd front && npm run build

# Backend
cd ../rental-api && npm run build

# Outputs:
# - front/.next/standalone/  (Next.js standalone server)
# - rental-api/dist/         (Compiled JS)
```

---

## Known Limitations

- Single MySQL instance (no replication/cluster)
- No CI/CD pipeline configured
- No structured logging / observability stack (Prometheus, Grafana, etc.)
- No database migration system (uses `synchronize: true` for dev)
- Admin bootstrap only runs once; no password reset flow
- No rate limiting on API endpoints
- WebSocket reconnection logic is basic

---

## Future Recommendations

1. **Add database migrations** (TypeORM CLI) and disable `synchronize` in prod
2. **Implement CI/CD** (GitHub Actions: lint, test, build, docker push)
3. **Add structured logging** (Pino / Winston) + correlation IDs
4. **Implement rate limiting** (`@nestjs/throttler`)
5. **Add health checks** (`@nestjs/terminus`) for k8s readiness/liveness
6. **Introduce API versioning** (`/api/v1/...`)
7. **Add integration tests** (Testcontainers for MySQL)
8. **Implement refresh token rotation** for better JWT security
9. **Add request validation pipeline** (class-validator already used, good)
10. **Consider React Query / TanStack Query** for frontend data fetching

---

## Authors

- **Vladyslav Berezhnyi**

---

## License

UNLICENSED — Private project.
