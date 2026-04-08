dashboard-app/
│
├── apps/
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.model.ts
│   │   │   │   │   └── auth.validation.ts
│   │   │   │   │
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── task.controller.ts
│   │   │   │   │   ├── task.service.ts
│   │   │   │   │   ├── task.routes.ts
│   │   │   │   │   ├── task.model.ts
│   │   │   │   │   └── task.validation.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── notFound.middleware.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── db.ts
│   │   │   │   ├── env.ts
│   │   │   │   └── cors.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── generateToken.ts
│   │   │   │   ├── asyncHandler.ts
│   │   │   │   └── apiResponse.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── tests/
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nodemon.json
│
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   ├── register/page.tsx
│   │   │   │   │
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Loader.tsx
│   │   │   │   │   └── Modal.tsx
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── RegisterForm.tsx
│   │   │   │   │
│   │   │   │   └── dashboard/
│   │   │   │       ├── TaskCard.tsx
│   │   │   │       ├── TaskList.tsx
│   │   │   │       └── Sidebar.tsx
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useTasks.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── task.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   │
│   │   ├── .env.local
│   │   ├── package.json
│   │   └── next.config.js
│
├── packages/
│   │
│   └── shared/
│       ├── types/
│       │   ├── user.ts
│       │   ├── task.ts
│       │   └── index.ts
│       │
│       ├── utils/
│       │   └── index.ts
│       │
│       └── index.ts
│
├── package.json
├── .gitignore
└── README.md



Row 1: ChatCard | OverviewCard | PaymentOverview
Row 2: WeeklyProfit | RegionalLabel
Row 3: TaskSection (full width)
Row 4: TopChannels | TopChannelsTool
Row 5: UsedDevices
Row 6: TaskForm (modal or drawer trigger)





├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── store/
│   └── authStore.ts
├── lib/
│   └── api.ts
├── types/
│   └── auth.ts
└── middleware.ts