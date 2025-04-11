import React, { useState, useEffect } from 'react';
import './ReadingModeAnnotator.css';

// We'll use the timer from ReadingContainer instead

const ReadingModeAnnotator = ({ pdfText, currentPage, onPageClick, notes, onAddNote, onDeleteNote, onUpdateNote }) => {
  const [extractedText, setExtractedText] = useState([]);
  // We use the shared notes system now, so local annotations state is not needed
  const [selectedText, setSelectedText] = useState('');
  const [currentComment, setCurrentComment] = useState('');
  const [highlights, setHighlights] = useState([]);

  // Formatting Text!!
  // Format the extracted text for better readability
  const formatText = (text) => {
    // Split text into lines and remove empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Join lines that appear to be part of the same paragraph
    let formattedLines = [];
    let currentParagraph = '';
    
    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      const nextLine = lines[i + 1]?.trim();
      
      // Check if this might be a title or heading (ends with period or is short)
      const isPossibleHeading = trimmedLine.length < 50 && 
        (trimmedLine.endsWith('.') || !nextLine || nextLine.startsWith('-'));
      
      // Check if this line ends with a sentence-ending punctuation
      const isEndOfSentence = /[.!?]$/.test(trimmedLine);
      
      if (isPossibleHeading || isEndOfSentence) {
        // Add the line as a separate paragraph
        formattedLines.push((currentParagraph + ' ' + trimmedLine).trim());
        currentParagraph = '';
      } else {
        // Add to current paragraph
        currentParagraph += ' ' + trimmedLine;
      }
    });
    
    // Add any remaining text
    if (currentParagraph.trim()) {
      formattedLines.push(currentParagraph.trim());
    }
    
    // Join paragraphs with double line breaks
    return formattedLines.join('\n\n');
  };

  useEffect(() => {
    // Split text into pages based on common page indicators
    const detectAndSplitPages = (text) => {
      // Common page break patterns
      const pageBreakPatterns = [
        /Page\s+\d+\s+of\s+\d+/i,  // "Page X of Y"
        /^Page\s+\d+$/im,           // "Page X" at start of line
        /\n\s*\d+\s*\n/,           // Standalone page numbers
        /\[Page\s*\d+\]/i,         // [Page X]
      ];

      // Split text into initial chunks by double newlines
      let chunks = text.split(/\n\s*\n/);
      let pages = [];
      let currentPage = [];
      let pageNumber = 1;

      chunks.forEach((chunk) => {
        // Check if chunk contains a page break indicator
        const isPageBreak = pageBreakPatterns.some(pattern => pattern.test(chunk));

        if (isPageBreak) {
          // If we have content in currentPage, save it as a page
          if (currentPage.length > 0) {
            pages.push({
              page: pageNumber++,
              text: formatText(currentPage.join('\n\n'))
            });
            currentPage = [];
          }
        }
        currentPage.push(chunk);
      });

      // Add the last page
      if (currentPage.length > 0) {
        pages.push({
          page: pageNumber,
          text: formatText(currentPage.join('\n\n'))
        });
      }

      return pages;
    };

    // Process each text chunk from pdfText
    if (pdfText && pdfText.length) {
      const formattedText = pdfText.flatMap(text => detectAndSplitPages(text));
      setExtractedText(formattedText);
    }
  }, [pdfText]);

  // Add a listener for the custom text selection event
  useEffect(() => {
    // Event handler for the custom text selection event
    const handleTextSelectedEvent = (event) => {
      const selectedText = event.detail;
      if (selectedText) {
        setSelectedText(selectedText);
      }
    };

    // Also check the hidden container for selected text on mount
    const checkSelectedTextContainer = () => {
      const container = document.getElementById('selected-text-container');
      if (container && container.textContent) {
        setSelectedText(container.textContent);
      }
    };
    
    // Listen for the custom event
    document.addEventListener('textSelected', handleTextSelectedEvent);
    
    // Initial check for selected text
    checkSelectedTextContainer();
    
    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('textSelected', handleTextSelectedEvent);
    };
  }, []);

  // We use the timer from ReadingContainer instead

  // Handle text selection directly from the annotation panel
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
    }
  };

  // Add highlight
  const addHighlight = () => {
    if (selectedText) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'highlighted-text';
      range.surroundContents(span);
      setHighlights([...highlights, selectedText]);
      setSelectedText('');
      selection.removeAllRanges();
    }
  };

  // Search on Google
  const searchOnGoogle = () => {
    if (selectedText) {
      const searchQuery = encodeURIComponent(selectedText);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  };

  // Summarize text
  const handleSummarize = async () => {
    if (selectedText) {
      try {
        const API_BASE_URL = window.location.hostname === 'localhost' 
          ? 'http://localhost:8000'  // Local development
          : 'http://backend:8000';    // Docker environment
        const response = await fetch(`${API_BASE_URL}/api/summarize/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: selectedText })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentComment(data.summary);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to get summary: ' + error.message);
      }
    }
  };

  // Add the annotation to the shared notes system
  const addAnnotation = () => {
    if (selectedText.trim()) {
      // Add to shared notes system (will sync with sidebar)
      onAddNote(selectedText, currentComment || 'No comment added');
      setSelectedText(''); // Clear the text after adding
      setCurrentComment(''); // Clear the comment after adding
    }
  };

  // Handle comment edit for existing annotation
  const handleCommentEdit = (noteId, newComment) => {
    // Update in shared notes system
    onUpdateNote(noteId, undefined, newComment);
  };

  // Delete annotation
  const deleteAnnotation = (noteId) => {
    // Delete from shared notes system
    onDeleteNote(noteId);
  };

  // Handle annotation card edit mode
  const AnnotationCard = ({ note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(note.comment);

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
      if (!isEditing) {
        setEditedComment(note.comment);
      }
    };

    const handleSave = () => {
      handleCommentEdit(note.id, editedComment);
      setIsEditing(false);
    };

    return (
      <div className="annotation-card">
        <div className="annotation-text">{note.text}</div>
        {isEditing ? (
          <div className="annotation-comment-edit">
            <textarea
              className="comment-edit-textarea"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="annotation-card-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleEditToggle}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="annotation-comment">{note.comment}</div>
            <div className="annotation-card-actions">
              <button className="edit-btn" onClick={handleEditToggle}>Edit</button>
              <button className="delete-btn" onClick={() => deleteAnnotation(note.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="text-panel">
                {/* Timer is now displayed in the ReadingContainer */}
        {extractedText.map((page, index) => (
          <div 
            key={`page-${index}`}
            className={`page-text ${currentPage === page.page ? 'current-page' : ''}`}
            onClick={() => onPageClick && onPageClick(page.page)}
          >
            <h3>Page {page.page}</h3>
            <div 
              className="selectable-text"
              onMouseUp={handleTextSelection}
              dangerouslySetInnerHTML={{ __html: page.text }}
            />
          </div>
        ))}
      </div>
      
      <div className="annotation-panel">
        <h3>Text Selection Tools</h3>
        
        {!selectedText && (
          <div className="empty-selection-prompt">
            <div className="info-icon">i</div>
            <p>Select text from the document to annotate, highlight, search or summarize.</p>
          </div>
        )}
        
        {selectedText && (
          <div className="selected-text-display">
            <div className="annotation-input-group">
              <label className="input-label">Selected Text</label>
              <textarea
                className="annotation-textarea"
                value={selectedText}
                readOnly
                placeholder="Selected text will appear here..."
              />
            </div>
            
            <div className="button-container">
              <div className="section-label">Actions</div>
              <div className="primary-button-group">
                <button 
                  className="highlight-btn" 
                  onClick={addHighlight}
                  disabled={!selectedText}
                >
                  <span className="btn-icon">✓</span> Highlight
                </button>
                <button 
                  className="add-annotation-btn" 
                  onClick={addAnnotation}
                  disabled={!selectedText}
                >
                  <span className="btn-icon">+</span> Add Note
                </button>
              </div>
              <button 
                className="search-google-btn" 
                onClick={searchOnGoogle}
                disabled={!selectedText}
              >
                <span className="btn-icon">🔍</span> Search on Google
              </button>
              <button 
                className="summarize-btn" 
                onClick={handleSummarize}
                disabled={!selectedText}
              >
                <span className="btn-icon">AI</span> Summarize
              </button>
            </div>
            
            <div className="annotation-input-group">
              <label className="input-label">Your Notes</label>
              <textarea
                className="annotation-textarea comment-textarea"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="Add your comments here..."
              />
            </div>
          </div>
        )}
        
        <div className="annotations-divider"></div>
        
        <div className="annotations-list">
          <h3>
            <span className="notes-icon">📝</span> 
            My Notes 
            <span className="notes-count">{notes ? notes.length : 0}</span>
          </h3>
          
          {(!notes || notes.length === 0) && (
            <div className="empty-notes-prompt">
              <p>Your saved notes will appear here.</p>
            </div>
          )}
          
          {notes && notes.map((note) => (
            <AnnotationCard 
              key={`annotation-${note.id}`} 
              note={note}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingModeAnnotator;
