import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MotionConfig } from 'framer-motion';

const MotionContext = createContext(undefined);

const STORAGE_KEY = 'kp-motion';
const QUERY = '(prefers-reduced-motion: reduce)';

function readStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'on' || stored === 'off' ? stored : null;
  } catch {
    return null;
  }
}

export function MotionProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );
  // null = follow the system setting; 'on' / 'off' = the visitor's explicit choice
  const [preference, setPreference] = useState(readStoredPreference);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (e) => setSystemReduced(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const motionOff = preference ? preference === 'off' : systemReduced;

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motionOff ? 'off' : 'on');
  }, [motionOff]);

  const toggleMotion = useCallback(() => {
    const next = motionOff ? 'on' : 'off';
    setPreference(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this visit only
    }
  }, [motionOff]);

  return (
    <MotionContext.Provider value={{ motionOff, toggleMotion }}>
      <MotionConfig reducedMotion={motionOff ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error('useMotion must be used within MotionProvider');
  return context;
}
