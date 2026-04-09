import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import questionService from '../services/questionService';
import LoadingSpinner from '../admin/components/LoadingSpinner';
import '../styles/components/QuestionDetails.css';

const QuestionDetails = () => {
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
        <div className="container">
            <div className="question-details-card fade-in-up">
                <div className="question-content">
                    <h2 className="question-text">{question.questionText}</h2>
                    <div className="options-grid">
                        {question.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = question.correctAnswer === index;
                            const isIncorrect = isSelected && !isCorrect;

                            let optionClass = 'option-card';
                            if (showAnswer) {
                                if (isCorrect) optionClass += ' correct';
                                if (isIncorrect) optionClass += ' incorrect';
                            } else if (isSelected) {
                                optionClass += ' selected';
                            }

                            return (
                                <div 
                                    key={index} 
                                    className={optionClass}
                                    onClick={() => handleOptionClick(index)}
                                >
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    <p className="option-text">{option}</p>
                                    
                                    {showAnswer && isCorrect && (
                                        <CheckCircle2 className="option-status-icon" size={20} />
                                    )}
                                    {showAnswer && isIncorrect && (
                                        <XCircle className="option-status-icon" size={20} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;

