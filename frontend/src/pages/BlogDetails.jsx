import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock } from 'lucide-react';
import blogService from '../services/blogService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/pages/BlogDetails.css';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlog(slug);
        setBlog(response);
      } catch (err) {
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0); // Reset scroll on load
  }, [slug]);

  if (loading) return <div className="container blog-details-page"><LoadingSpinner /></div>;
  if (error || !blog) return <div className="container blog-details-page"><p>{error || 'Blog not found'}</p></div>;

  return (
    <div className="container blog-details-page">
      <Link to="/blogs" className="back-link">
        <ArrowLeft size={20} /> Back to Blogs
      </Link>
      
      <article className="blog-details card">
        {blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} /> : null}
        
        <div className="blog-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span><User size={16} /> {blog.author || 'Gyan Sagar Admin'}</span>
            <span><Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span><Clock size={16} /> {Math.ceil((blog.content || '').length / 500)} min read</span>
          </div>
        </div>

        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};


export default BlogDetails;

