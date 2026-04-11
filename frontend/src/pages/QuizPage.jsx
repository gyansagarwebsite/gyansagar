import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Trophy, 
  Target, 
  Users, 
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  GraduationCap,
  Zap,
  HelpCircle
} from 'lucide-react';
import questionService from '../services/questionService';
import publicQuizService from '../services/publicQuizService';
import LoadingSpinner from '../admin/components/LoadingSpinner';
import WeeklyQuizChallenge from '../components/WeeklyQuizChallenge';
import PracticeByCategory from '../components/PracticeByCategory';
import '../styles/pages/QuizPage.css';
import { shuffleQuestions } from '../utils/quizUtils';
import { translateQuestions } from '../utils/translateUtils';
import useQuizProtection from '../hooks/useQuizProtection';

import { GENERAL_CATEGORIES, EXAM_POSTS } from '../constants/categories';
import ProtectionOverlay from '../components/common/ProtectionOverlay';

// Constants

const VIEWS = {
  CATEGORIES: 'CATEGORIES',
  SETS: 'SETS',
  QUIZ: 'QUIZ',
  RESULTS: 'RESULTS',
  WEEKLY: 'WEEKLY'
};

const QuizPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isProtected, protectedRef } = useQuizProtection();
  
  const [view, setView] = useState(searchParams.get('view') || VIEWS.CATEGORIES);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'GENERAL'); // 'GENERAL' or 'EXAMS'

  // Initialize selectedCategory from URL if present
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const catName = searchParams.get('cat');
    if (!catName) return null;
    return [...GENERAL_CATEGORIES, ...EXAM_POSTS].find(c => c.name === catName) || null;
  });

  const [selectedSet, setSelectedSet] = useState(parseInt(searchParams.get('set')) || null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false); 
  const [error, setError] = useState(null);
  const [weeklyStatus, setWeeklyStatus] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'US'); // 'US' = English, 'NP' = Nepali
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const checkWeekly = async () => {
      try {
        const status = await publicQuizService.getWeeklyQuizStatus();
        setWeeklyStatus(status);
      } catch (err) {}
    };
    checkWeekly();
  }, []);

  const updateQueryParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) newParams.delete(key);
      else newParams.set(key, value);
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCategorySelect = (category) => {
    setTempCategory(category);
    setShowLanguageModal(true);
  };

  const confirmLanguage = (lang) => {
    setSelectedLanguage(lang);
    setSelectedCategory(tempCategory);
    setShowLanguageModal(false);
    updateQueryParams({
      view: VIEWS.SETS,
      cat: tempCategory.name,
      lang: lang
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadSetQuestions = useCallback(async (catName, setNumber, lang) => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionService.getQuestions({
        category: catName,
        limit: 10,
        page: setNumber,
      });

      if (data.questions && data.questions.length > 0) {
        let finalQuestions = shuffleQuestions(data.questions);
        if (lang === 'NP') {
          setLoading(false);
          setTranslating(true);
          try {
            finalQuestions = await translateQuestions(finalQuestions, 'ne');
          } catch (_) {
          } finally {
            setTranslating(false);
          }
        }
        setQuestions(finalQuestions);
        setCurrentIndex(0);
        setUserAnswers({});
        setTimeLeft(300);
      } else {
        setError('Not enough questions in this set yet. Try another one!');
      }
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle manual View changes via URL (Back button)
  useEffect(() => {
    const viewFromParam = searchParams.get('view') || VIEWS.CATEGORIES;
    const catNameFromParam = searchParams.get('cat');
    const setFromParam = searchParams.get('set');
    const langFromParam = searchParams.get('lang') || 'US';
    const tabFromParam = searchParams.get('tab') || 'GENERAL';

    setView(viewFromParam);
    setSelectedLanguage(langFromParam);
    setActiveTab(tabFromParam);

    if (catNameFromParam) {
      const cat = [...GENERAL_CATEGORIES, ...EXAM_POSTS].find(c => c.name === catNameFromParam);
      if (cat) {
        setSelectedCategory(cat);
        setTempCategory(cat);
      }
    } else {
      setSelectedCategory(null);
      setTempCategory(null);
    }

    if (setFromParam) {
      const setNum = parseInt(setFromParam);
      setSelectedSet(setNum);
      
      // If we are in QUIZ view but questions are empty (e.g. page refresh or back button), trigger fetch
      // Only trigger if not currently loading and no error has been set yet
      if (viewFromParam === VIEWS.QUIZ && questions.length === 0 && !loading && !error && catNameFromParam) {
        loadSetQuestions(catNameFromParam, setNum, langFromParam);
      }
    } else {
      setSelectedSet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, questions.length, error, loadSetQuestions]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (view === VIEWS.QUIZ && questions.length > 0 && !loading && !translating && !error) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // End quiz when time is up
            setView(VIEWS.RESULTS);
            updateQueryParams({ view: VIEWS.RESULTS });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, questions.length, loading, translating, error, updateQueryParams]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSetSelect = async (setNumber) => {
    setSelectedSet(setNumber);
    updateQueryParams({
      view: VIEWS.QUIZ,
      set: setNumber
    });
    loadSetQuestions(tempCategory.name, setNumber, selectedLanguage);
  };

  const handleOptionSelect = (optIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView(VIEWS.RESULTS);
      updateQueryParams({ view: VIEWS.RESULTS });
    }
  };

  const handleBackToSets = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    updateQueryParams({
      view: VIEWS.SETS,
      set: null
    });
  };

  const handleBackToCategories = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    updateQueryParams({
      view: VIEWS.CATEGORIES,
      cat: null,
      set: null,
      lang: null
    });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  /* --- RENDERING --- */

  const renderLanguageModal = () => (
    <AnimatePresence>
      {showLanguageModal && (
        <div className="modal-overlay">
          <motion.div 
            className="language-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button className="modal-close" onClick={() => setShowLanguageModal(false)}>
              <XCircle size={24} />
            </button>
            <h3 className="modal-title">Select Language</h3>
            
            <div className="lang-options">
              <button className="lang-option" onClick={() => confirmLanguage('NP')}>
                <div className="lang-flag">NP</div>
                <div className="lang-info">
                  <h4>नेपाली</h4>
                  <p>Practice in Nepali Language</p>
                </div>
                <div className="lang-arrow"><ChevronRight /></div>
              </button>

              <button className="lang-option" onClick={() => confirmLanguage('US')}>
                <div className="lang-flag">US</div>
                <div className="lang-info">
                  <h4>English</h4>
                  <p>Practice in English Language</p>
                </div>
                <div className="lang-arrow"><ChevronRight /></div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderHeader = () => (
    <div className="quiz-hero">
      <div className="quiz-container">
        <h1 className="quiz-hero-title">Practice by Category</h1>
        <p className="quiz-hero-subtitle">
          Choose from our comprehensive collection of subject-wise practice sets
        </p>

        {/* Weekly Quiz Banner */}
        {weeklyStatus?.isActive && (
          <motion.div 
            className="weekly-quiz-active-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="wqa-content">
              <div className="wqa-icon"><Trophy size={28} /></div>
              <div className="wqa-text">
                <h3>Weekly Quiz is LIVE!</h3>
                <p>A new competitive challenge is active now. Compete for the leaderboard!</p>
              </div>
            </div>
            <button className="wqa-btn" onClick={() => updateQueryParams({ view: VIEWS.WEEKLY })}>
              Participate Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderSelectionPhase = () => (
    <PracticeByCategory 
      initialTab={activeTab} 
      onCategorySelect={handleCategorySelect} 
      showTitle={false}
    />
  );

/* Selection Phase is now handled by PracticeByCategory component */

  const renderSets = () => {
    if (!selectedCategory) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><LoadingSpinner /></div>;

    // If we're in Exam Tab, use specialized layout
    if (activeTab === 'EXAMS') return renderExamSets();

    return (
      <div className="quiz-container fade-in">
        <div className="quiz-sets-header" style={{ paddingTop: '5rem' }}>
          <button className="back-btn" onClick={handleBackToCategories}>
            <ChevronLeft size={18} /> Back to Categories
          </button>
          <h2 style={{ color: '#0b224d' }}>{selectedCategory.name} Sets</h2>
        </div>

        <div className="quiz-sets-grid">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i} 
              className="set-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ 
                duration: 0.3,
                delay: i * 0.08,
                scale: { type: "spring", stiffness: 400, damping: 25 },
                y: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <div className={`set-card-header`} style={{ backgroundColor: selectedCategory.color }}>
                <div className="set-badge"><Target size={24} /> Set {i + 1}</div>
                <div className="set-cat-name">{selectedCategory.name}</div>
                <div className="set-meta">
                  <span className="set-meta-item"><Clock size={14} /> 5 Min</span>
                  <span className="set-meta-item"><AlertCircle size={14} /> Medium</span>
                </div>
              </div>
              <div className="set-card-body">
                <div className="set-stats-row">
                  <div className="stat-box">
                    <div className="stat-label">Success Rate</div>
                    <div className="stat-value">{90 + (i % 5)}%</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Questions</div>
                    <div className="stat-value">10</div>
                  </div>
                </div>
                <div className="set-footer">
                  <div className="attempts-text"><Users size={14} /> {2 + (i % 3)}k attempts</div>
                  <button className="start-set-btn" onClick={() => handleSetSelect(i + 1)}>
                    Start Quiz <Play size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderExamSets = () => {
    if (!selectedCategory) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><LoadingSpinner /></div>;

    return (
      <div className="quiz-container fade-in">
        <div className="quiz-sets-header" style={{ paddingTop: '5rem' }}>
          <button className="back-btn" onClick={handleBackToCategories}>
            <ChevronLeft size={18} /> Back to Exam Posts
          </button>
          <h2 style={{ color: '#0b224d', fontSize: '2.5rem', fontWeight: 800, marginTop: '1.5rem' }}>
            {selectedCategory.name} Quiz Lists
          </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Prepare for the Loksewa Exam with Expert Resources
        </p>
      </div>

      <div className="quiz-sets-grid" style={{ marginTop: '4rem' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i} 
            className="exam-set-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12, scale: 1.03 }}
            transition={{ 
              duration: 0.3,
              delay: i * 0.1,
              scale: { type: "spring", stiffness: 400, damping: 25 },
              y: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <div className="esc-header" style={{ backgroundColor: selectedCategory.color || '#0084ff' }}>
              <GraduationCap className="esc-mortarboard" size={48} />
              <div className="esc-set-num">Set {i + 1}</div>
              <div className="esc-exam-name">{selectedCategory.name}</div>
            </div>
            
            <div className="esc-meta">
              <div className="esc-meta-item"><Clock size={16} /> 5 Min</div>
              <div className="esc-meta-item"><Zap size={16} color="#fbbf24" fill="#fbbf24" /> Medium</div>
            </div>

            <div className="esc-body">
              <div className="esc-stats-row">
                <div className="esc-stat-box">
                  <div className="esc-stat-label">Success Rate</div>
                  <div className="esc-stat-value">{75 + (i * 2)}%</div>
                </div>
                <div className="esc-stat-box">
                  <div className="esc-stat-label">Total Questions</div>
                  <div className="esc-stat-value">10</div>
                </div>
              </div>
              <div className="esc-footer">
                <div className="esc-attempts"><Users size={18} /> 3.8k attempts</div>
                <button className="esc-start-btn" onClick={() => handleSetSelect(i + 1)}>
                  Start Quiz <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    );
  };

  const renderWeekly = () => (
    <div className="quiz-container fade-in quiz-protection">
      <WeeklyQuizChallenge onBack={handleBackToCategories} />
    </div>
  );

  const renderQuiz = () => {
    const q = questions[currentIndex];
    
    if (!q) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><LoadingSpinner /></div>;

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="quiz-container fade-in">
        <div className="quiz-active-interface quiz-protection">
          <div className="quiz-top-stats">
            <div className="quiz-stat-card">
              <div className="qsc-icon-wrapper"><HelpCircle size={20}/></div>
              <div className="qsc-label">Question</div>
              <div className="qsc-value">{currentIndex + 1}/{questions.length}</div>
            </div>
            <div className="quiz-stat-card">
              <div className="qsc-icon-wrapper"><CheckCircle2 size={20}/></div>
              <div className="qsc-label">Answered</div>
              <div className="qsc-value">{Object.keys(userAnswers).length}</div>
            </div>
            <div className="quiz-stat-card">
              <div className="qsc-icon-wrapper"><Clock size={20}/></div>
              <div className="qsc-label">Time Left</div>
              <div className="qsc-value">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="quiz-question-area">
            <h2 className="quiz-question-text">{q.questionText}</h2>
            
            <div className="quiz-options-list">
              {q.options.map((opt, idx) => {
                const isSelected = userAnswers[currentIndex] === idx;
                const isCorrect = idx === q.correctAnswer;
                const isAnswered = userAnswers[currentIndex] !== undefined;

                let statusClass = '';
                if (isAnswered) {
                  if (isCorrect) statusClass = 'correct';
                  else if (isSelected) statusClass = 'incorrect';
                }

                return (
                  <div 
                    key={idx}
                    className={`quiz-option-item ${isSelected ? 'selected' : ''} ${statusClass}`}
                    onClick={() => !isAnswered && handleOptionSelect(idx)}
                    style={{ cursor: isAnswered ? 'default' : 'pointer' }}
                  >
                    <div className="quiz-option-radio">
                      {isAnswered && isCorrect && <CheckCircle2 size={18} className="status-icon-check" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="status-icon-x" />}
                    </div>
                    <div className="quiz-option-text" style={{ flexGrow: 1 }}>
                      <span style={{ fontWeight: 700, marginRight: '1rem' }}>{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="quiz-nav-footer">
            <button 
              className="back-btn" 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            {currentIndex === questions.length - 1 ? (
              <button 
                className="start-set-btn" 
                style={{ backgroundColor: '#22c55e' }}
                disabled={userAnswers[currentIndex] === undefined}
                onClick={() => updateQueryParams({ view: VIEWS.RESULTS })}
              >
                Submit Quiz <CheckCircle2 size={18} />
              </button>
            ) : (
              <button 
                className="start-set-btn"
                disabled={userAnswers[currentIndex] === undefined}
                onClick={handleNext}
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (questions.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><LoadingSpinner /></div>;
    
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);

    return (
      <div className="quiz-container fade-in">
        <div className="quiz-active-interface" style={{ textAlign: 'center' }}>
          <div style={{ background: '#eff6ff', display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', color: '#0056d2', marginBottom: '2rem' }}>
            <Trophy size={64} />
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0b224d', marginBottom: '1rem' }}>Quiz Completed!</h2>
          <p style={{ color: '#64748b', marginBottom: '3rem' }}>You've successfully finished Set {selectedSet} of {selectedCategory.name}.</p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem' }}>
            <div className="stat-box" style={{ padding: '2rem', borderRadius: '25px' }}>
              <div className="stat-label">Score</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{score} / {questions.length}</div>
            </div>
            <div className="stat-box" style={{ padding: '2rem', borderRadius: '25px' }}>
              <div className="stat-label">Accuracy</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{percent}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="start-set-btn" onClick={handleBackToSets}>
              <RotateCcw size={18} /> Practice Again
            </button>
            <button className="back-btn" onClick={handleBackToCategories} style={{ padding: '0 2rem' }}>
              <Home size={18} /> {activeTab === 'GENERAL' ? 'Categories' : 'Posts'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-page">
      {renderHeader()}
      {renderLanguageModal()}

      {/* Normal loading spinner */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Nepali auto-translation overlay */}
      {translating && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5rem 2rem',
          gap: '1.5rem',
        }}>
          <div style={{
            width: 64, height: 64,
            border: '5px solid #e0e7ff',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.4rem' }}>
              🇳🇵 नेपालीमा अनुवाद हुँदैछ…
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Translating questions to Nepali, please wait…
            </div>
          </div>
        </div>
      )}

      {error && !loading && !translating && (
        <div className="quiz-container">
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1.5rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle /> {error}
            <button onClick={handleBackToSets} className="back-btn" style={{ marginLeft: 'auto', border: 'none', background: 'rgba(220, 38, 38, 0.1)' }}>Try Again</button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <div 
          key={view} 
          ref={protectedRef}
          className={`quiz-protection ${isProtected ? 'protection-blurred' : ''}`}
          style={{ position: 'relative' }}
        >
          {isProtected && <ProtectionOverlay />}
          {!loading && !translating && !error && view === VIEWS.CATEGORIES && renderSelectionPhase()}
          {!loading && !translating && !error && view === VIEWS.SETS && renderSets()}
          {!loading && !translating && !error && view === VIEWS.QUIZ && renderQuiz()}
          {!loading && !translating && !error && view === VIEWS.RESULTS && renderResults()}
          {!loading && !translating && !error && view === VIEWS.WEEKLY && renderWeekly()}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
