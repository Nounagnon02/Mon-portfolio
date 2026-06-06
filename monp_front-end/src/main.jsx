import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import './styles/design-tokens.css';
import './styles/global.css';
import './styles/animations.css';

/* ── Service Worker Registration ── */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works without it
    });
  });
}

/* ── Analytics (optional, set VITE_ANALYTICS_URL in .env) ── */
if (import.meta.env.VITE_ANALYTICS_URL && import.meta.env.PROD) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = import.meta.env.VITE_ANALYTICS_URL;
  script.setAttribute('data-website-id', import.meta.env.VITE_ANALYTICS_ID || '');
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
