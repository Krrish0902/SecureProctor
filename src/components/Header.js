import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            SecureProctor
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/exam">Take Exam</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 