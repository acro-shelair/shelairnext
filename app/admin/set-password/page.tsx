"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function SetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "ready" | "success" | "error"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // The auth/callback route already exchanged the code for a session.
    // Just verify the user has a valid session.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("ready");
      } else {
        setStatus("error");
      }
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setStatus("success");
    setTimeout(() => window.location.href = "/admin", 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold mb-1">Set Your Password</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Shelair
          </p>

          {status === "loading" && (
            <p className="text-sm text-muted-foreground">Verifying link...</p>
          )}

          {status === "success" && (
            <p className="text-sm text-green-600">
              Password updated! Redirecting...
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-destructive">
              This link is invalid or has expired.{" "}
              <a href="/admin/login" className="underline">
                Back to login
              </a>
            </p>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirm")}
                />
                {errors.confirm && (
                  <p className="text-xs text-destructive">
                    {errors.confirm.message}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Set Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
