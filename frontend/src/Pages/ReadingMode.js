import React from 'react';
import ReadingSidebar from '../components/readingmode-components/ReadingSidebar';
import ReadingContainer from '../components/readingmode-components/ReadingContainer';

function ReadingModePage() {
    return (
        <div className="readingmode-container">
            <ReadingSidebar />
            <div className="readingmode-mainContentArea">
                <ReadingContainer />
            </div>
        </div>
    );
}

export default ReadingModePage;
