/**
 * Map legacy Inner Compass module routes → current app paths.
 * Aligns with MODULE_ROUTES targets without calling the ranking API.
 */
const LEGACY_ROUTE_MAP: Record<string, string> = {
  '/diary': '/journal',
  '/doodle': '/art',
  '/bubble': '/bubbles',
  '/mindfulness': '/meditation',
};

export function resolveModuleHref(route: string): string {
  return LEGACY_ROUTE_MAP[route] ?? route;
}
