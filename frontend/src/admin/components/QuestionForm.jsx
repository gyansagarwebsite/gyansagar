import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminQuestionService from '../services/adminQuestionService.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import { ALL_CATEGORY_NAMES } from '../../constants/categories.js';

const QuestionForm = ({ isEdit = false, questionId }) => {
  const { id } = useParams(); // Fallback for direct route

  const effectiveId = questionId || id;

  useEffect(() => {
    const loadQuestion = async () => {
      if (isEdit && effectiveId) {
        try {
          setLoading(true);
          const data = await adminQuestionService.getQuestion(effectiveId);
          setFormData({
            questionText: data.questionText || '',
            imageUrl: data.imageUrl || '',
            options: data.options || ['', '', '', ''],
            correctAnswer: data.correctAnswer !== undefined ? data.correctAnswer.toString() : '',
            category: data.category || '',
            questionTextNP: data.questionTextNP || '',
            optionsNP: data.optionsNP && data.optionsNP.length === 4 ? data.optionsNP : ['', '', '', ''],
          });
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        } catch (err) {
          toast.error('Failed to load question');
        } finally {
          setLoading(false);
        }
      }
    };
    loadQuestion();
  }, [isEdit, effectiveId]);
  const [formData, setFormData] = useState({
    questionText: '',
    imageUrl: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: '',
    questionTextNP: '',
    optionsNP: ['', '', '', ''],
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleOptionChange = useCallback((index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({...formData, options: newOptions});
  }, [formData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Placeholder for Cloudinary upload
      setImagePreview(URL.createObjectURL(file));
      setFormData({...formData, imageUrl: file.name}); // Will be replaced with Cloudinary URL
    }
  };

  const handleOptionNPChange = useCallback((index, value) => {
    const newOptions = [...formData.optionsNP];
    newOptions[index] = value;
    setFormData({...formData, optionsNP: newOptions});
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.questionText.trim()) {
      toast.error('Please enter question text');
      setLoading(false);
      return;
    }

    if (formData.options.some(opt => opt.trim() === '')) {
      toast.error('Please fill all four options');
      setLoading(false);
      return;
    }

    if (formData.correctAnswer === '') {
      toast.error('Please select the correct answer');
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Please select a category');
      setLoading(false);
      return;
    }

    // Validate Nepali options: if any NP option is filled, all 4 must be filled
    const npOptsFilled = formData.optionsNP.filter(o => o.trim() !== '').length;
    if (npOptsFilled > 0 && npOptsFilled < 4) {
      toast.error('Please fill all 4 Nepali options (or leave them all empty)');
      setLoading(false);
      return;
    }

    // Build payload — only include Nepali fields if they have content
    const payload = { ...formData };
    if (!formData.questionTextNP.trim()) {
      payload.questionTextNP = '';
    }
    if (npOptsFilled === 0) {
      payload.optionsNP = [];
    }

    try {
      if (isEdit && effectiveId) {
        await adminQuestionService.updateQuestion(effectiveId, payload);
        toast.success('✅ Question updated successfully!', { autoClose: 2000 });
      } else {
        await adminQuestionService.createQuestion(payload);
        toast.success('✅ Question created successfully!', { autoClose: 2000 });
      }
      setTimeout(() => {
        navigate('/admin/questions');
      }, 1500);
    } catch (err) {
      console.error('Error creating/updating question:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save question';
      toast.error(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="question-form">
      {/* ── English Section ── */}
      <div className="form-section-label" style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        🇺🇸 English (Required)
      </div>

      <div className="form-group">
        <label>Question Text *</label>
        <textarea
          value={formData.questionText}
          onChange={(e) => setFormData({...formData, questionText: e.target.value})}
          rows="3"
          placeholder="Enter question text here..."
          required
        />
      </div>

      <div className="form-group">
        <label>Image (Optional)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" onClick={() => setImagePreview(null)}>
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="options-grid">
        {formData.options.map((option, index) => (
          <div key={index} className="form-group">
            <label>Option {String.fromCharCode(65 + index)} *</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
            />
          </div>
        ))}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Correct Answer *</label>
          <select 
            value={formData.correctAnswer}
            onChange={(e) => setFormData({...formData, correctAnswer: parseInt(e.target.value)})}
            required
          >
            <option value="">Select correct answer</option>
            {formData.options.map((_, index) => (
              <option key={index} value={index}>
                Option {String.fromCharCode(65 + index)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            <option value="">Select category</option>
            {ALL_CATEGORY_NAMES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Nepali Translation Section ── */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
        borderRadius: '12px',
        border: '1px solid #fcd34d',
      }}>
        <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          🇳🇵 नेपाली अनुवाद (Optional — Fill to enable Nepali language)
        </div>

        <div className="form-group">
          <label>प्रश्न (Nepali Question Text)</label>
          <textarea
            value={formData.questionTextNP}
            onChange={(e) => setFormData({...formData, questionTextNP: e.target.value})}
            rows="3"
            placeholder="यहाँ प्रश्न नेपालीमा लेख्नुहोस्..."
            lang="ne"
            dir="ltr"
          />
        </div>

        <div className="options-grid">
          {formData.optionsNP.map((option, index) => (
            <div key={index} className="form-group">
              <label>विकल्प {String.fromCharCode(65 + index)} (Nepali)</label>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionNPChange(index, e.target.value)}
                placeholder={`विकल्प ${String.fromCharCode(65 + index)} नेपालीमा`}
                lang="ne"
              />
            </div>
          ))}
        </div>

        <p style={{ color: '#78350f', fontSize: '0.8rem', margin: '0.5rem 0 0' }}>
          ℹ️ If Nepali options are left empty, English will be shown for Nepali users as a fallback.
        </p>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <LoadingSpinner size="small" /> : (isEdit ? 'Update Question' : 'Create Question')}
      </button>
    </form>
  );
};

export default QuestionForm;

