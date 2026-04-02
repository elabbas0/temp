import React, { useEffect, useState } from 'react';
import './VersionList.css';
import { isVersionsApiConfigured, listFileVersions } from '../services/api';

function VersionList({ selectedFile }) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadVersions() {
      if (!selectedFile) {
        setVersions([]);
        setError('');
        return;
      }

      if (!isVersionsApiConfigured()) {
        setVersions([]);
        setError('add the lambda api url to load version history');
        return;
      }

      try {
        setIsLoading(true);
        const nextVersions = await listFileVersions(selectedFile.path);

        setVersions(nextVersions);
        setError('');
      } catch (loadError) {
        setVersions([]);
        setError('unable to load file versions right now');
      } finally {
        setIsLoading(false);
      }
    }

    loadVersions();
  }, [selectedFile]);

  return (
    <section className="version-list">
      <h3>Version History</h3>
      {!selectedFile ? <p>select a file to view versions.</p> : null}
      {selectedFile ? (
        <div>
          <p className="version-list-name">{selectedFile.name}</p>
          <p className="version-list-copy">older uploaded versions of this file will appear here.</p>
          {isLoading ? <p>loading versions...</p> : null}
          {!isLoading && error ? <p>{error}</p> : null}
          {!isLoading && !error && versions.length === 0 ? <p>no stored versions found yet.</p> : null}
          {!isLoading && !error && versions.length > 0 ? (
            <ul className="version-list-items">
              {versions.map((version) => (
                <li key={version.versionId} className="version-list-item">
                  <div>
                    <p className="version-list-version-label">{version.label}</p>
                    <p className="version-list-meta">{version.lastModified}</p>
                  </div>
                  <div className="version-list-actions">
                    <a href={version.url} target="_blank" rel="noreferrer" className="version-list-link">
                      open
                    </a>
                    <a href={version.url} download={selectedFile.name} className="version-list-link">
                      download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default VersionList;
