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
