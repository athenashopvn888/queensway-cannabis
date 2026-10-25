/** In-store boards. The sticky bar stays out of these documents. */
export function showMobileBar(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return path !== "/tv" && path !== "/tv2" && !path.startsWith("/tv/") && !path.startsWith("/tv2/");
}
