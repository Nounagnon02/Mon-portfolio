import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import TechTag from '../components/ui/TechTag';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import { blogService } from '../services/api';
import './Blog.css';

const fallbackArticles = [
  {
    id: 1,
    title: 'Building Scalable REST APIs with Laravel',
    excerpt:
      'Learn how to structure Laravel applications for scale — service layers, repository patterns, and API resource classes.',
    slug: 'building-scalable-rest-apis-laravel',
    category: 'Backend',
    read_time: 8,
    published_at: '2025-12-15',
    image: null,
    tags: ['Laravel', 'API', 'PHP'],
  },
  {
    id: 2,
    title: 'React Performance: Beyond the Basics',
    excerpt:
      'Dive deep into React memoization, code splitting, and rendering strategies to build blazing-fast UIs.',
    slug: 'react-performance-beyond-basics',
    category: 'Frontend',
    read_time: 10,
    published_at: '2025-11-28',
    image: null,
    tags: ['React', 'Performance', 'JavaScript'],
  },
  {
    id: 3,
    title: 'The Art of Clean Architecture in Modern Web Apps',
    excerpt:
      'Why separation of concerns still matters and how to apply clean architecture principles without over-engineering.',
    slug: 'clean-architecture-modern-web',
    category: 'Architecture',
    read_time: 12,
    published_at: '2025-10-10',
    image: null,
    tags: ['Architecture', 'Best Practices'],
  },
  {
    id: 4,
    title: 'Mastering Database Design for High-Traffic Apps',
    excerpt:
      'From normalization to indexing strategies — build databases that perform under pressure.',
    slug: 'mastering-database-design',
    category: 'Database',
    read_time: 7,
    published_at: '2025-09-05',
    image: null,
    tags: ['SQL', 'PostgreSQL', 'Performance'],
  },
  {
    id: 5,
    title: 'Authentication Patterns in Laravel & React',
    excerpt:
      'Compare SPA authentication approaches: Sanctum, JWT, and session-based auth with practical examples.',
    slug: 'auth-patterns-laravel-react',
    category: 'Full-Stack',
    read_time: 9,
    published_at: '2025-08-20',
    image: null,
    tags: ['Laravel', 'React', 'Auth'],
  },
  {
    id: 6,
    title: 'Why TypeScript Changes the Way You Think About Code',
    excerpt:
      'TypeScript is more than a type checker — it changes your design decisions and makes your code self-documenting.',
    slug: 'typescript-changes-how-you-think',
    category: 'Languages',
    read_time: 6,
    published_at: '2025-07-14',
    image: null,
    tags: ['TypeScript', 'JavaScript'],
  },
];

const categories = ['All', 'Backend', 'Frontend', 'Full-Stack', 'Architecture', 'Database'];
const categoryKeys = ['all', 'Backend', 'Frontend', 'Full-Stack', 'Architecture', 'Database'];

export default function Blog() {
  const { t } = useI18n();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await blogService.getAll();
      const data = res.data?.data || res.data || [];
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setArticles(fallbackArticles);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <section className="section" aria-label="Blog">
      <div className="container">
        <SectionTitle
          label={t('blog.label')}
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
        />

        {/* Category filter */}
        <div className="blog__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`blog__filter-btn ${activeCategory === cat ? 'blog__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="blog__grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="blog-skeleton" aria-hidden="true">
                <div className="skeleton-image" style={{ height: 180 }} />
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-line--cat" />
                  <div className="skeleton-line skeleton-line--title" style={{ width: '75%' }} />
                  <div className="skeleton-line skeleton-line--desc" style={{ width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="blog__grid"
            layout
          >
            {filtered.map((article, i) => (
              <motion.article
                key={article.id}
                className="blog-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                layout
              >
                <Link to={`/blog/${article.slug}`} className="blog-card__link" aria-label={article.title}>
                  <div className="blog-card__image">
                    {article.image ? (
                      <img src={article.image} alt={article.title} loading="lazy" />
                    ) : (
                      <div className="blog-card__placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          <line x1="8" y1="7" x2="16" y2="7" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                    )}
                    <span className="blog-card__category">{article.category}</span>
                  </div>
                  <div className="blog-card__content">
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="blog-card__read-time">{article.read_time} {t('blog.read_mins')}</span>
                    </div>
                    <h3 className="blog-card__title">{article.title}</h3>
                    <p className="blog-card__excerpt">{article.excerpt}</p>
                    <div className="blog-card__tags">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <TechTag key={tag}>{tag}</TechTag>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="blog__empty">
            {t('blog.no_articles')}
          </p>
        )}
      </div>
    </section>
  );
}
