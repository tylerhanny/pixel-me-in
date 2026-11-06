/**
 * Touch controls during a run: gestures on the whole game area, plus an
 * optional on-screen pad (Jump / Slide buttons). Setting "Touch buttons":
 * auto (portrait only), always, never.
 */
import { sendInput } from '../game/controller';
import { getSettings, setSettings } from '../storage/local';
import { isPortrait, isTouch } from './device';
import { GestureTracker, type GameInput } from './gestures';

export function padVisible(): boolean {
  if (!isTouch()) return false;
  const mode = getSettings().touchButtons;
  return mode === 'always' || (mode === 'auto' && isPortrait());
}

let refreshPad = () => {};
let cancelPad = () => {};

export function cancelTouchControls() {
  cancelPad();
}

/** Show or hide the on-screen buttons right now (pause menu, tutorial chip). */
export function setPadShown(shown: boolean) {
  setSettings({ touchButtons: shown ? 'always' : 'never' });
  refreshPad();
}

/** Re-read the "Touch buttons" setting while a run is on. */
export function updatePad() {
  refreshPad();
}

/** Attach gestures to `surface` and show/hide the pad in `padEl`. Returns a detach function. */
export function attachTouchControls(surface: HTMLElement, padEl: HTMLElement): () => void {
  const tracker = new GestureTracker();
  const send = (list: GameInput[]) => list.forEach(sendInput);
  const touchOnly = (e: PointerEvent) => e.pointerType === 'touch' || e.pointerType === 'pen';

  const down = (e: PointerEvent) => {
    if (!touchOnly(e)) return;
    surface.setPointerCapture?.(e.pointerId);
    send(tracker.down(e.pointerId, e.clientX, e.clientY, e.timeStamp));
  };
  const move = (e: PointerEvent) =>
    touchOnly(e) && send(tracker.move(e.pointerId, e.clientX, e.clientY));
  const up = (e: PointerEvent) =>
    touchOnly(e) && send(tracker.up(e.pointerId, e.clientX, e.clientY, e.timeStamp));
  const cancel = (e: PointerEvent) => touchOnly(e) && send(tracker.cancel(e.pointerId));
  surface.addEventListener('pointerdown', down);
  surface.addEventListener('pointermove', move);
  surface.addEventListener('pointerup', up);
  surface.addEventListener('pointercancel', cancel);
  surface.addEventListener('lostpointercapture', cancel);

  // On-screen pad: real buttons (hold Jump for a higher jump, hold Slide to keep sliding).
  padEl.innerHTML = `
    <button class="pad-btn pad-slide" aria-label="Slide" data-in="slide"><span aria-hidden="true">▼</span>Slide</button>
    <button class="pad-btn pad-jump" aria-label="Jump" data-in="jump"><span aria-hidden="true">▲</span>Jump</button>`;
  const held = new Map<HTMLElement, number>();
  const press = (e: PointerEvent) => {
    if (held.has(e.currentTarget as HTMLElement)) return;
    const kind = (e.currentTarget as HTMLElement).dataset.in;
    e.preventDefault();
    e.stopPropagation();
    held.set(e.currentTarget as HTMLElement, e.pointerId);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    (e.currentTarget as HTMLElement).classList.add('down');
    sendInput(kind === 'jump' ? 'jumpDown' : 'slideDown');
  };
  const release = (e: PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (held.get(el) !== e.pointerId) return;
    held.delete(el);
    el.classList.remove('down');
    sendInput(el.dataset.in === 'jump' ? 'jumpUp' : 'slideUp');
  };
  padEl.querySelectorAll<HTMLElement>('.pad-btn').forEach((b) => {
    b.addEventListener('pointerdown', press);
    b.addEventListener('pointerup', release);
    b.addEventListener('pointercancel', release);
    b.addEventListener('lostpointercapture', release);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  const reset = () => {
    tracker.reset();
    held.forEach((_id, el) => el.classList.remove('down'));
    held.clear();
    sendInput('cancel');
  };
  cancelPad = reset;
  const refresh = () => {
    reset();
    padEl.classList.toggle('hidden', !padVisible());
  };
  window.addEventListener('blur', reset);
  window.addEventListener('resize', reset);
  refresh();
  refreshPad = refresh;
  const mq = matchMedia('(orientation: portrait)');
  mq.addEventListener('change', refresh);

  return () => {
    reset();
    cancelPad = () => {};
    window.removeEventListener('blur', reset);
    window.removeEventListener('resize', reset);
    surface.removeEventListener('pointerdown', down);
    surface.removeEventListener('pointermove', move);
    surface.removeEventListener('pointerup', up);
    surface.removeEventListener('pointercancel', cancel);
    surface.removeEventListener('lostpointercapture', cancel);
    mq.removeEventListener('change', refresh);
    refreshPad = () => {};
    padEl.innerHTML = '';
    padEl.classList.add('hidden');
  };
}
