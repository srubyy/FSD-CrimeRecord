# CrimeNet OS // Backend REST API Server

Production-ready Express.js + Mongoose REST API for the CrimeNet OS Facility Control System.

---

## 1. Quick Start & Setup

### Environment Configuration
Copy `.env.example` to create your local `.env` file:
```bash
cp server/.env.example server/.env
```

Ensure MongoDB is running locally or specify your MongoDB connection string in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crimenet
```

### Seeding Initial Data
Populate the MongoDB database with initial inmate records and audit logs:
```bash
node server/seed.js
```

### Running the API Server
Start the Express server with live-reloading via `nodemon`:
```bash
npm run server:dev
```

Or run the production server:
```bash
npm run server
```

---

## 2. API Endpoints Reference

### A. Inmates Endpoints (`/api/inmates`)

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inmates` | Retrieve all inmate records | `?securityTier=Maximum` (optional)<br>`?search=Vance` (optional) |
| `GET` | `/api/inmates/:id` | Fetch single inmate by business ID | `:id` (e.g., `CN-8092`) |
| `POST` | `/api/inmates` | Register a new prisoner record | JSON body (Inmate Schema) |
| `PUT` | `/api/inmates/:id` | Update an existing inmate record | JSON body of fields to update |
| `DELETE` | `/api/inmates/:id` | Delete an inmate record | `:id` (e.g., `CN-8092`) |

#### Example Request / Response

**POST `/api/inmates` Request Body:**
```json
{
  "id": "CN-8169",
  "fullName": "Munna MBBS",
  "alias": "Munna",
  "age": 30,
  "cellBlock": "Block Alpha-1",
  "securityTier": "Maximum",
  "crimeCategory": "Assault & Battery",
  "medicalAlert": "None / Cleared",
  "medicalAlertSeverity": "emerald",
  "status": "Active",
  "cellNumber": "A1-101",
  "admissionDate": "2026-08-12",
  "sentenceLength": "5 Years",
  "paroleEligible": "2029",
  "dangerRating": 9.1,
  "notes": "DO NOT LEAVE ALONE UNCHAINED.",
  "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
}
```

**201 Created Response:**
```json
{
  "_id": "66b9f2c1e4b0123456789abc",
  "id": "CN-8169",
  "fullName": "Munna MBBS",
  "alias": "Munna",
  "age": 30,
  "cellBlock": "Block Alpha-1",
  "securityTier": "Maximum",
  "crimeCategory": "Assault & Battery",
  "medicalAlert": "None / Cleared",
  "medicalAlertSeverity": "emerald",
  "status": "Active",
  "cellNumber": "A1-101",
  "admissionDate": "2026-08-12",
  "sentenceLength": "5 Years",
  "paroleEligible": "2029",
  "dangerRating": 9.1,
  "notes": "DO NOT LEAVE ALONE UNCHAINED.",
  "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "createdAt": "2026-08-12T23:00:00.000Z",
  "updatedAt": "2026-08-12T23:00:00.000Z"
}
```

---

### B. Audit Logs Endpoints (`/api/auditlogs`)

> **Architectural Design Note**: `PUT` (update) and `DELETE` (destroy) endpoints are **intentionally omitted**. Security audit logs in high-security facilities are strictly append-only to preserve tamper-proof audit trails.

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auditlogs` | List security audit stream (newest first) | None |
| `POST` | `/api/auditlogs` | Broadcast new audit log event | JSON body (Audit Log Schema) |

#### Example Request / Response

**POST `/api/auditlogs` Request Body:**
```json
{
  "id": "LOG-9194",
  "timestamp": "Just now",
  "user": "Intake Officer (Terminal #01)",
  "action": "New Prisoner Intake Registered",
  "target": "Inmate Munna MBBS (CN-8169)",
  "type": "intake",
  "severity": "rose",
  "details": "Assigned to Block Alpha-1. Security Tier: Maximum."
}
```

**201 Created Response:**
```json
{
  "_id": "66b9f2c1e4b0123456789def",
  "id": "LOG-9194",
  "timestamp": "Just now",
  "user": "Intake Officer (Terminal #01)",
  "action": "New Prisoner Intake Registered",
  "target": "Inmate Munna MBBS (CN-8169)",
  "type": "intake",
  "severity": "rose",
  "details": "Assigned to Block Alpha-1. Security Tier: Maximum.",
  "createdAt": "2026-08-12T23:00:00.000Z",
  "updatedAt": "2026-08-12T23:00:00.000Z"
}
```

---

## 3. Key Design Decisions

1. **Business ID Lookups (`CN-8092` / `LOG-9081`) vs Mongo `_id`**:
   Lookups, updates, and deletes operate on human-readable domain identifiers (`CN-8092`) rather than internal MongoDB ObjectIds (`_id`). This decouples API consumers from underlying database-specific primary key implementations.

2. **Append-Only Audit Logs**:
   Security audit logs represent immutable facility history. Omitting `PUT` and `DELETE` endpoints prevents audit record tampering and guarantees regulatory compliance.
