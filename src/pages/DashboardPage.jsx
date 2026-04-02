import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import FileList from '../components/FileList';
import VersionList from '../components/VersionList';
import { deleteFile, isStorageConfigured, listFiles } from '../services/storage';

function DashboardPage({ currentUser, onSignOut }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState('');

  useEffect(() => {
    async function loadFiles() {
      if (!isStorageConfigured) {
        setFiles([]);
        setIsLoadingFiles(false);
        return;
      }

      try {
        const uploadedFiles = await listFiles();

        setFiles(uploadedFiles);
        setSelectedFile((currentSelectedFile) => {
          if (!currentSelectedFile) {
            return uploadedFiles[0] || null;
          }

          return (
            uploadedFiles.find((file) => file.path === currentSelectedFile.path) ||
            uploadedFiles[0] ||
            null
          );
        });
        setFilesError('');
      } catch (error) {
        // this won't work if the storage backend was not added through amplify yet
        setFilesError('unable to load files from s3 right now');
      } finally {
        setIsLoadingFiles(false);
      }
    }

    loadFiles();
  }, []);

  async function handleUploadSuccess() {
    setIsLoadingFiles(true);

    try {
      const uploadedFiles = await listFiles();

      setFiles(uploadedFiles);
      setSelectedFile(uploadedFiles[0] || null);
      setFilesError('');
    } catch (error) {
      setFilesError('upload finished, but refreshing the file list failed');
    } finally {
      setIsLoadingFiles(false);
    }
  }

  async function handleDeleteFile(file) {
    try {
      setFilesError('');
      await deleteFile(file.path);
      const uploadedFiles = await listFiles();

      setFiles(uploadedFiles);
      setSelectedFile((currentSelectedFile) => {
        if (currentSelectedFile?.path === file.path) {
          return uploadedFiles[0] || null;
        }

        return (
          uploadedFiles.find((uploadedFile) => uploadedFile.path === currentSelectedFile?.path) ||
          uploadedFiles[0] ||
          null
        );
      });
    } catch (error) {
      setFilesError('unable to delete this file right now');
    }
  }

  return (
    <main className="dashboard-page">
      <Navbar currentUser={currentUser} onSignOut={onSignOut} />
      <section className="dashboard-content">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        <FileList
          files={files}
          isLoading={isLoadingFiles}
          error={filesError}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          onDeleteFile={handleDeleteFile}
        />
        <VersionList selectedFile={selectedFile} />
      </section>
    </main>
  );
}

export default DashboardPage;
