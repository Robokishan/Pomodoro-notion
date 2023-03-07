const publicFileRegex = /\.(.*)$/;
const publicUrls = ["/privacy", "/terms", "/about", "/_offline", "/public"];

const ignoredApiRoutes = ["/api/auth"];

export const shouldIgnore = (pathname: string): boolean => {
  return (
    ignoredApiRoutes.findIndex((route) => pathname.startsWith(route)) != -1 ||
    pathname.startsWith("_next") ||
    pathname.startsWith("/static") ||
    publicFileRegex.test(pathname) ||
    publicUrls.findIndex((r) => pathname.startsWith(r)) != -1
  );
};
