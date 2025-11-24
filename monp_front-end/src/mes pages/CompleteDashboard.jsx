import React, { useState, useEffect } from 'react';
import { pagsService, projetctsService, contactsService } from '../services/api';
import { imageService } from '../services/imageService';
import './CompleteDashboard.css';

const CompleteDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('home');
  
  const [heroData, setHeroData] = useState({ headline: '', subHeadline: '', backgroundImage: '' });
  const [ctaData, setCtaData] = useState({ buttonText: '', buttonLink: '' });
  const [pageId, setPageId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, totalContacts: 0, unreadContacts: 0 });
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', image: '', technologies: [], category: '', live_url: '', github_url: '', order: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (activeSection === 'pages') loadPageData();
    if (activeSection === 'projects') loadProjects();
    if (activeSection === 'contacts') loadContacts();
    if (activeSection === 'dashboard') loadStats();
  }, [activeSection, activeTab]);

  const loadStats = async () => {
    try {
      const [projectsRes, contactsRes] = await Promise.all([
        projetctsService.getAll(),
        contactsService.getAll()
      ]);
      setStats({
        totalProjects: projectsRes.data.length,
        totalContacts: contactsRes.data.length,
        unreadContacts: contactsRes.data.filter(c => !c.is_read).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPageData = async () => {
    try {
      const response = await pagsService.getByName(activeTab);
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
        const response = await pagsService.create({ page_name: activeTab });
        setPageId(response.data.id);
      }
    }
  };

  const savePageChanges = async () => {
    if (!pageId) return;
    try {
      await pagsService.update(pageId, {
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
      const response = await projetctsService.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
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
        await projetctsService.update(currentProject.id, formData);
      } else {
        await projetctsService.create(formData);
      }
      
      setShowProjectModal(false);
      setCurrentProject(null);
      setProjectForm({ title: '', description: '', image: '', technologies: [], category: '', live_url: '', github_url: '', order: 0 });
      setSelectedImage(null);
      setImagePreview(null);
      loadProjects();
    } catch (error) {
      alert('Error saving project');
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projetctsService.delete(id);
        loadProjects();
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  const loadContacts = async () => {
    try {
      const response = await contactsService.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await contactsService.update(id, { is_read: true });
      loadContacts();
    } catch (error) {
      alert('Error updating contact');
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Delete this contact?')) {
      try {
        await contactsService.delete(id);
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
                      setHeroData({...heroData, headline: e.target.value});
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
                      setHeroData({...heroData, subHeadline: e.target.value});
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
                            setHeroData({...heroData, backgroundImage: uploadResult.path});
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
                      setCtaData({...ctaData, buttonText: e.target.value});
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
                      setCtaData({...ctaData, buttonLink: e.target.value});
                      setHasChanges(true);
                    }}
                    placeholder="Enter button link"
                  />
                </div>
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

              <div className="projects-grid" style={{ display: 'grid !important', gridTemplateColumns: 'repeat(3, 1fr) !important', gap: '1.5rem !important', marginTop: '2rem !important' }}>
                {projects.map(project => (
                  <div key={project.id} className="project-card" style={{ display: 'flex !important', flexDirection: 'column !important', background: 'white !important', borderRadius: '0.75rem !important', border: '1px solid #dbeafe !important', overflow: 'hidden !important', boxShadow: '0 1px 3px rgba(59, 130, 246, 0.05) !important' }}>
                    <div className="project-image">
                      <img src={project.image ? `http://localhost:8000${project.image}` : 'https://via.placeholder.com/300x200'} alt={project.title} />
                    </div>
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-technologies">
                        {Array.isArray(project.technologies) ? project.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">{tech}</span>
                        )) : null}
                      </div>
                      <div className="project-actions">
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
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
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
                  onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
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
                  onChange={(e) => setProjectForm({...projectForm, live_url: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={projectForm.order}
                  onChange={(e) => setProjectForm({...projectForm, order: parseInt(e.target.value) || 0})}
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