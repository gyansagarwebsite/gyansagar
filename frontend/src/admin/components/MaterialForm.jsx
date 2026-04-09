import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminMaterialService from '../services/adminMaterialService.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const MaterialForm = ({ materialId = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pdfFile: null
  });
  const [existingPdfUrl, setExistingPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEditMode = !!materialId;

  useEffect(() => {
    if (isEditMode) {
      const fetchMaterial = async () => {
        try {
          setFetching(true);
          const data = await adminMaterialService.getMaterial(materialId);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            pdfFile: null
          });
          setExistingPdfUrl(data.pdfUrl || '');
        } catch (err) {
          toast.error('Failed to load material data');
        } finally {
          setFetching(false);
        }
      };
      fetchMaterial();
    }
  }, [materialId, isEditMode]);

  const handleFileChange = (e) => {
    setFormData({...formData, pdfFile: e.target.files[0]});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error('Please enter material title');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter material description');
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Please select a category');
      setLoading(false);
      return;
    }

    // PDF is required only in Add mode
    if (!isEditMode && !formData.pdfFile) {
      toast.error('Please select a PDF file');
      setLoading(false);
      return;
    }

    try {
      let finalPdfUrl = existingPdfUrl;

      // Upload new PDF if provided
      if (formData.pdfFile) {
        const uploadResponse = await adminMaterialService.uploadMaterialPdf(formData.pdfFile);
        finalPdfUrl = uploadResponse?.url;
        
        if (!finalPdfUrl) {
          throw new Error('PDF upload did not return a valid URL');
        }
      }

      const materialPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pdfUrl: finalPdfUrl
      };

      if (isEditMode) {
        await adminMaterialService.updateMaterial(materialId, materialPayload);
        toast.success('✅ Material updated successfully!', { autoClose: 2000 });
        navigate('/admin/materials');
      } else {
        await adminMaterialService.createMaterial(materialPayload);
        toast.success('✅ Material uploaded successfully!', { autoClose: 2000 });
        setFormData({
          title: '',
          description: '',
          category: '',
          pdfFile: null
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save material', { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="material-form">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
          placeholder="Material title"
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
          placeholder="Brief description of material"
          required
        />
      </div>

      <div className="form-group">
        <label>Category *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Select category</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="GK">GK</option>
          <option value="Loksewa">Loksewa</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Current Affairs">Current Affairs</option>
          <option value="Constitution">Constitution</option>
          <option value="World GK">World GK</option>
          <option value="Literature">Literature</option>
          <option value="Computer">Computer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>PDF File {isEditMode ? '(Optional)' : '*'}</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required={!isEditMode}
        />
        {formData.pdfFile ? (
          <p className="file-name">{formData.pdfFile.name}</p>
        ) : isEditMode && existingPdfUrl ? (
          <p className="file-name current-file">Current File: {existingPdfUrl.split('/').pop()}</p>
        ) : null}
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <LoadingSpinner size="small" /> : isEditMode ? 'Update Material' : 'Upload Material'}
      </button>
    </form>
  );
};

export default MaterialForm;



