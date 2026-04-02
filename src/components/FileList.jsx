import React from 'react';
import './FileList.css';

function FileList({ files, isLoading, error, selectedFile, onSelectFile, onDeleteFile }) {
  function formatDate(value) {
    if (!value) {
      return 'unknown date';
    }

    return new Date(value).toLocaleString();
  }

  function formatSize(size) {
    if (!size) {
      return '0 b';
    }

    if (size < 1024) {
      return `${size} b`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} kb`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} mb`;
  }

  return (
    <section className="file-list">
      <h3>Your Files</h3>
      {isLoading ? <p>loading files...</p> : null}
      {!isLoading && error ? <p>{error}</p> : null}
      {!isLoading && !error && files.length === 0 ? <p>no files yet.</p> : null}
      {!isLoading && !error && files.length > 0 ? (
        <ul className="file-list-items">
          {files.map((file) => (
            <li
              key={file.path}
              className={selectedFile?.path === file.path ? 'file-list-item file-list-item-active' : 'file-list-item'}
            >
              <button type="button" className="file-list-select" onClick={() => onSelectFile(file)}>
                <span>{file.name}</span>
                <span>{formatSize(file.size)}</span>
                <span>{formatDate(file.lastModified)}</span>
              </button>
              <div className="file-list-actions">
                <a href={file.url} target="_blank" rel="noreferrer" className="file-list-link">
                  open
                </a>
                <a href={file.url} download={file.name} className="file-list-link">
                  download
                </a>
                <button type="button" className="file-list-delete" onClick={() => onDeleteFile(file)}>
                  delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default FileList;
