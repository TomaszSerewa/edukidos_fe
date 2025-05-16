import config from './config';
import axios from 'axios';

export const register = async (name, email, password, avatar, data_urodzenia) => {
  try {
    const response = await fetch(`${config.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, avatar, data_urodzenia }),
    });
    const data = await response.json();
    if (response.ok) {
      // Zapisz token w localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
    }
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Login i hasło są wymagane.');
    }

    console.log('Login:', email);

    const response = await fetch(`${config.backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: email, password }), // Przekazanie loginu i hasła
    });

    if (!response.ok) {
      throw new Error('Nieprawidłowe dane logowania.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getPlayerStats = async (gameId, token) => {
  try {
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/api/player-stats/${gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
      },
    });

    if (!response.ok) {
      throw new Error('Nie udało się pobrać statystyk gracza.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};

export const updatePlayerStats = async (gameId, starsChange, statsDetails, token) => {
  try {
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/api/player-stats/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
      },
      body: JSON.stringify({ starsChange, statsDetails }),
    });

    if (!response.ok) {
      throw new Error('Nie udało się zaktualizować statystyk gracza.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};

