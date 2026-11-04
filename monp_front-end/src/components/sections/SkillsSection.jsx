import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { useI18n } from '../../context/I18nContext';
import { projects } from '../../data/projects';
import './SkillsSection.css';

/* Skills are counted from the verified projects: each tool shows in how many
   projects of this portfolio it appears (interface or foundations). */
const SKILLS = {
  interfaces: [
    ['React', /^(pwa )?react\b(?! native)/i],
    ['Expo / React Native', /expo|react native/i],
    ['Next.js', /^next\.js/i],
    ['Tailwind CSS', /tailwind/i],
    ['TypeScript', /typescript/i],
    ['Nuxt', /^nuxt/i],
    ['Electron', /electron/i],
  ],
  backend: [
    ['Laravel', /^laravel/i],
    ['Python (FastAPI, Flask)', /fastapi|flask/i],
    ['Node.js / Express', /express|node\.js/i],
    ['Solidity', /solidity/i],
  ],
  data: [
    ['PostgreSQL', /postgres/i],
    ['MySQL', /mysql/i],
    ['Supabase', /supabase/i],
    ['SQLite', /sqlite/i],
    ['Prisma', /prisma/i],
    ['Redis', /redis/i],
  ],
  services: [
    ['FedaPay', /fedapay/i],
    ['Gemini', /gemini/i],
    ['CinetPay', /cinetpay/i],
    ['Mojaloop', /mojaloop/i],
    ['Twilio / WhatsApp', /twilio|whatsapp/i],
    ['Docker', /docker/i],
    ['Playwright', /playwright/i],
  ],
};

const skillGroups = Object.entries(SKILLS).map(([group, defs]) => ({
  group,
  items: defs
    .map(([name, pattern]) => ({
      name,
      count: projects.filter((p) => [...p.interface, ...p.foundations].some((tool) => pattern.test(tool))).length,
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count),
}));

const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SkillsSection() {
  const { t } = useI18n();

  return (
    <section className="section skills-section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionTitle
          align="left"
          label={t('skills.label')}
          title={<span id="skills-title">{t('skills.title')}</span>}
          subtitle={t('skills.subtitle')}
        />

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {skillGroups.map(({ group, items }) => (
            <motion.div key={group} className="skill-category" variants={itemVariants}>
              <h3 className="skill-category__title">{t(`skills.groups.${group}`)}</h3>
              <ul className="skill-category__items">
                {items.map((skill) => (
                  <li key={skill.name} className="skill-item">
                    <span>{skill.name}</span>
                    <span className="skill-item__count" aria-label={t('skills.count_aria', { count: skill.count })}>
                      {skill.count}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
