import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminBlogService from '../services/adminBlogService.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const BlogForm = ({ slug = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    imageUrl: '',
    excerpt: '',
    category: 'General',
    author: 'Gyan Sagar Team'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'General',
    'Preparation Tips',
    'Current Affairs',
    'Syllabus Analysis',
    'General Knowledge',
    'Writing Skills',
    'Soft Skills',
    'Exam Updates'
  ];

  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          setFetching(true);
          const data = await adminBlogService.getBlog(slug);
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            content: data.content || '',
            imageUrl: data.imageUrl || '',
            excerpt: data.excerpt || '',
            category: data.category || 'General',
            author: data.author || 'Gyan Sagar Team'
          });
          setImagePreview(data.imageUrl);
        } catch (err) {
          toast.error('Failed to load blog data');
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    }
  }, [slug]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    // Only auto-generate slug if we're not in edit mode
    // or if the user explicitly wants to rename the slug (less common)
    setFormData({
      ...formData,
      title,
      slug: slug ? formData.slug : generateSlug(title)
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({...formData, imageUrl: file.name}); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error('Please enter blog title');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please write the blog content');
      setLoading(false);
      return;
    }

    try {
      if (slug) {
        await adminBlogService.updateBlog(slug, formData);
        toast.success('✅ Blog updated successfully!', { autoClose: 2000 });
      } else {
        await adminBlogService.createBlog(formData);
        toast.success('✅ Blog published successfully!', { autoClose: 2000 });
      }
      
      // Navigate back to blogs list after a short delay
      setTimeout(() => navigate('/admin/blogs'), 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${slug ? 'update' : 'create'} blog`, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <div className="form-row">


        <div className="form-group flex-1">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            required
            placeholder="e.g. Loksewa Preparation Tips"
          />
        </div>

        <div className="form-group" style={{minWidth: '200px'}}>
          <label>Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Slug (Permalinks) *</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          required
          placeholder="auto-generated-slug"
          disabled={!!slug} // Don't allow slug changes during edit to prevent broken links
        />
        {slug && <small className="text-muted">Slug cannot be changed once published.</small>}
      </div>

      <div className="form-group">
        <label>Featured Image URL (Recommended for high-res)</label>
        <input 
          type="text"
          value={formData.imageUrl}
          onChange={(e) => {
            setFormData({...formData, imageUrl: e.target.value});
            setImagePreview(e.target.value);
          }}
          placeholder="Paste Unsplash or Cloudinary URL here..."
        />
        <div style={{marginTop: '8px', fontSize: '13px', color: '#666'}}>
          - Or upload a local file: 
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{marginLeft: '10px', fontSize: '12px'}}
          />
        </div>
        {imagePreview && (
          <div className="image-preview" style={{marginTop: '15px'}}>
            <img src={imagePreview} alt="Preview" style={{borderRadius: '8px', maxHeight: '200px'}} />
            <button type="button" className="btn-remove" onClick={() => {
              setImagePreview(null);
              setFormData({...formData, imageUrl: ''});
            }}>
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Short Excerpt (Shows in blog list) *</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          rows="3"
          placeholder="A brief summary to entice readers..."
          required
        />
      </div>

      <div className="form-group">
        <label>Full Content (HTML Supported) *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows="12"
          placeholder="Write your professional blog content here. You can use <h2>, <h3> and <p> tags for formatting."
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn admin-premium-action" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : slug ? 'Update Blog Post' : 'Publish Professional Blog'}
        </button>
      </div>
    </form>
  );
};


export default BlogForm;

