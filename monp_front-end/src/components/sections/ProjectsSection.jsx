import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import TechTag from '../ui/TechTag';
import Button from '../ui/Button';
import useTilt from '../../hooks/useTilt';
import { useI18n } from '../../context/I18nContext';
import { projectService } from '../../services/api';
import './ProjectsSection.css';

const fallbackProjects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Full-featured online store with cart, payments, and order management.',
    image: null,
    technologies: ['React', 'Laravel', 'MySQL', 'Stripe'],
    github_url: '#',
    live_url: '#',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Real-time collaborative task management with team workspaces.',
    image: null,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
    github_url: '#',
    live_url: '#',
  },
  {
    id: 3,
    title: 'RESTful API Gateway',
    description: 'Scalable API gateway with authentication, rate limiting, and caching.',
    image: null,
    technologies: ['Laravel', 'Redis', 'Docker', 'JWT'],
    github_url: '#',
    live_url: '#',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectsSection() {
  const { t } = useI18n();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // First try localStorage (set from dashboard)
    const stored = localStorage.getItem('kp_projects');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (Array.isArray(data) && data.length > 0) {
          // Convert comma-separated technologies to arrays
          const normalized = data.map((p) => ({
            ...p,
            technologies: typeof p.technologies === 'string'
              ? p.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : (p.technologies || []),
          }));
          setProjects(normalized);
          setLoading(false);
          return;
        }
      } catch { /* fall through */ }
    }
    // Then try API
    try {
      const res = await projectService.getAll();
      const data = res.data?.data || res.data || [];
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="container">
        <SectionTitle
          label={t('projects.label')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />

        {loading ? (
          <div className="projects-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-skeleton" aria-hidden="true">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-line--title" />
                  <div className="skeleton-line skeleton-line--desc" />
                  <div className="skeleton-line skeleton-line--tags" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="projects-grid"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {displayProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}

        <motion.div
          className="projects-section__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button href="/projects" variant="secondary">
            {t('projects.cta_all')}
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

/* ── Project Card with 3D Tilt ── */

function ProjectCard({ project }) {
  const { t } = useI18n();
  const { ref } = useTilt({ maxTilt: 10, scale: 1.02 });

  return (
    <motion.article
      ref={ref}
      className="project-card project-card--tilt"
      variants={itemVariants}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="project-card__image">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-card__placeholder">
            <span className="project-card__initials">
              {project.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
        <div className="project-card__overlay">
          {project.github_url && project.github_url !== '#' && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__overlay-link"
              aria-label={`View ${project.title} source code`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              {t('projects.code')}
            </a>
          )}
          {project.live_url && project.live_url !== '#' && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__overlay-link"
              aria-label={`View ${project.title} live`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              {t('projects.live')}
            </a>
          )}
        </div>
      </div>
      <div className="project-card__content">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__tech">
          {(project.technologies || []).slice(0, 4).map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
