import { motion } from 'framer-motion';
import './SectionTitle.css';

export default function SectionTitle({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  return (
    <motion.div
      className={`section-header section-header--${align} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {label && (
        <span className="section-header__label">{label}</span>
      )}
      <h2 className="section-header__title">{title}</h2>
      {subtitle && (
        <p className="section-header__subtitle">{subtitle}</p>
      )}
    </motion.div>
  );
}
