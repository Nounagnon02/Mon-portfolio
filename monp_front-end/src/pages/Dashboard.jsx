import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats] = useState({
    projects: 12,
    skills: 8,
    experience: 3,
    contacts: 45
  });

  const [projects] = useState([
    { id: 1, name: 'E-commerce Platform', status: 'Completed', tech: 'React, Node.js' },
    { id: 2, name: 'Task Manager', status: 'In Progress', tech: 'Vue.js, Python' },
    { id: 3, name: 'Portfolio Website', status: 'Completed', tech: 'React, Laravel' }
  ]);

  const [skills] = useState([
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'Laravel', level: 70 },
    { name: 'Docker', level: 65 }
  ]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Portfolio Dashboard</h1>
          <p>Gérez votre portfolio et suivez vos statistiques</p>
        </header>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <h3>{stats.projects}</h3>
                <p>Projets</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3>{stats.skills}</h3>
                <p>Compétences</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-content">
                <h3>{stats.experience}</h3>
                <p>Années d'expérience</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-content">
                <h3>{stats.contacts}</h3>
                <p>Messages reçus</p>
              </div>
            </div>
          </div>
        </section>

        <section className="projects-management">
          <h2>Gestion des Projets</h2>
          <div className="projects-table">
            <div className="table-header">
              <span>Nom du Projet</span>
              <span>Statut</span>
              <span>Technologies</span>
              <span>Actions</span>
            </div>
            {projects.map(project => (
              <div key={project.id} className="table-row">
                <span>{project.name}</span>
                <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
                <span>{project.tech}</span>
                <div className="actions">
                  <button className="btn-edit">✏️</button>
                  <button className="btn-delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-add">+ Ajouter un Projet</button>
        </section>

        <section className="skills-overview">
          <h2>Aperçu des Compétences</h2>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <button className="action-card">
              <span className="action-icon">📝</span>
              <span>Modifier le Profil</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📊</span>
              <span>Voir les Statistiques</span>
            </button>
            <button className="action-card">
              <span className="action-icon">💾</span>
              <span>Sauvegarder</span>
            </button>
            <button className="action-card">
              <span className="action-icon">🔄</span>
              <span>Synchroniser</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;