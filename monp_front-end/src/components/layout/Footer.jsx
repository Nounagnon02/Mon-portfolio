import { useI18n } from '../../context/I18nContext';
import { GitHubIcon, LinkedInIcon, TwitterIcon, EmailIcon } from '../ui/SocialIcon';
import Logo from '../ui/Logo';
import './Footer.css';

const socials = [
  { href: 'https://github.com/Nounagnon02', label: 'GitHub', icon: <GitHubIcon /> },
  { href: 'https://www.linkedin.com/in/nounagnon-prince-kangbode-a9a9a62b4', label: 'LinkedIn', icon: <LinkedInIcon /> },
  { href: 'mailto:princekangbode@gmail.com', label: 'Email', icon: <EmailIcon /> },
];

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Logo className="footer__logo" size={36} />
            <p className="footer__tagline">
              Full-Stack Developer crafting premium digital experiences.
            </p>
          </div>

          <div className="footer__socials">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              &copy; {year} Kangbode Prince. {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
