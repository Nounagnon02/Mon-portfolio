import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TechTag from '../components/ui/TechTag';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import { blogService } from '../services/api';
import './BlogArticle.css';

const fallbackArticles = [
  {
    id: 1,
    title: 'Building Scalable REST APIs with Laravel',
    excerpt: 'Learn how to structure Laravel applications for scale — service layers, repository patterns, and API resource classes.',
    slug: 'building-scalable-rest-apis-laravel',
    category: 'Backend',
    read_time: 8,
    published_at: '2025-12-15',
    tags: ['Laravel', 'API', 'PHP'],
    content: 'When building REST APIs with Laravel, structure is everything. Start with a clean service layer that separates business logic from controllers. Use repository patterns for data access abstraction. Leverage Laravel\'s API resources for consistent JSON responses. Implement proper validation with Form Requests. Use Laravel Sanctum for SPA authentication. Structure your routes with API versioning from day one. These patterns scale from prototype to production without rewriting.',
  },
  {
    id: 2,
    title: 'React Performance: Beyond the Basics',
    excerpt: 'Dive deep into React memoization, code splitting, and rendering strategies to build blazing-fast UIs.',
    slug: 'react-performance-beyond-basics',
    category: 'Frontend',
    read_time: 10,
    published_at: '2025-11-28',
    tags: ['React', 'Performance', 'JavaScript'],
    content: 'React performance optimization goes far beyond React.memo and useMemo. Start by measuring — use React DevTools Profiler to identify actual bottlenecks. Implement code splitting with React.lazy and Suspense at the route level. Use the useDeferredValue hook for expensive renders. Consider virtualization for long lists with libraries like react-window. Profile your bundle with tools like bundle-analyzer. Remember: premature optimization is the root of all evil — always measure first.',
  },
  {
    id: 3,
    title: 'The Art of Clean Architecture in Modern Web Apps',
    excerpt: 'Why separation of concerns still matters and how to apply clean architecture principles without over-engineering.',
    slug: 'clean-architecture-modern-web',
    category: 'Architecture',
    read_time: 12,
    published_at: '2025-10-10',
    tags: ['Architecture', 'Best Practices'],
    content: 'Clean architecture isn\'t about layers and abstractions for their own sake — it\'s about managing dependencies. The golden rule: source code dependencies point inward. Your business logic should not depend on frameworks, databases, or external services. Define interfaces at the boundaries. Use dependency injection to wire things together at the composition root. The result? Testable, maintainable code that adapts to change without cascading rewrites.',
  },
  {
    id: 4,
    title: 'Mastering Database Design for High-Traffic Apps',
    excerpt: 'From normalization to indexing strategies — build databases that perform under pressure.',
    slug: 'mastering-database-design',
    category: 'Database',
    read_time: 7,
    published_at: '2025-09-05',
    tags: ['SQL', 'PostgreSQL', 'Performance'],
    content: 'Database design can make or break your application under load. Start with proper normalization (3NF is a good baseline). Add indexes strategically — every index speeds up reads but slows writes. Use composite indexes for multi-column queries. Consider partial indexes for filtered queries. For high-traffic apps, use read replicas and connection pooling. Monitor slow queries with tools like pg_stat_statements. Always benchmark with realistic data volumes.',
  },
  {
    id: 5,
    title: 'Authentication Patterns in Laravel & React',
    excerpt: 'Compare SPA authentication approaches: Sanctum, JWT, and session-based auth with practical examples.',
    slug: 'auth-patterns-laravel-react',
    category: 'Full-Stack',
    read_time: 9,
    published_at: '2025-08-20',
    tags: ['Laravel', 'React', 'Auth'],
    content: 'Choosing the right authentication pattern for your Laravel-React SPA depends on your use case. Laravel Sanctum offers cookie-based SPA authentication that\'s secure and simple for first-party apps. JWT tokens work better for third-party API consumption and mobile apps. Session-based auth is the simplest but requires same-domain deployment. Each approach has trade-offs in security, developer experience, and scalability.',
  },
  {
    id: 6,
    title: 'Why TypeScript Changes the Way You Think About Code',
    excerpt: 'TypeScript is more than a type checker — it changes your design decisions and makes your code self-documenting.',
    slug: 'typescript-changes-how-you-think',
    category: 'Languages',
    read_time: 6,
    published_at: '2025-07-14',
    tags: ['TypeScript', 'JavaScript'],
    content: 'TypeScript does more than catch type errors — it fundamentally changes how you design software. When you define types first, you think about data shape before implementation. Union types and type narrowing make impossible states impossible to represent. Generics encourage reusable, composable patterns. The compiler becomes your first reviewer, catching entire classes of bugs before they reach production.',
  },
];

export default function BlogArticle() {
  const { t } = useI18n();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const res = await blogService.getBySlug(slug);
      const data = res.data?.data || res.data;
      if (data) {
        setArticle(data);
      } else {
        setArticle(fallbackArticles.find((a) => a.slug === slug) || null);
      }
    } catch {
      setArticle(fallbackArticles.find((a) => a.slug === slug) || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="blog-article__skeleton">
            <div className="skeleton-line skeleton-line--title" style={{ width: '60%', height: 32 }} />
            <div className="skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '100%' }} />
            <div className="skeleton-line" style={{ width: '90%' }} />
            <div className="skeleton-line" style={{ width: '95%' }} />
          </div>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="section">
        <div className="container">
          <div className="blog-article__not-found">
            <h1>{t('not_found.title')}</h1>
            <p>{t('not_found.description')}</p>
            <Button onClick={() => navigate('/blog')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {t('blog.cta_all')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.article
      className="section blog-article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        <div className="blog-article__header">
          <Button
            onClick={() => navigate('/blog')}
            variant="ghost"
            className="blog-article__back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t('blog.cta_all')}
          </Button>

          <span className="blog-article__category">{article.category}</span>
          <h1 className="blog-article__title">{article.title}</h1>

          <div className="blog-article__meta">
            <span>
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="blog-article__meta-sep">·</span>
            <span>{article.read_time} {t('blog.read_mins')}</span>
          </div>
        </div>

        <div className="blog-article__content">
          <p>{article.excerpt}</p>
          {article.content && <p>{article.content}</p>}
        </div>

        <div className="blog-article__footer">
          <div className="blog-article__tags">
            {article.tags?.map((tag) => (
              <TechTag key={tag}>{tag}</TechTag>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
