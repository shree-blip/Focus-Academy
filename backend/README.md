# Focus Academy Backend (Phase 1)

Node.js + Express + Socket.IO backend scaffold for real-time user/admin flows.

## What is implemented

- Auth: register, login, me
- Auth: register, login, Google login, me
- RBAC: admin + learner guard middleware
- Course APIs: catalog + admin CRUD (draft/published/archived)
- Enrollment APIs: create enrollment, learner/admin lists
- Payments (mock): checkout + callback simulation for eSewa/Khalti integration phase
- Realtime events: enrollment and payment updates over Socket.IO

## Quick start

1. Copy env:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run:

```bash
npm run dev
```

Backend runs on `http://localhost:5050`.

## Google Sign-In Setup

1. Create a Google OAuth Web Client.
2. Set `GOOGLE_CLIENT_ID` in `backend/.env`.
3. Set `google_oauth_client_id` in root `_config.yml`.

If client ID is not set, email/password auth still works.

## Demo users

- Admin: `admin@focusacademy.test` / `Admin@123`
- Learner: `user@focusacademy.test` / `User@123`

## Core endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/catalog`
- `GET /api/courses` (admin)
- `POST /api/courses` (admin)
- `PATCH /api/courses/:courseId` (admin)
- `POST /api/enrollments`
- `GET /api/enrollments/me`
- `GET /api/admin/enrollments` (admin)
- `POST /api/payments/checkout`
- `POST /api/payments/mock-callback`
- `GET /api/payments/me`

## Realtime channels

- Client emits: `join:user` with userId
- Admin client emits: `join:admin`
- Server emits:
  - `enrollment.updated`
  - `admin.enrollment.updated`
  - `payment.updated`
  - `admin.payment.updated`

## Next phase

- Replace in-memory store with PostgreSQL
- Add persistent sessions + refresh tokens
- Add eSewa and Khalti signature/webhook verification
- Add audit logs + notification service
