import React from 'react';
import './Navbar.css';

function Navbar({ currentUser, onSignOut }) {
  return (
    <header className="navbar">
      <div>
        <h2>My Backend Dropbox</h2>
        <p className="navbar-user">{currentUser.email || currentUser.username}</p>
      </div>
      <button type="button" onClick={onSignOut}>logout</button>
    </header>
  );
}

export default Navbar;
