"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_LABELS, type PermissionKey, type UserProfile } from "@/lib/rbac";
import { KeyRound, ShieldCheck, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Min. 6 characters"),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      supabase
        .from("user_profiles")
        .select("user_id, role, permissions")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => { if (data) setProfile(data as UserProfile); });
    });
  }, []);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onChangePassword = async (data: PasswordData) => {
    setPwError(null);
    setSuccessMsg(null);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) { setPwError(error.message); return; }
    reset();
    setSuccessMsg("Password updated successfully.");
  };

  const permissions = (profile?.permissions ?? []) as PermissionKey[];

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your account details and access permissions.</p>
      </div>

      {/* Account info */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Account Info
        </h2>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} readOnly className="bg-secondary" />
        </div>
        <div className="flex items-center gap-3">
          <Label>Role</Label>
          {profile ? (
            <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
              {profile.role === "admin" ? "Administrator" : "Employee"}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Loading…</span>
          )}
        </div>
      </div>

      {/* Permissions */}
      {profile?.role === "employee" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> My Access
          </h2>
          {permissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don't have access to any sections yet. Contact your administrator.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {permissions.map((p) => (
                <Badge key={p} variant="secondary">{PERMISSION_LABELS[p]}</Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Change password */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" /> Change Password
        </h2>
        <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" {...register("password")} placeholder="Min. 6 characters" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input type="password" {...register("confirm")} placeholder="Repeat new password" />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
          </div>
          {pwError && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{pwError}</p>}
          {successMsg && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">{successMsg}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
