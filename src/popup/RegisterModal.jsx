import React, { useState } from 'react';
import './Modal.css';

const RegisterModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await register(name, email, password);
      if (response.error) {
        setError(response.error);
      } else {
        alert('Registration successful!');
        window.location.reload();
        onClose();
      }
    } catch (err) {
      setError('An error occurred during registration.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h2>Rejestracja</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Imię:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wpisz swoje imię"
              required
            />
            <i className="fas fa-user"></i>
          </div>
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
          <button type="submit">Zarejestruj się</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;