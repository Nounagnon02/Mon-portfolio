import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import './Dashboard.css';

const LOCAL_KEY = 'kp_dashboard_auth';
const DASHBOARD_PIN = '2024';

const defaultStats = [
  { key: 'projects', label: 'Projects Completed', value: 15, suffix: '+' },
  { key: 'tech', label: 'Technologies Mastered', value: 15, suffix: '+' },
  { key: 'years', label: 'Years of Experience', value: 3, suffix: '+' },
  { key: 'clients', label: 'Happy Clients', value: 12, suffix: '+' },
];

const defaultProjects = [
  {
    id: '1', title: 'E-commerce Platform',
    description: 'Full-featured online store with cart, payments, and order management.',
    technologies: 'React, Laravel, MySQL, Stripe',
    github_url: '#', live_url: '#',
  },
  {
    id: '2', title: 'Task Management App',
    description: 'Real-time collaborative task management with team workspaces.',
    technologies: 'React, Node.js, PostgreSQL, Socket.io',
    github_url: '#', live_url: '#',
  },
  {
    id: '3', title: 'RESTful API Gateway',
    description: 'Scalable API gateway with authentication, rate limiting, and caching.',
    technologies: 'Laravel, Redis, Docker, JWT',
    github_url: '#', live_url: '#',
  },
];

const defaultSkillCategories = [
  { category: 'Frontend', skills: ['React', 'JavaScript', 'HTML5', 'CSS3'] },
  { category: 'Backend', skills: ['Laravel', 'PHP', 'Node.js', 'Java'] },
  { category: 'Database', skills: ['SQL', 'MySQL', 'PostgreSQL'] },
  { category: 'Tools', skills: ['Git/GitHub', 'Docker', 'REST APIs', 'Linux'] },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function checkAuth() {
  return localStorage.getItem(LOCAL_KEY) === 'true';
}

export default function Dashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(checkAuth);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === DASHBOARD_PIN) {
      localStorage.setItem(LOCAL_KEY, 'true');
      setAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_KEY);
    setAuthenticated(false);
    navigate('/');
  };

  if (!authenticated) {
    return (
      <section className="section dashboard">
        <div className="container">
          <div className="dashboard__login">
            <motion.div
              className="dashboard__login-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="dashboard__login-title">Dashboard Access</h1>
              <p className="dashboard__login-desc">Enter PIN to manage your portfolio.</p>
              <form onSubmit={handleLogin}>
                <div className="dashboard__pin-field">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter PIN"
                    value={pinInput}
                    onChange={(e) => { setPinInput(e.target.value); setPinError(''); }}
                    className="dashboard__pin-input"
                    autoFocus
                    aria-label="PIN code"
                  />
                </div>
                {pinError && <p className="dashboard__error">{pinError}</p>}
                <Button type="submit" size="lg">Access Dashboard</Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section dashboard">
      <div className="container">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Portfolio Dashboard</h1>
          <div className="dashboard__header-actions">
            <Button onClick={handleLogout} variant="secondary" size="sm">Logout</Button>
          </div>
        </div>

        {message.text && (
          <div className={`dashboard__message dashboard__message--${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="dashboard__tabs" role="tablist">
          {['stats', 'projects', 'skills', 'visitors'].map((tab) => (
            <button
              key={tab}
              className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && <StatsTab showMessage={showMessage} />}
        {activeTab === 'projects' && <ProjectsTab showMessage={showMessage} />}
        {activeTab === 'skills' && <SkillsTab showMessage={showMessage} />}
        {activeTab === 'visitors' && <VisitorsTab />}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS TAB
   ═══════════════════════════════════════════ */

function StatsTab({ showMessage }) {
  const [stats, setStats] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ key: '', label: '', value: 0, suffix: '+' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kp_stats');
    if (stored) {
      try { setStats(JSON.parse(stored)); return; } catch { /* */ }
    }
    setStats(defaultStats);
  }, []);

  const saveStats = (newStats) => {
    localStorage.setItem('kp_stats', JSON.stringify(newStats));
    setStats(newStats);
    showMessage('success', 'Stats saved successfully!');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm({ ...stats[index] });
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.key.trim() || form.value < 0) {
      showMessage('error', 'Please fill in all fields correctly.');
      return;
    }
    const newStats = [...stats];
    newStats[editingIndex] = { ...form };
    saveStats(newStats);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({ key: '', label: '', value: 0, suffix: '+' });
  };

  const handleReset = () => {
    saveStats(defaultStats);
  };

  return (
    <div>
      <div className="dashboard__tab-header">
        <h2>Manage Statistics</h2>
        <Button onClick={handleReset} variant="ghost" size="sm">Reset to Defaults</Button>
      </div>
      <div className="dashboard__table-wrap">
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Label</th>
              <th>Value</th>
              <th>Suffix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <tr key={stat.key}>
                {editingIndex === index ? (
                  <>
                    <td>
                      <input className="dashboard__input" value={form.key}
                        onChange={(e) => setForm({ ...form, key: e.target.value })} aria-label="Stat key" />
                    </td>
                    <td>
                      <input className="dashboard__input" value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })} aria-label="Stat label" />
                    </td>
                    <td>
                      <input className="dashboard__input dashboard__input--num" type="number" min="0"
                        value={form.value}
                        onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })} aria-label="Stat value" />
                    </td>
                    <td>
                      <input className="dashboard__input dashboard__input--short" value={form.suffix}
                        onChange={(e) => setForm({ ...form, suffix: e.target.value })} aria-label="Stat suffix" />
                    </td>
                    <td className="dashboard__actions">
                      <button className="dashboard__btn dashboard__btn--save" onClick={handleSave} aria-label="Save">✓</button>
                      <button className="dashboard__btn dashboard__btn--cancel" onClick={handleCancel} aria-label="Cancel">✕</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><code>{stat.key}</code></td>
                    <td>{stat.label}</td>
                    <td className="dashboard__value">{stat.value}</td>
                    <td>{stat.suffix}</td>
                    <td>
                      <button className="dashboard__btn dashboard__btn--edit" onClick={() => handleEdit(index)} aria-label="Edit">✎</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECTS TAB
   ═══════════════════════════════════════════ */

function ProjectsTab({ showMessage }) {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', technologies: '', github_url: '', live_url: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('kp_projects');
    if (stored) {
      try { setProjects(JSON.parse(stored)); return; } catch { /* */ }
    }
    setProjects(defaultProjects);
  }, []);

  const saveProjects = (newProjects) => {
    localStorage.setItem('kp_projects', JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const handleAdd = () => {
    if (!form.title.trim()) {
      showMessage('error', 'Project title is required.');
      return;
    }
    const newProject = { ...form, id: generateId() };
    const updated = [...projects, newProject];
    saveProjects(updated);
    setForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
    setShowForm(false);
    showMessage('success', 'Project added successfully!');
  };

  const handleUpdate = () => {
    if (!form.title.trim()) {
      showMessage('error', 'Project title is required.');
      return;
    }
    const updated = projects.map((p) => (p.id === editingId ? { ...form, id: editingId } : p));
    saveProjects(updated);
    setEditingId(null);
    setForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
    showMessage('success', 'Project updated successfully!');
  };

  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
    }
    showMessage('success', 'Project deleted.');
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({ ...project });
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
  };

  return (
    <div>
      <div className="dashboard__tab-header">
        <h2>Manage Projects</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', technologies: '', github_url: '', live_url: '' }); }} size="sm">
          {showForm ? 'Cancel' : '+ Add Project'}
        </Button>
      </div>

      {(showForm || editingId) && (
        <div className="dashboard__form">
          <h3 className="dashboard__form-title">{editingId ? 'Edit Project' : 'New Project'}</h3>
          <div className="dashboard__form-grid">
            <div className="dashboard__form-field">
              <label>Title *</label>
              <input className="dashboard__input" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project" />
            </div>
            <div className="dashboard__form-field dashboard__form-field--wide">
              <label>Description</label>
              <textarea className="dashboard__input dashboard__textarea" rows="3" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief project description..." />
            </div>
            <div className="dashboard__form-field">
              <label>Technologies</label>
              <input className="dashboard__input" value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Laravel, MySQL" />
            </div>
            <div className="dashboard__form-field">
              <label>GitHub URL</label>
              <input className="dashboard__input" value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
            </div>
            <div className="dashboard__form-field">
              <label>Live URL</label>
              <input className="dashboard__input" value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="dashboard__form-actions">
            <Button onClick={editingId ? handleUpdate : handleAdd} size="sm">
              {editingId ? 'Update Project' : 'Add Project'}
            </Button>
            {editingId && <Button onClick={cancelEdit} variant="secondary" size="sm">Cancel</Button>}
          </div>
        </div>
      )}

      <div className="dashboard__table-wrap">
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Technologies</th>
              <th>Links</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan="5" className="dashboard__empty">No projects yet. Add your first project above.</td></tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.title}</strong></td>
                  <td className="dashboard__cell-desc">{project.description}</td>
                  <td><code>{project.technologies}</code></td>
                  <td>
                    {project.github_url && project.github_url !== '#' && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="dashboard__link">GitHub</a>
                    )}
                    {project.live_url && project.live_url !== '#' && (
                      <span> | <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="dashboard__link">Live</a></span>
                    )}
                  </td>
                  <td className="dashboard__actions">
                    <button className="dashboard__btn dashboard__btn--edit" onClick={() => startEdit(project)} aria-label="Edit">✎</button>
                    <button className="dashboard__btn dashboard__btn--cancel" onClick={() => handleDelete(project.id)} aria-label="Delete">✕</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SKILLS TAB
   ═══════════════════════════════════════════ */

function SkillsTab({ showMessage }) {
  const [skills, setSkills] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [editingSkillIdx, setEditingSkillIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('kp_skills');
    if (stored) {
      try { setSkills(JSON.parse(stored)); return; } catch { /* */ }
    }
    setSkills(defaultSkillCategories);
  }, []);

  const saveSkills = (newSkills) => {
    localStorage.setItem('kp_skills', JSON.stringify(newSkills));
    setSkills(newSkills);
  };

  const addSkill = () => {
    if (!newCategory.trim() || !newSkill.trim()) {
      showMessage('error', 'Category and skill name are required.');
      return;
    }
    const updated = [...skills];
    const existing = updated.find((s) => s.category === newCategory.trim());
    if (existing) {
      if (existing.skills.includes(newSkill.trim())) {
        showMessage('error', 'Skill already exists in this category.');
        return;
      }
      existing.skills.push(newSkill.trim());
    } else {
      updated.push({ category: newCategory.trim(), skills: [newSkill.trim()] });
    }
    saveSkills(updated);
    setNewCategory('');
    setNewSkill('');
    showMessage('success', 'Skill added!');
  };

  const deleteSkill = (catIdx, skillIdx) => {
    const updated = [...skills];
    updated[catIdx].skills.splice(skillIdx, 1);
    if (updated[catIdx].skills.length === 0) {
      updated.splice(catIdx, 1);
    }
    saveSkills(updated);
    showMessage('success', 'Skill deleted.');
  };

  const deleteCategory = (catIdx) => {
    const updated = skills.filter((_, i) => i !== catIdx);
    saveSkills(updated);
    showMessage('success', 'Category deleted.');
  };

  const startEditSkill = (catIdx, skillIdx) => {
    setEditingCat(catIdx);
    setEditingSkillIdx(skillIdx);
    setEditValue(skills[catIdx].skills[skillIdx]);
  };

  const saveEditSkill = () => {
    if (!editValue.trim()) {
      showMessage('error', 'Skill name cannot be empty.');
      return;
    }
    const updated = [...skills];
    updated[editingCat].skills[editingSkillIdx] = editValue.trim();
    saveSkills(updated);
    setEditingCat(null);
    setEditingSkillIdx(null);
    setEditValue('');
    showMessage('success', 'Skill updated.');
  };

  const cancelEdit = () => {
    setEditingCat(null);
    setEditingSkillIdx(null);
    setEditValue('');
  };

  return (
    <div>
      <div className="dashboard__tab-header">
        <h2>Manage Skills</h2>
      </div>

      {/* Add skill form */}
      <div className="dashboard__form">
        <h3 className="dashboard__form-title">Add New Skill</h3>
        <div className="dashboard__form-inline">
          <div className="dashboard__form-field">
            <label>Category</label>
            <input className="dashboard__input" value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Frontend" list="cat-suggestions" />
            <datalist id="cat-suggestions">
              {['Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Design', 'Mobile'].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="dashboard__form-field">
            <label>Skill</label>
            <input className="dashboard__input" value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. TypeScript" />
          </div>
          <div className="dashboard__form-field dashboard__form-field--btn">
            <label>&nbsp;</label>
            <Button onClick={addSkill} size="sm">+ Add</Button>
          </div>
        </div>
      </div>

      {/* Skills list */}
      {skills.length === 0 ? (
        <p className="dashboard__empty">No skills added yet.</p>
      ) : (
        <div className="dashboard__skills-grid">
          {skills.map((cat, catIdx) => (
            <div key={cat.category} className="dashboard__skill-category">
              <div className="dashboard__skill-category-header">
                <h3>{cat.category}</h3>
                <button className="dashboard__btn dashboard__btn--cancel" onClick={() => deleteCategory(catIdx)} aria-label="Delete category" title="Delete category">✕</button>
              </div>
              <div className="dashboard__skill-items">
                {cat.skills.map((skill, skillIdx) => (
                  <div key={skill} className="dashboard__skill-item">
                    {editingCat === catIdx && editingSkillIdx === skillIdx ? (
                      <div className="dashboard__skill-edit">
                        <input className="dashboard__input dashboard__input--sm" value={editValue}
                          onChange={(e) => setEditValue(e.target.value)} />
                        <button className="dashboard__btn dashboard__btn--save" onClick={saveEditSkill} aria-label="Save">✓</button>
                        <button className="dashboard__btn dashboard__btn--cancel" onClick={cancelEdit} aria-label="Cancel">✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="dashboard__skill-name">{skill}</span>
                        <div className="dashboard__skill-actions">
                          <button className="dashboard__btn dashboard__btn--edit-sm" onClick={() => startEditSkill(catIdx, skillIdx)} aria-label="Edit skill">✎</button>
                          <button className="dashboard__btn dashboard__btn--cancel-sm" onClick={() => deleteSkill(catIdx, skillIdx)} aria-label="Delete skill">✕</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VISITORS TAB
   ═══════════════════════════════════════════ */

function VisitorsTab() {
  const visitorCount = parseInt(localStorage.getItem('kp_visitor_count') || '0', 10);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = visitorCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= visitorCount) {
        setAnimatedCount(visitorCount);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [visitorCount]);

  return (
    <div className="dashboard__visitors">
      <div className="dashboard__visitors-card">
        <div className="dashboard__visitors-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="dashboard__visitors-count">{animatedCount}</div>
        <div className="dashboard__visitors-label">Total Unique Visitors</div>
        <p className="dashboard__visitors-note">
          Counted once per browser. This tracks the number of unique devices that have visited your portfolio.
        </p>
      </div>

      <p className="dashboard__note">
        Visitor tracking uses localStorage. Clearing browser data will reset this count.
      </p>
    </div>
  );
}
