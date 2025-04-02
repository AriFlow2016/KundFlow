import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" className="app-logo">
          KundFlow
        </Link>
      </div>
      <div className="header-right">
        <span className="user-name">Johan Nilsson</span>
      </div>
    </header>
  );
};

export default Header;
