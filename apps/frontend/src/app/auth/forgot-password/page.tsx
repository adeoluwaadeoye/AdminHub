"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Email is required."); return; }

    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body:   JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 mb-2">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Forgot password?
          </CardTitle>
          <CardDescription>
            {sent
              ? "Check your inbox for a reset link."
              : "Enter your email and we&apos;ll send you a reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We sent a reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                It expires in 1 hour.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</>
                  : "Send Reset Link"
                }
              </Button>

              <Link href="/auth/login">
                <Button variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}