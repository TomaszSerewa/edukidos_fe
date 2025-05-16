import React, { useState, useEffect } from 'react';
import './ColoursGame.css'; // Stylizacja gry
import { getNextColor, checkColor } from '../../common/gamesApi/coloursApi';

const ColoursGame = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [starsCount, setStarsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token'); // Pobierz token z localStorage

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (!token) {
          throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
        }

        // Pobierz dane dla następnego koloru
        const colorData = await getNextColor(token);
        setCurrentColor(colorData.correctColor);
        setOptions([...colorData.uncorrectColors, colorData.correctColor].sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error('Error initializing game:', error);
        setMessage('Nie udało się zainicjalizować gry. Spróbuj ponownie później.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [token]);

  const handleOptionClick = async (color) => {
    try {
      const result = await checkColor(color, token);

      if (result.correct) {
        setMessage('Brawo! Poprawny kolor!');
        setStarsCount(result.stars_count || 0); // Zaktualizuj liczbę gwiazdek
        setTimeout(() => startNewGame(), 2000); // Rozpocznij nową grę po 2 sekundach
      } else {
        setMessage('Niestety, spróbuj ponownie.');
      }
    } catch (error) {
      console.error('Error checking color:', error);
      setMessage('Wystąpił błąd podczas sprawdzania koloru. Spróbuj ponownie później.');
    }
  };

  const startNewGame = async () => {
    setMessage('');
    setIsLoading(true);

    try {
      const colorData = await getNextColor(token);
      setCurrentColor(colorData.correctColor);
      setOptions([...colorData.uncorrectColors, colorData.correctColor].sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Error starting new game:', error);
      setMessage('Nie udało się rozpocząć nowej gry. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="game-container">
      {isLoading ? (
        <p>Ładowanie gry...</p>
      ) : (
        <>
          <h1>Gra w Kolory</h1>
          <p>Wskaż kolor: <strong>{currentColor}</strong></p>
          <div className="options-container">
            {options.map((color, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(color)}
                style={{ backgroundColor: color }}
                className="color-button"
              >
                {color}
              </button>
            ))}
          </div>
          {message && <p className="message">{message}</p>}
          <div className="stars-display">
            <p>Twoje gwiazdki: {starsCount} ★</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ColoursGame;