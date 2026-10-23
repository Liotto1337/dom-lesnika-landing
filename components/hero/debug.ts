/** Exposes scene internals on window.__debug when the page is opened with ?debug (used by e2e tests). */
export function debugExpose(key: string, value: unknown) {
  if (typeof window === 'undefined' || !window.location.search.includes('debug')) return;
  const w = window as unknown as { __debug?: Record<string, unknown> };
  w.__debug ??= {};
  w.__debug[key] = value;
}
