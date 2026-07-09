# FixItNow 🔧 — Backend API

A home services marketplace backend built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma**. Customers can browse services, book technicians, pay via Stripe, and leave reviews. Technicians manage their profiles, availability, and bookings. Admins moderate users and categories.

---

**Live API:** https://fixitnow-two.vercel.app

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API framework |
| TypeScript | Type safety |
| PostgreSQL (Prisma Postgres) | Database |
| Prisma ORM v7 (`prisma-client` generator + driver adapters) | Database access layer |
| Zod | Request validation |
| JWT (`jsonwebtoken`) | Authentication |
| bcryptjs | Password hashing |
| Stripe | Payment processing (BDT) |
| tsup | Production build/bundling |
| Vercel | Deployment |

---

## 📁 Project Structure

```
prisma/
  schema.prisma          # Data models
  seed.ts                 # Database seed script
src/
  modules/                 # auth, technician, admin, service, booking, payment, review, category
  middlewares/            # auth guard, validateRequest, globalHandler
  schemas/                # Zod validation schemas
  utils/                  # AppError, sendResponse, easyController
  lib/prisma.ts            # Prisma client instance (driver adapter)
  server.ts
prisma.config.ts          # Prisma CLI config (v7 — connection string, seed command)
tsup.config.ts            # Build config
vercel.json                # Deployment config
```

---

## ⚙️ Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Batch-7-assignment-4
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgres://<user>:<password>@pooled.db.prisma.io:5432/postgres?sslmode=require"
DIRECT_URL="postgres://<user>:<password>@db.prisma.io:5432/postgres?sslmode=require"

JWT_ACCESS_SECRET="your-secret-here"
JWT_ACCESS_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Generate the Prisma Client

```bash
npx prisma generate
```

### 4. Run migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the database

Seeding is **not automatic** in Prisma 7 — run it explicitly:

```bash
npx prisma db seed
```

This creates:
- 1 admin account
- 5 starter categories (Plumbing, Electrical, Cleaning, Painting, Carpentry)
- 2 technicians (verified, with services)
- 2 customers
- 3 sample bookings (one at each lifecycle stage)
- 1 completed payment + 1 review

### 6. Run the dev server

```bash
npm run dev
```

Server runs at `http://localhost:3000` (or whatever port you configure).

### 7. Stripe webhook (local testing)

In a separate terminal:

```bash
npm run stripe:webhook
```

This forwards Stripe test events to your local `/api/payment/confirm` endpoint. Copy the `whsec_...` secret it prints into your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 🔑 Test Credentials (from seed data)

| Role | Email | Password |
|---|---|---|
| Admin | admin@fixitnow.com | admin123 |
| Technician | kamal.electrician@example.com | password123 |
| Technician | rafiq.plumber@example.com | password123 |
| Customer | customer1@example.com | password123 |
| Customer | customer2@example.com | password123 |

---

## 👥 Roles & Permissions

| Role | Capabilities |
|---|---|
| **Customer** | Browse services/technicians, book, pay, cancel (pre-`IN_PROGRESS`), review, view own bookings/payments |
| **Technician** | Manage profile & availability, create services, accept/decline/progress bookings, view own bookings |
| **Admin** | Manage categories, view/ban users, view all bookings |

Role is selected at registration (`CUSTOMER` or `TECHNICIAN` only — `ADMIN` cannot be self-registered; it's seeded).

---

## 📡 API Routes

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register as CUSTOMER or TECHNICIAN |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Authenticated | Get current user's profile |

### Technician
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/technician/` | Public | List technicians (filter by skill, location, rating, category, search) |
| GET | `/api/technician/:id` | Public | Single technician profile with services & reviews |
| PATCH | `/api/technician/profile` | Technician | Update own profile |
| PUT | `/api/technician/availability` | Technician | Replace weekly availability schedule |

### Service
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/services/` | Technician | Create a new service |
| GET | `/api/services/` | Public | List services (filter by category, location, rating, price, search) |

### Category
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/category/` | Public | List service categories |

### Booking
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings/create` | Customer | Create a booking (status → `REQUESTED`) |
| GET | `/api/bookings` | Customer, Technician | List own bookings |
| GET | `/api/bookings/:id` | Customer, Admin | Single booking detail |
| PATCH | `/api/bookings/status/:id` | Technician | Accept / Decline / progress a booking |
| PATCH | `/api/bookings/:id/cancel` | Customer | Cancel (only before `IN_PROGRESS`) |

**Booking lifecycle:** `REQUESTED → ACCEPTED/DECLINED → PAID → IN_PROGRESS → COMPLETED` (or `CANCELLED` at any point before `IN_PROGRESS`)

### Payment (Stripe)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create` | Customer | Create a Stripe Checkout Session for an `ACCEPTED` booking |
| POST | `/api/payment/confirm` | Stripe webhook | Confirms payment, flips booking to `PAID` |
| GET | `/api/payments/` | Customer | Own payment history |
| GET | `/api/payments/:id` | Customer | Single payment detail |

Currency: **BDT**. Test with Stripe's card `4242 4242 4242 4242`, any future expiry, any CVC.

### Review
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews/` | Customer | Review a `COMPLETED` booking (one per booking) |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/admin/categories` | Admin | Create a category |
| GET | `/api/admin/categories` | Admin | List categories |
| GET | `/api/admin/allUsers` | Admin | List customers & technicians |
| GET | `/api/admin/bookings` | Admin | List all bookings (filter by status, dates, search) |
| PATCH | `/api/admin/user/:id` | Admin | Ban/unban a user |

---

## ✅ Mandatory Requirements Checklist

- [x] Structured error responses: `{ success, statusCode, message, errorDetails }` on every error
- [x] Server-side validation on all `POST`/`PATCH`/`PUT` routes via Zod
- [x] 20+ meaningful backend commits
- [x] Working admin credentials (see above, via seed script)
- [x] Stripe payment integration — real Checkout Sessions + webhook confirmation, no simulated payments
- [ ] API Documentation (Postman collection / Swagger) — *link here once exported*

---

## 🧪 Testing

All endpoints were tested manually via Postman. No frontend exists — this is a backend-only assignment. Key flows to test in order:

1. Register a customer and a technician
2. Technician creates a service under an existing category
3. Customer creates a booking for that service
4. Technician accepts the booking (`REQUESTED → ACCEPTED`)
5. Customer creates a payment session, pays via the Stripe-hosted checkout link (open in browser, not Postman)
6. Stripe webhook confirms payment (`ACCEPTED → PAID`)
7. Technician progresses the booking (`PAID → IN_PROGRESS → COMPLETED`)
8. Customer leaves a review

---

## 🚀 Deployment

Deployed on **Vercel** using `tsup` to bundle to `dist/server.js`.

```bash
npm run build   # runs `prisma generate && tsup`
```

Environment variables must be set in Vercel's project dashboard (Settings → Environment Variables) — `.env` is not deployed. The Stripe webhook must be reconfigured to point at the production URL (`https://your-app.vercel.app/api/payment/confirm`) with its own webhook signing secret, either via a second `stripe listen` session or directly in the Stripe Dashboard's webhook settings.

**Live API:** *add your deployed URL here*

---

## 🔮 Known Limitations / Future Improvements

- **No automatic refunds** — cancelling a `PAID` booking changes its status but does not trigger a Stripe refund; this would need a `stripe.refunds.create()` call added to the cancellation flow.
- **Location matching is substring-based**, not geocoded — a technician's `location` field is matched against the booking `address` as a simple case-insensitive substring check, not real distance/radius filtering.
- **Technician verification is manual** — there's no dedicated admin endpoint yet to flip `TechnicianProfile.isVerified`; it's currently set directly in the database (seed data, or via Prisma Studio).
- **No single-booking detail route for technicians** — technicians currently only see their bookings via the list endpoint, not a dedicated `/api/technician/bookings/:id`.

---

## 📄 License

ISC