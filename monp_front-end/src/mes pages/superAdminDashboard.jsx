import React, { useState, useEffect } from 'react';
import { pagsService, projetctsService, contactsService } from '../services/api';
import './superAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [heroData, setHeroData] = useState({
    headline: "",
    subHeadline: "",
    backgroundImage: ""
  });

  const [ctaData, setCtaData] = useState({
    buttonText: "",
    buttonLink: ""
  });

  const [activeTab, setActiveTab] = useState('home');
  const [pageId, setPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [activeTab]);

  const loadPageData = async () => {
    setLoading(true);
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
      setHasChanges(false);
    } catch (error) {
      if (error.response?.status === 404) {
        await createPage();
      }
    } finally {
      setLoading(false);
    }
  };

  const createPage = async () => {
    try {
      const response = await pagsService.create({ page_name: activeTab });
      setPageId(response.data.id);
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const saveChanges = async () => {
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
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving changes');
    }
  };

  const handleHeroChange = (field, value) => {
    setHeroData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCtaChange = (field, value) => {
    setCtaData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  return (
    <div className="portfolio-cms">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-top">
            <div className="user-profile">
              <div 
                className="profile-avatar"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcmCpWw65G3LZLQx_bRAf7EwO89SQTVkvZwgITIkwHKp62VEYoRmNs-lDDqFOh2mgCQIeFR9GI3wXWmL_y_1Y9gNCCfYUOEDw8e4ay7Bjxbg1C5xjebwS0lRpvgnUACMZ8ekJbV7L6MdJB4bdQc97RiS-BDQpiMO7VJtLmR3HyrbhjnY-vF5_0QxrgLhzhlSotevCK5Oe3qZWzUcuAokGSEXy7IH15mZLKTTXH9TpUuy9AmfaBGNSuAS7T6e_jDEWPfUDfMT2VZppq")' }}
              />
              <div className="profile-info">
                <h1 className="profile-name">John Doe</h1>
                <p className="profile-role">Administrator</p>
              </div>
            </div>

            <nav className="nav-menu">
              <a href="#" className="nav-item">
                <span className="material-symbols-outlined">dashboard</span>
                <p>Dashboard</p>
              </a>
              <a href="#" className="nav-item">
                <span className="material-symbols-outlined">folder</span>
                <p>Portfolio Projects</p>
              </a>
              <a href="#" className="nav-item active">
                <span className="material-symbols-outlined filled">article</span>
                <p>Page Content</p>
              </a>
              <a href="#" className="nav-item">
                <span className="material-symbols-outlined">settings</span>
                <p>Settings</p>
              </a>
              <a href="#" className="nav-item">
                <span className="material-symbols-outlined">bar_chart</span>
                <p>Analytics</p>
              </a>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button className="btn btn-primary btn-full">
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
          <div className="page-header">
            <div className="header-text">
              <h1 className="page-title">Manage Page Content</h1>
              <p className="page-subtitle">Update the content for your portfolio's main pages.</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={loadPageData} disabled={!hasChanges}>
                Discard Changes
              </button>
              <button className="btn btn-primary" onClick={saveChanges} disabled={!hasChanges}>
                Save & Publish
              </button>
            </div>
          </div>

          {loading && <div className="last-saved"><p>Loading...</p></div>}

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home Page
            </button>
            <button 
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About Page
            </button>
            <button 
              className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Page
            </button>
          </div>

          <div className="form-sections">
            <div className="section-card">
              <h2 className="section-title">Hero Section</h2>
              <div className="section-content">
                <div className="form-grid">
                  <label className="form-field">
                    <p className="field-label">Headline</p>
                    <input 
                      type="text"
                      className="form-input"
                      value={heroData.headline}
                      onChange={(e) => handleHeroChange('headline', e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <p className="field-label">Sub-headline / Tagline</p>
                    <input 
                      type="text"
                      className="form-input"
                      value={heroData.subHeadline}
                      onChange={(e) => handleHeroChange('subHeadline', e.target.value)}
                    />
                  </label>
                </div>

                <div className="image-upload-section">
                  <p className="field-label">Hero Background Image</p>
                  <div className="image-upload-wrapper">
                    <div 
                      className="image-preview"
                      style={{ backgroundImage: `url("${heroData.backgroundImage}")` }}
                    />
                    <div className="upload-controls">
                      <button className="btn btn-primary-light">
                        Upload New Image
                      </button>
                      <p className="upload-hint">PNG, JPG, WEBP up to 5MB. Recommended 1920x1080.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2 className="section-title">Call to Action (CTA)</h2>
              <div className="section-content">
                <div className="form-grid">
                  <label className="form-field">
                    <p className="field-label">Button Text</p>
                    <input 
                      type="text"
                      className="form-input"
                      value={ctaData.buttonText}
                      onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <p className="field-label">Button Link URL</p>
                    <input 
                      type="text"
                      className="form-input"
                      value={ctaData.buttonLink}
                      onChange={(e) => handleCtaChange('buttonLink', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;