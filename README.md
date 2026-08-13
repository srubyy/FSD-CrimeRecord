# CrimeNet OS // Facility Control Management System

A high-security, full-stack prison management application featuring a modern React frontend, Express/Mongoose REST API, JWT Role-Based Access Control (RBAC), real-time WebSockets communication, automated CI/CD pipelines, and multi-container Docker orchestration.

---

## 🐳 Run with Docker (Self-Contained Local Environment)

You can spin up the complete full-stack environment locally using **Docker Compose** without needing external dependencies, local Node.js installations, or cloud database connections (runs fully offline from MongoDB Atlas).

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Docker Compose installed.

### Step-by-Step Launch Sequence

```bash
# 1. Clone or navigate to the repository directory
cd /path/to/FSD

# 2. Create local Docker environment file from template
cp .env.docker.example .env.docker

# 3. Build and launch all 3 micro-services (MongoDB + API Server + Nginx Web)
docker-compose up --build
```

### Containerized Port Mappings & Endpoint Access

| Container Service | Docker Image / Source | Exposed Port | Purpose |
| :--- | :--- | :--- | :--- |
| **`crimenet-web`** | `Dockerfile.frontend` (Nginx:alpine) | `http://localhost:8080` | React Single Page Application frontend |
| **`crimenet-api`** | `server/Dockerfile` (Node:20-alpine) | `http://localhost:5001` | Express REST API & Socket.IO WebSockets |
| **`crimenet-mongo`** | `mongo:7` | `localhost:27017` | Isolated local MongoDB database container |

---

## 🏗️ Deployment Architecture (Vercel & Render)

The production application is decoupled into a static SPA frontend on Vercel and a persistent Web Service backend on Render:

```text
  ┌───────────────────────────────┐
  │   Vercel (Static CDN)         │
  │   CrimeNet OS React SPA       │
  └──────────────┬────────────────┘
                 │ HTTP / REST API & WebSockets
                 ▼
  ┌───────────────────────────────┐
  │   Render (Web Service)        │
  │   Express API + Socket.IO     │
  └──────────────┬────────────────┘
                 │ Mongoose Driver
                 ▼
  ┌───────────────────────────────┐
  │   MongoDB Atlas               │
  │   Cloud Database Cluster      │
  └───────────────────────────────┘
```

---

## 🧪 CI/CD Quality Gate Pipeline (`.github/workflows/ci-cd.yml`)

Every code push to `main` triggers an automated 3-stage GitHub Actions pipeline:

```text
[Push / PR] ──► [1. Oxlint + Build + In-Memory QA] ──► [2. Deploy Vercel & Render] ──► [3. Build & Push Docker Images to GHCR]
```

1. **Job 1 (CI Gate)**: Runs `Oxlint`, Vite build compilation, and executes the complete Postman Newman QA test suite (29 requests, 58 assertions) against an isolated, ephemeral in-memory database (`mongodb-memory-server`).
2. **Job 2 (Deploy)**: Deploys static SPA frontend to Vercel and triggers Render Web Service deploy hook.
3. **Job 3 (Docker GHCR)**: Builds production multi-stage Docker images (`crimenet-api` and `crimenet-web`) and pushes them to GitHub Container Registry (`ghcr.io`).

---

## 🔑 Required Configuration & Environment Variables

### **1. GitHub Repository Secrets** (`Settings` $\rightarrow$ `Secrets and variables` $\rightarrow$ `Actions`)

| Secret Name | Description |
| :--- | :--- |
| `VERCEL_TOKEN` | Vercel Personal Access Token |
| `VERCEL_ORG_ID` | Vercel Organization / Team ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |
| `RENDER_DEPLOY_HOOK_URL` | Render Deploy Hook URL |

---

### **2. Render Dashboard Environment Variables** (`crimenet-api` $\rightarrow$ `Environment`)

| Variable Name | Value |
| :--- | :--- |
| `MONGO_URI` | MongoDB Atlas Connection String |
| `JWT_SECRET` | Secret string for signing 24h JWT auth tokens (Fail-fast enforced: server exits if missing) |
| `ALLOWED_ORIGINS` | `https://fsd-crime-record.vercel.app,http://localhost:5173,http://localhost:8080` |
| `PORT` | `10000` |
