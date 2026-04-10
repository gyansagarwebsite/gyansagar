import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import questionService from '../services/questionService.js';
import LoadingSpinner from '../admin/components/LoadingSpinner.jsx';
import { shuffleQuestion } from '../utils/quizUtils.js';
import confetti from 'canvas-confetti';
import useQuizProtection from '../hooks/useQuizProtection';
import ProtectionOverlay from './common/ProtectionOverlay';
import '../styles/components/TodayQuestion.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const TodayQuestion = () => {
  const [searchParams] = useSearchParams();
  const { isProtected } = useQuizProtection();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const dqId = searchParams.get('dq');
        const data = await questionService.getDailyQuestion(dqId);
        if (data) {
          // Shuffle options for the daily question
          const q = shuffleQuestion(data);
          q.date = new Date(q.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }).toUpperCase();
          q.time = new Date(q.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
          }).toUpperCase();
          
          setQuestion(q);

          // Check if user already answered this specific question
          const storedAnswer = localStorage.getItem(`tq_answered_${data._id}`);
          if (storedAnswer) {
            const { selectedText } = JSON.parse(storedAnswer);
            // Find the index of this text in the SHUFFLED options
            const restoredIndex = q.options.indexOf(selectedText);
            if (restoredIndex !== -1) {
              setSelectedOption(restoredIndex);
              setShowAnswer(true);
            }
          }
        } else {
          setQuestion(null);
        }
      } catch (err) {
        console.error('Failed to load today\'s question:', err);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [searchParams]);

  useEffect(() => {
    if (!loading && question && searchParams.get('dq')) {
      // Scroll into view
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight pulse
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 6000); 
      return () => clearTimeout(timer);
    }
  }, [loading, question, searchParams]);
 
  if (loading) return <div className="today-question-section"><div className="container"><LoadingSpinner /></div></div>;
  if (!question) return null; // Fully hide if no question is found for today

  const q = question;

  const handleOptionClick = (index) => {
    if (!showAnswer) {
      const selectedText = q.options[index];
      setSelectedOption(index);
      setShowAnswer(true);
      
      // Persist selection to localStorage
      // We store the text to handle reshuffling correctly on page refresh
      localStorage.setItem(`tq_answered_${q._id}`, JSON.stringify({
        selectedText: selectedText,
        timestamp: new Date().getTime()
      }));

      // If correct, trigger confetti
      if (index === q.correctAnswer) {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    }
  };

  const getOptionClass = (index) => {
    if (!showAnswer) {
      return selectedOption === index ? 'selected' : '';
    }
    const isCorrect = index === q.correctAnswer;
    const isSelected = selectedOption === index;
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    selected: {
      scale: 1.03,
      y: -2,
      zIndex: 10,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    },
    correct: {
      scale: [1, 1.04, 1],
      zIndex: 10,
      transition: { 
        scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      }
    },
    hover: {
      scale: 1.03,
      y: -2,
      zIndex: 10,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    },
    incorrect: {
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.35 }
    }
  };

  const shadowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0 },
    selected: { opacity: 1 },
    hover: { opacity: 0.8 },
    correct: { opacity: 0.3 },
    incorrect: { opacity: 0 }
  };

  return (
    <section 
      ref={sectionRef}
      className={`today-question-section quiz-protection ${isProtected ? 'protection-blurred' : ''}`} 
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: 'relative' }}
    >
      {isProtected && <ProtectionOverlay />}
      <div className="tq-container">
        {/* Section Header */}
        <div className="tq-header">
          <span className="tq-header-icon">📋</span>
          <h2 className="tq-title">Today's Question</h2>
        </div>

        <motion.div
          className={`tq-card ${isHighlighted ? 'highlighted' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Question Text */}
          <p className="tq-question-text">{q.questionText}</p>

          {/* Options Grid (2x2) */}
          <motion.div 
            className="tq-options-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {q.options.map((option, index) => {
              const optClass = getOptionClass(index);
              const isCorrect = showAnswer && index === q.correctAnswer;
              const isWrong = showAnswer && selectedOption === index && index !== q.correctAnswer;

              // Determine motion variant
              let currentVariant = "visible";
              if (showAnswer) {
                if (isCorrect) currentVariant = "correct";
                else if (isWrong) currentVariant = "incorrect";
              } else if (selectedOption === index) {
                currentVariant = "selected";
              }

              return (
                <motion.button
                  key={index}
                  variants={optionVariants}
                  animate={currentVariant}
                  className={`tq-option ${optClass}`}
                  onClick={() => handleOptionClick(index)}
                  whileHover={!showAnswer ? "hover" : ""}
                  whileTap={!showAnswer ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="tq-option-shadow"
                    variants={shadowVariants}
                    animate={currentVariant === "correct" ? "correct" : currentVariant}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="tq-option-label">{OPTION_LABELS[index]}</span>
                  <span className="tq-option-text">{option}</span>
                  <AnimatePresence>
                    {isCorrect && (
                      <motion.span
                        className="tq-option-check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1.2, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10 }}
                      >
                        <CheckCircle size={18} />
                      </motion.span>
                    )}
                    {isWrong && (
                      <motion.span
                        className="tq-option-x"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <XCircle size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default TodayQuestion;
