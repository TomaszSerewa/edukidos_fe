import React, { useState } from 'react';
import { useUser } from '../UserContext'; // Pobieranie z kontekstu
import { login } from '../common/api'; // Import funkcji login z common/api.js
import './Modal.css';

const LoginModal = ({ onClose }) => {
  const { setUserId } = useUser(); // Pobieranie setUserId z kontekstu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(email, password); // Wywołanie API login
      if (response.error) {
        setError(response.error);
      } else {
        const userId = response.user.id;
        const userName = response.user.login;
        console.log('Login successful:', response);

        // Ustawienie danych użytkownika
        setUserId(userId); // Ustawienie userId w kontekście
        localStorage.setItem('loggedInUser', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        window.location.reload();

        onClose(); // Zamknięcie modala
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Błędny login lub hasło');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h2>Zaloguj się</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wpisz swój email"
              required
            />
          </div>
          <div className="form-group">
            <label>Hasło:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wpisz swoje hasło"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Zaloguj</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;