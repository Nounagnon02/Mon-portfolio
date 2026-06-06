import './TechTag.css';

export default function TechTag({ children, variant = 'default' }) {
  return (
    <span className={`tech-tag tech-tag--${variant}`}>
      {children}
    </span>
  );
}
