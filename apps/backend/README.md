# AdminHub — Backend API

Express REST API for the AdminHub task management platform.

## Stack
- Express.js + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Passport.js OAuth
- Resend emails
- Zod validation
- Multer file uploads

## Setup

```bash
npm install
```

Create `.env` file — see root README for all required variables.

```bash
npm run dev     # development
npm run build   # compile TypeScript
npm start       # run compiled build
```

## API runs on
http://localhost:5000/api


## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with ts-node-dev hot reload |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled JavaScript |

## Folder Structure
src/
├── config/
│   └── passport.ts         # Google + GitHub OAuth
├── lib/
│   └── mailer.ts           # Resend email service
├── middlewares/
│   ├── auth.middleware.ts  # JWT guard + admin guard
│   ├── upload.middleware.ts # Multer avatar upload
│   └── validate.ts         # Zod request validator
├── modules/
│   ├── auth/               # Auth module
│   │   ├── auth.controller.ts
│   │   ├── auth.model.ts
│   │   ├── auth.routes.ts
│   │   └── oauth.controller.ts
│   ├── tasks/              # Tasks module
│   │   ├── task.controller.ts
│   │   ├── task.model.ts
│   │   └── task.routes.ts
│   └── admin/              # Admin module
│       ├── admin.controller.ts
│       └── admin.routes.ts
├── validators/
│   ├── auth.validator.ts
│   └── task.validator.ts
├── app.ts                  # Express app setup
└── index.ts               # Server entry point

See [root README](../../README.md) for full documentation.