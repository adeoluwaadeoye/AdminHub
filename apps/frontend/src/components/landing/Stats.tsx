"use client";

import { useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBarSquare,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

// ── ANIMATION VARIANTS ─────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const, // ✅ fixed
    },
  },
};

const highlightVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.2,
      ease: "easeOut" as const, // ✅ fixed
    },
  }),
};

const stripVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: "easeOut" as const, // ✅ fixed
    },
  },
};

// ── DATA ───────────────────────────────────────────────────
const highlights = [
  {
    value: 240000,
    suffix: "+",
    label: "API Requests Daily",
    color: "text-indigo-600 dark:text-indigo-400",
    duration: 3.5,
    easingFn: (t: number) =>
      t < 0.7 ? t * 1.4 : 0.98 + (t - 0.7) * 0.067,
  },
  {
    value: 4.9,
    suffix: "/5",
    decimals: 1,
    label: "Average Rating",
    color: "text-yellow-500",
    duration: 2.8,
    easingFn: (t: number) =>
      t < 0.6 ? t * 1.6 : 0.96 + (t - 0.6) * 0.1,
  },
  {
    value: 50,
    suffix: "ms",
    label: "Avg Response Time",
    color: "text-green-600 dark:text-green-400",
    duration: 3,
    easingFn: (t: number) =>
      t < 0.75 ? t * 1.3 : 0.975 + (t - 0.75) * 0.1,
  },
];

const stats = [
  {
    icon: <HiOutlineUsers className="h-6 w-6 text-indigo-500" />,
    value: 12400,
    suffix: "+",
    label: "Active Users",
    desc: "Across 6 regions worldwide",
    color: "bg-indigo-50 dark:bg-indigo-950",
    border: "border-indigo-100 dark:border-indigo-900",
    duration: 2.5,
    easingFn: (t: number) =>
      t < 0.8 ? t * 1.2 : 0.96 + (t - 0.8) * 0.2,
  },
  {
    icon: <HiOutlineClipboardDocumentList className="h-6 w-6 text-green-500" />,
    value: 98000,
    suffix: "+",
    label: "Tasks Completed",
    desc: "And counting every day",
    color: "bg-green-50 dark:bg-green-950",
    border: "border-green-100 dark:border-green-900",
    duration: 4,
    easingFn: (t: number) =>
      t < 0.65 ? t * 1.5 : 0.975 + (t - 0.65) * 0.071,
  },
  {
    icon: <HiOutlineChartBarSquare className="h-6 w-6 text-purple-500" />,
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Uptime",
    desc: "Reliable infrastructure",
    color: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-100 dark:border-purple-900",
    duration: 3.2,
    easingFn: (t: number) =>
      t < 0.7 ? t * 1.4 : 0.98 + (t - 0.7) * 0.067,
  },
  {
    icon: <HiOutlineShieldCheck className="h-6 w-6 text-blue-500" />,
    value: 100,
    suffix: "%",
    label: "Secure",
    desc: "JWT + OAuth protected",
    color: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-100 dark:border-blue-900",
    duration: 2,
    easingFn: (t: number) =>
      t < 0.75 ? t * 1.3 : 0.975 + (t - 0.75) * 0.1,
  },
  {
    icon: <HiOutlineBolt className="h-6 w-6 text-yellow-500" />,
    value: 2,
    suffix: "min",
    label: "Setup Time",
    desc: "From signup to dashboard",
    color: "bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-100 dark:border-yellow-900",
    duration: 1.8,
    easingFn: (t: number) =>
      t < 0.8 ? t * 1.2 : 0.96 + (t - 0.8) * 0.2,
  },
  {
    icon: <HiOutlineGlobeAlt className="h-6 w-6 text-teal-500" />,
    value: 6,
    suffix: "+",
    label: "Global Regions",
    desc: "Users from every continent",
    color: "bg-teal-50 dark:bg-teal-950",
    border: "border-teal-100 dark:border-teal-900",
    duration: 2.2,
    easingFn: (t: number) =>
      t < 0.7 ? t * 1.4 : 0.98 + (t - 0.7) * 0.067,
  },
];

export default function Stats() {
  // ✅ triggerOnce: true — fires only once when scrolled into view
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  // ✅ removed unused shouldCount
  const [started, setStarted] = useState(false);

  return (
    <section className="bg-muted/30 py-16 md:py-24" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">

        {/* HEADER */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Badge className="mb-4 px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-sm">
            Platform Stats
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Trusted by developers
            <br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400">
              {" "}around the world
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-xl mx-auto">
            Real numbers from a production-ready platform built
            to scale with your workflow.
          </p>
        </motion.div>

        {/* HIGHLIGHT STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={highlightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border bg-background p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className={`text-4xl md:text-5xl font-black ${h.color}`}>
                {inView ? (
                  <CountUp
                    end={h.value}
                    duration={h.duration}
                    decimals={h.decimals || 0}
                    separator=","
                    easingFn={h.easingFn}
                    onEnd={() => !started && setStarted(true)}
                  />
                ) : "0"}
                <span className="text-2xl md:text-3xl ml-0.5">
                  {h.suffix}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {h.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* STATS GRID */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`
                rounded-2xl border ${s.border} ${s.color}
                p-6 flex items-start gap-4
                hover:shadow-md hover:-translate-y-0.5
                transition-shadow duration-300
              `}
            >
              {/* ICON */}
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-background shadow-sm shrink-0">
                {s.icon}
              </div>

              {/* CONTENT */}
              <div className="min-w-0">
                <p className="text-3xl font-black text-foreground leading-none">
                  {inView ? (
                    <CountUp
                      end={s.value}
                      duration={s.duration}
                      decimals={s.decimals || 0}
                      separator=","
                      easingFn={s.easingFn}
                    />
                  ) : "0"}
                  <span className="text-xl font-bold text-muted-foreground ml-0.5">
                    {s.suffix}
                  </span>
                </p>
                <p className="text-base font-semibold mt-1">{s.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM STRIP */}
        <motion.div
          variants={stripVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 rounded-2xl border bg-background p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-2">
              <p className="text-xl font-bold">
                Built for real-world production
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AdminHub is not a demo — it runs on a live Express REST API,
                MongoDB Atlas, and Next.js App Router with real authentication,
                real data, and real performance. Every feature you see is
                fully functional and deployed.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start md:items-end gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  All systems operational
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Live API active
                </span>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}