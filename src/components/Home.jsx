import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import UserContext
import styles from './Home.module.css'; // Import CSS module

const Home = () => {
  const { user } = useUser(); // Pobierz dane użytkownika z UserContext
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/home'); // Przekierowanie na HomeUnlogged, jeśli użytkownik nie jest zalogowany
    }
  }, [user, navigate]);

  return (
    <div className={styles.home}>
      <div className={styles.gamesGallery}>
        <div className={styles.gameItem}>
          <Link to="/games/letters">
            <img
              src="/img/gamesMiniatures/pokaz_literke_250.png"
              alt="Pokaż literkę"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/digits-unlogged">
            <img
              src="/img/gamesMiniatures/pokaz_cyferke_250.png"
              alt="Pokaż cyferkę"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/games/colours">
            <img
              src="/img/gamesMiniatures/pokaz_kolor_250.png"
              alt="Pokaż kolor"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
        <div className={styles.gameItem}>
          <Link to="/gamesUnlogged/directions-unlogged">
            <img
              src="/img/gamesMiniatures/pokaz_kierunek_250.png"
              alt="Pokaż kolor"
              className={styles.gameThumbnail}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;