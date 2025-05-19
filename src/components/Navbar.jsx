import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext'; 
import styles from './Header.module.css'; // Import modułu CSS jako styles

const Navbar = () => {
  const { user } = useUser(); 

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link to={user ? "/games/letters" : "/gamesUnlogged/letters-unlogged"}>LITERKI</Link>
        </li>|
        <li className={styles.navbarItem}>
          <Link to="/gamesUnlogged/digits">CYFERKI</Link>
        </li>|
        <li className={styles.navbarItem}>
          <Link to={user ? "/games/colours" : "/gamesUnlogged/colours-unloged"}>KOLORKI</Link>
        </li>|
        <li className={styles.navbarItem}>
          <Link to="/gamesUnlogged/directions">KIERUNKI</Link>
        </li>|
      </ul>
    </nav>
  );
};

export default Navbar;