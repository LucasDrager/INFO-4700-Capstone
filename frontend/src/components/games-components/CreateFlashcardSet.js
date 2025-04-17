import React, { useState } from 'react';
import './gamesstyle.css';

const CreateFlashcardSet = ({ isOpen, onClose, onSave }) => {
    const [setTitle, setSetTitle] = useState('');
    const [flashcards, setFlashcards] = useState([
        { id: 1, term: '', definition: '' }
    ]);

    const handleAddCard = () => {
        const newId = flashcards.length + 1;
        setFlashcards([...flashcards, { id: newId, term: '', definition: '' }]);
    };

    const handleRemoveCard = (id) => {
        if (flashcards.length > 1) {
            setFlashcards(flashcards.filter(card => card.id !== id));
        }
    };

    const handleCardChange = (id, field, value) => {
        setFlashcards(flashcards.map(card => 
            card.id === id ? { ...card, [field]: value } : card
        ));
    };

    const handleSave = () => {
        if (!setTitle.trim()) {
            alert('Please enter a title for your flashcard set');
            return;
        }

        const nonEmptyCards = flashcards.filter(card => 
            card.term.trim() !== '' || card.definition.trim() !== ''
        );

        if (nonEmptyCards.length === 0) {
            alert('Please add at least one flashcard');
            return;
        }

        onSave({
            title: setTitle,
            cards: nonEmptyCards
        });
        
        // Reset form
        setSetTitle('');
        setFlashcards([{ id: 1, term: '', definition: '' }]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="create-flashcard-modal">
                <h2>Create New Flashcard Set</h2>
                <div className="create-flashcard-form">
                    <input
                        type="text"
                        placeholder="Enter set title"
                        value={setTitle}
                        onChange={(e) => setSetTitle(e.target.value)}
                        className="set-title-input"
                    />
                    
                    <div className="flashcards-list">
                        {flashcards.map((card) => (
                            <div key={card.id} className="flashcard-input-group">
                                <input
                                    type="text"
                                    placeholder="Term"
                                    value={card.term}
                                    onChange={(e) => handleCardChange(card.id, 'term', e.target.value)}
                                    className="flashcard-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Definition"
                                    value={card.definition}
                                    onChange={(e) => handleCardChange(card.id, 'definition', e.target.value)}
                                    className="flashcard-input"
                                />
                                <button 
                                    onClick={() => handleRemoveCard(card.id)}
                                    className="remove-card-button"
                                    disabled={flashcards.length === 1}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={handleAddCard} className="add-card-button">
                        + Add Card
                    </button>

                    <div className="modal-buttons">
                        <button onClick={handleSave} className="save-button">
                            Save Set
                        </button>
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFlashcardSet;
