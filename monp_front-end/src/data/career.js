/* ============================================================
   Career — sources checked on 2026-11-04
   - experiences, education: Prince's own CV (Documents/…_CV.pdf)
   - certifications: certificate files in Documents/certifs
   - events: certificate, GitHub repository or CV, as noted in `proof`
   No phone number, student ID or birth date is published here.
   ============================================================ */

export const experiences = [
  {
    id: 'asin',
    role: {
      fr: 'Stagiaire développeur logiciel et systèmes d\'information',
      en: 'Software and information systems developer intern',
    },
    org: 'ASIN — Agence des Systèmes d\'Information et du Numérique',
    period: { fr: 'Juillet 2026 – aujourd\'hui', en: 'July 2026 – present' },
    current: true,
    points: [
      {
        fr: 'Développement, intégration et déploiement de systèmes d\'information publics et de plateformes numériques nationales.',
        en: 'Development, integration and deployment of public information systems and national digital platforms.',
      },
      {
        fr: 'APIs sécurisées, contrôle d\'accès et interopérabilité des données entre ministères.',
        en: 'Secure APIs, access control and data interoperability between ministries.',
      },
    ],
  },
  {
    id: 'novateck',
    role: { fr: 'Stagiaire développeur full-stack et back-end', en: 'Full-stack and back-end developer intern' },
    org: 'Novateck Vision',
    period: { fr: 'Février – août 2026', en: 'February – August 2026' },
    current: false,
    points: [
      {
        fr: 'Fonctionnalités web, logique back-end et modélisation de bases SQL.',
        en: 'Web features, back-end logic and SQL data modelling.',
      },
      {
        fr: 'APIs REST et optimisation du temps de réponse serveur.',
        en: 'REST APIs and server response-time optimisation.',
      },
    ],
  },
  {
    id: 'ifri-ast',
    role: { fr: 'Développeur full-stack / back-end', en: 'Full-stack / back-end developer' },
    org: 'IFRI & Africa Sun TV',
    period: { fr: '2025', en: '2025' },
    current: false,
    points: [
      {
        fr: 'Système de numérisation de la gestion des examens nationaux pour l\'IFRI.',
        en: 'Digitisation system for national exam management for IFRI.',
      },
      {
        fr: 'Plugins WordPress sur mesure pour Africa Sun TV : publication automatique des vidéos et des directs.',
        en: 'Custom WordPress plugins for Africa Sun TV: automatic publishing of videos and live streams.',
      },
    ],
  },
];

export const education = [
  {
    id: 'licence',
    title: { fr: 'Licence en Internet et Multimédia', en: 'Bachelor\'s degree in Internet and Multimedia' },
    org: 'IFRI — Université d\'Abomey-Calavi',
    period: '2023 – 2025',
  },
  {
    id: 'bac',
    title: { fr: 'Baccalauréat scientifique (série D)', en: 'Science baccalaureate (series D)' },
    org: 'Collège Moderne des Collines Léopold Sédar Senghor',
    period: '2023',
  },
];

export const certifications = [
  {
    id: 'genai',
    title: 'Generative and Agentic AI',
    issuer: 'Saïd Business School, University of Oxford · Coursera',
    date: { fr: 'Novembre 2026', en: 'November 2026' },
    verify: 'https://coursera.org/verify/L68W200CJHJ7',
  },
  {
    id: 'ai-essentials',
    title: 'AI Essentials',
    issuer: 'Saïd Business School, University of Oxford · Coursera',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    verify: null,
  },
  {
    id: 'data-gov-toolkit',
    title: 'Data Governance Toolkit for Navigating Data',
    issuer: 'Smart Africa Digital Academy',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    verify: null,
  },
  {
    id: 'data-gov-foundations',
    title: 'Data Governance Foundations and Implementation',
    issuer: 'Smart Africa Digital Academy',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    verify: null,
  },
  {
    id: 'pm-initiation',
    title: 'Project Initiation: Starting a Successful Project',
    issuer: 'Google · Coursera',
    date: { fr: 'Janvier 2026', en: 'January 2026' },
    verify: null,
  },
  {
    id: 'pm-foundations',
    title: 'Foundations of Project Management',
    issuer: 'Google · Coursera',
    date: { fr: 'Décembre 2025', en: 'December 2025' },
    verify: null,
  },
  {
    id: 'lightning',
    title: 'Bitcoin Lightning Developer Bootcamp',
    issuer: 'Africa Free Routing · Cotonou',
    date: { fr: 'Juin 2025', en: 'June 2025' },
    verify: null,
  },
  {
    id: 'sql',
    title: 'Introduction to SQL',
    issuer: '[Sololearn — à confirmer]',
    date: { fr: 'Mai 2024', en: 'May 2024' },
    verify: null,
  },
];

export const events = [
  { id: 'unesco', name: 'UNESCO Youth Hackathon', year: '2026', project: null, proof: 'certificate' },
  { id: 'build-together', name: 'Build Together Challenge', year: '2026', project: 'Ever After Events', proof: 'repository' },
  { id: 'miabe', name: 'Hackathon MIABE', year: '2026', project: 'DiasporaConnect', proof: 'repository' },
  { id: 'dorahacks', name: 'DoraHacks × CoinMarketCap', year: '2026', project: 'Second Opinion', proof: 'repository' },
  { id: 'nasa', name: 'NASA International Space Apps Challenge', year: '2025', project: null, proof: 'certificate' },
  { id: 'devlab', name: 'DevLab (ASIN)', year: '2025', project: 'Gbédagbé', proof: 'repository' },
  { id: 'sdsn', name: 'Hackathon SDSN Bénin', year: '2025', project: 'GLOTTO-BOT', proof: 'repository' },
];
