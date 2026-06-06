import { motion } from 'framer-motion';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useI18n } from '../../context/I18nContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import './HeroSection.css';

const roles = [
  'Full-Stack Developer',
  'Laravel & React Expert',
  'API Architect',
  'Problem Solver',
];

// Generate diamond data for the animated background
const diamondData = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: 20 + Math.random() * 80,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 8 + Math.random() * 20,
  delay: Math.random() * 10,
  rotate: Math.random() * 360,
  color: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'teal' : 'terracotta',
  reverse: Math.random() > 0.5,
}));

// Gradient orb data
const orbData = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  size: 150 + Math.random() * 250,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * 8,
  color: i % 2 === 0 ? 'gold' : 'teal',
}));

export default function HeroSection() {
  const { t } = useI18n();
  const { text } = useTypewriter({ words: roles, typeSpeed: 60, deleteSpeed: 40, pauseDuration: 2500 });

  return (
    <section className="hero-section" aria-label="Hero">
      {/* Animated cosmic geometric backdrop */}
      <div className="hero-section__bg-gradient" aria-hidden="true" />

      {/* Gradient orbs that drift */}
      {orbData.map((orb) => (
        <div
          key={orb.id}
          className={`hero-section__orb hero-section__orb--${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Animated KP watermark */}
      <div className="hero-section__watermark" aria-hidden="true">
        <span className="hero-section__watermark-text">KP</span>
      </div>

      {/* Floating diamond constellation */}
      {diamondData.map((diamond) => (
        <div
          key={diamond.id}
          className={`hero-section__diamond hero-section__diamond--${diamond.color}`}
          style={{
            width: diamond.size,
            height: diamond.size,
            left: `${diamond.x}%`,
            top: `${diamond.y}%`,
            animationDuration: `${diamond.duration}s`,
            animationDelay: `${diamond.delay}s`,
            transform: `rotate(${diamond.rotate}deg)`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Connecting constellation lines */}
      <svg className="hero-section__constellation" aria-hidden="true" viewBox="0 0 1000 800" preserveAspectRatio="none">
        <path
          className="hero-section__constellation-line"
          d="M200,100 L500,200 L700,100 M300,400 L500,200 L600,500 M400,600 L600,500 L800,600 M100,500 L300,400 L200,700"
          stroke="rgba(212,160,74,0.06)"
          strokeWidth="1"
          fill="none"
        />
        <path
          className="hero-section__constellation-line"
          d="M500,200 L800,100 M600,500 L800,400 M300,400 L100,300"
          stroke="rgba(13,115,119,0.05)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Bottom weave border */}
      <div className="hero-section__weave" aria-hidden="true" />

      <div className="container">
        <div className="hero-section__content">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="default">{t('hero.available')}</Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="hero-section__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('hero.greeting')}{' '}
            <span className="gradient-text">Kangbode Prince</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            className="hero-section__typewriter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="hero-section__typewriter-label">{t('hero.role_prefix')} </span>
            <span className="hero-section__typewriter-text">{text}</span>
            <span className="hero-section__typewriter-cursor" aria-hidden="true">|</span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="hero-section__description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('hero.description')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-section__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button href="/projects" size="lg">
              {t('hero.cta_projects')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              {t('hero.cta_contact')}
            </Button>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            className="hero-section__tech"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="hero-section__tech-label">{t('hero.tech_label')}:</span>
            <div className="hero-section__tech-icons">
              {['Laravel', 'React', 'Node.js', 'PHP', 'Java', 'SQL'].map((tech) => (
                <span key={tech} className="hero-section__tech-item">{tech}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
