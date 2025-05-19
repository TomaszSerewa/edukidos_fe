import React, { useState, useEffect } from 'react';
import style from './ColoursGame.module.css'; 
import { getPlayerStats } from '../../common/api'; 
import { getNextColor, checkColor } from '../../common/gamesApi/coloursApi'; 
import { useNavigate } from 'react-router-dom';

// Mapowanie angielskich nazw kolorów na polskie
const colorTranslations = {
  'red': 'czerwony',
  'blue': 'niebieski',
  'green': 'zielony',
  'yellow': 'żółty',
  'orange': 'pomarańczowy',
  'purple': 'fioletowy',
  'pink': 'różowy',
  'brown': 'brązowy',
  'black': 'czarny',
  'white': 'biały',
  'skyblue': 'błękitny',
  'gray': 'szary',
};

// Mapowanie kolorów RGB
const colors = {
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#A52A2A',
  'black': '#000000',
  'white': '#FFFFFF',
  'skyblue': '#00BFFF',
  'gray': '#808080',
};

// Lista wszystkich kolorów (angielskie nazwy)
const allColors = Object.keys(colors);

const ColorGame = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [options, setOptions] = useState([]);
  const [colorsStats, setColorsStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [guessed, setGuessed] = useState(false);
  const [disabledColors, setDisabledColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [starsCount, setStarsCount] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (!token) {
          throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
        }

        // Pobierz kolor do odgadnięcia
        const colorData = await getNextColor(token);

        // Ustawienie koloru do odgadnięcia i opcji
        setCurrentColor(colorData.correctColor);
        setOptions([...colorData.uncorrectColors, colorData.correctColor].sort(() => Math.random() - 0.5));
        speak(`Wskaż kolor ${colorTranslations[colorData.correctColor]}`);

        // Pobierz statystyki gracza
        const statsData = await getPlayerStats(2, token);

        // Ustaw statystyki kolorów
        setColorsStats(statsData.stats_details.colors);

        // Ustaw nazwę gracza i liczbę gwiazdek
        setPlayerName(statsData.player_name || 'Gracz');
        setStarsCount(statsData.stars_count || 0);
      } catch (error) {
        console.error('Error initializing game:', error);

        if (error.status === 403) {
          console.warn('Token jest nieważny. Przekierowanie na stronę główną...');
          localStorage.clear();
          navigate('/');
        } else {
          setError(error.message || 'Nie udało się zainicjalizować gry. Spróbuj ponownie później.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [token, navigate]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL'; 
    utterance.rate = 0.9; 
    speechSynthesis.speak(utterance);
  };

  const handleOptionClick = async (option) => {
    try {
      const result = await checkColor(option, token);

      if (result.correct) {
        setMessage('Brawo! Poprawny kolor!');
        setGuessed(true);
        speak(`Brawo! To kolor ${colorTranslations[option]}`);
      } else {
        setMessage('Niepoprawny kolor. Spróbuj ponownie.');
        setDisabledColors((prev) => [...prev, option]);
        speak(`To nie jest poprawny kolor. Spróbuj jeszcze raz.`);
      }

      // Pobierz zaktualizowane statystyki gracza
      const statsData = await getPlayerStats(2, token);
      if (statsData && statsData.stats_details && statsData.stats_details.colors) {
        setColorsStats(statsData.stats_details.colors);
        setStarsCount(statsData.stars_count || 0);
      }
    } catch (error) {
      console.error('Error checking color:', error);
      setError('Wystąpił błąd podczas sprawdzania koloru. Spróbuj ponownie później.');
    }
  };

  const handleNewGame = async () => {
    try {
      setGuessed(false);
      setMessage('');
      setDisabledColors([]);
      setCurrentColor('');
      setOptions([]);
      setError('');

      const colorData = await getNextColor(token);
      setCurrentColor(colorData.correctColor);
      setOptions([...colorData.uncorrectColors, colorData.correctColor].sort(() => Math.random() - 0.5));
      speak(`Wskaż kolor ${colorTranslations[colorData.correctColor]}`);
    } catch (error) {
      console.error('Error starting new game:', error);
      setError('Nie udało się rozpocząć nowej gry. Spróbuj ponownie później.');
    }
  };

  return (
    <div className={style.gameC}>
      {isLoading ? (
        <p>Ładowanie danych...</p>
      ) : (
        <>
          <div className={style.headerContainer}>
            <h1>KOLORY</h1>
          </div>
          {error && <p className={style.errorMessage}>{error}</p>}
          <div className={style.questionBox} onClick={() => !guessed && speak(`Wskaż kolor ${colorTranslations[currentColor]}`)}>
            {guessed ? colorTranslations[currentColor] : '?'}
          </div>
          {guessed ? (
            <button className={style.newGameButton} onClick={handleNewGame}>
              Nowa Gra
            </button>
          ) : (
            <div className={style.optionsContainer}>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={style.colorButton}
                  style={{ backgroundColor: colors[option] }}
                  disabled={disabledColors.includes(option)}
                >
                  {colorTranslations[option]}
                </button>
              ))}
            </div>
          )}
          <div className={style.coloursContainer}>
            {allColors.map(color => (
              <div key={color} className={style.colourBox}>
                <div className={style.letterSquare} style={{ backgroundColor: colors[color] }} />
                <div className={style.starsSquare}>
                  {colorsStats[color] > 0 && (
                    <>
                      <div className={style.starContainer}>
                        <span className={style.star}>★</span>
                      </div>
                      <div className={style.pointsContainer}>
                        <span className={style.points}>{colorsStats[color]}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={style.starsDisplay}>
            <div className={style.starsText}>
              {playerName} ma {starsCount} <span className={style.star}>★</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorGame;