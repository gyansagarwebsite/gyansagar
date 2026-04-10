import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import DataTable from '../components/DataTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import adminMaterialService from '../services/adminMaterialService.js';

const AdminMaterials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = search ? { q: search } : {};
      const response = await adminMaterialService.getMaterials(params);
      let data = response.materials || response || [];
      
      // Sort the data
      data = data.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      toast.error('Failed to load materials', { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const deleteMaterial = async (id) => {
    if (window.confirm('Delete this material?')) {
      try {
        await adminMaterialService.deleteMaterial(id);
        toast.success('✅ Material deleted successfully!', { autoClose: 2000 });
        fetchMaterials();
      } catch (error) {
        toast.error('Failed to delete material', { autoClose: 3000 });
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
      field: 'category',
      label: 'Category',
      width: '120px'
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
      onClick: (row) => navigate(`/admin/materials/edit/${row._id}`)
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => deleteMaterial(row._id)
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Study Materials</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <Link to="/admin/materials/add" className="btn btn-primary">
            <Plus size={18} /> Upload Material
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={materials}
        actions={actions}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        emptyMessage="No materials found. Upload your first study material!"
      />
    </div>
  );
};

export default AdminMaterials;

