"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfileSettings() {
  const user = useAuthStore((s) => s.user);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [profile, setProfile] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    current:  "",
    next:     "",
    confirm:  "",
  });

  const [showPass, setShowPass] = useState(false);
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 800)); // swap for real API call
    toast.success("Profile updated successfully.");
    setSavingProfile(false);
  };

  const handlePasswordSave = async () => {
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    await new Promise((r) => setTimeout(r, 800)); // swap for real API call
    toast.success("Password changed successfully.");
    setPasswords({ current: "", next: "", confirm: "" });
    setSavingPassword(false);
  };

  return (
    <div className="space-y-6">

      {/* ── PROFILE INFO ───────────────────────────────────── */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 space-y-6">

          {/* AVATAR ROW */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-semibold">
                {user ? getInitials(user.name) : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-base">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge className="mt-1 bg-indigo-100 text-indigo-700 text-[10px]">
                Member
              </Badge>
            </div>
          </div>

          <div className="border-t" />

          {/* FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p-name" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </Label>
              <Input
                id="p-name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                id="p-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="focus-visible:ring-0"
              />
            </div>
          </div>

          <Button
            onClick={handleProfileSave}
            disabled={savingProfile}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {savingProfile ? "Saving..." : "Save Profile"}
          </Button>

        </CardContent>
      </Card>

      {/* ── CHANGE PASSWORD ────────────────────────────────── */}
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 space-y-5">

          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-base">Change Password</p>
              <p className="text-xs text-muted-foreground">
                Use a strong password you don&apos;t use elsewhere
              </p>
            </div>
          </div>

          <div className="border-t" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "cur",  label: "Current Password", key: "current" },
              { id: "new",  label: "New Password",     key: "next" },
              { id: "conf", label: "Confirm Password", key: "confirm" },
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
                    className="focus-visible:ring-0 pr-10"
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
          </div>

          <Button
            onClick={handlePasswordSave}
            disabled={savingPassword}
            variant="outline"
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {savingPassword ? "Updating..." : "Update Password"}
          </Button>

        </CardContent>
      </Card>

    </div>
  );
}