import './Card.css';

export default function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'card',
    `card--${variant}`,
    hover && 'card--hover',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} {...props}>
      {children}
    </div>
  );
}
