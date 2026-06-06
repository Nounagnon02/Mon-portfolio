import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import './NotFound.css';

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">{t('not_found.title')}</h1>
        <p className="not-found__text">
          {t('not_found.description')}
        </p>
        <Button onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('not_found.cta')}
        </Button>
      </div>
    </div>
  );
}
