import React, { useState, useEffect } from 'react';
import './LetterGame.css'; 
import { getPlayerStats } from '../../common/api'; 
import { getNextLetter, checkLetter } from '../../common/gamesApi/lettersApi'; 

const allLetters = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ'.split('');

const LetterGame = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [lettersStats, setLettersStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [disabledLetters, setDisabledLetters] = useState([]); // Lista nieaktywnych liter
  const [isLoading, setIsLoading] = useState(true); // Dodaj stan isLoading
  const [playerName, setPlayerName] = useState('');
  const [starsCount, setStarsCount] = useState(0);
  const token = localStorage.getItem('token'); // Pobierz token z localStorage
  let polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));

  useEffect(() => {
    const loadVoices = async () => {
      return new Promise(async (resolve) => {
        let voices = await speechSynthesis.getVoices();
        if (voices.length !== 0) {
          setVoices(voices);
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = async () => {
            voices = await speechSynthesis.getVoices();
            setVoices(voices);
            resolve();
          };
        }
      });
    };

    const initializeGame = async () => {
      try {
        if (!token) {
          throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
        }

        // Pobierz literę do odgadnięcia
        const letterData = await getNextLetter(token);
        console.log('Fetched next letter:', letterData);

        // Ustawienie litery do odgadnięcia i opcji
        setCurrentLetter(letterData.correctLetter);
        setOptions([...letterData.uncorrectLetters, letterData.correctLetter].sort(() => Math.random() - 0.5));
        speak(`Wskaż literę ${letterData.correctLetter}`);

        // Pobierz statystyki gracza
        const statsData = await getPlayerStats(1, token); // Zakładamy gameId = 1
        console.log('Fetched player stats:', statsData);

        // Ustaw statystyki liter
        setLettersStats(statsData.stats_details.alphabet);

        // Ustaw nazwę gracza i liczbę gwiazdek
        setPlayerName(statsData.player_name || 'Gracz'); // Zakładamy, że `player_name` jest w `statsData`
        setStarsCount(statsData.stars_count || 0);
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Nie udało się zainicjalizować gry. Spróbuj ponownie później.');
      } finally {
        setIsLoading(false); // Ustaw isLoading na false po zakończeniu ładowania
      }
    };

    const initialize = async () => {
      await loadVoices();
      await initializeGame();
    };

    initialize();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (polishFemaleVoice) {
      utterance.voice = polishFemaleVoice;
    }

    utterance.lang = 'pl-PL'; 
    utterance.rate = 0.9; 
    speechSynthesis.speak(utterance);
  };

  const handleOptionClick = async (option) => {
    try {
      // Wywołaj endpoint do sprawdzania litery
      const result = await checkLetter(option, token);

      if (result.correct) {
        setMessage('Brawo! Poprawna litera!');
        setGuessed(true); // Ustaw stan na odgadnięte
        speak(`Brawo! To litera ${option}`);
      } else {
        setMessage('Niepoprawna litera. Spróbuj ponownie.');
        setDisabledLetters((prev) => [...prev, option]); // Dodaj literę do listy nieaktywnych
        speak(`To nie jest poprawna litera. Spróbuj jeszcze raz.`);
      }

      // Pobierz zaktualizowane statystyki gracza
      const statsData = await getPlayerStats(1, token); // Zakładamy gameId = 1
      if (statsData && statsData.stats_details && statsData.stats_details.alphabet) {
        setLettersStats(statsData.stats_details.alphabet); // Zaktualizuj statystyki liter
        setStarsCount(statsData.stars_count || 0); // Zaktualizuj liczbę gwiazdek
      }
    } catch (error) {
      console.error('Error checking letter:', error);
      setError('Wystąpił błąd podczas sprawdzania litery. Spróbuj ponownie później.');
    }
  };

  const handleNewGame = async () => {
    try {
      setGuessed(false);
      setMessage('');
      setDisabledLetters([]);
      setCurrentLetter('');
      setOptions([]);
      setError('');

      // Pobierz nową literę do odgadnięcia
      const letterData = await getNextLetter(token);
      console.log('Fetched new letter for new game:', letterData);

      // Ustaw nową literę i opcje
      setCurrentLetter(letterData.correctLetter);
      setOptions([...letterData.uncorrectLetters, letterData.correctLetter].sort(() => Math.random() - 0.5));
      speak(`Wskaż literę ${letterData.correctLetter}`);
    } catch (error) {
      console.error('Error starting new game:', error);
      setError('Nie udało się rozpocząć nowej gry. Spróbuj ponownie później.');
    }
  };

  const handleLetterClick = (letter) => {
    speak(`To jest litera ${letter}`);
  };

  return (
    <div className="game-c">
      {isLoading ? (
        <p>Ładowanie danych...</p> // Placeholder podczas ładowania
      ) : (
        <>
          <div className="header-container">
            <h1>LITERKI</h1>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="question-box" onClick={() => !guessed && speak(`Wskaż literę ${currentLetter}`)}>
            {guessed ? currentLetter : '?'}
          </div>
          {guessed ? (
            <button className="new-game-button" onClick={handleNewGame}>
              Nowa Gra
            </button>
          ) : (
            <div className="options-container">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="letter-button"
                  disabled={disabledLetters.includes(option)} // Wyłącz przycisk, jeśli litera jest nieaktywna
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="alphabet-container">
            {allLetters.map(letter => (
              <div key={letter} className="letter-box">
                <button className="letter-square" onClick={() => handleLetterClick(letter)}>
                  {letter}
                </button>
                <div className="stars-square">
                  {lettersStats[letter] > 0 && (
                    <>
                      <div className="star-container">
                        <span className="star">★</span>
                      </div>
                      <div className="points-container">
                        <span className="points">{lettersStats[letter]}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="stars-display">
            <div className="stars-text">
              {playerName} ma {starsCount} <span className="star">★</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LetterGame;