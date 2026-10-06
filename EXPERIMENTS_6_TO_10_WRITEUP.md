# FULL LAB RECORD WRITE-UP: EXPERIMENTS 6, 7, 8, 9 & 10

**Course / Subject**: Full Stack Web Development (FSD)  
**Project Name**: APEX CORRECTIONS // Custodial Intelligence & Operations Platform  
**Repository**: [github.com/srubyy/FSD-CrimeRecord](https://github.com/srubyy/FSD-CrimeRecord.git)  

---
---

# EXPERIMENT 6

## [FRONT PAGE]

### 1. AIM
Implement authentication and user roles with JWT

---

### 2. THEORY

#### A. JSON Web Tokens (JWT) Architecture
JSON Web Token (JWT) is an open industry standard (RFC 7519) that defines a compact, URL-safe, and self-contained mechanism for securely transmitting information between parties as a JSON object. A JWT is digitally signed using a cryptographic algorithm (HMAC SHA-256 or RSA/ECDSA) with a secret key or private/public keypair.

A JWT consists of three base64url-encoded parts delimited by periods (`.`):
1. **Header**: Contains the token type (`"typ": "JWT"`) and the cryptographic signing algorithm being applied (`"alg": "HS256"`).
2. **Payload**: Houses the claims (statements about an entity and operational metadata). Standard claims include registered claims (`exp` expiration timestamp, `iat` issued at), alongside custom application claims such as `userId`, `username`, and `role`.
3. **Signature**: Computed by taking the encoded header, encoded payload, secret salt, and algorithm specified in the header:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + \text{"."} + \text{base64UrlEncode}(\text{Payload}), \text{secret})$$

#### B. Stateless Authentication vs. Stateful Session Cookies
Traditional session authentication maintains server-side memory state (storing session IDs in Redis or database memory) and transmits a cookie. This creates architectural bottlenecks in horizontally scaled server clusters. 
JWTs deliver stateless authentication:
- The server issues a cryptographically signed token upon credential verification.
- Subsequent client requests transmit this token inside the HTTP `Authorization: Bearer <token>` request header.
- Each microservice or API cluster node validates the signature locally using the shared secret without querying a central session storage database.

#### C. Role-Based Access Control (RBAC) Principles
Role-Based Access Control regulates resource access based on assigned user responsibilities within an organization:
- **Principle of Least Privilege**: Users are granted only the minimum permissions necessary to execute their duties.
- **Hierarchical Authorization Gates**: Middleware functions inspect the authenticated user's role before granting route execution. Operations such as read-only telemetry querying are permitted for standard operators, whereas destructive mutations (e.g., inmate record expungement) require administrative credentials.

---

## [BACK PAGE]

### 3. OBJECTIVE (WHAT IS USED / DONE IN MY PROJECT)

#### A. Technologies & Libraries Used
- **Node.js & Express.js**: REST API server engine and middleware orchestration.
- **`jsonwebtoken`**: Generation (`jwt.sign`) and verification (`jwt.verify`) of bearer tokens with 24-hour expiration (`expiresIn: '24h'`).
- **`bcryptjs`**: Cryptographic password hashing (10 salt rounds) for credential storage in MongoDB.
- **Redux Toolkit (`authSlice.js`)**: Client-side state persistence for `token`, `user`, and `role` across page reloads via `localStorage`.

#### B. Project Implementation Details
1. **User Schema & Role Definition (`server/models/User.js`)**:
   - Stored user identities with fields: `username`, `email`, `passwordHash`, and `role`.
   - Defined strict roles: `Admin` (Warden/Superintendent), `Officer` (Correctional Guard), and `Medical` (Facility Physician).
2. **Authentication Controller (`server/routes/auth.js`)**:
   - **`/api/auth/register`**: Hashes raw passwords with `bcryptjs.genSalt(10)` and creates user records.
   - **`/api/auth/login`**: Verifies hashed passwords; generates and signs a JWT payload containing `{ id: user._id, username: user.username, role: user.role }`.
3. **Authentication & RBAC Middleware (`server/middleware/auth.js`)**:
   - `verifyToken`: Extracts the HTTP `Bearer` token, verifies its cryptographic signature against `process.env.JWT_SECRET`, and attaches the decoded user payload to `req.user`.
   - `requireRole(['Admin'])`: Guards high-clearance routes (such as `DELETE /api/inmates/:id`). Rejects unauthorized requests with HTTP `403 Forbidden` (`"Access Denied: Administrator clearance required"`).
4. **Frontend UI Integration (`src/components/AuthModal.jsx` & `src/App.jsx`)**:
   - Built an interactive credential management modal with pre-configured quick logins (`Admin`, `Officer`, `Medical`).
   - Synced user session details to the top navigation header (`TopNav.jsx`), showing user clearance levels and disabling restricted buttons (e.g., delete/expunge) when non-admin credentials are used.

---

### 4. CONCLUSION
In this experiment, robust stateless authentication and Role-Based Access Control were successfully engineered and integrated into the APEX Corrections platform using JSON Web Tokens (JWT) and Bcrypt:
1. **Stateless Security**: Implemented token-based authentication with signed bearer tokens containing user identities and clearance roles.
2. **Granular RBAC Enforcement**: Built reusable Express middleware ensuring non-admin operators are strictly prevented from executing destructive actions (inmate record expungement).
3. **Full-Stack Session Synchronization**: Connected the Node.js JWT verification pipeline with Redux Toolkit on the React frontend, persisting authenticated credentials and dynamically updating interface controls.

---
---

# EXPERIMENT 7

## [FRONT PAGE]

### 1. AIM
Validating RESTful APIs using Postman.

---

### 2. THEORY

#### A. REST Architectural Constraints & HTTP Methods
Representational State Transfer (REST) is an architectural style for distributed hypermedia systems governed by six core constraints: Client-Server separation, Statelessness, Cacheability, Layered System architecture, Code on Demand, and Uniform Interface.
Standard HTTP methods represent CRUD operations on resources:
- **`GET`**: Retrieve resources idempotently without mutating server state.
- **`POST`**: Create new sub-resources; non-idempotent.
- **`PUT` / `PATCH`**: Replace entirely (`PUT`) or partially modify (`PATCH`) an existing resource; `PUT` is idempotent.
- **`DELETE`**: Expunge an existing resource idempotently.

#### B. HTTP Status Code Classification
HTTP status codes provide standardized machine-readable response summaries:
- **`2xx` (Success)**: `200 OK` (standard response), `201 Created` (successful resource addition), `204 No Content` (successful deletion with empty body).
- **`4xx` (Client Errors)**: `400 Bad Request` (schema validation failure), `401 Unauthorized` (missing or invalid JWT), `403 Forbidden` (valid token but insufficient role privileges), `404 Not Found` (non-existent resource identifier).
- **`5xx` (Server Errors)**: `500 Internal Server Error` (unhandled server exceptions).

#### C. Automated API Contract Testing via Postman
Postman provides an automated testing framework using a bundled Node.js JavaScript sandbox (`pm.*` API).
- **Pre-request Scripts**: JavaScript executed prior to request dispatch (e.g., generating timestamps, dynamic IDs, or computing authentication headers).
- **Post-response Test Scripts**: Assertions run immediately following response receipt to validate response timing (`pm.response.responseTime`), HTTP status codes (`pm.response.to.have.status`), and JSON schema structures (`pm.expect(jsonData).to.have.property(...)`).
- **Environment Variables**: Dynamic scopes (`{{baseUrl}}`, `{{adminToken}}`) that pass variables downstream across requests, chaining authentication tokens to secured endpoints automatically.

---

## [BACK PAGE]

### 3. OBJECTIVE (WHAT IS USED / DONE IN MY PROJECT)

#### A. Technologies & Tools Used
- **Postman Desktop Client & Postman CLI / Newman**: API test automation suite.
- **`postman/CrimeNet-API.postman_collection.json`**: Standardized collection containing all endpoint definitions.
- **`postman/CrimeNet-Local.postman_environment.json`**: Dynamic environment configuration with variable mappings.
- **Express Backend (`server/routes/inmates.js`, `server/routes/auth.js`)**: Endpoints under test.

#### B. Project Implementation Details
1. **Environment Configuration**:
   - Variables initialized: `baseUrl = http://localhost:5001`, `officerToken = ""`, `adminToken = ""`, `createdInmateId = ""`.
2. **Automated Token Chaining & Dynamic Scripts**:
   - **`POST /api/auth/login` (Admin Login)**: Post-response test script automatically parses the JSON response and stores the token:
     ```javascript
     pm.test("Status code is 200", () => pm.response.to.have.status(200));
     const data = pm.response.json();
     pm.environment.set("adminToken", data.token);
     ```
   - Subsequent authenticated endpoints consume `{{adminToken}}` in their HTTP Authorization headers (`Bearer {{adminToken}}`).
3. **Endpoint Validation Suite**:
   - **Authentication**: Validated user login, JWT generation, and handling of malformed passwords (`401 Unauthorized`).
   - **Inmate Retrieval (`GET /api/inmates`)**: Verified response status `200 OK`, JSON array payload structure, and cell block query filtering.
   - **Inmate Booking (`POST /api/inmates`)**: Transmitted offender payload; verified `201 Created` and dynamic capture of `_id` into `{{createdInmateId}}`.
   - **RBAC Clearance Verification (`DELETE /api/inmates/:id`)**: Tested token-based access control by verifying that requests made with an Officer token fail with `403 Forbidden`, whereas Admin credentials successfully delete the record (`200 OK` / `204 No Content`).
4. **Newman Test Runner Script (`server/ci-test-runner.js`)**:
   - Scripted automated collection runs using Newman directly from the CLI to ensure zero-regression testing during CI workflows.

---

### 4. CONCLUSION
In this experiment, the complete REST API surface of the APEX Corrections backend was systematically tested and validated using Postman and Newman:
1. **Comprehensive Endpoint Verification**: Authenticated, CRUD, and health check endpoints were tested for correct HTTP status codes (`200`, `201`, `401`, `403`, `404`).
2. **Automated Environment Chaining**: Configured pre-request and test scripts to automatically capture JWT credentials and dynamically pass authentication tokens into downstream requests.
3. **Security & Boundary Auditing**: Verified error handling and RBAC gates, ensuring unauthorized or invalid requests receive appropriate HTTP error responses and informative JSON error payloads.

---
---

# EXPERIMENT 8

## [FRONT PAGE]

### 1. AIM
Enable real-time communication via WebSockets

---

### 2. THEORY

#### A. Half-Duplex HTTP vs. Full-Duplex WebSockets
Traditional web communications rely on the HTTP request-response cycle, which is half-duplex (the client initiates requests and the server responds). This architecture requires techniques like Short Polling (frequent client requests) or Long Polling (holding HTTP connections open) to receive updates, introducing high HTTP header overhead and server resource strain.

The WebSocket protocol (RFC 6455) provides:
- **Full-Duplex Bidirectional Channels**: Both client and server can transmit data frames simultaneously over a single, long-lived TCP connection.
- **Minimal Framing Overhead**: After a single HTTP-based protocol upgrade handshake (`Upgrade: websocket`, `Connection: Upgrade`), data is transmitted with low overhead (2 to 10 bytes of frame overhead instead of repeated kilobyte-heavy HTTP headers).
- **Real-Time Telemetry Delivery**: The server pushes state changes immediately as events occur without waiting for client polling.

#### B. Socket.IO Abstraction Layer
Socket.IO is a real-time event-driven JavaScript library built on top of the WebSocket protocol with engine-level fallbacks:
- **Connection Upgrading**: Establishes initial connectivity using HTTP long-polling (`Engine.IO`) and upgrades automatically to raw WebSocket transport once supported.
- **Heartbeat & Automatic Reconnection**: Periodically transmits ping/pong packets to monitor socket health and recovers dropped connections with exponential backoff.
- **Event-Driven Custom Namespaces & Rooms**: Allows multiplexing event communications (`socket.emit('event', payload)` and `socket.on('event', callback)`) and grouping connected clients into designated broadcast channels.

#### C. Multi-Client Presence & Concurrent Broadcast Models
In high-security operations centers, multiple officers and terminals operate simultaneously. The server acts as a centralized event broker: when one operator commits a change (e.g., booking an offender), the server broadcasts this state delta to all other connected clients in real time, preventing data staleness across disparate browser tabs.

---

## [BACK PAGE]

### 3. OBJECTIVE (WHAT IS USED / DONE IN MY PROJECT)

#### A. Technologies & Libraries Used
- **`socket.io` (v4.8 Backend)**: WebSocket server mounted on the Node.js/Express HTTP server instance (`server/socket.js`).
- **`socket.io-client` (Frontend)**: Real-time client library interfacing with React custom hooks.
- **Custom Hook (`src/hooks/useSocket.js`)**: Manages socket connection lifecycle, connection state flags, and reconnection strategies.
- **Redux Toolkit Integration (`inmatesSlice.js`, `auditLogsSlice.js`)**: Reactively receives socket event payloads and updates domain state trees.

#### B. Project Implementation Details
1. **Socket Server Architecture (`server/socket.js`)**:
   - Attached Socket.IO server to the HTTP server instance with CORS configuration.
   - Handled `connection` and `disconnect` events with client lifecycle tracking.
   - Implemented real-time telemetry events:
     - `inmate:created`: Broadcasts newly booked offender dossiers to all active terminals.
     - `inmate:updated`: Syncs cell block transfers and security tier escalations.
     - `inmate:deleted`: Broadcasts record expungement events to remove cards from client tables immediately.
     - `auditlog:created`: Pushes live incident reports directly into audit streams.
2. **Staff Presence Tracking (`presence:update`)**:
   - Tracked active terminals with user identity metadata (`socket.id`, `username`, `role`).
   - Broadcasted connected staff rosters to clients, rendering active officer counts in the global header (`TopNav.jsx`).
3. **Frontend Integration (`src/hooks/useSocket.js` & `src/App.jsx`)**:
   - Instantiated socket client connecting to `http://localhost:5001`.
   - Built listeners in `App.jsx` dispatching incoming events directly into the Redux store (`dispatch(addInmate(newInmate))`, `dispatch(addAuditLog(newLog))`).
   - Integrated toast notifications alerting operators when remote terminals admit new offenders or trigger critical high-severity alerts.

---

### 4. CONCLUSION
In this experiment, bidirectional full-duplex real-time communication was successfully designed and integrated into the APEX Corrections platform using WebSockets and Socket.IO:
1. **Low-Latency Event Streaming**: Replaced polling with an event-driven architecture, pushing data updates across terminals with minimal latency.
2. **Multi-Client State Synchronization**: Validated multi-client state consistency; actions taken in one browser window (admissions, incident logs, tier modifications) are reflected instantly across all connected sessions.
3. **Operational Telemetry & Presence**: Integrated real-time presence monitoring into the UI header, displaying live WebSocket connection indicators and active duty personnel counts.

---
---

# EXPERIMENT 9

## [FRONT PAGE]

### 1. AIM
CI/CD Deployment with GitHub Actions + Render/Vercel

---

### 2. THEORY

#### A. Continuous Integration & Continuous Delivery (CI/CD) Principles
CI/CD is a cornerstone of modern DevOps, automating software delivery through structured validation:
- **Continuous Integration (CI)**: Developers merge code changes frequently into a central repository. Automated build runners trigger regression tests, linters, and compilers to identify integration issues early.
- **Continuous Delivery (CD)**: Successfully verified code is automatically packaged and deployed to staging or production environments with zero downtime.

#### B. GitHub Actions Automation Engine
GitHub Actions provides an automation platform executed in cloud runner environments:
- **Workflows (`.github/workflows/*.yml`)**: Declarative configuration files defining the end-to-end automation pipeline.
- **Triggers (`on: [push, pull_request]`)**: Event criteria that invoke workflow execution.
- **Jobs & Matrix Execution**: Units of work running on virtual runners (`ubuntu-latest`). Jobs execute sequentially or in parallel, isolating build artifacts.
- **Steps & Actions**: Individual executable units running shell commands (`run: npm test`) or community actions (`actions/checkout@v4`, `actions/setup-node@v4`).

#### C. Cloud PaaS Deployment Platforms (Render & Vercel)
- **Vercel**: A serverless cloud platform optimized for static frontend Single Page Applications (SPAs) and edge computing. Features include global Edge CDN caching, immutable deployment URLs, and automated GitHub branch deployments.
- **Render**: A cloud Platform-as-a-Service (PaaS) built for containerized services, background workers, and managed databases. It provides automatic TLS/SSL provisioning, health-check zero-downtime rolling restarts, and declarative infrastructure-as-code manifests (`render.yaml`).

---

## [BACK PAGE]

### 3. OBJECTIVE (WHAT IS USED / DONE IN MY PROJECT)

#### A. Technologies & Configuration Files Used
- **GitHub Actions (`.github/workflows/ci-cd.yml`)**: Continuous integration and deployment orchestration pipeline.
- **Vercel CLI & Configuration (`vercel.json`)**: Frontend cloud hosting with SPA routing rewrites.
- **Render Manifest (`render.yaml`)**: Cloud backend API and database infrastructure specification.
- **Vite & Oxlint**: Production compilation and static code analysis.

#### B. Project Implementation Details
1. **CI Pipeline Architecture (`.github/workflows/ci-cd.yml`)**:
   - Structured three automated pipeline stages:
     - **Stage 1 (Frontend Quality & Compilation)**: Checks out repository, provisions Node.js 20, installs dependencies via `npm ci`, runs Oxlint, and validates production builds using `npm run build`.
     - **Stage 2 (Backend Validation & Testing)**: Sets up dependencies, spins up in-memory MongoDB services, runs Newman/Postman integration suites, and validates API health routes.
     - **Stage 3 (Production Deployment)**: Triggers deployments to target cloud hosting providers upon successful completion of main branch tests.
2. **Frontend Deployment Configuration (`vercel.json`)**:
   - Configured single-page application routing rules (`"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`) ensuring client-side routes resolve through the Vite build bundle without HTTP 404 errors.
3. **Backend Infrastructure-as-Code (`render.yaml`)**:
   - Configured backend service settings (`env: node`, `plan: free`, `buildCommand: npm install`, `startCommand: node server/index.js`).
   - Injected runtime environment variables (`NODE_ENV=production`, `PORT=5001`, `JWT_SECRET`) and connected MongoDB Atlas database strings.

---

### 4. CONCLUSION
In this experiment, an automated CI/CD pipeline was successfully configured and deployed using GitHub Actions, Vercel, and Render:
1. **Automated Quality Verification**: Automated code linting, security audits, and production build verification on every Git push, preventing defective builds from reaching the main branch.
2. **Zero-Downtime Multi-Cloud Deployments**: Configured deployment automation with the React frontend hosted on Vercel's global CDN and the Node.js API hosted on Render.
3. **Reproducible Pipeline Configuration**: Documented deployment setups using version-controlled manifests (`render.yaml`, `vercel.json`, and `.github/workflows/ci-cd.yml`).

---
---

# EXPERIMENT 10

## [FRONT PAGE]

### 1. AIM
Deploy full-stack apps using DevOps tools and Docker

---

### 2. THEORY

#### A. Containerization vs. Hardware Virtualization
Traditional virtualization runs a hypervisor over physical hardware to spin up guest operating systems, each requiring dedicated kernel memory and system overhead.
Containerization (via Docker) provides OS-level virtualization:
- **Shared Host Kernel**: Containers share the host system's OS kernel while isolating execution processes, user spaces, and file systems.
- **Portability ("Build Once, Run Anywhere")**: Applications package their complete runtime environment—source code, libraries, system binaries, and configuration files—eliminating environment discrepancies ("it works on my machine").
- **Resource Efficiency**: Containers instantiate in milliseconds with minimal memory footprint compared to virtual machines.

#### B. Docker Engine Architecture & Multi-Stage Builds
- **`Dockerfile`**: A script of successive instructions (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`) that builds an immutable Docker Image layer-by-layer.
- **Multi-Stage Builds**: A technique that uses separate intermediate build environments to minimize final image sizes. Heavy toolchains (Node compilers, SDKs) generate production artifacts in an early stage; the final stage copies only the compiled output into a lightweight production image (e.g., Alpine Linux), stripping development dependencies and reducing the security attack surface.

#### C. Multi-Container Orchestration with Docker Compose
Full-stack architectures depend on interconnected services (frontend UI, backend API, persistent database). **Docker Compose** is an orchestration tool that defines and executes multi-container Docker applications using a declarative YAML configuration file (`docker-compose.yml`). It automates:
- **Service Dependency Resolution (`depends_on`)**: Ensures databases initialize before dependent APIs boot.
- **Isolated Bridge Networking**: Creates an internal DNS service network where containers communicate using service names (e.g., `mongodb://mongo:27017/crimenet`) without exposing internal ports to the public host.
- **Data Persistence via Docker Volumes**: Maps host storage to container paths to retain database data across container restarts.

---

## [BACK PAGE]

### 3. OBJECTIVE (WHAT IS USED / DONE IN MY PROJECT)

#### A. Technologies & Configuration Files Used
- **Docker Engine & Docker CLI**: Containerization runtime.
- **Docker Compose (`docker-compose.yml`)**: Multi-container service orchestrator.
- **`Dockerfile.frontend`**: Multi-stage build for the React/Vite client using Nginx.
- **`server/Dockerfile`**: Production containerization for the Node.js backend.
- **`nginx.conf`**: High-performance HTTP server and reverse proxy configuration.

#### B. Project Implementation Details
1. **Frontend Containerization (`Dockerfile.frontend` & `nginx.conf`)**:
   - **Stage 1 (Build)**: Used `node:20-alpine` to install dependencies and compile the production build (`npm run build`).
   - **Stage 2 (Serve)**: Copied compiled static assets from `/app/dist` into an unprivileged `nginx:alpine` image.
   - Configured `nginx.conf` with gzip compression, security headers, and fallback routing for React client-side paths (`try_files $uri $uri/ /index.html;`).
2. **Backend API Containerization (`server/Dockerfile`)**:
   - Built a lightweight `node:20-alpine` image.
   - Configured non-root container users, set `NODE_ENV=production`, installed production dependencies via `npm ci --only=production`, and exposed port `5001`.
3. **Multi-Container Orchestration (`docker-compose.yml`)**:
   - Coordinated three container services:
     1. **`mongo`**: Official `mongo:7` image with persistent named volume storage (`mongo_data:/data/db`).
     2. **`api`**: Node.js backend container linked to MongoDB via internal service DNS (`MONGO_URI=mongodb://mongo:27017/crimenet`) and exposing port `5001`.
     3. **`web`**: Nginx frontend container exposing port `8080:80` and dependent on the `api` service.
4. **Environment File & Build Verification**:
   - Configured `.env.docker` to supply environment configurations across containers.
   - Verified that executing `docker-compose up --build -d` provisions all services, starts MongoDB, boots the Node server, and serves the UI with zero manual host configuration.

---

### 4. CONCLUSION
In this experiment, the APEX Corrections full-stack application was containerized and orchestrated using Docker, multi-stage Dockerfiles, and Docker Compose:
1. **Optimized Multi-Stage Builds**: Implemented multi-stage Docker builds for the React frontend, reducing image size by serving static assets via Alpine Nginx.
2. **Isolated Multi-Container Architecture**: Orchestrated the frontend, backend, and MongoDB services within a unified Docker Compose network with isolated service discovery.
3. **Data Persistence & Reproducibility**: Secured database persistence using Docker volumes, enabling reliable local and production deployment via a single command (`docker-compose up`).
