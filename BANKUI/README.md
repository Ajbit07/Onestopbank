# OneStopBank — Banking Portal UI (React)

React rewrite of the original Angular banking portal UI. Talks to the same Spring Boot backend (`BankPortalMainAPI`) with identical API calls.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios (with JWT auth interceptor, same behavior as the Angular interceptor)
- Chart.js via react-chartjs-2 (line, bar, pie transaction charts)
- Framer Motion (page transitions & micro-animations)
- react-hot-toast (notifications)
- SheetJS (Excel export of transactions)

## Run

```bash
npm install
npm run dev
```

Runs at http://localhost:4200 (same port as the old Angular app). The API base URL is configured in `src/environment.js` (`http://localhost:8180/api`).

## Backend

Start `BankPortalMainAPI` (Spring Boot, port 8180). Required env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `GEO_API_KEY`.

## Pages

Home, Login (password / OTP), Register, Forgot Password (OTP + reset), Dashboard (profile + account cards, charts, transaction table), Deposit, Withdraw, Fund Transfer, Account PIN (create/change), User Profile (view/edit), Transaction History (filter + Excel download), 404.
