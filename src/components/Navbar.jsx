import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/games/letters">LITERKI </Link></li>|
        <li className="navbar-item"><Link to="/games/digits"> CYFERKI </Link></li>|
        <li className="navbar-item"><Link to="/games/colors"> KOLORKI </Link></li>|
        <li className="navbar-item"><Link to="/games/directions"> KIERUNKI</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;