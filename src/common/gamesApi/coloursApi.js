import config from '../config';
import axios from 'axios';

// Funkcja do pobrania następnego koloru
export const getNextColor = async (token) => {
  try {
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/games/colours/next`, {
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
    console.error('Error fetching next color:', error);
    throw error;
  }
};

// Funkcja do sprawdzenia poprawności koloru
export const checkColor = async (color, token) => {
  try {
    const response = await axios.post(
      `${config.backendUrl}/games/colours/check/${color}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking color:', error);
    throw error;
  }
};