// src/utils/supabase/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  LOGIN_PATH,
  ONBOARDING_PATH,
  DASHBOARD_PATH,
} from "@/constants/common";

export default async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update cookies pada request object (untuk penggunaan di middleware ini)
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Buat instance response baru untuk memastikan header/cookie diperbarui dengan benar
          // Inilah yang membuat `let response` menjadi perlu karena `response` di-assign ulang.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // Buat instance response baru
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Memanggil getUser() akan me-refresh sesi jika perlu dan menggunakan cookie handlers di atas
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user) {
    const isAuthRoute =
      path.startsWith(LOGIN_PATH) || path.startsWith("/auth/callback");
    if (!isAuthRoute && path !== "/" && !path.startsWith("/api")) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = LOGIN_PATH;
      if (!path.startsWith("/api")) {
        loginUrl.searchParams.set("next", path);
      }
      return NextResponse.redirect(loginUrl); // Mengembalikan instance NextResponse BARU
    }
  } else {
    if (path.startsWith(LOGIN_PATH)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = DASHBOARD_PATH;
      return NextResponse.redirect(dashboardUrl); // Mengembalikan instance NextResponse BARU
    }

    const coreAppPathsRequiringOnboarding = [
      DASHBOARD_PATH,
      "/breakdown",
      "/goals",
      "/habits",
      "/reflections",
    ];
    const isOnboardingOrSetupPath =
      path === ONBOARDING_PATH || path === "/profile/setup";
    if (
      coreAppPathsRequiringOnboarding.some((p) => path.startsWith(p)) &&
      !isOnboardingOrSetupPath
    ) {
      const { count, error: countError } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("type", "MACRO");

      if (countError) {
        console.error(
          "Middleware: Error checking for macro goals:",
          countError.message
        );
      } else if (count === 0 || count === null) {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = ONBOARDING_PATH;
        return NextResponse.redirect(onboardingUrl); // Mengembalikan instance NextResponse BARU
      }
    }
  }

  // Mengembalikan instance `response` yang mungkin telah di-assign ulang di dalam cookie handlers
  return response;
}
