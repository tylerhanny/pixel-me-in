/**
 * Pure game rules (no Phaser), so balance changes can be unit-tested.
 * Distances are in metres unless the name says Px.
 */
import { ZONE_LENGTH_M } from '../config';

/** Seeded random numbers (mulberry32). Same seed = same run (for a future Daily Run). */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const START_SPEED = 230;
export const MAX_SPEED = 520;

/** World speed in px/s. Slow mode is an accessibility option. */
export function speedAt(distance: number, slowMode = false): number {
  const s = Math.min(MAX_SPEED, START_SPEED + distance * 0.28);
  return slowMode ? s * 0.75 : s;
}

export function zoneIndexAt(distance: number): number {
  return Math.floor(distance / ZONE_LENGTH_M);
}

export const BOSS_CHASE_M = 45;

/** The robot chases you during the last stretch of every zone. */
export function isBossChase(distance: number): boolean {
  return distance % ZONE_LENGTH_M >= ZONE_LENGTH_M - BOSS_CHASE_M;
}

/** Power-ups follow a predictable, rotating schedule, without replacing active powers. */
export const FIRST_POWER_M = 45;
export const POWER_PITY_M = 90;
export function powerDue(distance: number, last: number, active: boolean): boolean {
  return !active && distance - last >= POWER_PITY_M;
}

/** What the player must do in each tutorial lesson. */
export type LessonAction = 'jump' | 'slide' | 'double' | 'power';

export interface Lesson {
  pattern: 'low' | 'high' | 'doubleGears' | 'tutorialPower';
  action: LessonAction;
}

/** First-run tutorial: one lesson per move. Time slows down until the player does it. */
export const TUTORIAL: Lesson[] = [
  { pattern: 'low', action: 'jump' },
  { pattern: 'high', action: 'slide' },
  { pattern: 'doubleGears', action: 'double' },
  { pattern: 'tutorialPower', action: 'power' },
];

export type PowerId = 'shield' | 'magnet' | 'jetpack';
export const POWERS: PowerId[] = ['shield', 'magnet', 'jetpack'];
export const POWER_SECONDS: Record<PowerId, number> = { shield: Infinity, magnet: 8, jetpack: 5 };

// ---------------------------------------------------------------- RAM

/** Pickups are RAM sticks: 1 GB each, and a rare RGB stick worth 8 GB. */
export type RamKind = 'ram' | 'ramRgb';
export const RAM_RGB_CHANCE = 0.04;
export const RAM_GB: Record<RamKind, number> = { ram: 1, ramRgb: 8 };

export function pickRam(rng: () => number): RamKind {
  return rng() < RAM_RGB_CHANCE ? 'ramRgb' : 'ram';
}

/** GB for one pickup. "Download More RAM" doubles it. */
export function ramValue(kind: RamKind, doubled: boolean): number {
  return RAM_GB[kind] * (doubled ? 2 : 1);
}

/** On a stumble the villain grabs a quarter of the RAM you saved this run. */
export function ramLost(current: number): number {
  return Math.floor(Math.max(0, current) * 0.25);
}

/** Real PC sizes make the best jokes. */
export const RAM_MILESTONES: [number, string][] = [
  [8, '8 GB – enough for one Chrome tab'],
  [16, '16 GB – Chrome can open 3 tabs'],
  [32, '32 GB – gamer status!'],
  [64, '64 GB – the data center is jealous'],
  [128, '128 GB – you ARE the data center'],
  [256, "256 GB – hands off, it's mine!"],
];

/** The milestone crossed when going from `before` to `after` GB (the highest one), if any. */
export function ramMilestone(before: number, after: number): string | null {
  let hit: string | null = null;
  for (const [gb, text] of RAM_MILESTONES) if (before < gb && after >= gb) hit = text;
  return hit;
}

/** 12 → "12 GB", 1536 → "1.5 TB". */
export function formatGB(gb: number): string {
  return gb < 1024 ? `${gb} GB` : `${(gb / 1024).toFixed(1)} TB`;
}

export function metres(px: number, pxPerMetre: number): number {
  return Math.floor(px / pxPerMetre);
}

// ---------------------------------------------------------------- robot

/**
 * Stumble + catch-up (Temple Run / Subway Surfers style, owner's pick 2026-11-02):
 * a crash trips you and the robot runs up right behind you for a while;
 * crash again while it is close = caught.
 */
/** How long the robot stays right behind you after a stumble. */
export const DANGER_MS = 6000;

export function crashOutcome(now: number, dangerUntil: number): 'stumble' | 'caught' {
  return now < dangerUntil ? 'caught' : 'stumble';
}

/** Robot Rush attacks (end of each zone). Warnings are long enough to react. */
export const RUSH_ATTACK_EVERY_MS = 3300;
export const LASER_WARN_MS = 1100;
export const LASER_FIRE_MS = 350;
export const BOMB_FLIGHT_MS = 900;

/**
 * Where a thrown bomb is at progress `p` (0 → 1): a straight line from `from`
 * to `to` plus an arc `height` px tall. At p = 1 it is exactly on `to`.
 */
export function bombArc(
  p: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  height: number,
): { x: number; y: number } {
  const t = Math.min(1, Math.max(0, p));
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t - 4 * height * t * (1 - t),
  };
}

export type RobotAttack = 'laser' | 'bomb';

export function pickAttack(rng: () => number, last: RobotAttack | null): RobotAttack {
  // Never the same attack three times in a row feels fairer; simple: lean towards switching.
  if (last && rng() < 0.65) return last === 'laser' ? 'bomb' : 'laser';
  return rng() < 0.5 ? 'laser' : 'bomb';
}
