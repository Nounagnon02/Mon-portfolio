import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { useI18n } from '../../context/I18nContext';
import { experiences, education, certifications, events } from '../../data/career';
import './ExperienceSection.css';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function ExperienceSection() {
  const { t, locale } = useI18n();
  const pick = (value) => (typeof value === 'string' ? value : value[locale] || value.fr);

  return (
    <section className="section career" id="experience" aria-labelledby="career-title">
      <div className="container">
        <SectionTitle
          align="left"
          label={t('experience.label')}
          title={<span id="career-title">{t('experience.title')}</span>}
          subtitle={t('experience.subtitle')}
        />

        <div className="career__layout">
          <div className="career__column">
            <h3 className="career__heading">{t('experience.work')}</h3>
            <ol className="career__timeline">
              {experiences.map((exp, i) => (
                <motion.li key={exp.id} className="career__step" {...reveal} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <span className={`career__dot ${exp.current ? 'career__dot--current' : ''}`} aria-hidden="true" />
                  <p className="career__period">
                    {pick(exp.period)}
                    {exp.current && <span className="career__now">{t('experience.present')}</span>}
                  </p>
                  <h4 className="career__role">{pick(exp.role)}</h4>
                  <p className="career__org">{exp.org}</p>
                  <ul className="career__points">
                    {exp.points.map((point) => (
                      <li key={point.fr}>{pick(point)}</li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="career__column">
            <h3 className="career__heading">{t('experience.education')}</h3>
            <ul className="career__list">
              {education.map((item) => (
                <motion.li key={item.id} className="career__entry" {...reveal} transition={{ duration: 0.4 }}>
                  <p className="career__period">{item.period}</p>
                  <h4 className="career__role">{pick(item.title)}</h4>
                  <p className="career__org">{item.org}</p>
                </motion.li>
              ))}
            </ul>

            <h3 className="career__heading career__heading--spaced">{t('experience.events')}</h3>
            <ul className="career__events">
              {events.map((event) => (
                <li key={event.id}>
                  <span className="career__event-year">{event.year}</span>
                  <span className="career__event-name">
                    {event.name}
                    {event.project && <span className="career__event-project"> — {event.project}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="career__heading career__heading--spaced">{t('experience.certifications')}</h3>
        <ul className="career__certs">
          {certifications.map((cert, i) => (
            <motion.li key={cert.id} className="career__cert" {...reveal} transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}>
              <p className="career__period">{pick(cert.date)}</p>
              <h4 className="career__cert-title">{cert.title}</h4>
              <p className="career__org">{cert.issuer}</p>
              {cert.verify && (
                <a
                  className="career__verify"
                  href={cert.verify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('experience.verify_aria', { name: cert.title })}
                >
                  {t('experience.verify')}
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
