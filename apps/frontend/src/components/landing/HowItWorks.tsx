"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HiOutlineUserPlus,
  HiOutlinePencilSquare,
  HiOutlineArrowPath,
  HiOutlineChartBarSquare,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineEye,
} from "react-icons/hi2";

type Role = "user" | "admin";

const userSteps = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up with email or continue instantly with Google or GitHub. No forms, no friction.",
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
    border: "border-indigo-200 dark:border-indigo-800",
    icon: <HiOutlineUserPlus className="h-5 w-5 text-indigo-600" />,
  },
  {
    step: "02",
    title: "Create your first task",
    desc: "Add a title, description, priority, due date and tags. Saved instantly to MongoDB.",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: <HiOutlinePencilSquare className="h-5 w-5 text-yellow-600" />,
  },
  {
    step: "03",
    title: "Track your progress",
    desc: "Cycle tasks from To Do → In Progress → Done. Add comments, drag on kanban, edit or delete anytime.",
    color: "text-green-600 bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    icon: <HiOutlineArrowPath className="h-5 w-5 text-green-600" />,
  },
  {
    step: "04",
    title: "Analyse your workflow",
    desc: "View completion rate, tasks by priority, due-soon alerts and recently created tasks in analytics.",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    icon: <HiOutlineChartBarSquare className="h-5 w-5 text-purple-600" />,
  },
];

const adminSteps = [
  {
    step: "01",
    title: "Get promoted to Admin",
    desc: "An existing admin promotes your account — unlocking the full admin panel and platform controls.",
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
    border: "border-indigo-200 dark:border-indigo-800",
    icon: <HiOutlineShieldCheck className="h-5 w-5 text-indigo-600" />,
  },
  {
    step: "02",
    title: "Manage all users",
    desc: "Search, filter, promote or delete any user. Their tasks are cleaned up automatically on delete.",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    icon: <HiOutlineUsers className="h-5 w-5 text-blue-600" />,
  },
  {
    step: "03",
    title: "View platform stats",
    desc: "See total users, total tasks, tasks by status, and recently registered users across the platform.",
    color: "text-green-600 bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    icon: <HiOutlineEye className="h-5 w-5 text-green-600" />,
  },
  {
    step: "04",
    title: "Configure the system",
    desc: "Update user roles, moderate content, and keep the platform running smoothly from one dashboard.",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    icon: <HiOutlineCog6Tooth className="h-5 w-5 text-purple-600" />,
  },
];

export default function HowItWorks() {
  const [role, setRole] = useState<Role>("user");
  const steps = role === "user" ? userSteps : adminSteps;

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1.5 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800 text-sm">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Built for everyone
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-lg mx-auto">
            Whether you&apos;re a regular user managing tasks or an admin
            overseeing the entire platform — there&apos;s a clear path for you.
          </p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 rounded-xl border bg-background p-1">
            {(["user", "admin"] as Role[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={role === r ? "default" : "ghost"}
                className={`px-8 capitalize rounded-lg transition-all text-sm ${role === r
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "text-muted-foreground"
                  }`}
                onClick={() => setRole(r)}
              >
                {r === "admin" ? "👑 Admin" : "👤 User"}
              </Button>
            ))}
          </div>
        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%-8px)] w-full h-px bg-border z-0" />
              )}
              <Card className={`relative z-10 border ${s.border} shadow-sm hover:shadow-md transition-all duration-300 h-full`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${s.color}`}>
                      {s.icon}
                    </div>
                    <span className={`text-3xl font-black opacity-20 ${s.color.split(" ")[0]}`}>
                      {s.step}
                    </span>
                  </div>
                  <p className="font-semibold text-base">{s.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}