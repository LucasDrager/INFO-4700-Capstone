import React, { useState } from 'react';

function PDFUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append('pdf_files', file);  // ✅ backend expects this key

    setStatus('Uploading...');

    try {
      const res = await fetch('http://localhost:8000/parse_pdf', {
        method: 'POST',
        body: form,
        credentials: 'include', // 🔐 needed if user must be authenticated
      });

      const data = await res.json();

      if (res.ok && data.texts?.length) {
        onUpload(data.texts[0]);  // ✅ just one file
        setStatus('Upload complete');
      } else {
        setStatus('Upload failed');
        console.error('Error response:', data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload error');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload PDF
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default PDFUploader;