import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { useI18n } from '../../context/I18nContext';
import { skillService } from '../../services/skillService';
import './SkillsSection.css';

const defaultSkills = {
  'Frontend': ['React', 'JavaScript', 'HTML5', 'CSS3'],
  'Backend': ['Laravel', 'PHP', 'Node.js', 'Java'],
  'Database': ['SQL', 'MySQL', 'PostgreSQL'],
  'Tools': ['Git/GitHub', 'Docker', 'REST APIs', 'Linux'],
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SkillsSection() {
  const { t } = useI18n();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    // First try localStorage (set from dashboard)
    const stored = localStorage.getItem('kp_skills');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
          return;
        }
      } catch { /* fall through */ }
    }
    // Then try API
    try {
      const res = await skillService.getAll();
      const data = res.data || [];
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      setSkills([]);
    }
  };

  // Convert localStorage/custom skills format to grouped object
  const skillsByCategory = skills.length > 0
    ? (skills[0].skills ? skills.reduce((acc, cat) => {
        acc[cat.category] = cat.skills;
        return acc;
      }, {}) : skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill.name);
        return acc;
      }, {}))
    : defaultSkills;

  return (
    <section className="section skills-section" id="skills" aria-label="Skills">
      <div className="container">
        <SectionTitle
          label={t('skills.label')}
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
        />

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {Object.entries(skillsByCategory).map(([category, items]) => (
            <motion.div key={category} className="skill-category" variants={itemVariants}>
              <h3 className="skill-category__title">{category}</h3>
              <div className="skill-category__items">
                {items.map((skill) => (
                  <span key={skill} className="skill-item">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
