import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';
import { useI18n } from '../../context/I18nContext';
import { experienceService } from '../../services/experienceService';
import './ExperienceSection.css';

export default function ExperienceSection() {
  const { t } = useI18n();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const res = await experienceService.getAll();
      const data = res.data?.data || res.data || [];
      setExperiences(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    } catch {
      setExperiences([]);
    }
  };

  return (
    <section className="section" id="experience" aria-label="Experience">
      <div className="container">
        <SectionTitle
          label={t('experience.label')}
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
        />

        <div className="experience-grid">
          {experiences.length > 0 ? (
            experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="experience-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="experience-item__marker">
                  <div className="experience-item__dot" />
                  {index < experiences.length - 1 && <div className="experience-item__line" />}
                </div>

                <div className="experience-item__card">
                  <div className="experience-item__header">
                    <div>
                      <h3 className="experience-item__title">{exp.title}</h3>
                      {exp.company && (
                        <p className="experience-item__company">{exp.company}</p>
                      )}
                    </div>
                    <span className="experience-item__date">
                      {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {exp.is_current ? t('experience.present') : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="experience-item__description">{exp.description}</p>
                  )}
                  {(exp.type === 'competition' || exp.type === 'hackathon') && (
                    <Badge variant="purple">{exp.type}</Badge>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="experience-empty">
              <p>{t('experience.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
