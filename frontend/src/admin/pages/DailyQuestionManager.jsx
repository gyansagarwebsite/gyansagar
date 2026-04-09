import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import questionService from '../../services/questionService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Trash2, Calendar, LayoutList, Link as LinkIcon } from 'lucide-react';
import './DailyQuestionManager.css';

const DailyQuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    explanation: '',
    category: 'General',
    difficulty: 'Medium'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getAllDailyQuestions();
      setQuestions(data);
    } catch (error) {
      toast.error('Failed to fetch daily questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'correctAnswer' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.questionText || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD) {
      toast.error("Please fill all question and option fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        date: formData.date,
        questionText: formData.questionText,
        options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        category: formData.category,
        difficulty: formData.difficulty
      };
      
      await questionService.upsertDailyQuestion(payload);
      toast.success("Daily question saved successfully!");
      fetchQuestions();
      
      // Reset form but keep date
      setFormData(prev => ({
        ...prev,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        explanation: ''
      }));
    } catch (error) {
      toast.error(error.message || "Failed to save daily question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specific daily question?")) return;
    
    try {
      await questionService.deleteDailyQuestion(id);
      toast.success("Question deleted");
      fetchQuestions();
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const copyShareLink = (id) => {
    const url = `${window.location.origin}/?dq=${id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page fade-in">
      <div className="dq-manager-header">
        <h1>Today's Question Manager</h1>
        <p>Set a specific question to appear on the homepage for a specific date, and generate Facebook share links.</p>
      </div>

      <div className="admin-grid two-columns">
        <section className="admin-card form-section">
          <h2><Calendar size={20} className="icon-mr"/> Create Daily Question</h2>
          <form className="dq-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Designated Date *</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Question Text *</label>
              <textarea 
                name="questionText"
                placeholder="What is the question?"
                value={formData.questionText}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="options-grid-2x2">
              <div className="form-group">
                <label>Option A *</label>
                <input type="text" name="optionA" value={formData.optionA} onChange={handleInputChange} placeholder="Option 1" required />
              </div>
              <div className="form-group">
                <label>Option B *</label>
                <input type="text" name="optionB" value={formData.optionB} onChange={handleInputChange} placeholder="Option 2" required />
              </div>
              <div className="form-group">
                <label>Option C *</label>
                <input type="text" name="optionC" value={formData.optionC} onChange={handleInputChange} placeholder="Option 3" required />
              </div>
              <div className="form-group">
                <label>Option D *</label>
                <input type="text" name="optionD" value={formData.optionD} onChange={handleInputChange} placeholder="Option 4" required />
              </div>
            </div>

            <div className="form-group correct-answer-group">
              <label>Correct Answer *</label>
              <select name="correctAnswer" value={formData.correctAnswer} onChange={handleInputChange}>
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea 
                name="explanation"
                placeholder="Why is it correct?"
                value={formData.explanation}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Daily Question'}
            </button>
          </form>
        </section>

        <section className="admin-card history-section">
          <h2><LayoutList size={20} className="icon-mr"/> Previous Questions</h2>
          <div className="dq-history-list">
            {questions.length === 0 ? (
              <p className="no-data">No daily questions found.</p>
            ) : (
              questions.map(q => (
                <div key={q._id} className="history-item">
                  <div className="history-info">
                    <span className="history-date">
                      {new Date(q.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <p className="history-qtext">{q.questionText}</p>
                  </div>
                  <div className="history-actions">
                    <button className="icon-btn copy" onClick={() => copyShareLink(q._id)} title="Copy Question Link">
                      <LinkIcon size={16} /> Copy Link
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(q._id)} title="Delete Question">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DailyQuestionManager;
