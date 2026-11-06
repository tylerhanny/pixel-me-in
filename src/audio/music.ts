/**
 * Tiny chiptune music player (Web Audio, no files). One short loop per zone:
 * bass + arpeggio lead + noise hi-hat. Notes are scheduled a little ahead of
 * time so the beat stays steady even if a frame is slow.
 */
import { getAudioContext } from './sfx';

interface Song {
  bpm: number;
  /** Root note (MIDI) per bar; the loop is as long as this list. */
  bars: number[];
  /** Arpeggio steps (semitones above the root), one per 8th note. */
  arp: number[];
  lead: OscillatorType;
}

// Desk and Data Center: the same harmonic family, with a cooler, tighter second loop.
const SONGS: Song[] = [
  { bpm: 124, bars: [60, 57, 53, 55], arp: [0, 4, 7, 12, 7, 4, 9, 7], lead: 'triangle' },
  { bpm: 138, bars: [57, 53, 60, 55], arp: [0, 7, 12, 7, 3, 7, 10, 7], lead: 'square' },
];

// Photo Booth: a calm loop while you dress up.
const BOOTH: Song = {
  bpm: 96,
  bars: [60, 57, 53, 55],
  arp: [0, 7, 12, 16, 12, 7, 4, 7],
  lead: 'triangle',
};

const VOLUME = 0.035;
let enabled = true;
let song: Song | null = null;
let step = 0;
let nextTime = 0;
let timer = 0;
let master: GainNode | null = null;

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function note(
  ac: AudioContext,
  midi: number,
  t: number,
  dur: number,
  type: OscillatorType,
  vol: number,
) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq(midi), t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function hat(ac: AudioContext, t: number) {
  const len = Math.floor(ac.sampleRate * 0.03);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  const g = ac.createGain();
  g.gain.value = 0.25;
  src.buffer = buf;
  src.connect(g).connect(master!);
  src.onended = () => {
    src.disconnect();
    g.disconnect();
  };
  src.start(t);
}

function schedule() {
  const ac = getAudioContext();
  if (!ac || !song || !master) return;
  const eighth = 60 / song.bpm / 2;
  while (nextTime < ac.currentTime + 0.12) {
    const bar = Math.floor(step / 8) % song.bars.length;
    const root = song.bars[bar];
    const i = step % 8;
    note(ac, root + 12 + song.arp[i], nextTime, eighth * 0.9, song.lead, 0.5);
    if (i % 2 === 0) note(ac, root - 12, nextTime, eighth * 1.8, 'triangle', 0.9);
    if (i % 2 === 1) hat(ac, nextTime);
    nextTime += eighth;
    step++;
  }
}

export function setMusicEnabled(on: boolean) {
  enabled = on;
  if (!on) stopMusic();
}

/** Start (or switch to) the loop for a zone. */
export function playZoneMusic(zone: number) {
  playSong(SONGS[zone % SONGS.length]);
}

/** Calm loop for the Photo Booth (keeps playing if it is already on). */
export function playBoothMusic() {
  if (song !== BOOTH || !timer) playSong(BOOTH);
}

function playSong(next: Song) {
  const ac = getAudioContext();
  if (!enabled || !ac) return;
  stopMusic();
  song = next;
  if (!master) {
    master = ac.createGain();
    master.connect(ac.destination);
  }
  master.gain.setValueAtTime(VOLUME, ac.currentTime);
  step = 0;
  nextTime = ac.currentTime + 0.05;
  window.clearInterval(timer);
  timer = window.setInterval(schedule, 25);
}

export function pauseMusic() {
  window.clearInterval(timer);
  timer = 0;
}

export function resumeMusic() {
  const ac = getAudioContext();
  if (!enabled || !ac || !song || timer) return;
  nextTime = ac.currentTime + 0.05;
  timer = window.setInterval(schedule, 25);
}

export function stopMusic() {
  window.clearInterval(timer);
  timer = 0;
  song = null;
  // A new bus prevents already scheduled notes leaking into the next zone/retry.
  master?.disconnect();
  master = null;
}

/** Short "game over" tune. */
export function playGameOverJingle() {
  stopMusic();
  const ac = getAudioContext();
  if (!enabled || !ac) return;
  if (!master) {
    master = ac.createGain();
    master.connect(ac.destination);
  }
  master.gain.setValueAtTime(VOLUME, ac.currentTime);
  [72, 67, 64, 60].forEach((m, i) => note(ac, m, ac.currentTime + i * 0.14, 0.18, 'square', 0.6));
}
