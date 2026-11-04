import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { useI18n } from '../../context/I18nContext';
import './CaseStudySection.css';

/* Two case studies, every statement checked in the repository (2026-11-04).
   "verified" lists what the code shows, not usage results: none are documented. */
const caseStudies = [
  {
    id: 'ecole',
    title: 'École',
    tagline: {
      fr: 'Une API, trois applications, dix rôles',
      en: 'One API, three apps, ten roles',
    },
    role: { fr: 'Développé seul', en: 'Built alone' },
    duration: { fr: 'Mai 2025 – août 2026', en: 'May 2025 – August 2026' },
    problem: {
      fr: 'Numériser les opérations quotidiennes d\'un établissement scolaire d\'Afrique francophone : inscriptions, notes, bulletins, paiements et vie scolaire, pour chaque personne qui y travaille ou y étudie.',
      en: 'Digitise the daily operations of a French-speaking African school: enrolment, grades, report cards, payments and school life, for everyone who works or studies there.',
    },
    solution: {
      fr: 'Une seule API REST Laravel sert trois clients : un site React, une application mobile Expo et une application de bureau Electron. Chacun des dix rôles (direction, enseignants, élèves, parents, comptabilité, surveillance, censorat, infirmerie, bibliothèque, secrétariat) a son tableau de bord. Un mode multi-établissement gère les abonnements et la facturation par école.',
      en: 'A single Laravel REST API serves three clients: a React website, an Expo mobile app and an Electron desktop app. Each of the ten roles (management, teachers, pupils, parents, accounting, supervision, discipline, nursing, library, office) has its own dashboard. A multi-school mode handles subscriptions and billing per school.',
    },
    verified: [
      { fr: '159 commits, 82 modèles, 117 migrations', en: '159 commits, 82 models, 117 migrations' },
      { fr: '53 fichiers de tests back-end, 21 front-end, 4 parcours Playwright', en: '53 back-end test files, 21 front-end, 4 Playwright journeys' },
      { fr: 'Bulletins PDF, imports Excel, Mobile Money MTN/Moov via FedaPay', en: 'PDF report cards, Excel imports, MTN/Moov Mobile Money via FedaPay' },
      { fr: 'Traitements en file d\'attente : bulletins, imports, paiements, notifications', en: 'Queued jobs: report cards, imports, payments, notifications' },
    ],
    tech: ['Laravel 11', 'React 18', 'Expo 52', 'Electron', 'Sanctum', 'FedaPay'],
    links: { code: 'https://github.com/Nounagnon02/Ecole', demo: 'https://ecole-one.vercel.app' },
  },
  {
    id: 'sgp-uac',
    title: 'SGP-UAC',
    tagline: {
      fr: 'Une présence vérifiée par le serveur, jamais sur parole',
      en: 'Attendance checked by the server, never taken on trust',
    },
    role: { fr: 'Développé seul · mémoire de fin d\'études', en: 'Built alone · final-year thesis' },
    duration: { fr: 'Novembre 2025 – octobre 2026', en: 'November 2025 – October 2026' },
    problem: {
      fr: 'Vérifier de façon fiable la présence des étudiants aux cours de l\'Université d\'Abomey-Calavi, sans qu\'on puisse scanner à distance, prêter son téléphone ou faire suivre le QR code à un absent.',
      en: 'Reliably check student attendance at the University of Abomey-Calavi, without remote scanning, lending a phone or forwarding the QR code to someone absent.',
    },
    solution: {
      fr: 'L\'administration importe cours et emplois du temps, y compris par extraction IA d\'un document. Pendant la séance, un QR code change chaque minute ; l\'étudiant le scanne depuis l\'application mobile, et le serveur croise le jeton, la position dans la salle, le réseau (SSID, BSSID, plage IP) et l\'appareil avant de valider. Les rapports de présence sortent en PDF.',
      en: 'The administration imports courses and timetables, including AI extraction from a document. During the class, a QR code changes every minute; the student scans it from the mobile app, and the server cross-checks the token, the position in the room, the network (SSID, BSSID, IP range) and the device before accepting. Attendance reports are exported as PDF.',
    },
    verified: [
      { fr: '204 commits, 24 modèles, 63 migrations', en: '204 commits, 24 models, 63 migrations' },
      { fr: '103 fichiers de tests back-end, 75 front-end, 4 mobile, 7 parcours E2E', en: '103 back-end test files, 75 front-end, 4 mobile, 7 end-to-end journeys' },
      { fr: 'Scénarios de charge k6 et d\'analyse de sécurité OWASP ZAP dans le dépôt', en: 'k6 load scenarios and OWASP ZAP security scans in the repository' },
      { fr: 'Double authentification TOTP, import IA via Gemini, Groq ou OpenRouter', en: 'TOTP two-factor authentication, AI import through Gemini, Groq or OpenRouter' },
    ],
    tech: ['Laravel 12', 'PostgreSQL', 'Supabase', 'React 19', 'Expo'],
    links: { code: 'https://github.com/Nounagnon02/projet_verification_de_presence', demo: null },
  },
];

export default function CaseStudySection() {
  const { t, locale } = useI18n();
  const pick = (value) => value[locale] || value.fr;

  return (
    <section className="section" aria-labelledby="case-studies-title">
      <div className="container">
        <SectionTitle
          align="left"
          label={t('case_studies.label')}
          title={<span id="case-studies-title">{t('case_studies.title')}</span>}
          subtitle={t('case_studies.subtitle')}
        />

        <div className="casestudy__list">
          {caseStudies.map((study, i) => (
            <motion.article
              key={study.id}
              className="casestudy-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="casestudy-card__header">
                <div className="casestudy-card__meta">
                  <span className="casestudy-card__role">{pick(study.role)}</span>
                  <span className="casestudy-card__duration">{pick(study.duration)}</span>
                </div>
                <h3 className="casestudy-card__title">{study.title}</h3>
                <p className="casestudy-card__tagline">{pick(study.tagline)}</p>
              </div>

              <div className="casestudy-card__body">
                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">{t('case_studies.problem')}</h4>
                  <p className="casestudy-card__text">{pick(study.problem)}</p>
                </div>

                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">{t('case_studies.solution')}</h4>
                  <p className="casestudy-card__text">{pick(study.solution)}</p>
                </div>

                <div className="casestudy-card__section">
                  <h4 className="casestudy-card__section-title">{t('case_studies.results')}</h4>
                  <ul className="casestudy-card__results">
                    {study.verified.map((item) => (
                      <li key={item.fr} className="casestudy-card__result">{pick(item)}</li>
                    ))}
                  </ul>
                </div>

                <ul className="casestudy-card__tech">
                  {study.tech.map((tech) => (
                    <li key={tech} className="casestudy-card__tech-tag">{tech}</li>
                  ))}
                </ul>

                <div className="casestudy-card__links">
                  <a
                    href={study.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('projects.code_aria', { name: study.title })}
                  >
                    {t('projects.code')}
                  </a>
                  {study.links.demo && (
                    <a
                      href={study.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('projects.live_aria', { name: study.title })}
                    >
                      {t('projects.live')}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
