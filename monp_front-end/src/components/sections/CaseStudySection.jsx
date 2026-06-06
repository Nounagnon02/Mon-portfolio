import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';
import './CaseStudySection.css';

const caseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform',
    tagline: 'From zero to 10K+ daily orders',
    role: 'Full-Stack Developer',
    duration: '3 months',
    problem:
      'The client needed a scalable e-commerce platform capable of handling flash sales with thousands of concurrent users — their existing solution crashed under load.',
    solution:
      'Built a decoupled architecture with Laravel backend serving a React SPA. Redis caching layer, queue workers for order processing, and real-time inventory management via WebSockets.',
    results: [
      'Handles 10K+ daily orders with 99.9% uptime',
      'Page load time reduced from 4.2s to 1.1s',
      '50% reduction in cart abandonment',
      'PCI-compliant payment processing',
    ],
    tech: ['Laravel', 'React', 'Redis', 'MySQL', 'Stripe', 'Docker'],
    image: null,
  },
  {
    id: 2,
    title: 'Task Management App',
    tagline: 'Real-time collaboration at scale',
    role: 'Lead Developer',
    duration: '4 months',
    problem:
      'A growing remote team needed a project management tool with real-time collaboration, Kanban boards, and time tracking — existing tools were too expensive or lacked features.',
    solution:
      'Developed a real-time collaborative workspace using Socket.io for live updates, PostgreSQL for reliable data storage, and a React frontend with drag-and-drop Kanban boards.',
    results: [
      '500+ active users within first month',
      'Real-time sync under 50ms latency',
      '99% user satisfaction rating',
      'Integrated with Slack and GitHub',
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Redis'],
    image: null,
  },
];

export default function CaseStudySection() {
  const { t } = useI18n();
  return (
    <section className="section" aria-label="Case studies">
      <div className="container">
        <SectionTitle
          label={t('case_studies.label')}
          title={t('case_studies.title')}
          subtitle={t('case_studies.subtitle')}
        />

        <div className="casestudy__list">
          {caseStudies.map((study, i) => (
            <motion.article
              key={study.id}
              className="casestudy-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="casestudy-card__header">
                <div className="casestudy-card__meta">
                  <span className="casestudy-card__role">{study.role}</span>
                  <span className="casestudy-card__duration">{study.duration}</span>
                </div>
                <h3 className="casestudy-card__title">{study.title}</h3>
                <p className="casestudy-card__tagline">{study.tagline}</p>
              </div>

              <div className="casestudy-card__body">
                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">
                    <span className="casestudy-card__section-icon">!</span>
                    {t('case_studies.problem')}
                  </h4>
                  <p className="casestudy-card__text">{study.problem}</p>
                </div>

                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">
                    <span className="casestudy-card__section-icon">→</span>
                    {t('case_studies.solution')}
                  </h4>
                  <p className="casestudy-card__text">{study.solution}</p>
                </div>

                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">
                    <span className="casestudy-card__section-icon">✦</span>
                    {t('case_studies.results')}
                  </h4>
                  <ul className="casestudy-card__results">
                    {study.results.map((r, j) => (
                      <li key={j} className="casestudy-card__result">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="casestudy-card__tech">
                  {study.tech.map((t) => (
                    <span key={t} className="casestudy-card__tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="casestudy__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button href="/projects" variant="secondary">
            Explore All Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
