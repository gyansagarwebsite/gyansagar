import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import quizService from '../services/quizService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/components/WeeklyQuiz.css';

const WeeklyQuiz = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await quizService.getWeeklyQuiz();
        setStatus(response);
      } catch (error) {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) return <section className="weekly-quiz-section"><div className="container"><LoadingSpinner /></div></section>;
  if (!status || !status.isActive) return null;

  return (
    <section className="weekly-quiz-section">
      <div className="container">
        <h2 className="section-title">Weekly Quiz</h2>

        <motion.div
          className="quiz-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="quiz-header">
            <h3 className="quiz-title">{status.title || 'Weekly Loksewa & GK Quiz'}</h3>
            <div className="quiz-badge active">Active Now</div>
          </div>

          <div className="quiz-info-cards">
            <div className="info-card">
              <Clock size={20} />
              <div>
                <p className="info-label">Questions</p>
                <p className="info-value">{status.totalQuestions || 15}</p>
              </div>
            </div>
            <div className="info-card">
              <Clock size={20} />
              <div>
                <p className="info-label">Duration</p>
                <p className="info-value">150 seconds</p>
              </div>
            </div>
          </div>

          <div className="quiz-featured-items">
            <div className="featured-item">
              <CheckCircle size={20} className="featured-icon" />
              <div>
                <p className="featured-label">Weekly quiz schedule</p>
                <p className="featured-count">
                  {new Date(status.weekStart).toLocaleString()} - {new Date(status.weekEnd).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WeeklyQuiz;
