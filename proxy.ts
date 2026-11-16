import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  // Protect all dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Auth pages (login, registration)
  const isAuthPage =
    pathname === "/login" || pathname === "/registration";

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Support both proxy and middleware naming conventions
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
