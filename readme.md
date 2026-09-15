# 🏦 OneStopBank

A modern full-stack digital banking platform built with Spring Boot and React.

## Features

- Secure JWT Authentication
- User Registration & Login
- Email OTP Verification
- Fund Transfer
- Deposit & Withdraw Money
- Account Dashboard
- Transaction History
- Download Transactions
- User Profile Management
- Password Reset
- Charts & Analytics
- Responsive UI

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database

- PostgreSQL

---

## Project Structure

```
BANKUI/
BankPortalMainAPI/
```

---

## Installation

### Backend

```bash
cd BankPortalMainAPI
mvn spring-boot:run
```

### Frontend

```bash
cd BANKUI
npm install
npm run dev
```

---

## Screenshots

| Login | Dashboard |
|-------|-----------|
| Add Screenshot | Add Screenshot |

---

## API Documentation

Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

## Future Improvements

- Mobile App
- AI Spending Insights
- UPI Integration
- Bill Payments
- Loan Module
- Admin Dashboard
- Notifications

---
---

## CI/CD

Every push and pull request to `main` runs `.github/workflows/ci-cd.yml`:

| Stage | What it does |
|-------|--------------|
| `backend` | `mvn verify` on JDK 17 against a `postgres:16` service container; uploads surefire reports and the jar |
| `frontend` | `npm ci` + `npm run build` on Node 20; uploads `dist/` |
| `docker` | Builds both Dockerfiles. On `main` it pushes `ghcr.io/<owner>/<repo>-api` and `-ui` tagged `latest` and `sha-<commit>`; on PRs it only builds |
| `deploy-api` | Triggers the Render deploy hook (`main` only) |
| `deploy-ui` | Deploys `BANKUI` to Vercel production with the Vercel CLI (`main` only) |

### Required repository secrets

| Secret | Used by | Notes |
|--------|---------|-------|
| `RENDER_DEPLOY_HOOK_URL` | `deploy-api` | Render → Service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | `deploy-ui` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `deploy-ui` | From `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `deploy-ui` | Same file |

Deploy steps log a warning and skip if their secrets are missing, so the pipeline
stays green until they are configured. GHCR publishing uses the built-in
`GITHUB_TOKEN` and needs no setup.

### Optional repository variable

- `VITE_API_URL` — API base URL baked into the CI frontend build. Defaults to
  `http://localhost:8180/api`. (The Vercel deploy uses the env vars configured in
  the Vercel project itself.)

### Backend tests

Tests read `src/test/resources/application-test.properties`, which defaults to the
docker-compose Postgres. To run them locally:

```bash
docker compose -f BankPortalMainAPI/docker/docker-compose.yml up -d postgres
docker exec bankingportal-postgres psql -U postgres -c "CREATE DATABASE bankingportal_test" || true
cd BankPortalMainAPI && mvn verify
```
