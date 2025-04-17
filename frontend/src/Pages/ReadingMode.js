import React, { useState, useRef } from 'react';

import ReadingSidebar from '../components/readingmode-components/ReadingSidebar';
import ReadingContainer from '../components/readingmode-components/ReadingContainer';
import ReadingModeAnnotator from '../components/readingmode-components/ReadingModeAnnotator';
import './ReadingMode.css';

function ReadingModePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfText, setPdfText] = useState([]);
    const [annotationMode, setAnnotationMode] = useState(false);
    const [currentViewMode, setCurrentViewMode] = useState('text'); // 'text' or 'pdf'
    // Shared notes state to sync between components
    const [sharedNotes, setSharedNotes] = useState([]);
    // Reference to the interactive text container
    const interactiveTextRef = useRef(null);

    // Handle PDF text extraction (can be populated from ReadingContainer)
    const handlePdfTextExtraction = (extractedText) => {
        setPdfText(extractedText);
    };

    // Handle page navigation, view mode changes, and annotation mode toggling
    const handlePageChange = (pageNumber, viewMode, toggleAnnotation) => {
        // Update current page
        setCurrentPage(pageNumber);
        
        // If viewMode is provided, update the current view mode
        if (viewMode) {
            setCurrentViewMode(viewMode);
        }
        
        // If toggleAnnotation is provided (true/false), set annotation mode
        if (toggleAnnotation !== undefined) {
            setAnnotationMode(toggleAnnotation);
        }
    };

    // Annotation mode is now toggled directly from ReadingContainer
    
    // Handle adding a note from the annotator to be synced with sidebar
    const handleAddNote = (noteText, noteComment) => {
        const newNote = {
            id: Date.now(), // Unique ID based on timestamp
            text: noteText,
            comment: noteComment || ''
        };
        setSharedNotes([...sharedNotes, newNote]);
    };

    // Handle deleting a note from either component
    const handleDeleteNote = (noteId) => {
        const updatedNotes = sharedNotes.filter(note => note.id !== noteId);
        setSharedNotes(updatedNotes);
    };

    // Handle updating a note in either component
    const handleUpdateNote = (noteId, updatedText, updatedComment) => {
        const updatedNotes = sharedNotes.map(note => {
            if (note.id === noteId) {
                return { 
                    ...note, 
                    text: updatedText !== undefined ? updatedText : note.text,
                    comment: updatedComment !== undefined ? updatedComment : note.comment
                };
            }
            return note;
        });
        setSharedNotes(updatedNotes);
    };

    return (
        <div className="readingmode-container">
            <ReadingSidebar 
                notes={sharedNotes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onUpdateNote={handleUpdateNote}
                interactiveTextRef={interactiveTextRef}
            />
            <div className="readingmode-mainContentArea">
                <ReadingContainer 
                    onTextExtraction={handlePdfTextExtraction} 
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    pdfText={pdfText}
                    annotationMode={annotationMode}
                    notes={sharedNotes}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                    onUpdateNote={handleUpdateNote}
                    interactiveTextRef={interactiveTextRef}
                />
                {/* Annotation toggle is now handled in the ReadingContainer */}
            </div>
        </div>
    );
}

export default ReadingModePage;
