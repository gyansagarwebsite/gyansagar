import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Clock,
  Loader,
  ChevronLeft,
  XCircle,
  Trophy,
  Crown,
  Star,
  Timer,
  CalendarDays
} from 'lucide-react';
import publicQuizService from '../services/publicQuizService.js';
import { shuffleQuestions } from '../utils/quizUtils.js';
import confetti from 'canvas-confetti';
import useQuizProtection from '../hooks/useQuizProtection';
import ProtectionOverlay from './common/ProtectionOverlay';
import '../styles/pages/BlogsPage.css';
import '../styles/components/WeeklyQuizPage.css';

const TOTAL_TIME = 150;

const secToMin = (s) => {
  if (!s && s !== 0) return '—';
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const WinnerCard = ({ winner }) => {
  if (!winner) return null;
  return (
    <motion.div
      className="prev-winner-card"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="pwc-crown"><Crown size={22} /></div>
      <div className="pwc-body">
        <div className="pwc-label">🏆 Previous Week's Winner</div>
        <div className="pwc-name">{winner.userName}</div>
        <div className="pwc-stats">
          <span><Star size={12} /> {winner.score}/{winner.totalQuestions || 15} correct</span>
          <span><Timer size={12} /> {secToMin(winner.timeTakenSeconds)}</span>
          {(winner.weekStart || winner.weekEnd) && (
            <span><CalendarDays size={12} /> {fmtDate(winner.weekStart)} — {fmtDate(winner.weekEnd)}</span>
          )}
        </div>
        {winner.message && <div className="pwc-msg">"{winner.message}"</div>}
      </div>
    </motion.div>
  );
};

const WeeklyQuizChallenge = ({ onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [step, setStep] = useState('status');
  const [userName, setUserName] = useState('');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerId, setTimerId] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [started, setStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const { isProtected } = useQuizProtection();

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

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await publicQuizService.getWeeklyQuizStatus();
      if (response.isActive) {
        setQuizId(response.quizId);
        setStep('start');
      }
    } catch (err) {
      setError('No weekly quiz is currently available. Please check back later!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    publicQuizService.getWinner()
      .then(data => { if (data?.hasWinner) setWinner(data.winner); })
      .catch(() => {});
  }, [fetchStatus]);

  const handleStartQuiz = async () => {
    if (!userName.trim()) return;
    try {
      const response = await publicQuizService.startWeeklyQuiz(userName.trim());
      setQuizId(response.quizId);
      setStep('quiz');
      setStarted(true);
      startTimer();
    } catch (err) {
      setError(err.message || 'Failed to start quiz');
    }
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const handleLoadQuiz = useCallback(async () => {
    try {
      const response = await publicQuizService.getWeeklyQuizCurrent();
      
      // Shuffle options for all questions in the weekly quiz
      const randomizedQuestions = shuffleQuestions(response.questions);
      const randomizedResponse = { ...response, questions: randomizedQuestions };
      
      setQuiz(randomizedResponse);
      const emptyAnswers = {};
      randomizedResponse.questions.forEach((_, idx) => { emptyAnswers[idx] = null; });
      setAnswers(emptyAnswers);
    } catch (err) {
      setError('Failed to load quiz questions');
    }
  }, []);

  useEffect(() => {
    if (step === 'quiz') handleLoadQuiz();
  }, [step, handleLoadQuiz]);

  useEffect(() => {
    return () => { if (timerId) clearInterval(timerId); };
  }, [timerId]);

  const results = useMemo(() => {
    if (!submitted) return null;
    if (submitResponse) {
      return {
        score: submitResponse.correctCount,
        correct: submitResponse.correctCount,
        incorrect: submitResponse.wrongCount,
        unanswered: submitResponse.unansweredCount,
        totalQuestions: submitResponse.totalQuestions,
        percentage: submitResponse.percentage,
      };
    }
    if (!quiz) return null;
    let correct = 0, incorrect = 0, unanswered = 0;
    quiz.questions.forEach((question, idx) => {
      const userAnswer = answers[idx];
      if (userAnswer === null || userAnswer === undefined) unanswered++;
      else if (userAnswer === question.correctAnswer) correct++;
      else incorrect++;
    });
    const percentage = quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0;
    return { score: correct, correct, incorrect, unanswered, totalQuestions: quiz.questions.length, percentage };
  }, [quiz, answers, submitted, submitResponse]);

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (!submitted) {
      const isCorrect = optionIndex === quiz.questions[questionIndex].correctAnswer;
      
      if (isCorrect) {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#4ade80', '#ffffff']
        });
      }

      setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    }
  };

  const handleSubmit = async () => {
    if (!started) return;
    try {
      const payload = {
        quizId,
        userName,
        answers: Object.entries(answers).map(([idxStr, answer]) => ({
          questionId: quiz.questions[parseInt(idxStr)]._id,
          selectedAnswer: answer
        })),
        timeTakenSeconds: TOTAL_TIME - timeLeft
      };
      const response = await publicQuizService.submitWeeklyQuiz(payload);
      setSubmitResponse(response);
      setSubmitted(true);
      if (timerId) clearInterval(timerId);

      // Major celebration if score is good (>70%)
      if (response.correctCount / response.totalQuestions > 0.7) {
        const end = Date.now() + (3 * 1000);
        const colors = ['#2D3F8F', '#FF8A3D', '#ffffff', '#fbbf24'];

        (function frame() {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  if (loading) return <div className="loading-state"><Loader className="loading-spinner" size={48} /><p>Loading Weekly Competition...</p></div>;

  if (error) return <div className="error-state"><AlertCircle size={64} /><h2>Quiz Unavailable</h2><p>{error}</p><button onClick={onBack} className="btn btn-primary">Go Back</button></div>;

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions?.length || 0) - 1;
  const isAnswered = answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] !== undefined;

  const timerUrgent = timeLeft <= 30;
  const timerWarning = timeLeft <= 60 && timeLeft > 30;
  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div 
      className={`weekly-quiz-container fade-in quiz-protection ${isProtected ? 'protection-blurred' : ''}`} 
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: 'relative' }}
    >
      {isProtected && <ProtectionOverlay />}
        <button onClick={onBack} className="back-btn" style={{ marginBottom: '1.5rem' }}>
            <ChevronLeft size={18} /> Back to Quiz Collection
        </button>
      
      {winner && !submitted && <WinnerCard winner={winner} />}

      <AnimatePresence mode="wait">
        {step === 'start' && (
          <motion.div key="start" className="start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="start-container">
                <div className="start-icon"><Trophy size={48} /></div>
                <h2>Weekly Challenge</h2>
                <p>Tackle 15 questions in 2.5 minutes. Win exclusive rewards!</p>
                <div className="name-input-container">
                    <input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} className="name-input" />
                    <button className="btn btn-primary start-btn" onClick={handleStartQuiz} disabled={!userName.trim()}>Start Competition →</button>
                </div>
             </div>
          </motion.div>
        )}

        {step === 'quiz' && quiz && !submitted && (
          <motion.div key="quiz" className="quiz-view">
             <div className={`quiz-timer-bar ${timerUrgent ? 'urgent' : timerWarning ? 'warning' : ''}`}>
                <Clock size={18} /> <span className="timer-display">{timerMinutes}:{timerSeconds}</span>
                <div className="timer-track"><div className="timer-fill" style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }} /></div>
             </div>
             
             <div className="quiz-progress">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }} /></div>
             </div>

             <div className="question-card">
                <p className="question-text">{currentQuestion.questionText}</p>
                <div className="options-container">
                    {currentQuestion.options.map((option, optIdx) => {
                      const isSelected = answers[currentQuestionIndex] === optIdx;
                      const isCorrect = optIdx === currentQuestion.correctAnswer;
                      const isAnswered = answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] !== undefined;

                      let statusClass = '';
                      let currentVariant = "visible";

                      if (isAnswered) {
                        if (isCorrect) {
                          statusClass = 'correct';
                          currentVariant = "correct";
                        } else if (isSelected) {
                          statusClass = 'incorrect';
                          currentVariant = "incorrect";
                        }
                      } else if (isSelected) {
                        currentVariant = "selected";
                      }

                      return (
                        <motion.button 
                          key={optIdx} 
                          variants={optionVariants}
                          animate={currentVariant}
                          className={`option-button ${isSelected ? 'selected' : ''} ${statusClass}`} 
                          onClick={() => !isAnswered && handleSelectAnswer(currentQuestionIndex, optIdx)}
                          whileHover={!isAnswered ? "hover" : ""}
                          whileTap={!isAnswered ? { scale: 0.97 } : {}}
                          transition={{ duration: 0.2 }}
                          style={{ cursor: isAnswered ? 'default' : 'pointer' }}
                        >
                          <motion.div 
                            className="option-button-shadow"
                            variants={shadowVariants}
                            animate={currentVariant === "correct" ? "correct" : (currentVariant === "hover" ? "hover" : currentVariant)}
                            transition={{ duration: 0.2 }}
                          />
                          <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                          <span className="option-text">{option}</span>
                          <AnimatePresence>
                            {isAnswered && isCorrect && (
                              <motion.span
                                key="check"
                                className="option-status-icon success"
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1.2, rotate: 0 }}
                                transition={{ type: 'spring', damping: 10 }}
                              >
                                <CheckCircle2 size={18} />
                              </motion.span>
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                              <motion.span
                                key="cross"
                                className="option-status-icon error"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <XCircle size={18} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                </div>
             </div>

             <div className="quiz-navigation">
                <button className="btn btn-secondary" onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev-1))} disabled={currentQuestionIndex === 0}>Previous</button>
                {isLastQuestion ? 
                  <button className="btn btn-success" onClick={handleSubmit}>Submit Challenge</button> : 
                  <button className="btn btn-primary" onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={!isAnswered}>Next</button>
                }
             </div>
          </motion.div>
        )}

        {submitted && results && (
            <motion.div key="results" className="results-view">
                <div className="scoreboard">
                    <Award size={48} />
                    <h2>Challenge Complete!</h2>
                    <div className="score-display">
                        <div className="score-number">{results.score} / {results.totalQuestions}</div>
                    </div>
                    <button className="btn btn-primary" onClick={onBack}>Finish Challenge</button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyQuizChallenge;
