import React, { useState } from "react";
import "../components/games-components/flashcardstyle.css";
import FlashCard from "../components/games-components/FlashCard";

const Flashcard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    // Example flashcard data - replace with your actual data
    const flashcards = [
        { question: "Text of Question 1", answer: "Answer 1" },
        { question: "Text of Question 2", answer: "Answer 2" },
        { question: "Text of Question 3", answer: "Answer 3" },
        // Add more flashcards as needed
    ];

    //active dot logic
    const getActiveDot = (dotIndex) => {
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
                <div className="profile-section">
                    <img src="/profile.png" alt="Profile" className="profile-image" />
                    <div className="search-container">
                        <div className="search-icon">🔍</div>
                        <input type="text" placeholder="Search..." className="search-input" />
                    </div>
                </div>
                <div className="practice-test-container">
                    <button className="practice-test-button">Practice Test</button>
                </div>
            </div>
            <div className="main-content">
                <div className="content-header">
                    <h1 className="pdf-title">Title of PDF</h1>
                    <div className="header-actions">
                        <button className="action-button">Star</button>
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
