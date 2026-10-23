/** Countdown measured against the wall clock, so it stays correct while the tab is hidden. */
export function createBreakTimer(durationMs: number, now: () => number = Date.now) {
  let startedAt: number | null = null;
  const remainingMs = () =>
    startedAt === null ? durationMs : Math.max(0, durationMs - (now() - startedAt));
  return {
    start() {
      startedAt = now();
    },
    remainingMs,
    isDone: () => remainingMs() === 0,
  };
}

export function formatMMSS(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
