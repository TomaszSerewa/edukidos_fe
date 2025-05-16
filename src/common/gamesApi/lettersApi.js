import config from '../config';
import axios from 'axios';

// Funkcja do pobrania następnej litery
export const getNextLetter = async (token) => {
  try {
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/games/letters/next`, {
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

export const checkLetter = async (letter, token) => {
  try {
    const response = await axios.post(
      `${config.backendUrl}/games/letters/check/${letter}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking letter:', error);
    throw error;
  }
};