# CrimeNet OS // Secure Production REST API Backend

Enterprise-grade Express.js + Mongoose REST API for CrimeNet OS Facility Control System, hardened with multi-layer security controls.

---

## 1. Required Environment Variables

Create `.env` based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/crimenet?retryWrites=true&w=majority
API_KEY=crimenet_secret_key_2026
ALLOWED_ORIGINS=http://localhost:5173,https://fsd-crime-record.vercel.app
```

> **CRITICAL SECURITY REQUIREMENT**: `MONGO_URI` has **NO fallback credentials** anywhere in the codebase. The server will throw a critical error and refuse to start if `MONGO_URI` is missing from the environment.

---

## 2. Security Architecture & Layers

1. **Strict MONGO_URI Enforcement**: Eliminates hardcoded database credentials from source code; refuses execution if missing.
2. **Helmet HTTP Headers**: Applies 15+ security header protections (XSS, Clickjacking, MIME sniffing, HSTS).
3. **NoSQL Injection Defense**: Sanitizes all `req.body`, `req.query`, and `req.params` inputs via `express-mongo-sanitize` to strip Mongo operator keys (`$gt`, `$where`).
4. **ReDoS & Pattern Injection Defense**: Escapes special regex characters in search query inputs before constructing `RegExp`.
5. **Strict Input Validation**: Pre-validates payloads via `express-validator` schema middleware prior to database operations.
6. **API Key Authentication**: Protects all write endpoints (`POST`, `PUT`, `DELETE`) via `x-api-key` request header validation.
7. **Rate Limiting**: Enforces global API rate limiting (100 req/15 min) and write rate limiting (20 req/15 min) per IP address via `express-rate-limit`.
8. **Payload Size Restrictions**: Configures `express.json({ limit: '10kb' })` to mitigate body payload denial-of-service abuse.
9. **CORS Isolation**: Restricts cross-origin resource sharing strictly to domain origins listed in `ALLOWED_ORIGINS`.
10. **Centralized Error Handling**: Logs full error stack server-side while masking internal stack traces from clients in production.

---

## 3. Authenticated API Write Example

Protected write endpoints (`POST`, `PUT`, `DELETE`) require the `x-api-key` request header.

### Example cURL Request (`POST /api/inmates`):
```bash
curl -X POST http://localhost:5000/api/inmates \
  -H "Content-Type: application/json" \
  -H "x-api-key: crimenet_secret_key_2026" \
  -d '{
    "id": "CN-9999",
    "fullName": "Test Prisoner",
    "securityTier": "Maximum",
    "crimeCategory": "Cyber Heist"
  }'
```

### Example JavaScript `fetch`:
```javascript
const response = await fetch('https://fsd-crime-record.vercel.app/api/inmates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'crimenet_secret_key_2026',
  },
  body: JSON.stringify({
    id: 'CN-9999',
    fullName: 'Test Prisoner',
    securityTier: 'Maximum',
  }),
});
const data = await response.json();
```
