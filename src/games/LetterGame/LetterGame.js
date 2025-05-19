import React, { useState, useEffect } from 'react';
import style from './LetterGame.module.css'; 
import { getPlayerStats } from '../../common/api'; 
import { getNextLetter, checkLetter } from '../../common/gamesApi/lettersApi'; 
import { useNavigate } from 'react-router-dom';

const allLetters = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ'.split('');

const LetterGame = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [lettersStats, setLettersStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [starsCount, setStarsCount] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
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

        const letterData = await getNextLetter(token);
        setCurrentLetter(letterData.correctLetter);
        setOptions([...letterData.uncorrectLetters, letterData.correctLetter].sort(() => Math.random() - 0.5));
        speak(`Wskaż literę ${letterData.correctLetter}`);

        const statsData = await getPlayerStats(1, token);
        setLettersStats(statsData.stats_details.alphabet);
        setPlayerName(statsData.player_name || 'Gracz');
        setStarsCount(statsData.stars_count || 0);
      } catch (error) {
        console.error('Error initializing game:', error);
        if (error.status === 403) {
          console.warn('Token jest nieważny. Wylogowywanie użytkownika...');
          localStorage.clear();
          navigate('/');
        } else {
          setError(error.message || 'Nie udało się zainicjalizować gry. Spróbuj ponownie później.');
        }
      } finally {
        setIsLoading(false);
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
      const result = await checkLetter(option, token);

      if (result.correct) {
        setMessage('Brawo! Poprawna litera!');
        setGuessed(true);
        speak(`Brawo! To litera ${option}`);
      } else {
        setMessage('Niepoprawna litera. Spróbuj ponownie.');
        setDisabledLetters((prev) => [...prev, option]);
        speak(`To nie jest poprawna litera. Spróbuj jeszcze raz.`);
      }

      const statsData = await getPlayerStats(1, token);
      if (statsData && statsData.stats_details && statsData.stats_details.alphabet) {
        setLettersStats(statsData.stats_details.alphabet);
        setStarsCount(statsData.stars_count || 0);
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

      const letterData = await getNextLetter(token);
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
    <div className={style.gameContainer}>
      {isLoading ? (
        <p>Ładowanie danych...</p>
      ) : (
        <>
          <div className={style.starsDisplay}>
            <div className={style.starsText}>
              {playerName} ma {starsCount} 
            </div>
            <div className={style.star}>★</div>
          </div>
          <div className={style.headerContainer}>
            <h1>LITERKI</h1>
          </div>
          {error && <p className={style.errorMessage}>{error}</p>}
          <div className={style.questionBox} onClick={() => !guessed && speak(`Wskaż literę ${currentLetter}`)}>
            {guessed ? currentLetter : '?'}
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
                  className={style.letterButton}
                  style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)` }} 
                  disabled={disabledLetters.includes(option)} 
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className={style.alphabetContainer}>
            {allLetters.map((letter) => (
              <div key={letter} className={style.letterBox}>
                <button
                  className={style.letterSquare}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
                    opacity: disabledLetters.includes(letter) ? 0.5 : 1,
                    cursor: disabledLetters.includes(letter) ? 'not-allowed' : 'pointer',
                  }}
                  disabled={disabledLetters.includes(letter)}
                >
                  {letter}
                </button>
                <div className={style.starsSquare}>
                  {lettersStats[letter] > 0 && (
                    <>
                      <div className={style.starContainer}>
                        <span className={style.star}>★</span>
                      </div>
                      <div className={style.pointsContainer}>
                        <span className={style.points}>{lettersStats[letter]}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LetterGame;