import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import UserContext
import styles from './Home.module.css'; // Import modułu CSS

const HomeUnlogged = () => {
  const { user } = useUser(); // Pobierz dane użytkownika z UserContext
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Przekierowanie na Home, jeśli użytkownik jest zalogowany
    }
  }, [user, navigate]);

  return (
    <div className={styles.home}>
      <div className={styles.gamesGallery}>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/letters-unlogged">
            <img
              src="/img/gamesMiniatures/pokaz_literke_250.png"
              alt="Pokaż literkę"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/digits">
            <img
              src="/img/gamesMiniatures/pokaz_cyferke_250.png"
              alt="Pokaż cyferkę"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/colours-unloged">
            <img
              src="/img/gamesMiniatures/pokaz_kolor_250.png"
              alt="Pokaż kolor"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/directions">
            <img
              src="/img/gamesMiniatures/pokaz_kierunek_250.png"
              alt="Pokaż kierunek"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeUnlogged;