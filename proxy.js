import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function proxy(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("veritas_admin_token")?.value;
    if (!token || !verifyToken(token)) {
      // Nginx overwrites these headers; the container is reachable only locally.
      // Next.js Proxy requires an absolute redirect URL.
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
      const protocol = req.headers.get("x-forwarded-proto") === "https" ? "https:" : req.nextUrl.protocol;
      return NextResponse.redirect(new URL("/admin/login", `${protocol}//${host}`));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
