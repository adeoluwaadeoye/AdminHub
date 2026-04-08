# AdminHub — Frontend

Next.js App Router frontend for the AdminHub task management platform.

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Recharts
- Leaflet.js

## Setup

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev     # development — http://localhost:3000
npm run build   # production build
npm start       # run production build
```

## Pages

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Landing page | ❌ |
| `/auth/login` | Login | ❌ |
| `/auth/register` | Register | ❌ |
| `/auth/forgot-password` | Forgot password | ❌ |
| `/auth/reset-password` | Reset password | ❌ |
| `/dashboard` | Overview | ✅ |
| `/dashboard/tasks` | Task manager | ✅ |
| `/dashboard/analytics` | Analytics | ✅ |
| `/dashboard/profile` | Profile settings | ✅ |
| `/dashboard/admin` | Admin panel | 👑 |

---

See [root README](../../README.md) for full documentation.
