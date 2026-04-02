import React from 'react';
import './VersionList.css';

function VersionList({ selectedFile }) {
  return (
    <section className="version-list">
      <h3>Version History</h3>
      {!selectedFile ? <p>select a file to view versions.</p> : null}
      {selectedFile ? (
        <div>
          <p className="version-list-name">{selectedFile.name}</p>
          <p className="version-list-copy">
            version history will appear here after we enable s3 bucket versioning and connect the list versions flow.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default VersionList;
