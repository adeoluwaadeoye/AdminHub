"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/dashboard/skeletons/ProfileSkeleton";
import { toast } from "sonner";
import {
    User, Mail, Lock, Save,
    Eye, EyeOff, Camera, Loader2,
} from "lucide-react";

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const initialized = useAuthStore((s) => s.initialized);
    const fetchUser = useAuthStore((s) => s.fetchUser);

    const fileRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState({ name: "", email: "" });
    const [passwords, setPasswords] = useState({
        currentPassword: "", newPassword: "", confirm: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({ name: user.name, email: user.email });
        }
    }, [user]);

    if (!initialized) return <ProfileSkeleton />;

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    // ── PROFILE UPDATE ─────────────────────────────────────
    const handleProfileSave = async () => {
        setSavingProfile(true);
        try {
            await apiRequest("/auth/profile", {
                method: "PUT",
                body: JSON.stringify(profile),
            });
            await fetchUser();
            toast.success("Profile updated successfully.");
            // ✅ fixed
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to update profile.";
            toast.error(message);
        } finally {
            setSavingProfile(false);
        }
    };

    // ── PASSWORD CHANGE ────────────────────────────────────
    const handlePasswordSave = async () => {
        if (passwords.newPassword !== passwords.confirm) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setSavingPassword(true);
        try {
            await apiRequest("/auth/change-password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });
            toast.success("Password changed successfully.");
            setPasswords({ currentPassword: "", newPassword: "", confirm: "" });

            // ✅ fixed
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to change password.";
            toast.error(message);
        } finally {
            setSavingPassword(false);
        }
    };
    // ── AVATAR UPLOAD ──────────────────────────────────────
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setUploadingAvatar(true);
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/avatar`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                    // ⚠️ do NOT set Content-Type — browser sets multipart boundary
                }
            );
            await fetchUser();
            toast.success("Avatar updated!");
        } catch {
            toast.error("Failed to upload avatar.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

            <div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account details and security
                </p>
            </div>

            {/* ── PROFILE INFO ───────────────────────────── */}
            <Card className="shadow-sm">
                <CardContent className="p-6 space-y-6">

                    {/* AVATAR */}
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-semibold">
                                    {user ? getInitials(user.name) : <User className="h-6 w-6" />}
                                </AvatarFallback>
                            </Avatar>

                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute -bottom-1 -right-1 h-7 w-7 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                            >
                                {uploadingAvatar
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Camera className="h-3.5 w-3.5" />
                                }
                            </button>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />
                        </div>

                        <div>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <Badge className="mt-1.5 bg-indigo-100 text-indigo-700 text-[10px]">
                                Member
                            </Badge>
                        </div>
                    </div>

                    <div className="border-t" />

                    {/* FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="p-name" className="flex items-center gap-1.5 text-sm">
                                <User className="h-3.5 w-3.5" /> Full Name
                            </Label>
                            <Input
                                id="p-name"
                                value={profile.name}
                                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                                className="focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="p-email" className="flex items-center gap-1.5 text-sm">
                                <Mail className="h-3.5 w-3.5" /> Email
                            </Label>
                            <Input
                                id="p-email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                                className="focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleProfileSave}
                        disabled={savingProfile}
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {savingProfile
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                            : <><Save className="h-4 w-4" /> Save Profile</>
                        }
                    </Button>
                </CardContent>
            </Card>

            {/* ── CHANGE PASSWORD ────────────────────────── */}
            <Card className="shadow-sm">
                <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Change Password</p>
                            <p className="text-xs text-muted-foreground">
                                Use a strong password you don&apos;t use elsewhere
                            </p>
                        </div>
                    </div>

                    <div className="border-t" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: "cur", label: "Current Password", key: "currentPassword" },
                            { id: "new", label: "New Password", key: "newPassword" },
                            { id: "conf", label: "Confirm Password", key: "confirm" },
                        ].map(({ id, label, key }) => (
                            <div key={id} className="space-y-2">
                                <Label htmlFor={id} className="text-sm">{label}</Label>
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
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPass
                                            ? <EyeOff className="h-4 w-4" />
                                            : <Eye className="h-4 w-4" />
                                        }
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
                        {savingPassword
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
                            : <><Lock className="h-4 w-4" /> Update Password</>
                        }
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}