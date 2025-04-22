import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/games-components/flashcardstyle.css";
import FlashCard from "../components/games-components/FlashCard";
import girlLaptop from '../images/GirlLaptop.png';

const Flashcard = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [flashcards, setFlashcards] = useState([
        { question: "Text of Question 1", answer: "Answer 1", isStarred: false },
        { question: "Text of Question 2", answer: "Answer 2", isStarred: false },
        { question: "Text of Question 3", answer: "Answer 3", isStarred: false },
        // Add more flashcards as needed
    ]);
    const totalPages = flashcards.length;

    const handleStarClick = () => {
        setFlashcards(cards => cards.map((card, index) => {
            if (index === currentPage - 1) {
                return { ...card, isStarred: !card.isStarred };
            }
            return card;
        }));
    };

    //active dot logic
    const getActiveDot 
= (dotIndex) => {
        if (currentPage <= 2) {
            return dotIndex === currentPage;
        } else if (currentPage >= totalPages - 0) {
            return dotIndex === 3;
        } else {
            return dotIndex === 2;
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //start of how the page will look
    return (
        <div className="flashcard-container">
            <div className="sidebar">
                <button className="back-arrow" onClick={() => navigate(-1)} aria-label="Go back">
                    ←
                </button>
                <div className="profile-section">
                    <img src={girlLaptop} alt="Profile" className="profile-image" />
                    <div className="search-container">
                        <div className="search-icon">🔍</div>
                        <input type="text" placeholder="Search..." className="search-input" />
                    </div>
                </div>
                <div className="practice-test-container">
                    <button className="practice-test-button" onClick={() => navigate('/practice-test')}>Practice Test</button>
                </div>
            </div>
            <div className="main-content">
                <div className="content-header">
                    <h1 className="pdf-title">Title of PDF</h1>
                    <div className="header-actions">
                        <button 
                            className={`action-button star-button ${flashcards[currentPage - 1]?.isStarred ? 'starred' : ''}`}
                            onClick={handleStarClick}
                            aria-label={flashcards[currentPage - 1]?.isStarred ? 'Unstar card' : 'Star card'}
                        >
                            {flashcards[currentPage - 1]?.isStarred ? '★' : '☆'}
                        </button>
                    </div>
                </div>
                <div className="content-area">
                    <FlashCard 
                        question={flashcards[currentPage - 1]?.question}
                        answer={flashcards[currentPage - 1]?.answer}
                    />
                </div>
                <div className="navigation-controls">
                    <div className="nav-dots">
                        <span className={`dot ${getActiveDot(1) ? 'active' : ''}`}></span>
                        <span className={`dot ${getActiveDot(2) ? 'active' : ''}`}></span>
                        <span className={`dot ${getActiveDot(3) ? 'active' : ''}`}></span>
                    </div>
                    <div className="page-controls">
                        <button className="nav-button" onClick={handlePrevPage} disabled={currentPage === 1}>
                            <span>←</span>
                        </button>
                        <span className="page-indicator">{currentPage}/{totalPages}</span>
                        <button className="nav-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <span>→</span>
                        </button>
                    </div>
                </div>
        </div>
</div>
    );
};

export default Flashcard;
