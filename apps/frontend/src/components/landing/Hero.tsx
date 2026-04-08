"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HiOutlineBolt,
  HiArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from "react-icons/hi2";

export default function Hero() {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-20">

      {/* AMBIENT BLOBS */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">

        {/* BADGE */}
        <div className="flex justify-center mb-6">
          <Badge className="gap-2 px-4 py-1.5 text-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <HiOutlineBolt className="h-4 w-4 text-yellow-500" />
            Full-stack Task Management Platform
          </Badge>
        </div>

        {/* HEADING */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Manage Tasks.
          <span className="text-indigo-600 dark:text-indigo-400"> Stay Focused.</span>
          <br />
          Ship Faster.
        </h1>

        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A secure, real-time task management system built with Next.js and Express.
          Create, track, and complete tasks — all synced to your account.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                Go to Dashboard
                <HiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                  Get Started Free
                  <HiArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="gap-2 cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* TRUST STRIP */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: <HiOutlineCheckCircle className="h-4 w-4 text-green-500" />, text: "No credit card required" },
            { icon: <HiOutlineShieldCheck className="h-4 w-4 text-indigo-500" />, text: "Secured with JWT auth" },
            { icon: <HiOutlineChartBar className="h-4 w-4 text-purple-500" />, text: "Real-time dashboard" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}