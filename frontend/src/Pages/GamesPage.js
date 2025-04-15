import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/games-components/gamesstyle.css";
import CreateFlashcardSet from "../components/games-components/CreateFlashcardSet";
import EditFlashcard from "../components/games-components/EditFlashcard";

const GamesPageToggleSidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
      };
  };

const GamesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('flashcards');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFlashcard, setCurrentFlashcard] = useState(0);
    const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [flashcardSets, setFlashcardSets] = useState([
        { id: 1, title: 'Example Set', cards: [{ term: 'Example Term', definition: 'Example Definition' }] }
    ]);

    const [selectedSet, setSelectedSet] = useState(null);

    const handlePreviewClick = (set) => {
        setSelectedSet(set);
        setCurrentFlashcard(0);
        setIsModalOpen(true);
    };

    const handleCardDoubleClick = () => {
        navigate('/flashcard');
    };


    const handleSaveFlashcardSet = (newSet) => {
        setFlashcardSets([...flashcardSets, { ...newSet, id: Date.now() }]);
    };

    const handleEditCard = (editedCard) => {
        const updatedSets = flashcardSets.map(set => {
            if (set.id === selectedSet.id) {
                const updatedCards = [...set.cards];
                updatedCards[currentFlashcard] = editedCard;
                return { ...set, cards: updatedCards };
            }
            return set;
        });
        setFlashcardSets(updatedSets);
        setSelectedSet(updatedSets.find(set => set.id === selectedSet.id));
        setIsEditing(false);
    };

    const renderContent = () => {
        if (activeTab === 'flashcards') {
            return (
                <div className="cards-grid">
                    {flashcardSets.map((set) => (
                        <div key={set.id} className="card" onDoubleClick={handleCardDoubleClick}>
                            <h3 className="card-title">{set.title}</h3>
                            <p className="card-subtitle">Flashcards ({set.cards.length})</p>
                            <button className="preview-button" onClick={() => handlePreviewClick(set)}>Preview</button>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="cards-grid">
                    <div className="card">
                        <h3 className="card-title">Title of PDF</h3>
                        <p className="card-subtitle">Notes (15)</p>
                        <button className="preview-button">Preview</button>
                    </div>
                    
                    <div className="card">
                        <h3 className="card-title">Another PDF</h3>
                        <p className="card-subtitle">Notes</p>
                        <button className="preview-button">Preview</button>
                    </div>
                    
                    <div className="card">
                        <h3 className="card-title">Study Material</h3>
                        <p className="card-subtitle">Notes</p>
                        <button className="preview-button">Preview</button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="reading-tools-container games-page">
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
                <button className="filter-button" onClick={() => setIsCreateSetModalOpen(true)}>+ Add Set</button>
            </div>

            {renderContent()}

            {isModalOpen && selectedSet && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedSet.title}</h2>
                            <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        {isEditing ? (
                            <EditFlashcard
                                card={selectedSet.cards[currentFlashcard]}
                                onSave={handleEditCard}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <div className="flashcard">
                                <div className="flashcard-content">
                                    <div className="flashcard-front">
                                        <h3>{selectedSet.cards[currentFlashcard]?.term || 'No term available'}</h3>
                                    </div>
                                    <div className="flashcard-back">
                                        <p>{selectedSet.cards[currentFlashcard]?.definition || 'No definition available'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="modal-controls">
                            <button 
                                className="modal-action-button edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Card
                            </button>
                            <button 
                                className="modal-action-button delete-button"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this set?')) {
                                        setFlashcardSets(flashcardSets.filter(set => set.id !== selectedSet.id));
                                        setIsModalOpen(false);
                                    }
                                }}
                            >
                                Delete Set
                            </button>
                            <button 
                                className="modal-action-button open-button"
                                onClick={() => {
                                    navigate('/flashcard', { state: { selectedSet } });
                                }}
                            >
                                Open Set
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateFlashcardSet 
                isOpen={isCreateSetModalOpen}
                onClose={() => setIsCreateSetModalOpen(false)}
                onSave={handleSaveFlashcardSet}
            />
        </div>
    );
}; 

export default GamesPage;
