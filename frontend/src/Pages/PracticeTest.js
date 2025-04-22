import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../components/games-components/practiceteststyle.css";

const sampleQuestions = Array(18).fill().map((_, index) => ({
    id: index + 1,
    question: `Question ${index + 1}: Sample question text for question number ${index + 1}?`,
    options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
    ]
}));

const PracticeTest = () => {
    const navigate = useNavigate();
    const [activeDot, setActiveDot] = useState(0);
    const [answers, setAnswers] = useState({});
    const boxRefs = useRef([]);

    // Initialize refs array
    boxRefs.current = Array(18).fill().map((_, i) => boxRefs.current[i] || React.createRef());

    const handleDotClick = (index) => {
        setActiveDot(index);
        boxRefs.current[index].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = () => {
        // Here you can handle the submission of answers
        console.log('Submitted answers:', answers);
        alert('Test submitted!');
    };

    return (
        <div className="practice-test-layout">
            <div className="sidebar">
                <div className="questions-box">
                    <h2>Questions</h2>
                    <div className="question-dots">
                        {Array(18).fill().map((_, index) => (
                            <div 
                                key={index} 
                                className={`question-dot ${index === activeDot ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="main-content">
                <h1 className="pdf-title">Title of PDF</h1>
                <div className="content-area">
                    {sampleQuestions.map((question) => (
                        <div 
                            key={question.id}
                            ref={boxRefs.current[question.id - 1]}
                            className="white-box"
                        >
                            <div className="question-text">{question.question}</div>
                            <div className="options-container">
                                {question.options.map(option => (
                                    <div 
                                        key={option.id}
                                        className={`option ${answers[question.id] === option.id ? 'selected' : ''}`}
                                        onClick={() => handleOptionSelect(question.id, option.id)}
                                    >
                                        <span className="option-label">{option.id.toUpperCase()}:</span>
                                        <span className="option-text">{option.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="submit-button" onClick={handleSubmit}>Submit Test</button>
                <button className="bottom-back-button" onClick={() => navigate(-1)}>←</button>
            </div>
        </div>
    );
};

export default PracticeTest;