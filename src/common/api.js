import config from './config';

export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${config.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
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

export const getPlayerStats = async (userId, gameId) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/player-stats/${userId}/${gameId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};

export const updatePlayerStats = async (userId, gameId, starsChange, statsDetails) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/player-stats/${userId}/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ starsChange, statsDetails }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};

export const getNextLetter = async (userId) => {
  try {
    const token = localStorage.getItem('token'); // Pobierz token z localStorage
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/api/games/letters/next/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
      },
    });

    if (!response.ok) {
      throw new Error('Nie udało się pobrać danych z serwera.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching next letter:', error);
    throw error;
  }
};