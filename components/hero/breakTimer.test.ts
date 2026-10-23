import { describe, expect, it } from 'vitest';
import { createBreakTimer, formatMMSS } from './breakTimer';

describe('formatMMSS', () => {
  it('formats whole minutes', () => expect(formatMMSS(60000)).toBe('1:00'));
  it('rounds partial seconds up', () => expect(formatMMSS(59001)).toBe('1:00'));
  it('pads seconds', () => expect(formatMMSS(9000)).toBe('0:09'));
  it('never goes negative', () => expect(formatMMSS(-5)).toBe('0:00'));
});

describe('createBreakTimer', () => {
  it('counts wall-clock time, so a hidden tab does not stall it', () => {
    let now = 0;
    const timer = createBreakTimer(60000, () => now);
    timer.start();
    now = 45000;
    expect(timer.remainingMs()).toBe(15000);
    expect(timer.isDone()).toBe(false);
    now = 61000;
    expect(timer.isDone()).toBe(true);
    expect(timer.remainingMs()).toBe(0);
  });

  it('reports full duration before start', () => {
    const timer = createBreakTimer(60000, () => 123);
    expect(timer.remainingMs()).toBe(60000);
  });
});
