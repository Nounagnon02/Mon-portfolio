import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';
import { useMotion } from '../../context/MotionContext';
import { featuredProjects } from '../../data/projects';
import LagoonFallback from '../lagoon/LagoonFallback';
import LagoonCanvas, { canUse3D } from '../lagoon/LagoonCanvas';
import './HeroSection.css';

// Distinct technologies that carry the featured projects, main one first, for the static image
const fallbackTags = [
  ...new Set([
    ...featuredProjects.map((p) => p.foundations[0]),
    ...featuredProjects.flatMap((p) => p.foundations.slice(1)),
  ]),
];

export default function HeroSection() {
  const { t } = useI18n();
  const { motionOff } = useMotion();
  const sectionRef = useRef(null);
  const apiRef = useRef(null);
  const [failed, setFailed] = useState(false);
  // ready: a scene is on screen. tall: the section has its two-screen dive height,
  // kept while a scene is rebuilt (theme change) so the page never jumps.
  const [ready, setReady] = useState(false);
  const [tall, setTall] = useState(false);

  const supports3D = useMemo(() => canUse3D(), []);
  const want3D = supports3D && !motionOff && !failed;
  const live = want3D && ready;
  const diving = want3D && tall;

  useEffect(() => {
    if (!want3D) {
      setReady(false);
      setTall(false);
    }
  }, [want3D]);

  const handlePending = useCallback(() => setReady(false), []);
  const handleReady = useCallback(() => {
    setReady(true);
    setTall(true);
  }, []);
  const handleFail = useCallback(() => {
    setFailed(true);
    setReady(false);
    setTall(false);
  }, []);

  // Scroll and pointer steer the camera; native scrolling is never intercepted
  useEffect(() => {
    if (!diving) return undefined;
    const section = sectionRef.current;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
      section.style.setProperty('--dive', p.toFixed(3));
      if (apiRef.current) apiRef.current.setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse' || !apiRef.current) return;
      apiRef.current.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
      section.style.removeProperty('--dive');
    };
  }, [diving]);

  return (
    <section
      ref={sectionRef}
      className="hero-lagoon"
      data-live={live ? 'true' : 'false'}
      data-tall={diving ? 'true' : 'false'}
      aria-labelledby="hero-title"
    >
      <div className="hero-lagoon__stage">
        <div className="hero-lagoon__sky" aria-hidden="true" />
        <LagoonFallback className="hero-lagoon__fallback" tags={fallbackTags} />
        {want3D && (
          <LagoonCanvas
            className="hero-lagoon__canvas"
            houses={featuredProjects}
            apiRef={apiRef}
            onPending={handlePending}
            onReady={handleReady}
            onFail={handleFail}
          />
        )}

        <div className="container hero-lagoon__content">
          <p className="hero-lagoon__eyebrow">{t('hero.lagoon.eyebrow')}</p>
          <h1 id="hero-title" className="hero-lagoon__title">
            Kangbode <br />
            Prince
          </h1>
          <p className="hero-lagoon__tagline">{t('hero.lagoon.tagline')}</p>
          <div className="hero-lagoon__actions">
            <Link to="/projects" className="hero-lagoon__cta">
              {t('hero.cta_projects')}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/contact" className="hero-lagoon__link">
              {t('hero.cta_contact')}
            </Link>
          </div>
        </div>

        {diving && (
          <p className="container hero-lagoon__cue" aria-hidden="true">
            {t('hero.lagoon.hint_3d')}
          </p>
        )}

        <div className="container hero-lagoon__below">
          <p className="hero-lagoon__below-title">{t('hero.lagoon.below')}</p>
          <p className="hero-lagoon__hint">{t('hero.lagoon.hint_static')}</p>
        </div>
      </div>
    </section>
  );
}
