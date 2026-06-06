import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';
import { contactService } from '../../services/api';
import { GitHubIcon, LinkedInIcon, EmailIcon } from '../ui/SocialIcon';
import './ContactSection.css';

export default function ContactSection() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', message: t('contact.form.error_required') });
      return;
    }

    setIsLoading(true);
    try {
      await contactService.send(form);
      setStatus({ type: 'success', message: t('contact.form.success') });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', message: t('contact.form.error_failed') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section" id="contact" aria-label="Contact">
      <div className="container">
        <SectionTitle
          label={t('contact.label')}
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="contact-info__title">{t('contact.info_title')}</h3>
            <p className="contact-info__text">
              {t('contact.info_text')}
            </p>

            <div className="contact-info__details">
              <div className="contact-info__detail">
                <EmailIcon />
                <div>
                  <strong>{t('contact.email_label')}</strong>
                  <a href="mailto:princekangbode@gmail.com">princekangbode@gmail.com</a>
                </div>
              </div>
              <div className="contact-info__detail">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>{t('contact.location_label')}</strong>
                  <span>Cotonou, Benin</span>
                </div>
              </div>
            </div>

            <div className="contact-info__socials">
              <a href="https://github.com/Nounagnon02" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a href="https://www.linkedin.com/in/nounagnon-prince-kangbode-a9a9a62b4" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="contact-name">{t('contact.form.name')} <span aria-hidden="true">*</span></label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t('contact.form.placeholder_name')}
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                  aria-required="true"
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-email">{t('contact.form.email')} <span aria-hidden="true">*</span></label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t('contact.form.placeholder_email')}
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  aria-required="true"
                />
              </div>
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-subject">{t('contact.form.subject')}</label>
              <input
                id="contact-subject"
                type="text"
                placeholder={t('contact.form.placeholder_subject')}
                value={form.subject}
                onChange={handleChange('subject')}
              />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-message">{t('contact.form.message')} <span aria-hidden="true">*</span></label>
              <textarea
                id="contact-message"
                placeholder={t('contact.form.placeholder_message')}
                value={form.message}
                onChange={handleChange('message')}
                rows={5}
                required
                aria-required="true"
              />
            </div>

            {status.message && (
              <div className={`contact-form__status contact-form__status--${status.type}`} role="alert">
                {status.message}
              </div>
            )}

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? t('contact.form.sending') : t('contact.form.send')}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
