import React, { useState, useEffect } from 'react';
import { pageService, projectService, contactService, experienceService } from '../services/api';
import { imageService } from '../services/imageService';
import { skillService } from '../services/skillService';
import './CompleteDashboard.css';
import './DashboardProjects.css';

const CompleteDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('home');

  const [heroData, setHeroData] = useState({ headline: '', subHeadline: '', backgroundImage: '' });
  const [ctaData, setCtaData] = useState({ buttonText: '', buttonLink: '' });
  const [pageId, setPageId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);

  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, totalContacts: 0, unreadContacts: 0 });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', image: '', technologies: [], category: '', live_url: '', github_url: '', order: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    type: 'professional', title: '', company: '', position: '', description: '', location: '', start_date: '', end_date: '', is_current: false, order: 0
  });

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    category: '', name: '', proficiency: 'intermediate'
  });

  useEffect(() => {
    if (activeSection === 'pages') loadPageData();
    if (activeSection === 'projects') loadProjects();
    if (activeSection === 'experiences') loadExperiences();
    if (activeSection === 'skills') loadSkills();
    if (activeSection === 'contacts') loadContacts();
    if (activeSection === 'dashboard') loadStats();
  }, [activeSection, activeTab]);

  const loadStats = async () => {
    try {
      const [projectsRes, contactsRes] = await Promise.all([
        projectService.getAll(),
        contactService.getAll()
      ]);
      const projectsData = projectsRes.data?.data || projectsRes.data || [];
      const contactsData = contactsRes.data?.data || contactsRes.data || [];
      setStats({
        totalProjects: Array.isArray(projectsData) ? projectsData.length : 0,
        totalContacts: Array.isArray(contactsData) ? contactsData.length : 0,
        unreadContacts: Array.isArray(contactsData) ? contactsData.filter(c => !c.is_read).length : 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPageData = async () => {
    try {
      const response = await pageService.getByName(activeTab);
      const page = response.data;
      setPageId(page.id);
      setHeroData({
        headline: page.hero_headline || '',
        subHeadline: page.hero_subheadline || '',
        backgroundImage: page.hero_background_image || ''
      });
      setCtaData({
        buttonText: page.cta_button_text || '',
        buttonLink: page.cta_button_link || ''
      });
      setBackgroundImagePreview(page.hero_background_image || null);
      setHasChanges(false);
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await pageService.create({ page_name: activeTab });
        setPageId(response.data.id);
      }
    }
  };

  const savePageChanges = async () => {
    if (!pageId) return;
    try {
      await pageService.update(pageId, {
        hero_headline: heroData.headline,
        hero_subheadline: heroData.subHeadline,
        hero_background_image: heroData.backgroundImage,
        cta_button_text: ctaData.buttonText,
        cta_button_link: ctaData.buttonLink
      });
      setHasChanges(false);
      alert('Changes saved!');
    } catch (error) {
      alert('Error saving changes');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll();
      console.log('Projects response:', response);
      const projectsData = response.data?.data || response.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const loadExperiences = async () => {
    try {
      const response = await experienceService.getAll();
      const experiencesData = response.data?.data || response.data || [];
      setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences([]);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = projectForm.image;

      // Upload new image if selected
      if (selectedImage) {
        const uploadResult = await imageService.upload(selectedImage, 'project');
        imagePath = uploadResult.path;
      }

      const formData = { ...projectForm, image: imagePath };

      if (currentProject) {
        await projectService.update(currentProject.id, formData);
      } else {
        await projectService.create(formData);
      }

      setShowProjectModal(false);
      setCurrentProject(null);
      setProjectForm({ title: '', description: '', image: '', technologies: [], category: '', live_url: '', github_url: '', order: 0 });
      setSelectedImage(null);
      setImagePreview(null);
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      const message = error.response?.data?.message || 'Error saving project';
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        const errorDetails = Object.values(validationErrors).flat().join('\n');
        alert(`${message}\n\n${errorDetails}`);
      } else {
        alert(message);
      }
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentExperience) {
        await experienceService.update(currentExperience.id, experienceForm);
      } else {
        await experienceService.create(experienceForm);
      }
      setShowExperienceModal(false);
      setCurrentExperience(null);
      setExperienceForm({ type: 'professional', title: '', company: '', position: '', description: '', location: '', start_date: '', end_date: '', is_current: false, order: 0 });
      loadExperiences();
    } catch (error) {
      alert('Error saving experience');
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectService.delete(id);
        loadProjects();
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  const deleteExperience = async (id) => {
    if (window.confirm('Delete this experience?')) {
      try {
        await experienceService.delete(id);
        loadExperiences();
      } catch (error) {
        alert('Error deleting experience');
      }
    }
  };

  const loadSkills = async () => {
    try {
      const response = await skillService.getAll();
      setSkills(response.data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await contactService.getAll();
      const contactsData = response.data?.data || response.data || [];
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await contactService.update(id, { is_read: true });
      loadContacts();
    } catch (error) {
      alert('Error updating contact');
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Delete this contact?')) {
      try {
        await contactService.delete(id);
        loadContacts();
      } catch (error) {
        alert('Error deleting contact');
      }
    }
  };

  return (
    <div className="portfolio-cms">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-top">
            <div className="user-profile">
              <div className="profile-avatar" style={{ backgroundImage: 'url("https://via.placeholder.com/40")' }} />
              <div className="profile-info">
                <h1 className="profile-name">Admin</h1>
                <p className="profile-role">Administrator</p>
              </div>
            </div>

            <nav className="nav-menu">
              <a href="#" className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
                <span className="material-symbols-outlined">dashboard</span>
                <p>Dashboard</p>
              </a>
              <a href="#" className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => setActiveSection('projects')}>
                <span className="material-symbols-outlined">folder</span>
                <p>Portfolio Projects</p>
              </a>
              <a href="#" className={`nav-item ${activeSection === 'experiences' ? 'active' : ''}`} onClick={() => setActiveSection('experiences')}>
                <span className="material-symbols-outlined">work</span>
                <p>Experiences</p>
              </a>
              <a href="#" className={`nav-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setActiveSection('skills')}>
                <span className="material-symbols-outlined">star</span>
                <p>Skills</p>
              </a>
              <a href="#" className={`nav-item ${activeSection === 'pages' ? 'active' : ''}`} onClick={() => setActiveSection('pages')}>
                <span className="material-symbols-outlined">article</span>
                <p>Page Content</p>
              </a>
              <a href="#" className={`nav-item ${activeSection === 'contacts' ? 'active' : ''}`} onClick={() => setActiveSection('contacts')}>
                <span className="material-symbols-outlined">mail</span>
                <p>Messages</p>
              </a>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button className="btn btn-primary btn-full" onClick={() => window.location.href = '/'}>
              View Portfolio
            </button>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">logout</span>
              <p>Logout</p>
            </a>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-container">
          {activeSection === 'dashboard' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Dashboard</h1>
                  <p className="page-subtitle">Overview of your portfolio</p>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Projects</h3>
                  <p className="stat-number">{stats.totalProjects}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Messages</h3>
                  <p className="stat-number">{stats.totalContacts}</p>
                </div>
                <div className="stat-card">
                  <h3>Unread Messages</h3>
                  <p className="stat-number">{stats.unreadContacts}</p>
                </div>
              </div>
            </>
          )}

          {activeSection === 'pages' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Manage Page Content</h1>
                  <p className="page-subtitle">Update content for your portfolio pages</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-secondary" onClick={loadPageData} disabled={!hasChanges}>Discard</button>
                  <button className="btn btn-primary" onClick={savePageChanges} disabled={!hasChanges}>Save</button>
                </div>
              </div>

              <div className="tabs">
                <button className={`tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
                <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
                <button className={`tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Hero Headline</label>
                  <input
                    type="text"
                    value={heroData.headline}
                    onChange={(e) => {
                      setHeroData({ ...heroData, headline: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Enter hero headline"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Sub-headline</label>
                  <textarea
                    value={heroData.subHeadline}
                    onChange={(e) => {
                      setHeroData({ ...heroData, subHeadline: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Enter hero sub-headline"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Background Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBackgroundImagePreview(reader.result);
                          };
                          reader.readAsDataURL(file);

                          try {
                            const uploadResult = await imageService.upload(file, 'page');
                            setHeroData({ ...heroData, backgroundImage: uploadResult.path });
                            setHasChanges(true);
                          } catch (error) {
                            alert('Error uploading image');
                          }
                        }
                      }}
                      className="image-input"
                      id="background-image"
                    />
                    <label htmlFor="background-image" className="image-upload-label">
                      {backgroundImagePreview || heroData.backgroundImage ? (
                        <div className="image-preview">
                          <img src={backgroundImagePreview || (heroData.backgroundImage ? `http://localhost:8000${heroData.backgroundImage}` : '')} alt="Background Preview" />
                          <div className="image-overlay">
                            <span>Changer l'image de fond</span>
                          </div>
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          <span className="material-symbols-outlined">add_photo_alternate</span>
                          <span>Choisir une image de fond</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaData.buttonText}
                    onChange={(e) => {
                      setCtaData({ ...ctaData, buttonText: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Enter button text"
                  />
                </div>
                <div className="form-group">
                  <label>CTA Button Link</label>
                  <input
                    type="url"
                    value={ctaData.buttonLink}
                    onChange={(e) => {
                      setCtaData({ ...ctaData, buttonLink: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Enter button link"
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === 'experiences' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Professional Experiences</h1>
                  <p className="page-subtitle">Manage your professional experiences</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={() => {
                    setCurrentExperience(null);
                    setExperienceForm({ type: 'professional', title: '', company: '', position: '', description: '', location: '', start_date: '', end_date: '', is_current: false, order: 0 });
                    setShowExperienceModal(true);
                  }}>
                    Add Experience
                  </button>
                </div>
              </div>

              <div className="experiences-list">
                {Array.isArray(experiences) && experiences.map(exp => (
                  <div key={exp.id} className="experience-card">
                    <div className="experience-header">
                      <div className="experience-info">
                        <h3>{exp.title}</h3>
                        <p className="experience-company">{exp.company}</p>
                        <p className="experience-date">
                          {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="experience-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => {
                          setCurrentExperience(exp);
                          setExperienceForm(exp);
                          setShowExperienceModal(true);
                        }}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteExperience(exp.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    {exp.description && <p className="experience-description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'projects' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Portfolio Projects</h1>
                  <p className="page-subtitle">Manage your portfolio projects</p>
                </div>
                <div className="header-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCurrentProject(null);
                      setProjectForm({ title: '', description: '', image: '', technologies: [], category: '', live_url: '', github_url: '', order: 0 });
                      setSelectedImage(null);
                      setImagePreview(null);
                      setShowProjectModal(true);
                    }}
                  >
                    Add Project
                  </button>
                </div>
              </div>

              <div className="dashboard-projects-grid">
                {Array.isArray(projects) && projects.map(project => (
                  <div key={project.id} className="dashboard-project-card">
                    <div className="dashboard-project-image">
                      <img src={project.image ? `http://localhost:8000${project.image}` : 'https://via.placeholder.com/300x200'} alt={project.title} />
                    </div>
                    <div className="dashboard-project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="dashboard-project-technologies">
                        {Array.isArray(project.technologies) ? project.technologies.map((tech, index) => (
                          <span key={index} className="dashboard-tech-tag">{tech}</span>
                        )) : null}
                      </div>
                      <div className="dashboard-project-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setCurrentProject(project);
                            setProjectForm({
                              title: project.title,
                              description: project.description,
                              image: project.image,
                              technologies: project.technologies || [],
                              category: project.category,
                              live_url: project.live_url,
                              github_url: project.github_url,
                              order: project.order
                            });
                            setImagePreview(project.image);
                            setSelectedImage(null);
                            setShowProjectModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'skills' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Skills</h1>
                  <p className="page-subtitle">Manage your technical skills</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={() => {
                    setCurrentSkill(null);
                    setSkillForm({ category: '', name: '', proficiency: 'intermediate' });
                    setShowSkillModal(true);
                  }}>
                    Add Skill
                  </button>
                </div>
              </div>

              <div className="skills-list">
                {Array.isArray(skills) && skills.map(skill => (
                  <div key={skill.id} className="skill-item">
                    <div className="skill-info">
                      <h3>{skill.name}</h3>
                      <p className="skill-category">{skill.category}</p>
                      <p className="skill-proficiency">{skill.proficiency}</p>
                    </div>
                    <div className="skill-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => {
                        setCurrentSkill(skill);
                        setSkillForm(skill);
                        setShowSkillModal(true);
                      }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => {
                        if (window.confirm('Delete this skill?')) {
                          skillService.delete(skill.id).then(() => loadSkills());
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'contacts' && (
            <>
              <div className="page-header">
                <div className="header-text">
                  <h1 className="page-title">Messages</h1>
                  <p className="page-subtitle">Manage contact messages</p>
                </div>
              </div>

              <div className="contacts-list">
                {contacts.map(contact => (
                  <div key={contact.id} className={`contact-card ${!contact.is_read ? 'unread' : ''}`}>
                    <div className="contact-header">
                      <div className="contact-info">
                        <h3>{contact.name}</h3>
                        <p className="contact-email">{contact.email}</p>
                        <p className="contact-date">{new Date(contact.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="contact-actions">
                        {!contact.is_read && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => markAsRead(contact.id)}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteContact(contact.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="contact-message">
                      <p>{contact.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {showSkillModal && (
        <div className="modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
              <button className="modal-close" onClick={() => setShowSkillModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (currentSkill) {
                skillService.update(currentSkill.id, skillForm).then(() => {
                  setShowSkillModal(false);
                  setCurrentSkill(null);
                  setSkillForm({ category: '', name: '', proficiency: 'intermediate' });
                  loadSkills();
                });
              } else {
                skillService.create(skillForm).then(() => {
                  setShowSkillModal(false);
                  setSkillForm({ category: '', name: '', proficiency: 'intermediate' });
                  loadSkills();
                });
              }
            }} className="project-form">
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Skill Name</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Proficiency</label>
                <select value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSkillModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentSkill ? 'Update' : 'Create'} Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExperienceModal && (
        <div className="modal-overlay" onClick={() => setShowExperienceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentExperience ? 'Edit Experience' : 'Add New Experience'}</h2>
              <button className="modal-close" onClick={() => setShowExperienceModal(false)}>×</button>
            </div>
            <form onSubmit={handleExperienceSubmit} className="project-form">
              <div className="form-group">
                <label>Type</label>
                <select value={experienceForm.type} onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value })} required>
                  <option value="professional">Expérience Professionnelle</option>
                  <option value="competition">Compétition</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="education">Formation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={experienceForm.title} onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input type="text" value={experienceForm.position} onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} rows="4" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} disabled={experienceForm.is_current} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={experienceForm.is_current} onChange={(e) => setExperienceForm({ ...experienceForm, is_current: e.target.checked })} />
                  Currently working here
                </label>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input type="number" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: e.target.value })} min="0" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExperienceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentExperience ? 'Update' : 'Create'} Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>×</button>
            </div>
            <form onSubmit={handleProjectSubmit} className="project-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Project Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                    id="project-image"
                  />
                  <label htmlFor="project-image" className="image-upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview || (projectForm.image ? `http://localhost:8000${projectForm.image}` : '')} alt="Preview" />
                        <div className="image-overlay">
                          <span>Changer l'image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="image-placeholder">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                        <span>Choisir une image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(projectForm.technologies) ? projectForm.technologies.join(', ') : ''}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Live URL</label>
                <input
                  type="url"
                  value={projectForm.live_url}
                  onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={projectForm.order}
                  onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })}
                  min="0"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentProject ? 'Update' : 'Create'} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteDashboard;