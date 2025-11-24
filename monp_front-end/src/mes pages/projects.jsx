import React, { useState, useEffect } from 'react';
import { projetctsService } from '../services/api';
import './projects.css';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projetctsService.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Une plateforme e-commerce complète avec panier, paiement et gestion des commandes.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'fullstack',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Application de gestion de tâches avec collaboration en temps réel.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Socket.io'],
      category: 'fullstack',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Site portfolio personnel avec dashboard administrateur.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['React', 'Laravel', 'MySQL', 'Tailwind'],
      category: 'frontend',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 4,
      title: 'Weather App',
      description: 'Application météo avec géolocalisation et prévisions.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['JavaScript', 'API REST', 'CSS3', 'HTML5'],
      category: 'frontend',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 5,
      title: 'Chat Application',
      description: 'Application de chat en temps réel avec salles privées.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
      category: 'fullstack',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 6,
      title: 'Blog Platform',
      description: 'Plateforme de blog avec éditeur riche et système de commentaires.',
      image: 'https://via.placeholder.com/400x200',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Vercel'],
      category: 'fullstack',
      liveUrl: '#',
      githubUrl: '#'
    }
  ];

  if (loading) {
    return <div className="projects-section"><p>Loading...</p></div>;
  }

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  const categories = [
    { id: 'all', label: 'Tous les projets' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' }
  ];

  const filteredProjects = filter === 'all' 
    ? displayProjects 
    : displayProjects.filter(project => project.category === filter);

  return (
    <div className="projects-section">
      <div className="projects-hero">
        <div className="hero-badge">Portfolio</div>
        <h1 className="projects-title">
          Mes <span className="gradient-text">Projets</span>
        </h1>
        <p className="projects-subtitle">
          Découvrez mes réalisations et projets développés avec passion
        </p>
      </div>

      <div className="projects-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="project-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="project-image">
              <img src={project.image} alt={project.title} />
              <div className="project-overlay">
                <div className="overlay-content">
                  <a href={project.liveUrl} className="overlay-btn primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                    Voir le projet
                  </a>
                  <a href={project.githubUrl} className="overlay-btn secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    Code source
                  </a>
                </div>
              </div>
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-technologies">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-projects">
          <p>Aucun projet trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;