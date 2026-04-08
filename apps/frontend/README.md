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

## Folder Structure
src/
├── app/
│   ├── (auth)/             # Auth pages
│   ├── dashboard/          # Dashboard pages
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Login and register forms
│   ├── dashboard/          # Dashboard widgets
│   │   ├── charts/         # Chart components
│   │   ├── skeletons/      # Loading skeletons
│   │   └── tables/         # Data tables
│   ├── landing/            # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TaskDemo.tsx
│   │   └── CTA.tsx
│   ├── layout/             # Header, footer, sidebar
│   └── providers/          # Theme and auth providers
├── lib/
│   ├── api.ts              # Base fetch wrapper
│   └── taskApi.ts          # Task API methods
├── store/
│   └── authStore.ts        # Zustand auth store
├── types/
│   ├── auth.ts             # Auth types
│   └── task.ts             # Task types
└── middleware.ts            # Route protection

---

See [root README](../../README.md) for full documentation.