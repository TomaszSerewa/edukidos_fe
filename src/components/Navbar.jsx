import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import UserContext

import './Header.css'; 

const Navbar = () => {
  const { user } = useUser(); 

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to={user ? "/games/letters" : "/gamesUnlogged/letters-unlogged"}>LITERKI</Link>
        </li>|        
        <li className="navbar-item"><Link to="/gamesUnlogged/digits"> CYFERKI </Link></li>|
        <li className="navbar-item"><Link to="/gamesUnlogged/colors"> KOLORKI </Link></li>|
        <li className="navbar-item"><Link to="/gamesUnlogged/directions"> KIERUNKI</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;