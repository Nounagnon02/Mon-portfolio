import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import { useI18n } from '../../context/I18nContext';
import { projects, featuredProjects } from '../../data/projects';
import './ProjectsSection.css';

const otherProjects = projects.filter((p) => !p.featured);

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const gridVariants = { visible: { transition: { staggerChildren: 0.08 } } };

/* variant "featured": the six featured projects (home page).
   variant "all": featured projects, then every other project (projects page). */
export default function ProjectsSection({ variant = 'featured' }) {
  const { t } = useI18n();
  const showAll = variant === 'all';

  return (
    <section className="section projects-lagoon" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionTitle
          align="left"
          label={t('projects.label')}
          title={<span id="projects-title">{t(showAll ? 'projects.all_title' : 'projects.title')}</span>}
          subtitle={t('projects.subtitle')}
        />

        <ProjectGrid items={featuredProjects} />

        {showAll ? (
          <>
            <h3 className="projects-lagoon__group-title">{t('projects.others_title')}</h3>
            <ProjectGrid items={otherProjects} compact />
          </>
        ) : (
          <div className="projects-lagoon__cta">
            <Link to="/projects" className="projects-lagoon__cta-link">
              {t('projects.cta_all', { count: projects.length })}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectGrid({ items, compact = false }) {
  return (
    <motion.ul
      className={`projects-lagoon__grid ${compact ? 'projects-lagoon__grid--compact' : ''}`}
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {items.map((project) => (
        <motion.li key={project.id} variants={itemVariants}>
          <ProjectCard project={project} compact={compact} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* A cross-section card: the house (what people use) above the waterline,
   the foundations (what carries it) below. */
function ProjectCard({ project, compact }) {
  const { t, locale } = useI18n();
  const pick = (value) => (value ? value[locale] || value.fr : null);
  const context = pick(project.context);
  const team = pick(project.team);
  const facts = compact ? project.facts.slice(0, 1) : project.facts;

  return (
    <article className={`lagoon-card ${compact ? 'lagoon-card--compact' : ''}`}>
      <div className="lagoon-card__house">
        <p className="lagoon-card__kind">{pick(project.kind)}</p>
        <h3 className="lagoon-card__name">{project.name}</h3>
        <p className="lagoon-card__summary">{pick(project.summary)}</p>
        {(context || team) && (
          <ul className="lagoon-card__badges">
            {context && <li>{context}</li>}
            {team && <li>{team}</li>}
          </ul>
        )}
        <p className="lagoon-card__layer">{t('projects.interface')}</p>
        <ul className="lagoon-card__chips">
          {project.interface.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>

      <div className="lagoon-card__waterline" aria-hidden="true" />

      <div className="lagoon-card__ground">
        <p className="lagoon-card__layer lagoon-card__layer--deep">{t('projects.foundations')}</p>
        <ul className="lagoon-card__chips lagoon-card__chips--deep">
          {project.foundations.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        {facts.length > 0 && (
          <ul className="lagoon-card__facts">
            {facts.map((fact) => (
              <li key={fact.fr}>{pick(fact)}</li>
            ))}
          </ul>
        )}
        <div className="lagoon-card__links">
          {project.links.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('projects.code_aria', { name: project.name })}
            >
              {t('projects.code')}
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('projects.live_aria', { name: project.name })}
            >
              {t('projects.live')}
            </a>
          )}
          {project.private && <span className="lagoon-card__private">{t('projects.private')}</span>}
        </div>
      </div>
    </article>
  );
}
