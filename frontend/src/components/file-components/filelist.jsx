import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PDFList() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const response = await axios.get('http://localhost:8000/list-pdfs/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setFiles(response.data);
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h2>Uploaded PDFs</h2>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <a href={`http://localhost:8000/media/${file.file}`} target="_blank" rel="noopener noreferrer">
                            {file.file_name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PDFList;
