**Backend Setup**

- **Purpose:** Backend for HousingProject (Express + Mongoose).
- **Location:** [backend](backend)

**Quick Start**

- Install dependencies:

```
cd backend
npm install
```

- Run in development (auto-restart):

```
npm run dev
```

- Run in production:

```
npm start
```

**Required Runtime / External Services**

- **Node.js**: v18+ recommended
- **npm** (or `yarn`)
- **MongoDB**: local or hosted (MongoDB Atlas)
- **SMTP / Email service**: credentials for sending verification/reset emails
- **Frontend host URL**: public or local URL used in email links
- **(Optional)** Google Maps API key if the project uses maps

**Environment Variables**

Create a `.env` file in `backend/` (or use `.env.example`) with these variables:

- `PORT` — server port (e.g., `5000`)
- `MONGO_URI` — MongoDB connection string (example: `mongodb://localhost:27017/housingproject`)
- `JWT_SECRET` — secret for access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens
- `EMAIL_HOST` — SMTP host (e.g., `smtp.gmail.com` or your provider)
- `EMAIL_PORT` — SMTP port (e.g., `587`)
- `EMAIL_USER` — SMTP username
- `EMAIL_PASS` — SMTP password
- `EMAIL_FROM` — from address used in outgoing emails (e.g., `noreply@example.com`)
- `FRONTEND_URL` — frontend base URL for verification/reset links (e.g., `http://localhost:3000`)
- `NODE_ENV` — `development` or `production`
- `GOOGLE_MAPS_API_KEY` — (optional) Google Maps API key

Note: the code currently reads `process.env.MONGO_URI` but an existing `.env` file in this repo uses `MONGODB_URI`. Use `MONGO_URI` or update `src/routes/config/db.js` to match your `.env` name.

**Common Commands**

- Install deps: `npm install`
- Dev server: `npm run dev` (requires `nodemon`)
- Start: `npm start`

**Files of Interest**

- Routes: [src/routes/authRoutes.js](src/routes/authRoutes.js) and [src/routes/propertyRoutes.js](src/routes/propertyRoutes.js)
- DB connection: [src/routes/config/db.js](src/routes/config/db.js)
- Auth controller: [src/routes/controllers/authController.js](src/routes/controllers/authController.js)
- Error middleware: [src/routes/middleware/errorMiddleware.js](src/routes/middleware/errorMiddleware.js)