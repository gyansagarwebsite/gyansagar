import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import adminQuestionService from '../services/adminQuestionService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/QuizQuestionPicker.css';

const QuizQuestionPicker = ({ onSave, onCancel, currentQuestionIds }) => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(new Set(currentQuestionIds));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        setLoading(true);
        const recentQuestions = await adminQuestionService.getRecentQuestions();
        setQuestions(recentQuestions);
      } catch (err) {
        setError('Failed to load recent questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentQuestions();
  }, []);

  const handleToggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 15) {
          next.add(id);
        }
      }
      return next;
    });
  };

  const handleSave = () => {
    if (selected.size !== 15) {
      setError('You must select exactly 15 questions.');
      return;
    }
    onSave(Array.from(selected));
  };

  return (
    <motion.div
      className="question-picker-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="picker-content"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="picker-header">
          <h2>Select 15 Questions for the Quiz</h2>
          <div className="selection-counter">
            <span className={selected.size === 15 ? 'complete' : ''}>
              {selected.size}
            </span> / 15 selected
          </div>
          <button className="close-btn" onClick={onCancel}><X size={24} /></button>
        </div>
        {error && <p className="picker-error">{error}</p>}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="questions-list">
            {questions.map((q) => (
              <motion.div
                key={q._id}
                className={`question-item ${selected.has(q._id) ? 'selected' : ''}`}
                onClick={() => handleToggleSelect(q._id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <div className="select-indicator">
                  {selected.has(q._id) && <Check size={16} />}
                </div>
                <p className="question-text">{q.questionText}</p>
                <span className="question-category">{q.category}</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="picker-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={selected.size !== 15}
          >
            Save 15 Questions
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizQuestionPicker;
