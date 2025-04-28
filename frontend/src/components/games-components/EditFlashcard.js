import React, { useState } from 'react';
import './gamesstyle.css';

const EditFlashcard = ({ card, onSave, onCancel }) => {
    const [editedCard, setEditedCard] = useState({
        term: card.term,
        definition: card.definition
    });

    const handleSave = () => {
        if (!editedCard.term.trim() || !editedCard.definition.trim()) {
            alert('Both term and definition are required');
            return;
        }
        onSave(editedCard);
    };

    return (
        <div className="edit-flashcard">
            <div className="edit-flashcard-form">
                <div className="input-group">
                    <label>Term:</label>
                    <input
                        type="text"
                        value={editedCard.term}
                        onChange={(e) => setEditedCard({ ...editedCard, term: e.target.value })}
                        placeholder="Enter term"
                    />
                </div>
                <div className="input-group">
                    <label>Definition:</label>
                    <input
                        type="text"
                        value={editedCard.definition}
                        onChange={(e) => setEditedCard({ ...editedCard, definition: e.target.value })}
                        placeholder="Enter definition"
                    />
                </div>
                <div className="edit-buttons">
                    <button className="save-edit-button" onClick={handleSave}>Save Changes</button>
                    <button className="cancel-edit-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditFlashcard;
