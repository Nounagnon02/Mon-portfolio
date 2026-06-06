import { useState, useEffect, useCallback } from 'react';

export function useTypewriter({ words, typeSpeed = 80, deleteSpeed = 50, pauseDuration = 2000 }) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (isPaused) {
      setIsPaused(false);
      setIsDeleting(true);
      return;
    }

    if (!isDeleting) {
      setText(currentWord.substring(0, text.length + 1));
      if (text.length + 1 === currentWord.length) {
        setIsPaused(true);
      }
    } else {
      setText(currentWord.substring(0, text.length - 1));
      if (text.length === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [text, wordIndex, isDeleting, isPaused, words]);

  useEffect(() => {
    const timeout = setTimeout(
      tick,
      isPaused ? pauseDuration : isDeleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(timeout);
  }, [tick, isPaused, pauseDuration, isDeleting, deleteSpeed, typeSpeed]);

  return { text, isDeleting };
}
