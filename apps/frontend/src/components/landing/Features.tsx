"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineChartBarSquare,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineBellAlert,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineCreditCard,
} from "react-icons/hi2";

const bentoItems = [
  {
    icon:       <HiOutlineClipboardDocumentList className="h-6 w-6 text-indigo-500" />,
    title:      "Task Manager",
    desc:       "Create, filter, search and sort tasks by priority, due date and tags. Full CRUD with comments.",
    color:      "bg-indigo-50 dark:bg-indigo-950",
    // mobile: full width | tablet: half | desktop: quarter
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Core",
    badgeColor: "bg-indigo-100 text-indigo-700",
    preview: (
      <div className="mt-4 space-y-2">
        {[
          { label: "Design login page", status: "done",        priority: "high"   },
          { label: "Fix API endpoints", status: "in-progress", priority: "medium" },
          { label: "Write unit tests",  status: "todo",        priority: "low"    },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2 bg-background/60 rounded-lg px-3 py-2">
            <span className={`h-2 w-2 rounded-full shrink-0 ${
              t.status === "done"        ? "bg-green-500"  :
              t.status === "in-progress" ? "bg-yellow-500" : "bg-gray-400"
            }`} />
            <p className={`text-xs flex-1 truncate ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {t.label}
            </p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
              t.priority === "high"   ? "bg-red-100 text-red-600"       :
              t.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
              "bg-gray-100 text-gray-500"
            }`}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineChartBarSquare className="h-6 w-6 text-purple-500" />,
    title:      "Live Analytics",
    desc:       "Real charts from your data — completion rates, priority breakdown, due-soon alerts.",
    color:      "bg-purple-50 dark:bg-purple-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Insights",
    badgeColor: "bg-purple-100 text-purple-700",
    preview: (
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total", value: "24",  color: "text-foreground" },
            { label: "Done",  value: "18",  color: "text-green-600"  },
            { label: "Rate",  value: "75%", color: "text-indigo-600" },
          ].map((s, i) => (
            <div key={i} className="bg-background/60 rounded-lg p-2 text-center">
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-background/60 rounded-lg px-3 py-2">
          <div className="flex items-end gap-1 h-10">
            {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-400 rounded-sm opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Weekly activity</p>
        </div>
      </div>
    ),
  },
  {
    icon:       <HiOutlineBolt className="h-6 w-6 text-yellow-500" />,
    title:      "Kanban Board",
    desc:       "Drag and drop tasks between columns. Add new tasks directly from the board in seconds.",
    color:      "bg-yellow-50 dark:bg-yellow-950",
    // full width on all sizes
    className:  "col-span-1 sm:col-span-4 lg:col-span-2",
    badge:      "Productivity",
    badgeColor: "bg-yellow-100 text-yellow-700",
    preview: (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { col: "To Do",       color: "bg-gray-100 dark:bg-gray-800",     tasks: ["Write docs", "Add tests"]            },
          { col: "In Progress", color: "bg-yellow-100 dark:bg-yellow-900", tasks: ["Build dashboard", "Fix auth bug"]     },
          { col: "Done",        color: "bg-green-100 dark:bg-green-900",   tasks: ["Setup project", "Configure Tailwind"] },
        ].map((col, i) => (
          <div key={i} className={`rounded-lg p-2 ${col.color}`}>
            <p className="text-xs font-semibold mb-2">{col.col}</p>
            <div className="space-y-1.5">
              {col.tasks.map((t, j) => (
                <div key={j} className="bg-background/80 rounded px-2 py-1.5">
                  <p className="text-xs truncate">{t}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineCalendarDays className="h-6 w-6 text-green-500" />,
    title:      "Calendar & Schedule",
    desc:       "Track deadlines and events. Click any day to see what is due and plan ahead.",
    color:      "bg-green-50 dark:bg-green-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Planning",
    badgeColor: "bg-green-100 text-green-700",
    preview: (
      <div className="mt-4 bg-background/60 rounded-lg p-3">
        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <div
              key={d}
              className={`text-center text-xs py-0.5 rounded ${
                d === 14 ? "bg-indigo-500 text-white font-bold" :
                [7, 18, 25].includes(d)
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : "text-muted-foreground"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon:       <HiOutlineBellAlert className="h-6 w-6 text-pink-500" />,
    title:      "Notifications",
    desc:       "Stay updated with in-app alerts. Filter by read/unread, dismiss or mark all read.",
    color:      "bg-pink-50 dark:bg-pink-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Alerts",
    badgeColor: "bg-pink-100 text-pink-700",
    preview: (
      <div className="mt-4 space-y-2">
        {[
          { dot: "bg-blue-500",   title: "New user registered", time: "2m ago",  unread: true  },
          { dot: "bg-green-500",  title: "Payment received",    time: "15m ago", unread: true  },
          { dot: "bg-yellow-500", title: "Server warning",      time: "1h ago",  unread: false },
        ].map((n, i) => (
          <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            n.unread ? "bg-indigo-50/60 dark:bg-indigo-950/40" : "bg-background/60"
          }`}>
            <span className={`h-2 w-2 rounded-full shrink-0 ${n.dot}`} />
            <p className={`text-xs flex-1 truncate ${n.unread ? "font-semibold" : ""}`}>
              {n.title}
            </p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineMapPin className="h-6 w-6 text-teal-500" />,
    title:      "Global Map",
    desc:       "Visualise user distribution and revenue by region. Click any pin to inspect stats.",
    color:      "bg-teal-50 dark:bg-teal-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Global",
    badgeColor: "bg-teal-100 text-teal-700",
    preview: (
      <div className="mt-4 bg-linear-to-b from-sky-100 to-blue-200 dark:from-slate-800 dark:to-slate-900 rounded-lg relative h-24 overflow-hidden">
        <svg viewBox="0 0 100 40" className="w-full h-full absolute inset-0">
          <ellipse cx="22" cy="20" rx="10" ry="10" fill="#c7d2fe" opacity="0.7" />
          <ellipse cx="47" cy="15" rx="6"  ry="6"  fill="#c7d2fe" opacity="0.7" />
          <ellipse cx="49" cy="26" rx="5"  ry="7"  fill="#c7d2fe" opacity="0.7" />
          <ellipse cx="70" cy="18" rx="13" ry="8"  fill="#c7d2fe" opacity="0.7" />
          <ellipse cx="80" cy="30" rx="5"  ry="4"  fill="#c7d2fe" opacity="0.7" />
        </svg>
        {[
          { cx: "22%", cy: "50%" },
          { cx: "47%", cy: "35%" },
          { cx: "70%", cy: "40%" },
          { cx: "80%", cy: "70%" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2"
            style={{ left: p.cx, top: p.cy }}
          >
            <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-40 animate-ping" />
            <span className="relative flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 border-2 border-white" />
          </span>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineCreditCard className="h-6 w-6 text-orange-500" />,
    title:      "Payment Overview",
    desc:       "Track transactions, filter by status, and view 6-month revenue trends at a glance.",
    color:      "bg-orange-50 dark:bg-orange-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Finance",
    badgeColor: "bg-orange-100 text-orange-700",
    preview: (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-2">
          <p className="text-sm font-semibold text-indigo-600">$1,274 collected</p>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">+18%</span>
        </div>
        {[
          { name: "Alice Johnson", amount: "$120", status: "completed" },
          { name: "Bob Smith",     amount: "$75",  status: "pending"   },
          { name: "Carol White",   amount: "$340", status: "failed"    },
        ].map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-1.5">
            <p className="text-xs truncate flex-1">{p.name}</p>
            <p className="text-xs font-medium mx-2 whitespace-nowrap">{p.amount}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${
              p.status === "completed" ? "bg-green-100 text-green-700" :
              p.status === "pending"   ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-600"
            }`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineShieldCheck className="h-6 w-6 text-indigo-500" />,
    title:      "Secure Auth",
    desc:       "JWT cookies, Google OAuth, GitHub OAuth, bcrypt hashing and role-based access control.",
    color:      "bg-indigo-50 dark:bg-indigo-950",
    className:  "col-span-1 sm:col-span-2 lg:col-span-1",
    badge:      "Security",
    badgeColor: "bg-indigo-100 text-indigo-700",
    preview: (
      <div className="mt-4 space-y-2">
        {[
          "JWT httpOnly Cookie",
          "Google OAuth 2.0",
          "GitHub OAuth",
          "Bcrypt Hashing",
          "Role-Based Access",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-background/60 rounded-lg px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            <p className="text-xs">{item}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon:       <HiOutlineUserGroup className="h-6 w-6 text-blue-500" />,
    title:      "User Management",
    desc:       "Admins can search, promote, demote and delete users. Full platform stats in one view.",
    color:      "bg-blue-50 dark:bg-blue-950",
    // full width on all breakpoints
    className:  "col-span-1 sm:col-span-4 lg:col-span-2",
    badge:      "Admin",
    badgeColor: "bg-blue-100 text-blue-700",
    preview: (
      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">User</th>
              <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Email</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { name: "Alice J.",  email: "alice@...", role: "admin" },
              { name: "Bob S.",    email: "bob@...",   role: "user"  },
              { name: "Carol W.",  email: "carol@...", role: "user"  },
            ].map((u, i) => (
              <tr key={i} className="hover:bg-muted/20">
                <td className="px-3 py-2 font-medium">{u.name}</td>
                <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs cursor-pointer">Edit</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs cursor-pointer">Del</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <Badge className="mb-4 px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-sm">
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Every tool you need,
            <br className="hidden md:block" />
            built into one platform
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-xl mx-auto">
            From task management to analytics, kanban to global maps —
            AdminHub ships with everything ready to use.
          </p>
        </div>

        {/* BENTO GRID
            mobile:  1 col — every card full width
            tablet:  4 col grid — cards use col-span-2 or col-span-4
            desktop: 4 col grid — cards use col-span-1 or col-span-2
        */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {bentoItems.map((item, i) => (
            <Card
              key={i}
              className={`
                ${item.className}
                shadow-sm hover:shadow-lg hover:-translate-y-0.5
                transition-all duration-300 border overflow-hidden
              `}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-xl shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 ${item.badgeColor}`}>
                    {item.badge}
                  </Badge>
                </div>
                <p className="font-semibold text-base mt-3">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {item.desc}
                </p>
                {item.preview}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}