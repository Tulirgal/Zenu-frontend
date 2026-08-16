/** Routes that use ZenFocusMode — hide global shell navigation */
export const ZEN_FOCUS_ROUTES = ['/meditation'] as const;

export function isZenFocusRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return ZEN_FOCUS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
