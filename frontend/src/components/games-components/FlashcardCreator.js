import React, { useState } from 'react';
import { usePDF } from '../../contexts/PDFContext';
import './flashcard-styles.css';

const FlashcardCreator = ({ onClose }) => {
  const { pdfTexts, pdfFiles, createFlashcard } = usePDF();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedPDF, setSelectedPDF] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSelectPDF = (pdfName) => {
    setSelectedPDF(pdfName);
    setStep(2);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
    }
  };

  const handleAddToCard = (side) => {
    if (!selectedText) return;
    
    if (side === 'front') {
      setFront(prev => prev ? `${prev}\n\n${selectedText}` : selectedText);
    } else {
      setBack(prev => prev ? `${prev}\n\n${selectedText}` : selectedText);
    }
    setSelectedText('');
  };

  const handleCreateFlashcard = () => {
    if (!front) {
      setError('Front side of the card cannot be empty');
      return;
    }

    createFlashcard(front, back, selectedPDF);
    setFront('');
    setBack('');
    setSelectedText('');
    setError('');
    setStep(3);
  };

  const handleCreateAnother = () => {
    setStep(1);
    setSelectedPDF('');
  };

  return (
    <div className="flashcard-creator">
      <div className="flashcard-creator-header">
        <h2>Create Flashcard</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>

      {step === 1 && (
        <div className="step-container">
          <h3>Step 1: Select a PDF</h3>
          <div className="pdf-list">
            {pdfFiles.length > 0 ? (
              pdfFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="pdf-item"
                  onClick={() => handleSelectPDF(file.name)}
                >
                  <div className="pdf-icon">📄</div>
                  <div className="pdf-name">{file.name}</div>
                </div>
              ))
            ) : (
              <div className="no-pdfs-message">
                <p>No PDFs available. Please upload PDFs from the Home page first.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h3>Step 2: Create Your Flashcard</h3>
          <div className="flashcard-content">
            <div className="pdf-text-container">
              <h4>PDF Content: {selectedPDF}</h4>
              <div 
                className="pdf-text" 
                onMouseUp={handleTextSelection}
              >
                {pdfTexts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
              {selectedText && (
                <div className="selected-text-buttons">
                  <button onClick={() => handleAddToCard('front')}>
                    Add to Front Side
                  </button>
                  <button onClick={() => handleAddToCard('back')}>
                    Add to Back Side
                  </button>
                </div>
              )}
            </div>

            <div className="flashcard-form">
              <div className="card-preview">
                <div className="card-side">
                  <label>Front (Question):</label>
                  <textarea
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter the question or term..."
                  />
                </div>
                <div className="card-side">
                  <label>Back (Answer):</label>
                  <textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter the answer or definition..."
                  />
                </div>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                className="create-button"
                onClick={handleCreateFlashcard}
                disabled={!front}
              >
                Create Flashcard
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-container success-container">
          <div className="success-icon">✅</div>
          <h3>Flashcard Created Successfully!</h3>
          <div className="success-buttons">
            <button 
              className="create-another-button"
              onClick={handleCreateAnother}
            >
              Create Another Flashcard
            </button>
            <button 
              className="finish-button"
              onClick={onClose}
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardCreator;
