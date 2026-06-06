import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import './Layout.css';

export default function Layout({ children }) {
  // Track unique visitor (once per browser)
  useEffect(() => {
    const visited = localStorage.getItem('kp_visited');
    if (!visited) {
      const count = parseInt(localStorage.getItem('kp_visitor_count') || '0', 10);
      localStorage.setItem('kp_visitor_count', String(count + 1));
      localStorage.setItem('kp_visited', 'true');
    }
  }, []);

  return (
    <div className="layout">
      <CustomCursor />
      <Header />
      <main id="main-content" className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
