import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, .card, .project-card').forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    addHoverListeners();

    // Re-run when DOM changes (for dynamic content)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  // Only show on devices with fine pointer (not touch)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Cursor dot */}
      <motion.div
        className="custom-cursor"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.8 : 1,
        }}
      />
      {/* Cursor trail */}
      <motion.div
        className="custom-cursor custom-cursor--trail"
        style={{
          translateX: trailX,
          translateY: trailY,
          opacity: isVisible ? 0.4 : 0,
          scale: isHovering ? 2.5 : 1,
        }}
      />
      {/* Gold particle ring */}
      <motion.div
        className="custom-cursor custom-cursor--ring"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          opacity: isVisible ? 0.3 : 0,
          scale: isHovering ? 0.8 : 1,
        }}
      />
    </>
  );
}
