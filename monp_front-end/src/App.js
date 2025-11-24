import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './mes pages/home';
import Projects from './mes pages/projects';
import Contact from './mes pages/contact';
import About from './mes pages/about';
import Resume from './mes pages/resume';
import SuperAdminDashboard from './mes pages/superAdminDashboard';
import CompleteDashboard from './mes pages/CompleteDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<CompleteDashboard />} />
        <Route path="/dashboard-old" element={<SuperAdminDashboard />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
