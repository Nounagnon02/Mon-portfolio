import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PALETTE_VARS = {
  skyTop: '--lagoon-sky-top',
  skyBottom: '--lagoon-sky-bottom',
  sun: '--lagoon-sun',
  haze: '--lagoon-haze',
  water: '--lagoon-water',
  deepTop: '--lagoon-deep-top',
  deepBottom: '--lagoon-deep-bottom',
  wood: '--lagoon-wood',
  woodWet: '--lagoon-wood-wet',
  roof: '--lagoon-roof',
  deck: '--lagoon-deck',
  window: '--lagoon-window',
  ink: '--lagoon-ink',
  onDeep: '--lagoon-on-deep',
  onDeepSoft: '--lagoon-on-deep-soft',
};

/* Weak device, data saver or no WebGL: the static image is shown instead. */
export function canUse3D() {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator;
  if (nav.connection && nav.connection.saveData) return false;
  if ((nav.hardwareConcurrency || 4) <= 2) return false;
  if (nav.deviceMemory && nav.deviceMemory <= 2) return false;
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function LagoonCanvas({ houses, apiRef, onPending, onReady, onFail, className }) {
  const hostRef = useRef(null);
  const callbacks = useRef({ onPending, onReady, onFail });
  callbacks.current = { onPending, onReady, onFail };
  const { theme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    let cancelled = false;
    let api = null;
    let canvas = null;
    let inView = true;
    let idleId = null;
    let io = null;
    let ro = null;

    // A new scene is on its way (first load or theme change): show the static image meanwhile
    if (callbacks.current.onPending) callbacks.current.onPending();

    const syncRunning = () => {
      if (!api) return;
      if (inView && !document.hidden) api.start();
      else api.stop();
    };

    const fail = (reason) => {
      if (!cancelled) callbacks.current.onFail(reason);
    };

    const start = async () => {
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const { createLagoonScene } = await import('./lagoonScene.js');
        if (cancelled) return;

        // A fresh canvas per scene: a disposed WebGL context cannot be reused
        canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        host.appendChild(canvas);

        const styles = getComputedStyle(host);
        const palette = Object.fromEntries(
          Object.entries(PALETTE_VARS).map(([key, name]) => [
            key,
            styles.getPropertyValue(name).trim(),
          ]),
        );
        palette.night = theme === 'dark';
        const narrow = host.clientWidth / Math.max(host.clientHeight, 1) < 0.9;

        api = createLagoonScene(canvas, {
          houses,
          palette,
          narrow,
          onSlow: () => fail('slow'),
          onLost: () => fail('lost'),
        });
        apiRef.current = api;

        ro = new ResizeObserver(() => api && api.resize());
        ro.observe(host);
        io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncRunning();
        });
        io.observe(host);
        document.addEventListener('visibilitychange', syncRunning);
        syncRunning();
        callbacks.current.onReady();
      } catch {
        fail('error');
      }
    };

    // Text first: the 3D only loads once the page is loaded and the browser is idle
    const schedule = () => {
      idleId =
        'requestIdleCallback' in window
          ? window.requestIdleCallback(start, { timeout: 2000 })
          : window.setTimeout(start, 300);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        window.clearTimeout(idleId);
      }
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener('visibilitychange', syncRunning);
      if (api) api.dispose();
      if (canvas) canvas.remove();
      apiRef.current = null;
    };
  }, [theme, houses, apiRef]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
