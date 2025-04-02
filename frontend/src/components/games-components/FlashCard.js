import React, { useState } from 'react';

const FlashCard = ({ question, answer }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card-content" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-front">
                    <div className="question-text">
                        {question || 'Text of Question'}
                    </div>
                </div>
                <div className="card-back">
                    <div className="answer-text">
                        {answer || 'Answer'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashCard;
