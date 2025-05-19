import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import UserContext
import styles from './Header.module.css'; // Import modułu CSS jako styles
import RegisterModal from '../popup/RegisterModal';
import LoginModal from '../popup/LoginModal';

const Header = () => {
  const { user, setUser } = useUser(); // Pobierz dane użytkownika z UserContext
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Wyczyszczenie stanu użytkownika w UserContext
    localStorage.clear();
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('token'); // Usuń inne dane, jeśli są przechowywane
    navigate('/'); // Przekierowanie na stronę główną
  };

  const logoLetters = [
    { letter: 'e', color: 'black' },
    { letter: 'd', color: '#dd3434' },
    { letter: 'u', color: 'orange' },
    { letter: 'k', color: 'gold' },
    { letter: 'i', color: '#3cad3c' },
    { letter: 'd', color: '#4c4ce6' },
    { letter: 'o', color: 'indigo' },
    { letter: 's', color: 'violet' },
    { letter: '.', color: 'black' },
    { letter: 'p', color: 'black' },
    { letter: 'l', color: 'black' },
  ];

  function showLogo() {
    return (
      <div className={styles.logo}>
        <Link to="/" className={styles.logo}>
          {logoLetters.map((item, index) => (
            <span key={index} style={{ color: item.color }}>
              {item.letter}
            </span>
          ))}
        </Link>
      </div>
    );
  }

  return (
    <header className={styles.header}>
      {showLogo()}
      {user ? (
        <div className={styles.forms}>
          <p>
            Witaj,{' '}
            <Link to="/welcome" className={styles.userLink}>
              {user.name}
            </Link>
            !
          </p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Wyloguj
          </button>
        </div>
      ) : (
        <div className={styles.forms}>
          <button onClick={() => setShowLoginModal(true)} className={styles.loginButton}>
            Zaloguj
          </button>
          <div className={styles.separator}>
            <div className={styles.circle}>LUB</div>
          </div>
          <button onClick={() => setShowRegisterModal(true)} className={styles.registerButton}>
            Zarejestruj
          </button>
        </div>
      )}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
};

export default Header;