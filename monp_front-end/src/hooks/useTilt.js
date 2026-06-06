import { useCallback, useRef, useEffect } from 'react';

/**
 * useTilt — 3D perspective tilt on hover
 *
 * @param {object} opts
 * @param {number} opts.maxTilt   — max rotation in degrees (default 8)
 * @param {number} opts.scale     — scale on hover (default 1.02)
 * @param {number} opts.speed     — transition speed in ms (default 300)
 * @param {boolean} opts.disabled — force disable tilt
 * @returns {object} { ref: React.RefObject, style: React.CSSProperties }
 */
export default function useTilt({
  maxTilt = 8,
  scale = 1.02,
  speed = 300,
  disabled: forceDisabled = false,
} = {}) {
  const ref = useRef(null);
  const state = useRef({ rect: null, isHovering: false, rafId: null });

  // Use a dynamic style object updated via RAF
  const styleRef = useRef({
    transform: `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: `transform ${speed}ms ease-out`,
  });

  const updateTransform = useCallback(
    (x, y) => {
      const { rect } = state.current;
      if (!rect) return;

      const px = (x - rect.left) / rect.width;   // 0..1
      const py = (y - rect.top) / rect.height;

      const tiltX = -(py - 0.5) * 2 * maxTilt;  // -maxTilt..+maxTilt
      const tiltY = (px - 0.5) * 2 * maxTilt;

      const el = ref.current;
      if (!el) return;

      el.style.transform = `
        perspective(800px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
      el.style.transition = `transform ${speed}ms ease-out`;
    },
    [maxTilt, scale, speed],
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = `transform ${speed}ms ease-out`;
    state.current.isHovering = false;
  }, [speed]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!state.current.isHovering) return;
      if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
      state.current.rafId = requestAnimationFrame(() => {
        updateTransform(e.clientX, e.clientY);
      });
    },
    [updateTransform],
  );

  const handleMouseEnter = useCallback((e) => {
    state.current.rect = e.currentTarget.getBoundingClientRect();
    state.current.isHovering = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    reset();
    if (state.current.rafId) {
      cancelAnimationFrame(state.current.rafId);
      state.current.rafId = null;
    }
  }, [reset]);

  useEffect(() => {
    const el = ref.current;
    if (!el || forceDisabled) return;

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [forceDisabled, handleMouseEnter, handleMouseMove, handleMouseLeave]);

  // Respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      const el = ref.current;
      if (el) {
        el.style.transform = '';
        el.style.transition = '';
      }
    }
  }, []);

  return { ref };
}
