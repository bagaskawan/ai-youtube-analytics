import { type NextRequest } from "next/server";
import updateSession from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// src/middleware.ts
export const config = {
  matcher: [
    // Rute Autentikasi
    "/login", // jika ada halaman signup terpisah
    "/auth/callback",
    // Rute Aplikasi Inti
    "/dashboard/:path*",
    // Kecualikan aset statis dan _next
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)", // Pola umum untuk mengecualikan file statis
  ],
};
