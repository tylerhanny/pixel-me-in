/** Authored road phrases. Distances include their entire tail and a recovery beat. */
export type EncounterId = 'vault' | 'duck' | 'steps' | 'switchback' | 'reward';
export interface EncounterItem {
  kind: 'low' | 'high' | 'ram';
  x: number;
  height: number;
}
export interface Encounter {
  id: EncounterId;
  items: EncounterItem[];
  width: number;
  recovery: number;
}

export function encounter(id: EncounterId, speed: number): Encounter {
  const items: EncounterItem[] = [];
  const beat = Math.max(250, speed * 1.25);
  const low = (x: number) => {
    items.push({ kind: 'low', x, height: 0 });
    // A readable takeoff, crest and landing. The trail is a suggestion, not a requirement.
    for (let i = -2; i <= 2; i++)
      items.push({ kind: 'ram', x: x + i * 27, height: 66 + (2 - Math.abs(i)) * 24 });
  };
  const high = (x: number) => {
    items.push({ kind: 'high', x, height: 0 });
    for (let i = -1; i <= 2; i++) items.push({ kind: 'ram', x: x + i * 26, height: 18 });
  };
  if (id === 'vault') low(60);
  if (id === 'duck') high(60);
  if (id === 'steps') {
    low(60);
    low(60 + beat);
  }
  if (id === 'switchback') {
    high(60);
    low(60 + beat);
  }
  if (id === 'reward') {
    // Ground RAM is always safe; the high arch rewards an optional double jump.
    for (let i = 0; i < 7; i++) items.push({ kind: 'ram', x: i * 30, height: 18 });
    for (let i = 0; i < 5; i++)
      items.push({ kind: 'ram', x: 45 + i * 30, height: 155 + (2 - Math.abs(i - 2)) * 16 });
  }
  const width = Math.max(...items.map((i) => i.x + (i.kind === 'ram' ? 14 : 30)));
  return { id, items, width, recovery: Math.max(240, speed * 1.15) };
}

export function pickEncounter(
  rng: () => number,
  metres: number,
  zone: number,
  last: EncounterId | null,
): EncounterId {
  const choices: EncounterId[] =
    metres < 35
      ? ['vault', 'duck', 'reward']
      : zone % 2
        ? ['duck', 'switchback', 'steps', 'reward', 'vault']
        : ['vault', 'steps', 'duck', 'reward', 'switchback'];
  const allowed = choices.filter((id) => id !== last);
  return allowed[Math.floor(rng() * allowed.length)];
}

/** Visible leading edge to player, including both body half-widths. */
export function roadSpeed(base: number, width: number, player: number, slow: boolean): number {
  const reactionSeconds = 1.05;
  const limit = (width - player - 42) / reactionSeconds;
  return Math.min(base, limit) * (slow ? 0.75 : 1);
}
