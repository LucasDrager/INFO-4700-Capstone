import React, { useState, useEffect } from 'react';
import { usePDF } from '../../contexts/PDFContext';
import './flashcard-styles.css';

const FlashcardViewer = ({ onClose }) => {
  const { flashcards, reviewFlashcard, deleteFlashcard } = usePDF();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('review'); // 'review' or 'quiz'
  const [confidenceRatings, setConfidenceRatings] = useState({});
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Initialize study session with shuffled cards
  useEffect(() => {
    if (flashcards.length === 0) return;
    
    // Shuffle the flashcards for study
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setCurrentDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);
  
  if (flashcards.length === 0) {
    return (
      <div className="flashcard-viewer empty-state">
        <div className="flashcard-viewer-header">
          <h2>Study Flashcards</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="empty-flashcards">
          <div className="empty-icon">📚</div>
          <p>You haven't created any flashcards yet.</p>
          <p>Create flashcards from your PDF content to start studying.</p>
          <button className="create-first-card" onClick={onClose}>
            Create Your First Flashcard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = currentDeck[currentIndex] || flashcards[0];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const navigateCard = (direction) => {
    setIsFlipped(false);
    
    if (direction === 'next') {
      if (currentIndex < currentDeck.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // End of deck, show summary or restart
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };
  
  const handleConfidence = (level) => {
    // Update confidence for the current card
    reviewFlashcard(currentCard.id, level);
    
    // Store confidence rating for the session
    setConfidenceRatings({
      ...confidenceRatings,
      [currentCard.id]: level
    });
    
    // Move to next card
    navigateCard('next');
  };
  
  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteFlashcard(currentCard.id);
      setShowConfirmDelete(false);
      
      // If we deleted the last card, close the viewer
      if (flashcards.length === 1) {
        onClose();
      }
    } else {
      setShowConfirmDelete(true);
    }
  };
  
  const getCardProgress = () => {
    return `${currentIndex + 1} / ${currentDeck.length}`;
  };
  
  const getSourceText = () => {
    return currentCard.pdfSource ? 
      `Source: ${currentCard.pdfSource}` : 
      'Custom flashcard';
  };
  
  return (
    <div className="flashcard-viewer">
      <div className="flashcard-viewer-header">
        <h2>Study Flashcards</h2>
        <div className="viewer-controls">
          <select 
            value={studyMode} 
            onChange={(e) => setStudyMode(e.target.value)}
            className="study-mode-selector"
          >
            <option value="review">Review Mode</option>
            <option value="quiz">Quiz Mode</option>
          </select>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
      </div>
      
      <div className="flashcard-progress">
        <span className="progress-text">{getCardProgress()}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${((currentIndex + 1) / currentDeck.length) * 100}%`}}
          ></div>
        </div>
      </div>
      
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
          onClick={handleFlip}
        >
          <div className="flashcard-front">
            <div className="card-content">{currentCard.front}</div>
            <div className="card-footer">
              <span className="tap-to-flip">Tap to see answer</span>
              <span className="card-source">{getSourceText()}</span>
            </div>
          </div>
          <div className="flashcard-back">
            <div className="card-content">{currentCard.back || "No additional information provided."}</div>
            <div className="card-footer">
              <span className="tap-to-flip">Tap to see question</span>
              <span className="card-source">{getSourceText()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flashcard-actions">
        {studyMode === 'review' ? (
          <div className="navigation-buttons">
            <button 
              className="nav-button" 
              onClick={() => navigateCard('prev')}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button 
              className="nav-button" 
              onClick={() => navigateCard('next')}
              disabled={currentIndex === currentDeck.length - 1}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="confidence-buttons">
            <button 
              className="confidence-button low" 
              onClick={() => handleConfidence(0)}
            >
              Again
            </button>
            <button 
              className="confidence-button medium-low" 
              onClick={() => handleConfidence(1)}
            >
              Hard
            </button>
            <button 
              className="confidence-button medium-high" 
              onClick={() => handleConfidence(2)}
            >
              Good
            </button>
            <button 
              className="confidence-button high" 
              onClick={() => handleConfidence(3)}
            >
              Easy
            </button>
          </div>
        )}
      </div>
      
      <div className="flashcard-management">
        {showConfirmDelete ? (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this flashcard?</p>
            <div className="confirmation-buttons">
              <button className="confirm-delete" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-delete" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="delete-card" onClick={handleDelete}>
            Delete This Flashcard
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashcardViewer;
