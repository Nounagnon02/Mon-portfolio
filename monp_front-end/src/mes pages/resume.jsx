import React from 'react';
import './resume.css';

const Resume = () => {
  const experiences = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Développement d\'applications web complexes avec React, Node.js et MongoDB. Leadership technique d\'une équipe de 5 développeurs.'
    },
    {
      title: 'Full-Stack Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Création de sites web et applications mobiles. Spécialisation en React, Laravel et bases de données relationnelles.'
    },
    {
      title: 'Junior Developer',
      company: 'StartUp Innovation',
      period: '2018 - 2020',
      description: 'Développement front-end et back-end. Apprentissage des bonnes pratiques et méthodologies agiles.'
    }
  ];

  const education = [
    {
      degree: 'Master en Informatique',
      school: 'Université de Technologie',
      period: '2016 - 2018',
      description: 'Spécialisation en développement web et intelligence artificielle'
    },
    {
      degree: 'Licence en Informatique',
      school: 'Institut Supérieur de Technologie',
      period: '2013 - 2016',
      description: 'Formation générale en informatique et programmation'
    }
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'] },
    { category: 'Backend', items: ['Node.js', 'Laravel', 'Python', 'PHP', 'Express.js'] },
    { category: 'Database', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma'] }
  ];

  return (
    <div className="resume-container">
      <div className="resume-header">
        <h1 className="resume-title">Kangboden Prince</h1>
        <p className="resume-subtitle">Full-Stack Developer</p>
        <div className="contact-info">
          <span>📧 kangboden.prince@email.com</span>
          <span>📱 +33 6 12 34 56 78</span>
          <span>📍 Paris, France</span>
        </div>
      </div>

      <section className="resume-section">
        <h2 className="section-title">Expérience Professionnelle</h2>
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-date">{exp.period}</div>
              <div className="experience-content">
                <h3 className="experience-title">{exp.title}</h3>
                <h4 className="experience-company">{exp.company}</h4>
                <p className="experience-description">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h2 className="section-title">Formation</h2>
        <div className="timeline">
          {education.map((edu, index) => (
            <div key={index} className="experience-item">
              <div className="experience-date">{edu.period}</div>
              <div className="experience-content">
                <h3 className="experience-title">{edu.degree}</h3>
                <h4 className="experience-company">{edu.school}</h4>
                <p className="experience-description">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h2 className="section-title">Compétences Techniques</h2>
        <div className="skills-grid">
          {skills.map((skillGroup, index) => (
            <div key={index} className="skill-group">
              <h3 className="skill-category">{skillGroup.category}</h3>
              <div className="skill-tags">
                {skillGroup.items.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resume;