import React, { useState, useEffect } from "react";
import { pageService, experienceService } from '../services/api';
import { skillService } from '../services/skillService';
import "./about.css";

// ========================================
// Composants réutilisables
// ========================================

const NavLink = ({ href, children }) => (
  <a href={href} className="nav-link">{children}</a>
);

const Button = ({ children, href, type = "button", variant = "darkblue", size = "medium" }) => {
  const className = `btn btn--${variant} btn--${size}`;
  if (href) return <a href={href} className={className}>{children}</a>;
  return <button type={type} className={className}>{children}</button>;
};

const SectionTitle = ({ children }) => (
  <h2 className="section-title">{children}</h2>
);

const SkillCard = ({ icon, title, description }) => (
  <div className="skill-card">
    <span className="material-symbols-outlined skill-card__icon">{icon}</span>
    <div className="skill-card__content">
      <h3 className="skill-card__title">{title}</h3>
      <p className="skill-card__desc">{description}</p>
    </div>
  </div>
);

const ExperienceItem = ({ title, date, description, isLast = false }) => (
  <div className="experience-item">
    <div className="experience-item__timeline">
      <span className="material-symbols-outlined experience-item__icon">work</span>
      {!isLast && <div className="experience-item__line" />}
    </div>
    <div className="experience-item__content">
      <p className="experience-item__title">{title}</p>
      <p className="experience-item__date">{date}</p>
      <p className="experience-item__desc">{description}</p>
    </div>
  </div>
);

const ProjectCard = ({ title, description, image }) => (
  <div className="project-card" style={{ backgroundImage: `url('${image}')` }}>
    <div className="project-card__overlay" />
    <div className="project-card__content">
      <p className="project-card__title">{title}</p>
      <p className="project-card__desc">{description}</p>
    </div>
    <div className="project-card__links">
      <a href="#" className="project-card__link">
        <span className="material-symbols-outlined">link</span>
      </a>
      <a href="#" className="project-card__link">
        <span className="material-symbols-outlined">code</span>
      </a>
    </div>
  </div>
);

const FormInput = ({ type = "text", placeholder, name }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className="form-input"
  />
);

const FormTextarea = ({ placeholder, name, rows = 4 }) => (
  <textarea
    name={name}
    placeholder={placeholder}
    rows={rows}
    className="form-textarea"
  />
);

const SocialLink = ({ href, icon }) => (
  <a href={href} className="social-link">{icon}</a>
);

const LinkedInIcon = () => (
  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// ========================================
// Composant principal
// ========================================

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageData, setPageData] = useState({
    hero_headline: "Full-Stack Developer",
    hero_subheadline: "I am a passionate full-stack developer with a knack for creating beautiful and functional web applications. I thrive on solving complex problems and am dedicated to writing clean, efficient, and scalable code.",
    hero_background_image: "/images/Prince.jpeg"
  });
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadPageData();
    loadExperiences();
    loadSkills();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await pageService.getByName('about');
      setPageData(response.data);
    } catch (error) {
      console.log('Using default content');
    }
  };

  const loadExperiences = async () => {
    try {
      const response = await experienceService.getAll();
      const experiencesData = response.data?.data || response.data || [];
      setExperiences(Array.isArray(experiencesData) ? experiencesData.sort((a, b) => a.order - b.order) : []);
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const loadSkills = async () => {
    try {
      const response = await skillService.getAll();
      const skillsData = response.data || [];
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const navLinks = ["About", "Skills", "Experience", "Projects", "Contact"];

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const projects = [
    {
      title: "E-commerce Platform",
      desc: "A full-featured online store.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI7DFPPFQddvQTSeVbKj48vo2bB7O0pkO-JQvyuEjjzZ_D8szTAET5MZQ_O6Wsl9P9KNSXYOs8UC2HswM_jTHs2TfOTqLr-n9Xux6LIj8UThjdEeEeimCpc6BbIe4A7a9u9jeHMGoIWi2F9KqE_0RQIMay-fYoDGmommSjeZZcbPzEavP5Jx_bsjOjlx-JQ5h9lKkkFW0e7zRY1Ujlw5lO8bRaZa7_85MZ03DksouzKacVkeRzQw6vfqrxNiZ-pR1S7Aw3oITlXtXm"
    },
    {
      title: "Task Management App",
      desc: "A tool to organize your daily tasks.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDldKzzq2tUP8DuEGcx7pkNqWXZ1K2X6ODMg_AxfGZsDSQLuoikUsFK5hE96IbQ-ntaVTYn5W9xN7DvuRMNBG7QmGad0bFDN0RuUQzzXlDGbs0slvqZn8ZTPDu80kZq3g4GXPZxUvueJMOI-43uVcsNPhWOp2qjO69kRmaTXtEKIbrLXUgSTWf9bNI46Ei2HkfXpW9TwDyvBIaXDOnfjPotJSlDw8W1EszNHyiEXSDygYs2b0wXhoDlL8YDU1D2jwYL-6BnsExOP"
    },
    {
      title: "Portfolio Website",
      desc: "This very website you are on.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA64Da68KyyMSeK-mZHFajdVQ5g7PYkqm2TK7bR_NjRS4wOXA3HL_PBKgrHkTpTBZ7xwRGhZVfbJk0Kn1foxt2_r5iGQOt7qFLhaVT3Lou3YZXJvG-dkgBw_V4MhgdwnxdiGTBY_Jr_JQVBT-MECf2xuOBEw8ErreaCj5pnoD9eSmDWWgzT1QxJapvV3he5TzCtuimtXpMg2R5AUcD2BvgjvXG6MRIKHLdo7Jp5pcSeDUBwQFuGC6EFkFBg4P5WqqkTmKlwEwSUP7N3"
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="hero">
          <img 
                src={pageData.hero_background_image || "/images/Prince.jpeg"} 
                alt="Kangboden Prince" 
                className="hero__image"
              />
          <div className="hero__content">
            <h1 className="hero__title">{pageData.hero_headline || "Full-Stack Developer"}</h1>
            <p className="hero__description">
              {pageData.hero_subheadline || "I am a passionate full-stack developer with a knack for creating beautiful and functional web applications. I thrive on solving complex problems and am dedicated to writing clean, efficient, and scalable code."}
            </p>
            <Button href="contact" size="large">Get in touch</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle>Skills</SectionTitle>
        <div className="skills-grid">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                icon="code"
                title={skill.name}
                description={skill.category}
              />
            ))
          ) : (
            <p>No skills yet.</p>
          )}
        </div>
      </section>

      <section className="section">
        <SectionTitle>Experience</SectionTitle>
        <div className="experience-list">
          {experiences.length > 0 ? (
            experiences.map((exp, idx) => (
              <ExperienceItem
                key={exp.id}
                title={`${exp.title} at ${exp.company}`}
                date={`${new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                description={exp.description}
                isLast={idx === experiences.length - 1}
              />
            ))
          ) : (
            <p>No experiences yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
