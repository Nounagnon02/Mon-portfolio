import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import './StatsSection.css';

const statKeys = ['projects', 'tech', 'years', 'clients'];

function AnimatedCounter({ value, suffix, isVisible }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <span className="stats-card__value">
      {count}{suffix}
    </span>
  );
}

const defaultStats = [
  { value: 15, suffix: '+', key: 'projects' },
  { value: 15, suffix: '+', key: 'tech' },
  { value: 3, suffix: '+', key: 'years' },
  { value: 12, suffix: '+', key: 'clients' },
];

function loadStats() {
  try {
    const stored = localStorage.getItem('kp_stats');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s) => ({ key: s.key, value: s.value, suffix: s.suffix }));
      }
    }
  } catch { /* fall through */ }
  return defaultStats;
}

export default function StatsSection() {
  const { t } = useI18n();
  const [statsData] = useState(loadStats);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref} aria-label="Statistics">
      <div className="container">
        <motion.div
          className="stats-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.key}
              className="stats-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              <span className="stats-card__label">{t(`stats.${stat.key}`)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
