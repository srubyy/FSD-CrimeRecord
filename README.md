# CrimeNet OS // Facility Control Management System

A high-security, full-stack prison management application featuring a modern React frontend, Express/Mongoose REST API, JWT Role-Based Access Control (RBAC), real-time WebSockets communication, and automated CI/CD deployment pipelines.

---

## 🏗️ Deployment Architecture

The application uses a decoupled micro-architecture separating the static Single Page Application (SPA) frontend from the persistent backend Web Service:

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

1. **Frontend (Vercel)**: Deployed as a static React SPA on Vercel's global CDN. Routes all backend requests dynamically to the Render backend via `VITE_API_URL`.
2. **Backend (Render Web Service)**: Deployed as a persistent long-lived Node.js Web Service on Render (`crimenet-api`). Enables full **Socket.IO WebSockets** support for real-time multi-client state broadcasting and presence tracking.
3. **Database (MongoDB Atlas)**: Cloud-hosted MongoDB database storing encrypted user credentials, inmate records, and tamper-proof security audit feeds.

---

## 🧪 CI/CD Quality Gate Pipeline (`.github/workflows/ci-cd.yml`)

Every code push or pull request triggers an automated GitHub Actions CI pipeline:

```text
[Push / PR] ──► [1. Oxlint Static Analysis] ──► [2. Vite Build Check] ──► [3. In-Memory MongoDB Newman QA] ──► [4. Deploy to Vercel & Render]
```

> [!IMPORTANT]
> **Ephemeral In-Memory Database Isolation**: The CI quality gate executes the complete **Postman Newman Automated API Test Suite (29 requests, 58 assertions)** against an isolated, ephemeral in-memory MongoDB server (`mongodb-memory-server`). The production MongoDB Atlas database is **never touched or polluted** during automated CI test runs.

---

## 🔑 Required Configuration & Environment Variables

### **1. GitHub Repository Secrets** (Set in GitHub $\rightarrow$ Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions)

| Secret Name | Description | Where to Obtain |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | Vercel Personal Access Token | Vercel Dashboard $\rightarrow$ Account Settings $\rightarrow$ Tokens |
| `VERCEL_ORG_ID` | Vercel Team / Account ID | Found in local `.vercel/project.json` or Vercel project settings |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Found in local `.vercel/project.json` or Vercel project settings |
| `RENDER_DEPLOY_HOOK_URL` | Render Deploy Hook URL | Render Dashboard $\rightarrow$ `crimenet-api` Service $\rightarrow$ Settings $\rightarrow$ Deploy Hook |

---

### **2. Render Dashboard Environment Variables** (Set in Render Dashboard $\rightarrow$ `crimenet-api` $\rightarrow$ Environment)

| Variable Name | Example / Description |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/crimenet?retryWrites=true&w=majority` |
| `JWT_SECRET` | Strong random secret string used for signing 24h JWT auth tokens |
| `ALLOWED_ORIGINS` | `https://fsd-crime-record.vercel.app,http://localhost:5173` |
| `PORT` | `10000` (Render default port) |

---

### **3. Vercel Project Environment Variable** (Set in Vercel Dashboard $\rightarrow$ Settings $\rightarrow$ Environment Variables)

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://crimenet-api.onrender.com` | Points frontend API requests to the Render backend URL |

---

## 🛠️ Local Development Setup

```bash
# Install dependencies
npm install

# Start local backend API & Socket server (port 5001)
npm run server

# Start local React frontend (port 5173)
npm run dev

# Run automated in-memory MongoDB QA test suite
node server/ci-test-runner.js
```
