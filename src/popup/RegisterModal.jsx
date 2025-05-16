import React, { useState } from 'react';
import './Modal.css';
import { register } from '../common/api'; // Ścieżka do pliku, w którym znajduje się funkcja `register`

const RegisterModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [data_urodzenia, setDataUrodzenia] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(name, email, password, avatar, data_urodzenia);
      if (response.error) {
        setError(response.error);
      } else {
        console.log('Registration successful:', response);
        onClose();
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Wystąpił błąd podczas rejestracji.');
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
          <div className="form-group">
          <label>Wybierz avatar:</label>
          <div className="avatar-options">
            <div
              className={`avatar-option ${avatar === 'boy' ? 'selected' : ''}`}
              onClick={() => setAvatar('boy')}
            >
              <img src="/img/avatars/boy.png" alt="Uczeń" />
            </div>
            <div
              className={`avatar-option ${avatar === 'girl' ? 'selected' : ''}`}
              onClick={() => setAvatar('girl')}
            >
              <img src="/img/avatars/girl.png" alt="Uczennica" />
            </div>
          </div>
        </div>
          <div className="form-group">
            <label>Data urodzenia:</label>
            <input
              type="date"
              value={data_urodzenia}
              onChange={(e) => setDataUrodzenia(e.target.value)}
              placeholder="Wpisz swoją datę urodzenia"
            />
            <i className="fas fa-calendar"></i>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Zarejestruj się</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;