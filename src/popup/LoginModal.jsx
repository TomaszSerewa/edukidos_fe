import React, { useState } from 'react';
import { useUser } from '../UserContext'; // Import UserContext
import { login } from '../common/api';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const LoginModal = ({ onClose }) => {
  const { setUser } = useUser(); // Pobierz funkcję setUser z UserContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(email, password);
      if (response.error || !response.token || !response.user) {
        setError(response.error || 'Nieprawidłowa odpowiedź serwera.');
        return;
      }

      const { token, user } = response;

      // Zapisanie danych użytkownika w localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userAvatar', user.avatar);
      localStorage.setItem('userBirthDate', user.birthDate);
      localStorage.setItem('userStars', user.stars);

      // Zaktualizuj stan użytkownika w UserContext
      setUser(user);

      onClose(); // Zamknięcie modala
      navigate('/welcome'); // Przekierowanie na WelcomePage
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