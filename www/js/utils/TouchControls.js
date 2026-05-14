// ─── TOUCH CONTROLS ───────────────────────────────────────────────────────────
// On-screen D-pad + action buttons for mobile / Capacitor builds.
// Each button dispatches a synthetic KeyboardEvent at `window`, which the
// Phaser keyboard manager already listens to — so existing input code in
// Sophia / Jesus / LevelScene works unchanged.
//
// Mount once from main.js. Auto-detects touch devices; force-on with `?touch=1`.
// Hidden by default; LevelScene calls show()/hide() on its own lifecycle so the
// pad doesn't intercept menu / prologue taps.

const KEYS = {
  left:   { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
  right:  { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  up:     { key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
  attack: { key: 'z',          code: 'KeyZ',       keyCode: 90 },
  dash:   { key: 'x',          code: 'KeyX',       keyCode: 88 },
  pause:  { key: 'Escape',     code: 'Escape',     keyCode: 27 },
};

const BUTTONS = [
  { id: 'left',   cls: 'btn-left',   label: '◀'  },
  { id: 'right',  cls: 'btn-right',  label: '▶'  },
  { id: 'up',     cls: 'btn-jump',   label: '⤴'  },
  { id: 'attack', cls: 'btn-attack', label: 'Z'  },
  { id: 'dash',   cls: 'btn-dash',   label: 'X'  },
  { id: 'pause',  cls: 'btn-pause',  label: '‖' },
];

const STYLE = `
.sophia-touch {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  font-family: monospace;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
.sophia-touch.hidden { display: none; }
.sophia-touch button {
  position: absolute;
  pointer-events: auto;
  background: rgba(20, 12, 40, 0.42);
  border: 2px solid rgba(255, 224, 160, 0.55);
  color: rgba(255, 240, 200, 0.92);
  border-radius: 50%;
  font-size: 26px;
  font-weight: bold;
  padding: 0;
  line-height: 1;
  cursor: pointer;
  outline: none;
  touch-action: none;
  text-shadow: 0 0 6px rgba(255, 224, 160, 0.6);
  transition: background 80ms linear, transform 80ms linear;
}
.sophia-touch button:active,
.sophia-touch button.pressed {
  background: rgba(255, 224, 160, 0.28);
  transform: scale(0.94);
}
.sophia-touch .btn-left   { left: 14px;   bottom: 80px;  width: 72px; height: 72px; }
.sophia-touch .btn-right  { left: 100px;  bottom: 80px;  width: 72px; height: 72px; }
.sophia-touch .btn-jump   { right: 18px;  bottom: 96px;  width: 80px; height: 80px;
  background: rgba(60, 100, 60, 0.42); border-color: rgba(160, 255, 200, 0.55); }
.sophia-touch .btn-attack { right: 104px; bottom: 14px;  width: 66px; height: 66px;
  background: rgba(80, 30, 60, 0.42);  border-color: rgba(255, 160, 200, 0.55); }
.sophia-touch .btn-dash   { right: 26px;  bottom: 14px;  width: 66px; height: 66px;
  background: rgba(80, 60, 20, 0.42);  border-color: rgba(255, 200, 100, 0.6); }
.sophia-touch .btn-pause  { right: 14px;  top: 14px;     width: 44px; height: 44px;
  font-size: 18px; border-radius: 10px; }
`;

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')
  );
}

function dispatch(type, info) {
  const ev = new KeyboardEvent(type, {
    key: info.key,
    code: info.code,
    bubbles: true,
    cancelable: true,
  });
  // KeyboardEvent's constructor ignores keyCode/which in some engines;
  // Phaser's keyboard plugin reads keyCode, so override after construction.
  Object.defineProperty(ev, 'keyCode', { get: () => info.keyCode });
  Object.defineProperty(ev, 'which',   { get: () => info.keyCode });
  window.dispatchEvent(ev);
}

export function mountTouchControls({ force = false } = {}) {
  if (typeof document === 'undefined') return null;
  if (document.querySelector('.sophia-touch')) return null;
  if (!force && !isTouchDevice()) return null;

  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'sophia-touch hidden';

  const held = new Set();

  const press = (id) => {
    if (held.has(id)) return;
    held.add(id);
    dispatch('keydown', KEYS[id]);
  };
  const release = (id) => {
    if (!held.has(id)) return;
    held.delete(id);
    dispatch('keyup', KEYS[id]);
  };

  for (const def of BUTTONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = def.cls;
    btn.textContent = def.label;
    btn.setAttribute('aria-label', def.id);

    const onStart = (e) => {
      e.preventDefault();
      btn.classList.add('pressed');
      press(def.id);
    };
    const onEnd = (e) => {
      e.preventDefault();
      btn.classList.remove('pressed');
      release(def.id);
    };

    btn.addEventListener('touchstart',  onStart, { passive: false });
    btn.addEventListener('touchend',    onEnd,   { passive: false });
    btn.addEventListener('touchcancel', onEnd,   { passive: false });
    btn.addEventListener('mousedown',   onStart);
    btn.addEventListener('mouseup',     onEnd);
    btn.addEventListener('mouseleave',  onEnd);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());

    overlay.appendChild(btn);
  }

  // Release every held key when the overlay is hidden or the tab loses focus —
  // otherwise a key dispatched in 'down' state would stick if the user backgrounds
  // the app mid-press.
  const releaseAll = () => {
    for (const id of Array.from(held)) release(id);
    overlay.querySelectorAll('button.pressed').forEach(b => b.classList.remove('pressed'));
  };
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releaseAll();
  });

  document.body.appendChild(overlay);

  const api = {
    el: overlay,
    show() { overlay.classList.remove('hidden'); },
    hide() { releaseAll(); overlay.classList.add('hidden'); },
    isVisible() { return !overlay.classList.contains('hidden'); },
    destroy() {
      releaseAll();
      overlay.remove();
      style.remove();
    },
  };
  window.__sophiaTouchControls = api;
  return api;
}
