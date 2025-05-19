import axios from 'axios';
import config from './config';
import { useUser } from '../UserContext';

const api = axios.create({
  baseURL: config.backendUrl,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useUser();
      logout(); // Wyloguj użytkownika, jeśli token jest nieważny
    }
    return Promise.reject(error);
  }
);

export default api;

export const register = async (name, email, password, avatar, data_urodzenia) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      avatar,
      data_urodzenia,
    });
    const data = response.data;
    if (response.status === 200) {
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

    const response = await api.post('/auth/login', {
      login: email,
      password, // Przekazanie loginu i hasła
    });

    const data = response.data;
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

    const response = await api.get(`/api/player-stats/${gameId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
      },
    });

    const data = response.data;
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

    const response = await api.put(`/api/player-stats/${gameId}`, {
      starsChange,
      statsDetails,
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Przekazanie tokena w nagłówku
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};

// Funkcja pomocnicza do obsługi błędów HTTP
export const handleHttpError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || 'Błąd serwera',
    };
  }
  return response.json();
};

