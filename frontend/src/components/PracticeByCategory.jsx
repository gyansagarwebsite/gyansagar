import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  Trophy,
  BookOpen,
  Users,
  Zap,
  Settings,
  ShieldCheck,
  Building2,
  Activity
} from 'lucide-react';
import { GENERAL_CATEGORIES, EXAM_POSTS } from '../constants/categories';
import '../styles/components/PracticeByCategory.css';

// Icon Map helper to convert strings back to components
const IconMap = { Zap, Settings, Building2, Activity, ShieldCheck, Trophy };

const PracticeByCategory = ({ initialTab = 'GENERAL', onCategorySelect, showTitle = true }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // States for randomized display on Homepage
  const [displayedCategories, setDisplayedCategories] = useState(GENERAL_CATEGORIES);
  const [displayedPosts, setDisplayedPosts] = useState(EXAM_POSTS);

  useEffect(() => {
    if (showTitle) {
      // Show fixed first 6 for Homepage
      setDisplayedCategories(GENERAL_CATEGORIES.slice(0, 6));
      setDisplayedPosts(EXAM_POSTS.slice(0, 6));
    } else {
      // Show all on Quiz Page
      setDisplayedCategories(GENERAL_CATEGORIES);
      setDisplayedPosts(EXAM_POSTS);
    }
  }, [showTitle]);

  const handleSelect = (category) => {
    // If onCategorySelect is provided (like in QuizPage), use it.
    // Otherwise (like on Home page), navigate to QuizPage with params.
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      navigate(`/quiz?view=SETS&cat=${category.name}&tab=${activeTab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCategories = () => (
    <div className="quiz-container fade-in">
      <div className="quiz-categories-grid">
        {displayedCategories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            className="premium-category-card"
            onClick={() => handleSelect(cat)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -15, scale: 1.02 }}
            transition={{
              duration: 0.3,
              delay: idx * 0.1,
              scale: { type: "spring", stiffness: 400, damping: 25 },
              y: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <img src={cat.bg} alt={cat.name} className="pcc-bg-image" />
            <div className="pcc-overlay" />

            <div className="pcc-content">
              <div className="pcc-top">
                <div className="pcc-icon-container">
                  {cat.icon}
                </div>
                <div className="pcc-badge">
                  100+ Questions
                </div>
              </div>

              <div className="pcc-info-area">
                <h2 className="pcc-title">{cat.name}</h2>
                <div className="pcc-stats-row">
                  <div className="pcc-stat-item">
                    <Users size={16} /> Multiple Levels
                  </div>
                  <div className="pcc-stat-item">
                    <BookOpen size={16} /> 10 Sets
                  </div>
                  <div className="pcc-stat-item">
                    <Clock size={16} /> 5 mins
                  </div>
                </div>
              </div>

              <div className="pcc-action-bar">
                <span className="pcc-action-text">Start Practice</span>
                <div className="pcc-arrow">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderExamPosts = () => (
    <div className="quiz-container fade-in">
      <div className="exam-posts-grid">
        {displayedPosts.map((post, idx) => (
          <motion.div
            key={post.name}
            className="exam-post-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -18, scale: 1.03 }}
            transition={{
              duration: 0.3,
              delay: idx * 0.1,
              scale: { type: "spring", stiffness: 400, damping: 25 },
              y: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <div className="epc-icon-wrap" style={{ color: post.color }}>
              {IconMap[post.icon] ? (
                (() => {
                  const IconComponent = IconMap[post.icon];
                  return <IconComponent size={40} />;
                })()
              ) : <Zap size={40} />}
            </div>
            <h2 className="epc-title">{post.name}</h2>
            <p className="epc-desc">{post.desc}</p>
            <div className="epc-badge">
              100+ Questions
            </div>
            <button className="epc-btn" onClick={() => handleSelect(post)}>
              Explore Now <ChevronRight size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="practice-by-category-section" style={{ padding: '2rem 0' }}>
      <div className="quiz-container" style={{ marginBottom: '2rem' }}>
        {showTitle && (
          <div className="section-row-header">
            <div className="section-row-title">
              <span className="section-row-icon">📚</span>
              <h2 className="section-row-h2">Practice by Category</h2>
            </div>
            <Link to="/quiz" className="see-all-link">View All</Link>
          </div>
        )}

        <div className="quiz-tabs" style={{ marginTop: showTitle ? '1rem' : '0' }}>
          <button
            className={`quiz-tab ${activeTab === 'GENERAL' ? 'active' : ''}`}
            onClick={() => setActiveTab('GENERAL')}
          >
            General Categories
          </button>
          <button
            className={`quiz-tab ${activeTab === 'EXAMS' ? 'active' : ''}`}
            onClick={() => setActiveTab('EXAMS')}
          >
            Loksewa Posts
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'GENERAL' ? renderCategories() : renderExamPosts()}
      </AnimatePresence>
    </div>
  );
};


export default PracticeByCategory;
