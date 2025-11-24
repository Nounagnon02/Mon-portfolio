import React, { useState, useEffect } from "react";
import { contactService, pagsService } from '../services/api';
import "./contact.css";

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

const NavLink = ({ href, children, isActive = false }) => (
  <a href={href} className={`nav-link ${isActive ? "nav-link--active" : ""}`}>
    {children}
  </a>
);

const Button = ({ children, type = "button", variant = "#1173d4", size = "medium", fullWidth = false, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""}`}
  >
    {children}
  </button>
);

const FormInput = ({ id, label, type = "text", placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-input"
    />
  </div>
);

const FormTextarea = ({ id, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-textarea"
    />
  </div>
);

const SocialIcon = ({ href, icon, label }) => (
  <a href={href} className="social-link" aria-label={label}>
    {icon}
  </a>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.286 2.89 7.915 6.84 9.143.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.804.605-3.396-1.354-3.396-1.354-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [copied, setCopied] = useState(false);
  const [pageData, setPageData] = useState({
    hero_headline: "Get in Touch",
    hero_subheadline: "I'm always open to discussing new projects or opportunities. Let's connect!"
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await pagsService.getByName('contact');
      setPageData(response.data);
    } catch (error) {
      console.log('Using default content');
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact", isActive: true }
  ];

  const socialLinks = [
    { href: "https://github.com", icon: <GitHubIcon />, label: "GitHub" },
    { href: "https://twitter.com", icon: <TwitterIcon />, label: "Twitter" },
    { href: "https://linkedin.com", icon: <LinkedInIcon />, label: "LinkedIn" }
  ];

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactService.send(formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Error sending message');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="contact-section">
      <section className="contact-hero">
        <h1 className="contact-hero__title">{pageData.hero_headline || "Get in Touch"}</h1>
        <p className="contact-hero__subtitle">
          {pageData.hero_subheadline || "I'm always open to discussing new projects or opportunities. Let's connect!"}
        </p>
      </section>

      <section className="contact-form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <FormInput
              id="name"
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange("name")}
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange("email")}
            />
          </div>
          <FormInput
            id="subject"
            label="Subject"
            placeholder="Enter the subject"
            value={formData.subject}
            onChange={handleChange("subject")}
          />
          <FormTextarea
            id="message"
            label="Message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange("message")}
          />
          <Button type="submit" size="large">
            Send Message
          </Button>
        </form>
      </section>

      <section className="social-section">
        <h2 className="section-title">Find me on other platforms</h2>
        <div className="social-links">
          {socialLinks.map((social) => (
            <SocialIcon key={social.label} {...social} />
          ))}
        </div>
      </section>
    </div>
  );
}