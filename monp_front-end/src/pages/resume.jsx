import React, { useState, useEffect } from 'react';
import { experienceService } from '../services/experienceService';
import { skillService } from '../services/skillService';
import './resume.css';

const Resume = () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expRes, skillRes] = await Promise.all([
        experienceService.getAll(),
        skillService.getAll()
      ]);
      setExperiences(expRes.data || []);
      setSkills(skillRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const professionalExp = experiences.filter(e => e.type === 'professional');
  const competitions = experiences.filter(e => e.type === 'competition');
  const hackathons = experiences.filter(e => e.type === 'hackathon');
  const education = experiences.filter(e => e.type === 'education');

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const ExperienceSection = ({ title, items }) => (
    <section className="resume-section">
      <h2 className="section-title">{title}</h2>
      <div className="timeline">
        {items.length > 0 ? (
          items.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="experience-date">
                {new Date(exp.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                {exp.end_date ? ` - ${new Date(exp.end_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}` : ' - Présent'}
              </div>
              <div className="experience-content">
                <h3 className="experience-title">{exp.title}</h3>
                <h4 className="experience-company">{exp.company}</h4>
                {exp.position && <p className="experience-position">{exp.position}</p>}
                {exp.location && <p className="experience-location">{exp.location}</p>}
                {exp.description && <p className="experience-description">{exp.description}</p>}
              </div>
            </div>
          ))
        ) : (
          <p>Aucune donnée disponible</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1 className="resume-title">Kangbode Prince</h1>
        <p className="resume-subtitle">Full-Stack Developer</p>
        <div className="contact-info">
          <span>📧 princekangbode@gmail.com</span>
          <span>📱 +229 019 011 2477</span>
          <span>📍 Cotonou, Bénin</span>
        </div>
      </div>

      {professionalExp.length > 0 && <ExperienceSection title="Expérience Professionnelle" items={professionalExp} />}
      {hackathons.length > 0 && <ExperienceSection title="Hackathons" items={hackathons} />}
      {competitions.length > 0 && <ExperienceSection title="Compétitions" items={competitions} />}
      {education.length > 0 && <ExperienceSection title="Formation" items={education} />}

      {Object.keys(skillsByCategory).length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Compétences Techniques</h2>
          <div className="skills-grid">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="skill-group">
                <h3 className="skill-category">{category}</h3>
                <div className="skill-tags">
                  {categorySkills.map((skill) => (
                    <span key={skill.id} className="skill-tag">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Resume;
