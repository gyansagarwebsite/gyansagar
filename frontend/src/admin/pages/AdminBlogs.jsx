import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import DataTable from '../components/DataTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import adminBlogService from '../services/adminBlogService.js';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');

  const [sortOrder, setSortOrder] = useState('desc');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await adminBlogService.getBlogs(search ? { q: search } : {});
      let data = response.blogs || response || [];
      
      // Sort the data
      data = data.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      toast.error('Failed to load blogs', { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const deleteBlog = async (slug) => {
    if (window.confirm('Delete this blog?')) {
      try {
        await adminBlogService.deleteBlog(slug);
        toast.success('✅ Blog deleted successfully!', { autoClose: 2000 });
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog', { autoClose: 3000 });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const columns = [
    {
      field: 'title',
      label: 'Title'
    },
    {
      field: 'slug',
      label: 'Slug',
      width: '150px',
      render: (value) => '/' + value
    },
    {
      field: 'createdAt',
      label: 'Created',
      width: '120px',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      icon: <Edit2 size={16} />,
      label: 'Edit',
      variant: 'primary',
      onClick: (row) => navigate(`/admin/blogs/edit/${row.slug}`)
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => deleteBlog(row.slug)
    }
  ];


  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Blogging</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <Link to="/admin/blogs/add" className="btn btn-primary">
            <Plus size={18} /> New Blog
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        actions={actions}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        emptyMessage="No blogs found. Write your first blog post!"
      />
    </div>
  );
};

export default AdminBlogs;

