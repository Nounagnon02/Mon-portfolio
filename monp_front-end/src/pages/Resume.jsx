import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import './Resume.css';

const resumeData = {
  name: 'Kangbode Prince Nounagnon',
  title: 'Full-Stack Developer',
  location: 'Cotonou, Benin',
  email: 'princekangbode@gmail.com',
  summary:
    'Passionate full-stack developer with expertise in Laravel, React, and modern web technologies. I build scalable, performant applications that solve real problems. Focused on clean architecture, API design, and delivering exceptional user experiences.',
  skills: [
    { category: 'Frontend', items: ['React', 'JavaScript (ES6+)', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Laravel', 'PHP', 'Node.js', 'REST APIs', 'GraphQL', 'Authentication'] },
    { category: 'Database', items: ['MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Database Design'] },
    { category: 'DevOps', items: ['Docker', 'Linux', 'Git', 'CI/CD', 'Nginx', 'Cloud Deployment'] },
    { category: 'Tools', items: ['VS Code', 'Postman', 'Figma', 'Jira', 'Composer', 'npm/yarn'] },
  ],
  experience: [
    {
      role: 'Full-Stack Developer',
      company: 'Freelance / Self-Employed',
      period: '2022 — Present',
      highlights: [
        'Built and deployed 15+ web applications for clients across various industries',
        'Architected scalable REST APIs handling 10K+ daily requests',
        'Migrated legacy PHP apps to modern Laravel + React stack',
        'Reduced page load times by 60% through optimization and caching strategies',
      ],
    },
    {
      role: 'Web Developer',
      company: 'Previous Position',
      period: '2020 — 2022',
      highlights: [
        'Developed responsive web applications using PHP and JavaScript',
        'Collaborated with design teams to implement pixel-perfect UIs',
        'Maintained and improved existing codebases with modern practices',
        'Implemented automated testing reducing bug reports by 40%',
      ],
    },
  ],
  education: [
    {
      degree: 'Bachelor Degree in Computer Science',
      school: 'University',
      period: '2016 — 2020',
    },
  ],
  languages: ['French (Native)', 'English (Professional)'],
  interests: ['Open Source', 'Tech Blogging', 'Problem Solving', 'API Design'],
};

export default function Resume() {
  return (
    <section className="section resume-page" aria-label="Resume">
      <div className="container">
        {/* Header */}
        <motion.div
          className="resume-page__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="resume-page__header-content">
            <h1 className="resume-page__name gradient-text">{resumeData.name}</h1>
            <h2 className="resume-page__title">{resumeData.title}</h2>
            <div className="resume-page__contact">
              <span>{resumeData.location}</span>
              <span className="resume-page__dot">·</span>
              <a href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
            </div>
          </div>
          <Button
            href="/Kangbode_Prince_Resume.pdf"
            download
            variant="secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </Button>
        </motion.div>

        {/* Summary */}
        <motion.p
          className="resume-page__summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {resumeData.summary}
        </motion.p>

        <div className="resume-page__grid">
          {/* Skills */}
          <motion.div
            className="resume-page__block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="resume-page__block-title">Skills & Expertise</h3>
            <div className="resume-page__skills">
              {resumeData.skills.map((group) => (
                <div key={group.category} className="resume-page__skill-group">
                  <h4 className="resume-page__skill-category">{group.category}</h4>
                  <ul className="resume-page__skill-list">
                    {group.items.map((skill) => (
                      <li key={skill} className="resume-page__skill-item">{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            className="resume-page__block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="resume-page__block-title">Experience</h3>
            <div className="resume-page__experience">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="resume-page__exp-item">
                  <div className="resume-page__exp-header">
                    <h4 className="resume-page__exp-role">{exp.role}</h4>
                    <span className="resume-page__exp-period">{exp.period}</span>
                  </div>
                  <p className="resume-page__exp-company">{exp.company}</p>
                  <ul className="resume-page__exp-highlights">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="resume-page__exp-highlight">{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <motion.div
          className="resume-page__bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {/* Education */}
          <div className="resume-page__block">
            <h3 className="resume-page__block-title">Education</h3>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="resume-page__edu-item">
                <h4 className="resume-page__edu-degree">{edu.degree}</h4>
                <p className="resume-page__edu-school">{edu.school} · {edu.period}</p>
              </div>
            ))}
          </div>

          {/* Languages & Interests */}
          <div className="resume-page__block">
            <div className="resume-page__group">
              <h3 className="resume-page__block-title">Languages</h3>
              <ul className="resume-page__group-list">
                {resumeData.languages.map((lang) => (
                  <li key={lang} className="resume-page__group-item">{lang}</li>
                ))}
              </ul>
            </div>
            <div className="resume-page__group">
              <h3 className="resume-page__block-title">Interests</h3>
              <div className="resume-page__interests">
                {resumeData.interests.map((int) => (
                  <span key={int} className="resume-page__interest-tag">{int}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
