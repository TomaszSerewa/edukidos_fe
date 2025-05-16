import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import UserContext
import './Home.css'; // Możesz użyć tej samej stylizacji co dla Home

const HomeUnlogged = () => {
  const { user } = useUser(); // Pobierz dane użytkownika z UserContext
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Przekierowanie na Home, jeśli użytkownik jest zalogowany
    }
  }, [user, navigate]);

  return (
    <div className="home">
      <div className="games-gallery">
        <div className="game-item">
          <Link to="/gamesUnlogged/letters-unlogged">
            <img
              src="/img/gamesMiniatures/pokaz_literke_250.png"
              alt="Pokaż literkę"
              className="game-thumbnail"
            />
          </Link>
        </div>
        <div className="game-item">
          <Link to="/gamesUnlogged/digits">
            <img
              src="/img/gamesMiniatures/pokaz_cyferke_250.png"
              alt="Pokaż cyferkę"
              className="game-thumbnail"
            />
          </Link>
        </div>
        <div className="game-item">
          <Link to="/gamesUnlogged/colors">
            <img
              src="/img/gamesMiniatures/pokaz_kolor_250.png"
              alt="Pokaż kolor"
              className="game-thumbnail"
            />
          </Link>
        </div>
        <div className="game-item">
          <Link to="/gamesUnlogged/directions">
            <img
              src="/img/gamesMiniatures/pokaz_kierunek_250.png"
              alt="Pokaż kierunek"
              className="game-thumbnail"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeUnlogged;