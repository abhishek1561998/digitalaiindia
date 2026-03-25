# DigitalAIIndia MVP (Next.js + Prisma)

## 1) Install

```bash
npm install
```

## 2) Configure env

Create `.env` (or `.env.local`) with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/digitalaiindia"
JWT_SECRET="replace-with-a-long-random-secret"
API_KEY_ENCRYPTION_SECRET="optional-second-secret"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

## 3) Prepare database

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

## 4) Run app

```bash
npm run dev
```

## 5) Core routes

- `GET /` Landing page
- `GET /auth` JWT login/signup page
- `GET /dashboard` Authenticated dashboard
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/keys` / `POST /api/keys` / `DELETE /api/keys/:id`
- `GET /api/dashboard/stats`
- `POST /api/chat`
- `POST /api/voice`
- `POST /api/three-d`
- `POST /api/design`

## 6) Free-tier policy

- Per-user monthly quota stored in `UsageRecord`
- Default limit is `1000` requests/month
- API returns `429` once exhausted
