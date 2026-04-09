"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const loading  = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({
    name:            "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || loading) return;

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      toast.success("Account created successfully!");
      // ✅ hard redirect forces browser to re-read cookies
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    setOauthLoading(provider);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  };

  const isDisabled = submitting || loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl border-muted">

        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Create account
          </CardTitle>
          <CardDescription>
            Start your journey in seconds
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* SOCIAL */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex gap-2"
              onClick={() => handleOAuth("google")}
              type="button"
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "google"
                ? <Loader2 size={18} className="animate-spin" />
                : <FcGoogle size={20} />
              }
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex gap-2"
              onClick={() => handleOAuth("github")}
              type="button"
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "github"
                ? <Loader2 size={18} className="animate-spin" />
                : <FaGithub size={18} />
              }
              Sign up with GitHub
            </Button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              OR SIGN UP WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isDisabled}
            >
              {isDisabled ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}