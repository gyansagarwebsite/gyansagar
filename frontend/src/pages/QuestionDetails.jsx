import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import questionService from '../services/questionService';
import LoadingSpinner from '../admin/components/LoadingSpinner';
import useQuizProtection from '../hooks/useQuizProtection';
import ProtectionOverlay from '../components/common/ProtectionOverlay';
import '../styles/components/QuestionDetails.css';

const QuestionDetails = () => {
    const { isProtected } = useQuizProtection();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const data = await questionService.getQuestion(slug);
                setQuestion(data);
            } catch (err) {
                setError('Failed to load question. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchQuestion();
        }
    }, [slug]);

    const handleOptionClick = (index) => {
        if (!showAnswer) {
            setSelectedAnswer(index);
            setShowAnswer(true); // Instantly highlight answer
        }
    };

    if (loading) {
        return <div className="container"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="container"><p className="error-message">{error}</p></div>;
    }

    if (!question) {
        return <div className="container"><p>Question not found.</p></div>;
    }

    return (
        <div 
          className={`focused-question-container quiz-protection ${isProtected ? 'protection-blurred' : ''}`}
          style={{ position: 'relative' }}
          onContextMenu={(e) => e.preventDefault()}
        >
            {isProtected && <ProtectionOverlay />}
            <div className="focused-question-card fade-in-up">
                <div className="focused-question-header">
                    <h1 className="focused-question-text">{question.questionText}</h1>
                </div>

                <div className="focused-options-grid">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = question.correctAnswer === index;
                        const isIncorrect = isSelected && !isCorrect;

                        let optionStatus = '';
                        if (showAnswer) {
                            if (isCorrect) optionStatus = 'correct';
                            else if (isIncorrect) optionStatus = 'incorrect';
                        } else if (isSelected) {
                            optionStatus = 'selected';
                        }

                        return (
                            <div 
                                key={index} 
                                className={`focused-option-card ${optionStatus}`}
                                onClick={() => handleOptionClick(index)}
                            >
                                <div className="focused-option-inner">
                                    <div className="focused-letter-box">
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <div className="focused-option-content">
                                        <p>{option}</p>
                                    </div>
                                    <div className="focused-status-indicator">
                                        {showAnswer && isCorrect && <CheckCircle2 size={24} />}
                                        {showAnswer && isIncorrect && <XCircle size={24} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;

