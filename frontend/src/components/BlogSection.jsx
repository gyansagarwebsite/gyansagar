import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import blogService from '../services/blogService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/components/BlogSection.css';

const BLOG_ICONS = ['✏️', '💡', '📚', '🎯', '🔍', '📖'];

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getBlogs();
        const items = Array.isArray(response) ? response : (response.blogs || []);
        setBlogs(items.slice(0, 4));
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="blog-section"><div className="blog-container"><LoadingSpinner /></div></div>;

  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Header */}
        <div className="section-row-header">
          <div className="section-row-title">
            <span className="section-row-icon">📄</span>
            <h2 className="section-row-h2">Recent Blogs</h2>
          </div>
          <Link to="/blogs" className="see-all-link">See All</Link>
        </div>

        {blogs.length === 0 && (
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>No blogs published yet.</p>
        )}

        {/* Blog Cards - Horizontal scroll on mobile */}
        <motion.div
          className="blog-scroll-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {blogs.map((blog, i) => (
            <motion.div
              key={blog._id}
              className="blog-mobile-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
                }
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.02,
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={`/blog/${blog.slug}`} className="blog-card-link">
                {/* Icon or Image */}
                <div className="blog-card-icon-box" style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                    : 'linear-gradient(135deg, #ede9fe, #ddd6fe)'
                }}>
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="blog-card-img" />
                  ) : (
                    <span className="blog-card-emoji">{BLOG_ICONS[i % BLOG_ICONS.length]}</span>
                  )}
                </div>

                {/* Content */}
                <div className="blog-card-content">
                  <h3 className="blog-card-title">{blog.title}</h3>
                  <div className="blog-card-meta">
                    <Clock size={12} />
                    <span>{blog.readTime || Math.max(2, Math.ceil((blog.content?.length || 0) / 800))} min read</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
