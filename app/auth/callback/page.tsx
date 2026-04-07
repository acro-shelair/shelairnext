"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const hash = window.location.hash;

    if (!hash || !hash.includes("access_token")) {
      setError(true);
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setError(true);
        } else {
          window.location.href = next;
        }
      });
  }, [next]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Authentication failed.{" "}
          <a href="/admin/login" className="underline">
            Back to login
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
