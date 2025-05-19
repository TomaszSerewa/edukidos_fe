import React from 'react';
import style from './WelcomePage.module.css';

const WelcomePage = () => {
  const userName = localStorage.getItem('userName');
  const userAvatar = localStorage.getItem('userAvatar');
  const userBirthDate = localStorage.getItem('userBirthDate');
  const userStars = localStorage.getItem('userStars') || 0;

  return (
    <div className={style.welcomePage}>
      <h1>Witaj, {userName}!</h1>
      <div className={style.welcomeContent}>
        <div className={style.playerInfo}>
          <h2>Informacje o graczu</h2>
          <p><strong>Imię:</strong> {userName}</p>
          <p><strong>Data urodzenia:</strong> {userBirthDate || 'Brak danych'}</p>
          <p><strong>Zebrane gwiazdki:</strong> {userStars} ★</p>
        </div>
        <div className={style.playerAvatar}>
          <h2>{userName}</h2>
          <img src={`/img/avatars/${userAvatar}.png`} alt="Avatar gracza" />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;