import React, { useState } from 'react';
import './UploadForm.css';
import { isStorageConfigured, uploadFile } from '../services/storage';

function UploadForm({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] || null;

    setSelectedFile(nextFile);
    setStatusMessage('');
  }

  async function handleUpload() {
    if (!selectedFile) {
      setStatusMessage('choose a file before uploading');
      return;
    }

    if (!isStorageConfigured) {
      setStatusMessage('run amplify add storage and amplify push before uploading');
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage('uploading to s3...');
      await uploadFile(selectedFile);
      setStatusMessage('upload complete');
      setSelectedFile(null);
      onUploadSuccess();
    } catch (error) {
      // this usually means the storage category was not created or permissions failed
      setStatusMessage('upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="upload-form">
      <h3>Upload File</h3>
      <p className="upload-form-copy">Send a file to your private S3 space.</p>
      <input type="file" onChange={handleFileChange} />
      <button type="button" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'uploading...' : 'upload'}
      </button>
      <p className="upload-form-status">{statusMessage}</p>
    </section>
  );
}

export default UploadForm;
