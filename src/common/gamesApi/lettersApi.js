import config from '../config';
import axios from 'axios';
import { handleHttpError } from '../api'; // Import funkcji handleHttpError

// Funkcja do pobrania następnej litery
export const getNextLetter = async (token) => {
  try {
    if (!token) {
      throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
    }

    const response = await fetch(`${config.backendUrl}/games/letters/next`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleHttpError(response);
  } catch (error) {
    console.error('Error fetching next letter:', error);
    throw error;
  }
};

// Funkcja do sprawdzania litery
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

    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message || 'Błąd serwera',
      };
    }

    throw { status: 500, message: 'Nieznany błąd podczas sprawdzania litery.' };
  }
};