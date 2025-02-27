import React, { useState, useEffect } from 'react';
import './ExtractedTextAnnotator.css';

const ExtractedTextAnnotator = ({ pdfText }) => {
  const [extractedText, setExtractedText] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [currentComment, setCurrentComment] = useState('');

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
    // Transform and format the pdfText array
    const formattedText = pdfText.map((text, index) => ({
      page: index + 1,
      text: formatText(text)
    }));
    setExtractedText(formattedText);
  }, [pdfText]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
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
        <h2>Extracted Text</h2>
        {extractedText.map((pageData, index) => (
          <div key={index} className="page-text">
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
          <button 
            onClick={addAnnotation} 
            className="add-annotation-btn"
            disabled={!selectedText.trim()}
          >
            Add Annotation
          </button>
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
