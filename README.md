# CanRoute-API (Express + MongoDB)

Backend API for CanRoute - handles auth, cans, service logs, resident notifications (via QR), transfers, and payroll.

---

## Repositories

- Mobile App (Expo): https://github.com/derinkaras/CanRoute-App/tree/main
- Backend API (this repo): https://github.com/derinkaras/CanRoute-API

---

## Required Environment Variables

Set these in Render (or a local .env for development):

```
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/canroute
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=production
API_URL=https://your-render-service-name.onrender.com
```

Notes
- DB_URI — MongoDB Atlas recommended
- JWT_EXPIRES_IN — e.g., 1d, 7d, 12h
- API_URL — the public base URL (used by the app and for health pings)
- Set Arcjet variables only if you are using Arcjet middleware

---

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Auth
- Arcjet (optional security layer)
- CORS configured for Expo dev + production domain

---

## Local Development

```
npm install
npm run dev
# API at http://localhost:${PORT}
```

Create a .env with the variables above.

---

## Deploying to Render (Free Plan)

1) Create New Web Service in Render
- Connect to derinkaras/CanRoute-API
- Build Command: npm install
- Start Command: node server.js (or your entry)
- Environment: add variables from above

2) Keep Free Instance Awake (Cron Ping)
Free instances may spin down. Keep warm by pinging a health endpoint every 5–10 min:
- Implement GET /health (returns { ok: true })
- Point UptimeRobot/cron-job.org/Healthchecks to ${API_URL}/health

Example server.js snippet

```js
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
```

3) CORS
Allow Expo dev host during development; restrict in production.

Example CORS config

```js
import cors from 'cors';

const allowed = [process.env.API_URL, 'http://localhost:19006']; // add Expo/web hosts
app.use(cors({ origin: allowed, credentials: true }));
```

---

## Auth

- POST /api/auth/register — create user
- POST /api/auth/login — returns JWT
- GET /api/auth/users — list users (admin)

JWT middleware

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
```

---

## Endpoints (High-Level)

Cans
- GET /api/cans — list cans
- GET /api/cans/:id — get can
- POST /api/cans — create can
- PATCH /api/cans/:id — update can
- DELETE /api/cans/:id — delete can

Notifications
- GET /api/notifications — list notifications
- POST /api/notifications — create notification
- PATCH /api/notifications/:id — update status
- DELETE /api/notifications/:id — delete notification

Service Logs
- GET /api/service-logs — list logs
- POST /api/service-logs — create log
- PATCH /api/service-logs/:id — update log
- DELETE /api/service-logs/:id — delete log

Payroll
- GET /api/payroll — list payroll entries
- POST /api/payroll — create entry
- PATCH /api/payroll/:id — update entry
- DELETE /api/payroll/:id — delete entry

Transfers
- GET /api/transfers — list transfers
- POST /api/transfers — create transfer
- PATCH /api/transfers/:id — update transfer
- DELETE /api/transfers/:id — delete transfer

---

## Models (Overview)

- User — workers/supervisors, auth, assignments
- Can — physical bin with geo + status
- ServiceLog — actions taken on cans
- CanNotification — alerts from resident or worker
- Transfer — can/route reassignment
- Payroll — hourly logs, amounts, approvals

---

## Testing (optional)

- Unit: Jest + Supertest
- API docs: Swagger/OpenAPI (future suggestion)

---

## License

MIT — see repository license.

---

## Credits

Created by Derin Karas
- App: https://github.com/derinkaras/CanRoute-App/tree/main
- API: https://github.com/derinkaras/CanRoute-API
