import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import TechTag from '../ui/TechTag';
import Button from '../ui/Button';
import { useI18n } from '../../context/I18nContext';
import { blogService } from '../../services/api';
import './BlogSection.css';

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
  },
  {
    id: 3,
    title: 'Mastering Database Design for High-Traffic Apps',
    excerpt: 'From normalization to indexing strategies — build databases that perform under pressure.',
    slug: 'mastering-database-design',
    category: 'Database',
    read_time: 7,
    published_at: '2025-09-05',
    tags: ['SQL', 'PostgreSQL', 'Performance'],
  },
];

export default function BlogSection() {
  const { t } = useI18n();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await blogService.getAll();
        const data = res.data?.data || res.data || [];
        setArticles(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        setArticles(fallbackArticles);
      }
    })();
  }, []);

  const display = articles.length > 0 ? articles : fallbackArticles;

  return (
    <section className="section" id="blog" aria-label="Latest articles">
      <div className="container">
        <SectionTitle
          label={t('blog.label')}
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
        />

        <motion.div
          className="blog-section__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {display.map((article, i) => (
            <motion.article
              key={article.id}
              className="blog-section__card"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <Link to={`/blog/${article.slug}`} className="blog-section__card-link" aria-label={article.title}>
                <div className="blog-section__card-image">
                  <span className="blog-section__category">{article.category}</span>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="blog-section__icon">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <line x1="8" y1="7" x2="16" y2="7" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <div className="blog-section__card-body">
                  <div className="blog-section__meta">
                    <span>{new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}</span>
                    <span>{article.read_time} {t('blog.read_mins')}</span>
                  </div>
                  <h3 className="blog-section__card-title">{article.title}</h3>
                  <p className="blog-section__card-excerpt">{article.excerpt}</p>
                  <div className="blog-section__tags">
                    {article.tags?.slice(0, 3).map((tag) => (
                      <TechTag key={tag}>{tag}</TechTag>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="blog-section__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button href="/blog" variant="secondary">
            {t('blog.cta_all')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
