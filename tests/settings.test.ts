import { beforeEach, describe, expect, it } from 'vitest';

// Tiny in-memory localStorage (tests run in Node).
const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage;

describe('touch buttons setting', () => {
  beforeEach(() => store.clear());

  it('defaults to on-press buttons', async () => {
    const { getSettings } = await import('../src/storage/local');
    expect(getSettings().touchButtons).toBe('always');
  });

  it("old saves with the old default 'auto' use the new default", async () => {
    const { getSettings } = await import('../src/storage/local');
    store.set('pmi:settings', JSON.stringify({ touchButtons: 'auto', tutorialDone: true }));
    expect(getSettings().touchButtons).toBe('always');
    expect(getSettings().tutorialDone).toBe(true);
  });

  it("keeps the player's own choice", async () => {
    const { getSettings, setSettings } = await import('../src/storage/local');
    setSettings({ touchButtons: 'auto' });
    expect(getSettings().touchButtons).toBe('auto');
    setSettings({ music: false }); // other changes keep it
    expect(getSettings().touchButtons).toBe('auto');
    setSettings({ touchButtons: 'never' });
    expect(getSettings().touchButtons).toBe('never');
  });

  it('preserves earned totals and legacy records while separating new normal/slow bests', async () => {
    const { recordRun } = await import('../src/storage/local');
    store.set('pmi:stats', JSON.stringify({ best: 2000, totalGears: 250, totalDistance: 8000, runs: 12 }));
    const normal = recordRun(180, 20);
    expect(normal.newBest).toBe(true);
    expect(normal.stats.best).toBe(2000);
    expect(normal.stats.releaseBest).toBe(180);
    const slow = recordRun(250, 10, true);
    expect(slow.stats.releaseBestSlow).toBe(250);
    expect(slow.stats.releaseBest).toBe(180);
    expect(slow.stats.totalGears).toBe(280);
  });
});
