import { NextRequest, NextResponse } from "next/server";

const publicFileRegex = /\.(.*)$/;
const anonymousRoutes = [
  //   "/",
  "/login",
  "/register",
  "/auth/error",
  "/auth/verify-request",
]; // The whitelisted routes

const publicUrls = ["/privacy", "/terms", "/about"];

const ignoredApiRoutes = ["/api/auth"];

//https://stackoverflow.com/a/73845472/4919370

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ignore api _next static files and publicpathname
  if (
    // ignore all api routes
    ignoredApiRoutes.findIndex((route) => pathname.startsWith(route)) != -1 ||
    pathname.startsWith("_next") ||
    pathname.startsWith("/static") ||
    publicFileRegex.test(pathname) ||
    publicUrls.findIndex((r) => pathname.startsWith(r)) != -1
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!(
    req.cookies.get("next-auth.session-token") ??
    req.cookies.get("__Secure-next-auth.session-token")
  );

  // if not authenticated and accessing login route then allow
  if (!isAuthenticated) {
    if (anonymousRoutes.findIndex((r) => pathname.startsWith(r)) != -1) {
      return NextResponse.next();
    } else {
      // otherwise redirect
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthenticated) {
    // if authenticated and accessing login page then redirect
    if (anonymousRoutes.findIndex((r) => pathname.startsWith(r)) != -1) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    } else {
      // otherwise allow
      return NextResponse.next();
    }
  }
}
