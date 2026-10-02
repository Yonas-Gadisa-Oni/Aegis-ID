# Aegis ID

Aegis ID is a full-stack university student identification and campus access management system for Ethiopian Defence University.

## Stack
- React + Vite
- Node.js + Express
- PostgreSQL
- JWT + bcrypt
- QR generation and browser scanning

## 1. Requirements
- Node.js 20+
- PostgreSQL 14+ (or Docker)

## 2. Database
Using Docker:

```bash
docker compose up -d postgres
```

Then create the schema:

```bash
psql postgresql://postgres:postgres@localhost:5432/aegis_id -f database/schema.sql
```

Or paste `database/schema.sql` into pgAdmin / your PostgreSQL client.

## 3. Configure backend

```bash
cd server
cp .env.example .env
```

Update `DATABASE_URL` and `JWT_SECRET` if necessary.

## 4. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

## 5. Seed demo data

```bash
npm run seed --prefix server
```

Demo credentials:

- Admin: `admin@aegis.local` / `Admin123!`
- Gateway: `gateway@aegis.local` / `Gateway123!`
- Student: `student@aegis.local` / `Student123!`

## 6. Run

From the project root:

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000/api/health

## Main workflow

Student submits permission → administrator approves → gateway scans QR → exit is recorded → student becomes OUTSIDE → return scan records ENTRY → student becomes INSIDE. A background monitor expires overdue permissions and creates administrator alerts.

## Notes

This release is a development-ready functional prototype. Before production deployment, add university SSO/identity integration, HTTPS, production secret management, database backups, stronger operational monitoring, formal security review, and institutional data-retention policies.
