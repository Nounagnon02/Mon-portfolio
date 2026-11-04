import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import { useMotion } from '../../context/MotionContext';
import { projects, featuredProjects } from '../../data/projects';
import './StatsSection.css';

/* Every figure is computed from the verified project data (src/data/projects.js).
   RépétIA is not counted among competitions: its competition is still to be confirmed. */
const stats = [
  { key: 'shown', value: projects.length },
  { key: 'commits', value: featuredProjects.reduce((sum, p) => sum + (p.commits || 0), 0) },
  {
    key: 'events',
    value: projects.filter((p) => p.context && /hackathon|challenge/i.test(p.context.fr)).length,
  },
  { key: 'mobile', value: projects.filter((p) => p.interface.some((i) => /expo|android/i.test(i))).length },
];

function AnimatedCounter({ value, isVisible, instant }) {
  const [count, setCount] = useState(instant ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (instant) {
      setCount(value);
      return undefined;
    }
    if (!isVisible || hasAnimated.current) return undefined;
    hasAnimated.current = true;
    const duration = 1400;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setCount(step >= steps ? value : Math.floor((value * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value, instant]);

  // The counting number is decorative; screen readers get the final value at once
  return (
    <span className="stats-card__value">
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

export default function StatsSection() {
  const { t } = useI18n();
  const { motionOff } = useMotion();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref} aria-label={t('stats.title')}>
      <div className="container">
        <ul className="stats-grid">
          {stats.map((stat, i) => (
            <motion.li
              key={stat.key}
              className="stats-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <AnimatedCounter value={stat.value} isVisible={isVisible} instant={motionOff} />
              <span className="stats-card__label">{t(`stats.${stat.key}`)}</span>
            </motion.li>
          ))}
        </ul>
        <p className="stats-section__source">{t('stats.source')}</p>
      </div>
    </section>
  );
}
