import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import blogService from '../services/blogService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import '../styles/pages/BlogsPage.css';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogs();
        setBlogs(Array.isArray(response) ? response : (response.blogs || []));
      } catch (err) {
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) return <div className="blogs-loading-wrapper"><LoadingSpinner /></div>;
  if (error) return <div className="blogs-page-container"><p className="blogs-empty">{error}</p></div>;

  return (
    <div className="blogs-page-container">
      <header className="blogs-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="blogs-header-title">Blogs & Posts</h1>
          <p className="blogs-header-subtitle">Your ultimate destination for Loksewa preparation tips, syllabus updates, and curriculum-aligned study materials.</p>
        </motion.div>
      </header>

      <motion.div
        className="premium-blogs-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {blogs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="blogs-empty"
            >
              No professional articles available at the moment. Check back soon!
            </motion.p>
          ) : (
            blogs.map((blog) => (
              <motion.article
                key={blog._id}
                className="blog-card-premium"
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="blog-card-img-wrapper">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="blog-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {blog.category && (
                    <div className="card-category-badge">
                      <Tag size={12} style={{ marginRight: '4px' }} />
                      {blog.category}
                    </div>
                  )}
                </div>

                <div className="blog-card-content">
                  <h2 className="blog-card-title">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">
                    {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...' : 'Dive into our latest professional guide for Loksewa preparation...')}
                  </p>

                  <div className="blog-card-footer">
                    <div className="blog-card-meta">
                      <span className="meta-author">
                        <User size={14} style={{ marginRight: '6px' }} />
                        {blog.author || 'Gyan Sagar'}
                      </span>
                      <span className="meta-date">
                        <Calendar size={14} style={{ marginRight: '6px' }} />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="read-more-btn">
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BlogsPage;
