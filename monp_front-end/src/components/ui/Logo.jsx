import { motion } from 'framer-motion';
import './Logo.css';

export default function Logo({ size = 44, className = '', animate = true }) {
  return (
    <motion.span
      className={`logo ${className}`}
      style={{ width: size, height: size }}
      whileHover={animate ? { scale: 1.05, rotate: -4 } : undefined}
      whileTap={animate ? { scale: 0.95 } : undefined}
      aria-label="Kangbode Prince logo"
    >
      <svg
        viewBox="0 0 120 120"
        className="logo__svg"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background gradient: teal to dark teal */}
          <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D7377" />
            <stop offset="100%" stopColor="#095E61" />
          </linearGradient>

          {/* Border gradient: gold to terracotta */}
          <linearGradient id="logoBorder" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A04A" />
            <stop offset="50%" stopColor="#E2B85C" />
            <stop offset="100%" stopColor="#C9614A" />
          </linearGradient>

          {/* Monogram gradient: warm gold */}
          <linearGradient id="logoMono" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C56A" />
            <stop offset="100%" stopColor="#D4A04A" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1" result="offset" />
            <feComposite in="SourceGraphic" in2="offset" operator="over" />
          </filter>
        </defs>

        {/* Outer diamond - shadow */}
        <path d="M60 4 L116 60 L60 116 L4 60 Z" fill="rgba(0,0,0,0.15)" transform="translate(0, 2)" />

        {/* Outer diamond - gold/terracotta gradient border */}
        <path d="M60 4 L116 60 L60 116 L4 60 Z" fill="url(#logoBorder)" />

        {/* Inner diamond - teal background */}
        <path d="M60 10 L110 60 L60 110 L10 60 Z" fill="url(#logoBg)" />

        {/* Decorative inner border ring */}
        <path
          d="M60 8 L112 60 L60 112 L8 60 Z"
          stroke="rgba(212, 160, 74, 0.25)"
          strokeWidth="1"
          fill="none"
        />

        {/* Corner decorative triangles (Beninese-inspired) */}
        <path d="M60 4 L68 12 L60 12 Z" fill="rgba(212, 160, 74, 0.4)" />
        <path d="M116 60 L108 68 L108 60 Z" fill="rgba(212, 160, 74, 0.4)" />
        <path d="M60 116 L52 108 L60 108 Z" fill="rgba(212, 160, 74, 0.4)" />
        <path d="M4 60 L12 52 L12 60 Z" fill="rgba(212, 160, 74, 0.4)" />

        {/* K - left diagonal stroke */}
        <path
          d="M35 32 L35 88"
          stroke="url(#logoMono)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logoGlow)"
        />

        {/* K - upper diagonal */}
        <path
          d="M35 50 L62 32"
          stroke="url(#logoMono)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* K - lower diagonal */}
        <path
          d="M35 70 L62 88"
          stroke="url(#logoMono)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* P - vertical bar (shares with K's vertical) */}
        <path
          d="M58 35 L58 88"
          stroke="url(#logoMono)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logoGlow)"
        />

        {/* P - loop */}
        <path
          d="M58 35 L78 35 Q85 35 85 48 Q85 60 78 62 L58 62"
          stroke="url(#logoMono)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Decorative accent diamond at bottom */}
        <path d="M60 95 L65 100 L60 105 L55 100 Z" fill="#C9614A" />

        {/* Small gold dots on left and right points */}
        <circle cx="18" cy="60" r="2.5" fill="#D4A04A" opacity="0.6" />
        <circle cx="102" cy="60" r="2.5" fill="#D4A04A" opacity="0.6" />
      </svg>
    </motion.span>
  );
}
