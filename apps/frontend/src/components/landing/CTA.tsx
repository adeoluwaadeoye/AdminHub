"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HiArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineBolt,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple, FaGooglePlay } from "react-icons/fa";

const perks = [
  { icon: <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />,  text: "Free forever"          },
  { icon: <HiOutlineShieldCheck  className="h-5 w-5 text-indigo-500" />, text: "JWT + OAuth secured"   },
  { icon: <HiOutlineBolt         className="h-5 w-5 text-yellow-500" />, text: "Live in 2 minutes"     },
];

function QRCode() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-28 w-28 rounded-xl border bg-white p-2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4"  y="4"  width="24" height="24" rx="2" fill="none" stroke="#1e1e1e" strokeWidth="4" />
      <rect x="10" y="10" width="12" height="12" rx="1" fill="#1e1e1e" />
      <rect x="52" y="4"  width="24" height="24" rx="2" fill="none" stroke="#1e1e1e" strokeWidth="4" />
      <rect x="58" y="10" width="12" height="12" rx="1" fill="#1e1e1e" />
      <rect x="4"  y="52" width="24" height="24" rx="2" fill="none" stroke="#1e1e1e" strokeWidth="4" />
      <rect x="10" y="58" width="12" height="12" rx="1" fill="#1e1e1e" />
      {[
        [34,4],[38,4],[42,4],[34,8],[42,8],[38,12],[34,16],[42,16],[38,20],
        [34,34],[38,30],[42,34],[46,30],[50,34],[34,38],[46,38],[50,38],
        [54,34],[58,30],[62,34],[66,30],[70,34],[54,38],[70,38],
        [34,42],[42,42],[50,42],[58,42],[66,42],[70,42],
        [34,46],[38,46],[46,46],[54,50],[62,46],[70,46],
        [34,50],[42,54],[50,54],[58,54],[66,54],[70,50],
        [38,58],[46,58],[54,58],[62,62],[70,58],
        [34,62],[42,62],[50,66],[58,66],[66,66],[70,62],
        [34,66],[38,70],[46,70],[54,70],[62,70],[70,70],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="3" height="3" rx="0.5" fill="#1e1e1e" />
      ))}
    </svg>
  );
}

export default function CTA() {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="relative bg-background py-16 md:py-24 overflow-hidden">

      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 bg-indigo-400/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 bg-purple-400/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 bg-green-400/5 blur-3xl rounded-full" />

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT ─────────────────────────────────────── */}
          <div>
            <Badge className="mb-6 px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-sm">
              Get Started Today
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to take control
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                of your workflow?
              </span>
            </h2>

            <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
              Join AdminHub and start managing tasks, tracking progress,
              and shipping faster — backed by a production-ready full-stack
              platform.
            </p>

            {/* PERKS */}
            <div className="mt-6 flex flex-col gap-3">
              {perks.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 text-base text-muted-foreground">
                  {p.icon}
                  <span>{p.text}</span>
                </div>
              ))}
            </div>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer text-base">
                    Open Dashboard
                    <HiArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer text-base">
                      Create Free Account
                      <HiArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="cursor-pointer text-base">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* OAUTH SHORTCUTS */}
            {!user && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground text-sm">
                    <FcGoogle className="h-4 w-4" />
                    Continue with Google
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground text-sm">
                    <FaGithub className="h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </Link>
              </div>
            )}

            <p className="mt-5 text-sm text-muted-foreground">
              No setup fees. No contracts. Cancel anytime.
            </p>
          </div>

          {/* ── RIGHT — APP DOWNLOAD ──────────────────────── */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="w-full max-w-sm rounded-2xl border bg-card shadow-xl p-6 space-y-5">

              {/* APP HEADER */}
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <HiOutlineBolt className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-base">AdminHub</p>
                  <p className="text-sm text-muted-foreground">Task & Project Manager</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Downloads", value: "10K+" },
                  { label: "Rating",    value: "4.9"  },
                  { label: "Reviews",   value: "2.3K" },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-muted/40 py-2.5">
                    <p className="text-base font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* STORE BUTTONS */}
              <div className="space-y-2.5">
                <Link href="#">
                  <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 hover:bg-muted transition-colors cursor-pointer">
                    <FaApple className="h-7 w-7 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground leading-none">Download on the</p>
                      <p className="text-base font-semibold leading-tight mt-0.5">App Store</p>
                    </div>
                    <Badge className="ml-auto text-xs bg-indigo-100 text-indigo-700">Soon</Badge>
                  </div>
                </Link>

                <Link href="#">
                  <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 hover:bg-muted transition-colors cursor-pointer">
                    <FaGooglePlay className="h-6 w-6 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground leading-none">Get it on</p>
                      <p className="text-base font-semibold leading-tight mt-0.5">Google Play</p>
                    </div>
                    <Badge className="ml-auto text-xs bg-indigo-100 text-indigo-700">Soon</Badge>
                  </div>
                </Link>
              </div>

              {/* QR CODE */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <QRCode />
                <div>
                  <p className="text-base font-semibold">Scan to open</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Point your camera at the QR code to open AdminHub on your device instantly.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}