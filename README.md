# AdminHub — Full-Stack Task Management Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Express](https://img.shields.io/badge/Express-4-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A production-ready, full-stack task management platform built with **Next.js App Router**, **Express REST API**, **MongoDB Atlas**, and **Passport.js OAuth**. Features a comprehensive admin dashboard, real-time analytics, kanban board, and secure authentication with Google and GitHub OAuth.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | [https://dashboard-app.vercel.app](https://adminhub-sigma.vercel.app) |
| Backend API | [https://dashboard-app-backend.onrender.com](https://adminhub-ea0f.onrender.com) |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT authentication via httpOnly cookies
- Google OAuth 2.0 and GitHub OAuth
- Bcrypt password hashing
- Role-based access control — User and Admin
- Forgot password with secure email reset via Resend
- Rate limiting and Helmet security headers

### ✅ Task Management
- Full CRUD — create, read, update, delete
- Task priorities — low, medium, high
- Due dates, tags and comments
- Status tracking — To Do → In Progress → Done
- Search, filter, sort and pagination

### 📊 Dashboard
- KPI cards with animated stats
- Line and bar charts
- Kanban board with drag and drop
- Activity feed and notifications panel
- Calendar and schedule
- Global user map
- Payment overview and weekly profit
- Used devices and top channels breakdown

### 👑 Admin Panel
- Manage all users — search, promote, demote, delete
- Platform-wide statistics
- Tasks cleaned up automatically on user delete

### 👤 Profile & Settings
- Update name and email
- Change password
- Upload avatar

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 15 App Router | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Zustand | Global state management |
| Recharts | Charts and analytics |
| Leaflet.js | Interactive world map |
| Framer Motion | Animations |
| Sonner | Toast notifications |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Express.js | REST API framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| Bcrypt | Password hashing |
| Passport.js | Google and GitHub OAuth |
| Resend | Transactional emails |
| Multer | Avatar file uploads |
| Zod | Request validation |
| Helmet | Security headers |
| Express Rate Limit | API rate limiting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- Resend account
- Google OAuth credentials
- GitHub OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/adeoluwaadeoye/dashboard-app.git
cd dashboard-app
```

### 2. Setup and run Backend

```bash
cd apps/backend
npm install
```

Create `apps/backend/.env`:

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dashboard_app

JWT_SECRET=your_super_secret_jwt_key_here

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

FRONTEND_URL=http://localhost:3000

RESEND_API_KEY=re_your_resend_api_key
```

Run the backend:

```bash
npm run dev
# runs on http://localhost:5000
```

### 3. Setup and run Frontend

```bash
cd apps/frontend
npm install
```

Create `apps/frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
# runs on http://localhost:3000
```

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login with email and password |
| POST | `/logout` | ❌ | Logout and clear cookie |
| GET | `/me` | ✅ User | Get current user |
| PUT | `/profile` | ✅ User | Update name and email |
| PUT | `/change-password` | ✅ User | Change password |
| POST | `/avatar` | ✅ User | Upload profile avatar |
| POST | `/forgot-password` | ❌ | Send password reset email |
| POST | `/reset-password` | ❌ | Reset password with token |
| GET | `/google` | ❌ | Google OAuth redirect |
| GET | `/google/callback` | ❌ | Google OAuth callback |
| GET | `/github` | ❌ | GitHub OAuth redirect |
| GET | `/github/callback` | ❌ | GitHub OAuth callback |

### Tasks — `/api/tasks`

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/stats` | ✅ User | Get task analytics |
| POST | `/` | ✅ User | Create a new task |
| GET | `/` | ✅ User | Get all tasks with filters |
| GET | `/:id` | ✅ User | Get single task by ID |
| PUT | `/:id` | ✅ User | Update task |
| DELETE | `/:id` | ✅ User | Delete task |
| POST | `/:id/comments` | ✅ User | Add comment to task |
| DELETE | `/:id/comments/:commentId` | ✅ User | Delete comment |

### Admin — `/api/admin`

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/stats` | 👑 Admin | Platform statistics |
| GET | `/users` | 👑 Admin | Get all users with pagination |
| GET | `/users/:id` | 👑 Admin | Get single user |
| PUT | `/users/:id` | 👑 Admin | Update user role |
| DELETE | `/users/:id` | 👑 Admin | Delete user and their tasks |

---

## 🌍 Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `apps/backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/index.js` |
| Environment | Node |
| Port | `10000` |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `apps/frontend` |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |

### Production Environment Variables

**Render (Backend):**
```bash
PORT=10000
NODE_ENV=production
MONGO_URI=your_atlas_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/api/auth/github/callback
FRONTEND_URL=https://your-frontend.vercel.app
RESEND_API_KEY=your_resend_key
```

**Vercel (Frontend):**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## 🔑 OAuth Setup

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-backend.onrender.com/api/auth/google/callback`
4. Add authorized origin: `https://your-frontend.vercel.app`

### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `https://your-backend.onrender.com/api/auth/github/callback`

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Adeoluwa Adeoye**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-indigo?style=flat-square)](https://adeoluwaadeoye.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat-square&logo=github)](https://github.com/adeoluwaadeoye)

---

<div align="center">
  <strong>AdminHub</strong> — Built with ❤️ using Next.js, Express and MongoDB
</div>
