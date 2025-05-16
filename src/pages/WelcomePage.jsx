import React from 'react';
import './WelcomePage.css'; // Stylizacja strony

const WelcomePage = () => {
  const userName = localStorage.getItem('userName');
  const userAvatar = localStorage.getItem('userAvatar');
  const userBirthDate = localStorage.getItem('userBirthDate');
  const userStars = localStorage.getItem('userStars') || 0;

  return (
    <div className="welcome-page">
      <h1>Witaj, {userName}!</h1>
      <div className="welcome-content">
        {/* Informacje o graczu */}
        <div className="player-info">
          <h2>Informacje o graczu</h2>
          <p><strong>Imię:</strong> {userName}</p>
          <p><strong>Data urodzenia:</strong> {userBirthDate || 'Brak danych'}</p>
          <p><strong>Zebrane gwiazdki:</strong> {userStars} ★</p>
        </div>
        {/* Avatar gracza */}
        <div className="player-avatar">
          <h2>{userName}</h2>
          <img src={`/img/avatars/${userAvatar}.png`} alt="Avatar gracza" />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;