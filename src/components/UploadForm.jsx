import React from 'react';
import './UploadForm.css';

function UploadForm() {
  return (
    <section className="upload-form">
      <h3>Upload File</h3>
      <input type="file" />
      <button type="button">Upload</button>
    </section>
  );
}

export default UploadForm;
