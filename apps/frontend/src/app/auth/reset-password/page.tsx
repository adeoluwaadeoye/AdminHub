"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: passwords.new }),
      });
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Reset failed. Link may have expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { id: "new", label: "New Password", key: "new" },
        { id: "confirm", label: "Confirm Password", key: "confirm" },
      ].map(({ id, label, key }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <div className="relative">
            <Input
              id={id}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={passwords[key as keyof typeof passwords]}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, [key]: e.target.value }))
              }
              className="focus-visible:ring-indigo-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ))}

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={loading}
      >
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Resetting...</>
          : "Reset Password"
        }
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 mb-2">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Set new password
          </CardTitle>
          <CardDescription>
            Choose a strong password you don&apos;t use elsewhere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading...
            </div>
          }>
            <ResetForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}