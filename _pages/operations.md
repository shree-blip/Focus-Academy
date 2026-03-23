---
layout: page
permalink: /operations/
title: operations
description: course, enrollment, and payment operations blueprint
nav: true
nav_order: 10
---

## Course and Payment Management Blueprint

### 1) Virtual Courses

Manage virtual courses as structured catalog records with:

- title, description, level, modules
- start date, cohort, mentor assignment
- price, discount, and access duration
- publish status (draft/published/archived)

**Operational flow:**

1. Create course in Admin Dashboard
2. Publish to catalog
3. User enrolls and initiates payment
4. On verified payment, access is granted automatically

### 2) Physical Courses

Manage physical courses with location and capacity controls:

- venue, room, schedule blocks
- maximum seats and waitlist
- admission deadline and confirmation rules

**Operational flow:**

1. Admin sets schedule + seats
2. User applies/enrolls
3. Payment confirmation reserves seat
4. Admin can move waitlisted learners if seats open

### 3) Payments, Enrollments, and Access

Target gateways for this project:

- **eSewa**
- **Khalti**

**Recommended transaction lifecycle:**

1. Enrollment is created as `pending_payment`
2. User is redirected to eSewa/Khalti checkout
3. Gateway callback/webhook is verified server-side
4. Enrollment moves to `paid`
5. Virtual course access is activated or physical seat is confirmed
6. Receipt and transaction reference are stored for support/audit

### 4) What Exists Right Now

- Public curriculum pages and static content are live
- Admin/User dashboard pages are scaffolded for UI flow
- Backend phase 1 is implemented in `backend/` with auth, enrollments, mock payments, and realtime events

### 4.1) Quick Backend Commands

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Then test:

```bash
curl http://localhost:5050/api/health
```

### 5) Build-Next Checklist

- Implement secure backend app for auth and role management
- Add payment verification endpoints for eSewa and Khalti
- Add enrollment and access-control database tables
- Connect this site CTAs to live product endpoints
