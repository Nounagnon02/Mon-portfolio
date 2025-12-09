import React, { useState, useEffect } from "react";
import { pageService } from '../services/api';
import { useToast, Toast } from '../components/Toast';
import { getErrorMessage } from '../utils/errorHandler';
import "./home.css";

const Logo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
    />
  </svg>
);

const SkillCard = ({ icon, title, description }) => (
  <div className="skill-card">
    <span className="material-symbols-outlined skill-icon">{icon}</span>
    <h2 className="skill-title">{title}</h2>
    <p className="skill-description">{description}</p>
  </div>
);

const NavLink = ({ href, children, variant = "header" }) => (
  <a href={href} className={`nav-link nav-link--${variant}`}>
    {children}
  </a>
);

const Button = ({ children, variant = "darkblue", size = "medium", className = "" }) => (
  <button className={`btn btn--${variant} btn--${size} ${className}`}>
    {children}
  </button>
);

export default function Home() {
  const [pageData, setPageData] = useState({
    hero_headline: "Hi, I'm Kangboden Prince. A Full-Stack Developer.",
    hero_subheadline: "I build beautiful and functional web applications.",
    hero_background_image: "/images/Prince.jpeg"
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const { toasts, addToast, removeToast } = useToast();

  const loadPageData = async () => {
    try {
      const response = await pageService.getByName('home');
      setPageData(response.data.data || response.data);
    } catch (error) {
      console.log('Utilisation du contenu par défaut');
    }
  };

  const skills = [
    {
      icon: "code",
      title: "Frontend Development",
      description: "I build responsive and interactive user interfaces."
    },
    {
      icon: "dns",
      title: "Backend Development",
      description: "I develop robust and scalable server-side applications."
    },
    {
      icon: "database",
      title: "Database Management",
      description: "I design and manage efficient and secure databases."
    }
  ];

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <div className="home-page">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <section className="hero-section">
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__image-wrapper">
              <img 
                src={pageData.hero_background_image || "/images/Prince.jpeg"} 
                alt="Kangboden Prince" 
                className="hero__image"
                style={{
                  borderRadius: '50%',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="hero__text">
              <h1 className="hero__title">
                {pageData.hero_headline || "Hi, I'm Kangboden Prince. A Full-Stack Developer."}
              </h1>
              <p className="hero__subtitle">
                {pageData.hero_subheadline || "I build beautiful and functional web applications."}
              </p>
              <Button size="large">View My Work</Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about" id="about">
        <div className="about__container">
          <div className="about__content">
            <h1 className="section-title">About Me</h1>
            <p className="about__description">
              I am a passionate full-stack developer with expertise in modern web
              applications. I love solving complex problems and creating intuitive user
              experiences.
            </p>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <SkillCard key={index} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}