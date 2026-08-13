# CrimeNet OS // Postman API Verification & Automated QA Suite

Automated API test collection and environment suite for validating CrimeNet OS RESTful backend endpoints (`Auth`, `Inmates`, `Audit Logs`).

---

## 1. Directory Structure

```text
postman/
├── CrimeNet-API.postman_collection.json    # Postman v2.1 Collection with 29 automated pm.test() assertions
├── CrimeNet-Local.postman_environment.json   # Postman Environment declaring {{base_url}} and JWT token slots
└── README.md                                 # Documentation & Newman CLI execution guide
```

---

## 2. Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `base_url` | `http://localhost:5000` | Target server host URL |
| `admin_token` | *(Populated dynamically)* | JWT issued during Admin login (`admin_vance`) |
| `officer_token` | *(Populated dynamically)* | JWT issued during Officer login (`officer_blake`) |
| `warden_token` | *(Populated dynamically)* | JWT issued during Warden login (`warden_k`) |

---

## 3. How to Import & Run in Postman GUI

1. Open **Postman Desktop Client** or **Postman Web**.
2. Click **Import** (top left) $\rightarrow$ select both files:
   - `postman/CrimeNet-API.postman_collection.json`
   - `postman/CrimeNet-Local.postman_environment.json`
3. Select the **`CrimeNet-Local`** environment from the top-right environment dropdown.
4. Click **CrimeNet-API** collection $\rightarrow$ click **Run Collection**.
5. Ensure execution order runs **Auth** folder first (so login tests populate token variables), then click **Run CrimeNet-API**.

---

## 4. Headless Execution via Newman CLI

Ensure local server is running on `http://localhost:5000` (`npm run server`), then execute:

```bash
npx newman run postman/CrimeNet-API.postman_collection.json -e postman/CrimeNet-Local.postman_environment.json
```

---

## 5. Endpoints & Test Validation Matrix

| Resource | Method | Endpoint | Required Role | Validated Assertions (`pm.test`) |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Public | Status 200, JWT token extracted to `admin_token` |
| **Auth** | `POST` | `/api/auth/login` | Public | Status 200, JWT token extracted to `officer_token` |
| **Auth** | `POST` | `/api/auth/login` | Public | Status 200, JWT token extracted to `warden_token` |
| **Auth** | `POST` | `/api/auth/register` | Public | Status 201, User created, `passwordHash` excluded |
| **Auth** | `POST` | `/api/auth/register` | Public | Status 400, Duplicate username blocked |
| **Auth** | `POST` | `/api/auth/register` | Public | Status 400, Password <6 chars rejected |
| **Auth** | `POST` | `/api/auth/register` | Public | Status 400, Invalid role enum rejected |
| **Auth** | `POST` | `/api/auth/login` | Public | Status 401, Invalid password rejected |
| **Auth** | `POST` | `/api/auth/login` | Public | Status 401, Nonexistent username rejected |
| **Inmates** | `GET` | `/api/inmates` | Public | Status 200, Returns array of records |
| **Inmates** | `GET` | `/api/inmates?securityTier=Maximum` | Public | Status 200, Every item has `securityTier === 'Maximum'` |
| **Inmates** | `GET` | `/api/inmates?search=Chen` | Public | Status 200, Search substring matches results |
| **Inmates** | `GET` | `/api/inmates/:id` | Public | Status 200, Matches inmate schema |
| **Inmates** | `GET` | `/api/inmates/:id` | Public | Status 404, Nonexistent ID returns not found error |
| **Inmates** | `POST` | `/api/inmates` | Public | Status 401, Unauthenticated write blocked |
| **Inmates** | `POST` | `/api/inmates` | `Admin`, `Officer` | Status 201, Record created successfully |
| **Inmates** | `POST` | `/api/inmates` | `Admin`, `Officer` | Status 400, Missing `fullName` rejected |
| **Inmates** | `POST` | `/api/inmates` | `Admin`, `Officer` | Status 400, Duplicate ID blocked |
| **Inmates** | `PUT` | `/api/inmates/:id` | `Admin`, `Officer` | Status 200, Updates notes field |
| **Inmates** | `PUT` | `/api/inmates/:id` | `Admin`, `Officer` | Status 404, Nonexistent ID returns not found error |
| **Inmates** | `DELETE` | `/api/inmates/:id` | `Officer` | Status 403, Officer role blocked from deletion |
| **Inmates** | `DELETE` | `/api/inmates/:id` | `Admin` | Status 200, Admin expunges record |
| **Inmates** | `DELETE` | `/api/inmates/:id` | `Admin` | Status 404, Repeat deletion returns not found |
| **Audit Logs** | `GET` | `/api/auditlogs` | Public | Status 200, Array sorted descending by `createdAt` |
| **Audit Logs** | `POST` | `/api/auditlogs` | Public | Status 401, Unauthenticated log append blocked |
| **Audit Logs** | `POST` | `/api/auditlogs` | `Admin`, `Officer`, `Warden` | Status 201, Warden appends audit incident |
| **Audit Logs** | `POST` | `/api/auditlogs` | `Admin`, `Officer`, `Warden` | Status 400, Invalid type enum rejected |
| **Audit Logs** | `PUT` | `/api/auditlogs/:id` | None | Status 404, Audit logs are tamper-proof |
| **Audit Logs** | `DELETE` | `/api/auditlogs/:id` | None | Status 404, Audit logs are append-only |
