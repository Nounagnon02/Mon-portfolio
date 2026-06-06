import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';
import './AboutSection.css';

export default function AboutSection() {
  const { t } = useI18n();
  return (
    <section className="section" id="about" aria-label={t('about.label')}>
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              label={t('about.label')}
              title={t('about.title')}
              subtitle=""
              align="left"
            />
            <p className="about-content__text">
              {t('about.p1')}
            </p>
            <p className="about-content__text">
              {t('about.p2')}
            </p>
            <p className="about-content__text">
              {t('about.p3')}
            </p>
            <div className="about-content__actions">
              <Button href="/resume" variant="secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('about.cta_resume')}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about-image__wrapper">
              <img
                src="/images/Prince.jpeg"
                alt="Kangbode Prince"
                className="about-image__img"
                loading="lazy"
              />
              <div className="about-image__border" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
