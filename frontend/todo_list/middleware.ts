import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // 🔐 If user NOT logged in → protect todolist
  if (!token && pathname.startsWith("/todolist")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🚫 If user already logged in → prevent going back to login/home
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/todolist", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/todolist/:path*"],
};