import React, { useState } from "react";
import "../components/games-components/gamesstyle.css";
const GamesPageToggleSidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
      };
  };
const GamesPage = () => {
    const [activeTab, setActiveTab] = useState('flashcards');

    const renderContent = () => {
        if (activeTab === 'flashcards') {
            return (
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
            );
        } else {
            return (
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
            );
        }
    };

    return (
        <div className="reading-tools-container">
            <h1 className="reading-tools-title">Reading Tools</h1>
            
            <div className="toggle-container">
                <button 
                    className={`toggle-button ${activeTab === 'flashcards' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flashcards')}
                >
                    Flashcards
                </button>
                <button 
                    className={`toggle-button ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
            </div>

            <div className="filter-container">
                <button className="filter-button">Filter</button>
                <button className="filter-button">↓</button>
                <button className="filter-button">↓</button>
                <button className="filter-button">↓</button>
            </div>

            {renderContent()}
        </div>
    );
};

export default GamesPage;