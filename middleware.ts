import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccess, getDefaultPage, type UserProfile } from "@/lib/rbac";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  request.headers.set("x-pathname", pathname);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoginPath = pathname === "/admin/login";
  const isSetPasswordPath = pathname === "/admin/set-password";

  const redirect = (dest: string) => {
    const url = request.nextUrl.clone();
    url.pathname = dest;
    const res = NextResponse.redirect(url);
    res.headers.set("x-pathname", dest);
    return res;
  };

  // Not logged in → allow login and set-password pages, redirect others to login
  if (!user && !isLoginPath && !isSetPasswordPath) return redirect("/admin/login");

  // Logged in — fetch profile once (needed for both login-redirect and access check)
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("user_id, role, permissions")
      .eq("user_id", user.id)
      .single();

    const userProfile = profile as UserProfile | null;

    // On login page → redirect to appropriate default page
    if (isLoginPath) {
      const dest = userProfile ? getDefaultPage(userProfile) : "/admin/home";
      return redirect(dest);
    }

    // No profile yet → treat as employee with no permissions
    if (!userProfile) {
      const dest = getDefaultPage({ user_id: user.id, role: "employee", permissions: [] });
      if (!isSetPasswordPath && pathname !== dest) return redirect(dest);
      return supabaseResponse;
    }

    if (!canAccess(userProfile, pathname)) {
      return redirect(getDefaultPage(userProfile));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
