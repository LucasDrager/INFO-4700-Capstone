import React, { createContext, useState, useContext, useEffect } from 'react';

const PDFContext = createContext(null);

export const usePDF = () => useContext(PDFContext);

export const PDFProvider = ({ children }) => {
  const [pdfTexts, setPdfTexts] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [flashcards, setFlashcards] = useState(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    return savedFlashcards ? JSON.parse(savedFlashcards) : [];
  });

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const addPDFText = (texts, files) => {
    setPdfTexts(prevTexts => [...prevTexts, ...texts]);
    setPdfFiles(prevFiles => [...prevFiles, ...files]);
  };

  const createFlashcard = (front, back, pdfSource) => {
    const newFlashcard = {
      id: Date.now(),
      front,
      back,
      pdfSource,
      dateCreated: new Date().toISOString(),
      lastReviewed: null,
      reviewCount: 0,
      confidence: 0 // 0-3: 0=not confident, 3=very confident
    };
    
    setFlashcards(prev => [...prev, newFlashcard]);
    return newFlashcard;
  };

  const updateFlashcard = (id, updates) => {
    setFlashcards(prev => 
      prev.map(card => card.id === id ? { ...card, ...updates } : card)
    );
  };

  const deleteFlashcard = (id) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const reviewFlashcard = (id, confidence) => {
    setFlashcards(prev => 
      prev.map(card => {
        if (card.id === id) {
          return {
            ...card,
            lastReviewed: new Date().toISOString(),
            reviewCount: card.reviewCount + 1,
            confidence
          };
        }
        return card;
      })
    );
  };

  return (
    <PDFContext.Provider value={{
      pdfTexts,
      pdfFiles,
      flashcards,
      addPDFText,
      createFlashcard,
      updateFlashcard,
      deleteFlashcard,
      reviewFlashcard
    }}>
      {children}
    </PDFContext.Provider>
  );
};

export default PDFContext;
