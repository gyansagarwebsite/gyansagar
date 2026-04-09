import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import questionService from '../services/questionService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import '../styles/components/TrendingQuestions.css';

const TrendingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { questions: fetchedQuestions } = await questionService.getQuestions({ limit: 4 });
        const formattedQuestions = fetchedQuestions.map(q => ({
          id: q._id,
          text: q.questionText,
          category: q.category,
          date: new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          slug: q.slug,
        }));
        setQuestions(formattedQuestions);
      } catch (err) {
        setError('Failed to load trending questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) return <div className="trending-section"><div className="container"><LoadingSpinner /></div></div>;
  if (error || questions.length === 0) return <div className="trending-section"><div className="container"><p>{error || 'No trending questions'}</p></div></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="trending-section">
      <div className="container">
        <h2 className="section-title">Trending Questions</h2>

        <motion.div
          className="trending-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {questions.map((question, index) => (
            <Link to={`/question/${question.slug}`} key={question.id} className="trending-item-link">
              <motion.div
                className="trending-item"
                variants={itemVariants}
                whileHover={{ x: 8, scale: 1.01, backgroundColor: 'rgba(45, 63, 143, 0.04)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="trending-icon">{index + 1}</div>
                <div className="trending-content">
                  <p className="trending-text">{question.text}</p>
                  <div className="trending-meta">
                    <span className="trending-category">{question.category}</span>
                    <span className="trending-date">{question.date}</span>
                  </div>
                </div>
                <ArrowRight size={20} className="trending-arrow" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingQuestions;
