import React, { useState } from "react";
import "../components/games-components/gamesstyle.css";

const GamesPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('flashcards');

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'flashcards':
                return (
                    <div className="flashcards-container">
                        <h2>Flashcards</h2>
                        <div className="cards-grid">
                            <div className="card active">
                                <h3 className="card-title">Title of PDF</h3>
                                <p className="card-subtitle">Flashcards (120)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                            
                            <div className="card">
                                <h3 className="card-title">Another PDF</h3>
                                <p className="card-subtitle">Flashcards (85)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                            
                            <div className="card">
                                <h3 className="card-title">Study Material</h3>
                                <p className="card-subtitle">Flashcards (50)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                        </div>
                    </div>
                );
            case 'quiz':
                return (
                    <div className="quiz-container">
                        <h2>Quiz</h2>
                        <div className="cards-grid">
                            <div className="card active">
                                <h3 className="card-title">Title of PDF</h3>
                                <p className="card-subtitle">Notes (15)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                            
                            <div className="card">
                                <h3 className="card-title">Another PDF</h3>
                                <p className="card-subtitle">Notes (8)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                            
                            <div className="card">
                                <h3 className="card-title">Study Material</h3>
                                <p className="card-subtitle">Notes (12)</p>
                                <button className="preview-button">Preview</button>
                            </div>
                        </div>
                    </div>
                );
            case 'matching':
                return (
                    <div className="matching-container">
                        <h2>Matching</h2>
                        {/* Add your matching game content here */}
                    </div>
                );
            default:
                return <div>Select a game type</div>;
        }
    };

    return (
        <div className={`games-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? '×' : '☰'}
            </button>
            
            <div className="sidebar">
                <h2>Game Types</h2>
                <ul>
                    <li
                        className={activeTab === 'flashcards' ? 'active' : ''}
                        onClick={() => handleTabClick('flashcards')}
                    >
                        Flashcards
                    </li>
                    <li
                        className={activeTab === 'quiz' ? 'active' : ''}
                        onClick={() => handleTabClick('quiz')}
                    >
                        Quiz
                    </li>
                    <li
                        className={activeTab === 'matching' ? 'active' : ''}
                        onClick={() => handleTabClick('matching')}
                    >
                        Matching
                    </li>
                </ul>
            </div>
            
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default GamesPage;
