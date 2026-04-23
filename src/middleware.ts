import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

export async function middleware(req: NextRequest) {
  const bypassed =
    PUBLIC_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route)) ||
    req.nextUrl.pathname.startsWith("/api");

  const hasDemoSession =
    req.cookies.has("sb-access-token") ||
    req.cookies.has("sb-refresh-token") ||
    req.cookies.has("demo-session");

  if (!hasDemoSession && !bypassed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
