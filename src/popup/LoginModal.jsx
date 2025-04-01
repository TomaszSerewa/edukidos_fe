import React, { useState } from 'react';
import './Modal.css';

const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Nieprawidłowy email lub hasło.');
      } else {
        onClose(); // Zamknięcie popupu po zalogowaniu
        window.location.reload(); // Odświeżenie strony
      }
    } catch (err) {
      setError('Wystąpił błąd podczas logowania.');
      console.error(err);
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
            <i className="fas fa-envelope"></i>
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
            <i className="fas fa-lock"></i>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Zaloguj</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;