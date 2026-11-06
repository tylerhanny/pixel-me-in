import { describe, expect, it } from 'vitest';
import { encounter, pickEncounter, roadSpeed, type EncounterId } from '../src/game/encounters';
import { makeRng, speedAt } from '../src/game/rules';
import { computeView, playerX } from '../src/game/view';

describe('authored encounters', () => {
  it('reserves the full tail and a recovery beat at all speeds', () => {
    for (const speed of [172.5, 230, 350, 520])
      for (const id of ['vault', 'duck', 'steps', 'switchback', 'reward'] as EncounterId[]) {
        const e = encounter(id, speed);
        expect(e.items.every((i) => i.x + 14 <= e.width)).toBe(true);
        expect(e.recovery / speed).toBeGreaterThanOrEqual(1.15);
        const hazards = e.items.filter((i) => i.kind !== 'ram');
        for (let i = 1; i < hazards.length; i++)
          expect((hazards[i].x - hazards[i - 1].x - 60) / speed).toBeGreaterThanOrEqual(0.98);
      }
  });
  it('keeps at least 1.05s of visible approach in each viewport and slow mode', () => {
    for (const [w, h] of [
      [360, 740],
      [412, 915],
      [915, 412],
      [1280, 720],
    ]) {
      const v = computeView(w, h);
      for (const m of [0, 500, 2500])
        for (const slow of [false, true]) {
          const speed = roadSpeed(speedAt(m), v.width, playerX(v), slow);
          expect((v.width - playerX(v) - 42) / speed).toBeGreaterThanOrEqual(1.05);
        }
    }
  });
  it('is seeded, avoids immediate repetition and includes relief', () => {
    const run = () => {
      const rng = makeRng(73);
      let last: EncounterId | null = null;
      return Array.from({ length: 40 }, () => (last = pickEncounter(rng, 200, 1, last)));
    };
    const ids = run();
    expect(run()).toEqual(ids);
    expect(ids).toContain('reward');
    expect(ids.every((id, i) => !i || id !== ids[i - 1])).toBe(true);
    expect(encounter('reward', 520).items.every((i) => i.kind === 'ram')).toBe(true);
  });
});
