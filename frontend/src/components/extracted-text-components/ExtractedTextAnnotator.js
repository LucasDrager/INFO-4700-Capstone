import React, { useState, useEffect } from 'react';
import './ExtractedTextAnnotator.css';

// Function to format time in MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ExtractedTextAnnotator = ({ pdfText, currentPage, onPageClick }) => {
  const [extractedText, setExtractedText] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [currentComment, setCurrentComment] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);

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
    const formattedText = pdfText.flatMap(text => detectAndSplitPages(text));
    setExtractedText(formattedText);
  }, [pdfText]);

  // Reading timer effect
  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  // Start timer when component mounts
  useEffect(() => {
    setIsReading(true);
    return () => setIsReading(false);
  }, []);

  // Handle text selection
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

  // Add the annotation to the list
  const addAnnotation = () => {
    if (selectedText.trim()) {
      const newAnnotation = {
        text: selectedText,
        comment: currentComment || 'No comment added',
      };
      setAnnotations([...annotations, newAnnotation]);
      setSelectedText(''); // Clear the text after adding
      setCurrentComment(''); // Clear the comment after adding
    }
  };

  // Handle comment edit for existing annotation
  const handleCommentEdit = (index, newComment) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[index] = {
      ...updatedAnnotations[index],
      comment: newComment
    };
    setAnnotations(updatedAnnotations);
  };

  return (
    <div className="container">
      <div className="text-panel">
        <div className="text-panel-header">
          <div className="reading-timer">
            Reading Time: {formatTime(readingTime)}
          </div>
        </div>
        {extractedText.map((pageData, index) => (
          <div 
            key={index} 
            className={`page-text ${currentPage === index + 1 ? 'current-page' : ''}`}
            onClick={() => onPageClick(index + 1)}
          >
            <h3>Page {pageData.page}</h3>
            <p onMouseUp={handleTextSelection} className="selectable-text">
              {pageData.text}
            </p>
          </div>
        ))}
      </div>
      <div className="annotation-panel">
        <h2>Annotations</h2>
        <div className="annotation-input-group">
          <textarea
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            placeholder="Select text from the left pane..."
            className="annotation-textarea"
          />
          <textarea
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            placeholder="Add your comment here..."
            className="annotation-textarea comment-textarea"
          />
          <div className="button-container">
            <div className="primary-button-group">
              <button 
                onClick={addHighlight} 
                className="highlight-btn"
                disabled={!selectedText.trim()}
              >
                Highlight Text
              </button>
              <button 
                onClick={addAnnotation} 
                className="add-annotation-btn"
                disabled={!selectedText.trim()}
              >
                Add Annotation
              </button>
            </div>
            <div className="secondary-button-group">
              <button
                onClick={searchOnGoogle}
                className="search-google-btn"
                disabled={!selectedText.trim()}
              >
                Search on Google
              </button>
              <button
                onClick={handleSummarize}
                className="summarize-btn"
                disabled={!selectedText.trim()}
              >
                Summarize Text
              </button>
            </div>
          </div>
        </div>
        <div className="annotation-list">
          {annotations.map((ann, i) => (
            <div key={i} className="annotation-item">
              <p className="annotation-text"><strong>Annotation:</strong> {ann.text}</p>
              <div className="comment-section">
                <strong>Comment:</strong>
                <textarea
                  value={ann.comment}
                  onChange={(e) => handleCommentEdit(i, e.target.value)}
                  className="comment-edit-textarea"
                  placeholder="Add or edit your comment..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtractedTextAnnotator;
