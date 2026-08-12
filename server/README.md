# CrimeNet OS // JWT Authentication & Role-Based API Backend

Production-ready Express.js + Mongoose REST API for CrimeNet OS Facility Control System, hardened with JWT Authentication and Role-Based Access Control (RBAC).

---

## 1. Required Environment Variables

Create `.env` based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/crimenet?retryWrites=true&w=majority
JWT_SECRET=crimenet_super_secret_jwt_key_2026
ALLOWED_ORIGINS=http://localhost:5173,https://fsd-crime-record.vercel.app
```

> **CRITICAL SECURITY REQUIREMENT**: Both `MONGO_URI` and `JWT_SECRET` have **NO fallback values** in source code. The server will refuse to start if either is missing.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Endpoint | Method | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new staff user |
| `/api/auth/login` | `POST` | Public | Authenticate & receive 24h JWT token |
| `/api/inmates` | `GET` | Public | List inmate records (filtered) |
| `/api/inmates/:id` | `GET` | Public | View single inmate dossier |
| `/api/inmates` | `POST` | `Admin`, `Officer` | Intake new prisoner record |
| `/api/inmates/:id` | `PUT` | `Admin`, `Officer` | Update inmate record |
| `/api/inmates/:id` | `DELETE` | **`Admin` Only** | Permanent record expungement |
| `/api/auditlogs` | `GET` | Public | View security audit feed |
| `/api/auditlogs` | `POST` | `Admin`, `Officer`, `Warden` | Append security incident log |

---

## 3. Demo User Accounts (Seeded via `node server/seed.js`)

| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin_vance` | `AdminPass123!` | `Admin` | Full administrative rights (GET, POST, PUT, DELETE) |
| `officer_blake` | `OfficerPass123!` | `Officer` | Facility officer (GET, POST, PUT inmate records) |
| `warden_k` | `WardenPass123!` | `Warden` | Facility warden (GET, POST audit logs; No inmate edits/deletes) |

---

## 4. Authentication API Reference

### A. Login (`POST /api/auth/login`)

**Request Body:**
```json
{
  "username": "admin_vance",
  "password": "AdminPass123!"
}
```

**200 OK Response:**
```json
{
  "status": "success",
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "66b9f2c1e4b0123456789abc",
    "username": "admin_vance",
    "role": "Admin",
    "createdAt": "2026-08-12T23:00:00.000Z",
    "updatedAt": "2026-08-12T23:00:00.000Z"
  }
}
```

---

## 5. Protected Endpoint Access with Bearer Token

Protected routes (`POST`, `PUT`, `DELETE`) require the `Authorization: Bearer <token>` header.

### Example cURL Request (`DELETE /api/inmates/CN-9999`):
```bash
curl -X DELETE http://localhost:5000/api/inmates/CN-9999 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example JavaScript `fetch`:
```javascript
const response = await fetch('https://fsd-crime-record.vercel.app/api/inmates/CN-9999', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
const data = await response.json();
```
