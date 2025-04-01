import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { login } from '../common/api';
import './Header.css'; 
import RegisterModal from '../popup/RegisterModal';
import LoginModal from '../popup/LoginModal';

const Header = ({ setUserId }) => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userName, setUserName] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogin = async (email, password) => {
    setErrorMessage('');
    try {
      const response = await login(email, password);
      if (response.error) {
        setErrorMessage(response.error);
        return false;
      } else {
        setLoggedInUser(email);
        localStorage.setItem('loggedInUser', email);
        localStorage.setItem('userId', response.userId); 
        localStorage.setItem('userName', response.user.name);
        setUserId(response.userId);
        setUserName(response.user.name);
        console.log('Login successful:', response);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Błędny login lub hasło');
      return false;
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userId'); 
    setUserId(null);
    setUserName(null);
    navigate('/'); 
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

  const rainbowColors = ['#dd3434', 'orange', 'gold', '#3cad3c', '#4c4ce6', 'indigo', 'violet'];
  const [currentColors, setCurrentColors] = useState(logoLetters);

  useEffect(() => {
    const interval = setInterval(() => {
      const newColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      setCurrentColors((prevColors) => {
        const newColors = prevColors.map((item, index) => {
          if (index === 0) {
            return { ...item, color: newColor };
          }
          return item;
        });
        return newColors;
      });

      for (let i = 1; i <= 7; i++) {
        setTimeout(() => {
          setCurrentColors((prevColors) => {
            const newColors = prevColors.map((item, index) => {
              if (index === i) {
                return { ...item, color: newColor };
              }
              return item;
            });
            return newColors;
          });

          setTimeout(() => {
            setCurrentColors((prevColors) => {
              const newColors = prevColors.map((item, index) => {
                if (index === i) {
                  return { ...item, color: logoLetters[index].color };
                }
                return item;
              });
              return newColors;
            });
          }, 1000);
        }, i * 1000);
      }

      setTimeout(() => {
        setCurrentColors((prevColors) => {
          const newColors = prevColors.map((item, index) => {
            if (index >= 8 && index <= 10) {
              return { ...item, color: newColor };
            }
            return item;
          });
          return newColors;
        });
      }, 8000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  function showLogo() {
    return (
      <div className="logo">
      <Link to="/" className="logo">
        {currentColors.map((item, index) => (
          <span key={index} style={{ color: item.color }}>{item.letter}</span>
        ))}
      </Link>
      </div>
    );
  }

  return (
    <header>
      {showLogo()}
      {userName ? (
        <div className="forms">
          <p>Witaj, {userName}!</p>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      ) : (
        <div className="forms">
          <button onClick={() => setShowLoginModal(true)}>Zaloguj</button>
          <div className="separator">
            <div className="circle">LUB</div>
          </div>
          <button onClick={() => setShowRegisterModal(true)}>Zarejestruj</button>
        </div>
      )}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </header>
  );
};

export default Header;