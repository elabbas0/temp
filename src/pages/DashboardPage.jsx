import React from 'react';
import './DashboardPage.css';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import FileList from '../components/FileList';
import VersionList from '../components/VersionList';

function DashboardPage({ currentUser, onSignOut }) {
  return (
    <main className="dashboard-page">
      <Navbar currentUser={currentUser} onSignOut={onSignOut} />
      <section className="dashboard-content">
        <UploadForm />
        <FileList />
        <VersionList />
      </section>
    </main>
  );
}

export default DashboardPage;
