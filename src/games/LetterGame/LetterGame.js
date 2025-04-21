import React, { useState, useEffect } from 'react';
import './LetterGame.css'; // Importuj plik CSS
import { getNextLetter, getPlayerStats, updatePlayerStats } from '../../common/api'; // Import funkcji API

const allLetters = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ'.split('');

const LetterGame = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [lettersStats, setLettersStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [letters, setLetters] = useState([]);
  const userId = localStorage.getItem('userId'); // Pobierz ID użytkownika z localStorage
  const gameId = 1; // ID gry (możesz ustawić dynamicznie)
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
        const token = localStorage.getItem('token'); // Pobierz token z localStorage
        if (!token) {
          throw new Error('Brak tokena uwierzytelniającego. Zaloguj się ponownie.');
        }

        const data = await getNextLetter(userId, token); // Wywołanie funkcji API
        console.log('Fetched next letter:', data);

        // Ustawienie litery do odgadnięcia i opcji
        setCurrentLetter(data.correctLetter);
        setOptions([...data.uncorrectLetters, data.correctLetter].sort(() => Math.random() - 0.5)); // Losowe rozmieszczenie opcji
        speak(`Wskaż literę ${data.correctLetter}`);
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Nie udało się zainicjalizować gry. Spróbuj ponownie później.');
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
      utterance.voice =  polishFemaleVoice;
    }

    utterance.lang = 'pl-PL'; 
    utterance.rate = 0.9; 
    speechSynthesis.speak(utterance);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateNewQuestion = async (filteredLetters) => {
    setGuessed(false);
    try {
      const storedLetter = sessionStorage.getItem('currentLetter');
      let data;
      if (storedLetter) {
        data = { letterToGuess: storedLetter };
      } else {
        const letterToGuess = filteredLetters[Math.floor(Math.random() * filteredLetters.length)];
        data = { letterToGuess };
        sessionStorage.setItem('currentLetter', letterToGuess);
      }
      console.log('Fetched next letter:', data);
      setCurrentLetter(data.letterToGuess);
      speak(`Wskaż literę ${data.letterToGuess}`);

      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomLetter = filteredLetters[Math.floor(Math.random() * filteredLetters.length)];
        if (randomLetter !== data.letterToGuess) {
          optionsSet.add(randomLetter);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.letterToGuess); 
      console.log('Generated options:', optionsArray); 
      setOptions(optionsArray);

      const colors = optionsArray.map(() => getRandomColor());
      setButtonColors(colors);

    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  function betterLetter(letter) {
    if (letter === 'W') {
      return 'WU';
    } 
    return letter;
  }

  const getRandomSuccessMessage = (letter) => {
    const messages = [
      `Brawo, to litera ${betterLetter(letter)}`,
      `Super, poznajesz literę ${betterLetter(letter)}`,
      `Tak, to litera ${betterLetter(letter)}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...lettersStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { letterStats: 0 };
      }
      if (!updatedStats[currentLetter]) {
        updatedStats[currentLetter] = { letterStats: 0 };
      }

      let isCorrect = false;

      if (option === currentLetter) {
        setMessage('Correct!');
        updatedStats[option].letterStats += 1;
        setGuessed(true);
        speak(getRandomSuccessMessage(option));
        isCorrect = true;
      } else {
        setMessage('Try again!');
        updatedStats[option].letterStats = 0;
        updatedStats[currentLetter].letterStats = 0;
        speak(`To jest litera ${option}. Spróbuj jeszcze raz.`);
      }

      setLettersStats(updatedStats);
      sessionStorage.setItem('lettersStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentLetter');
      sessionStorage.removeItem('userId');

      // Wyślij statystyki na backend dla zalogowanego użytkownika
      const playerId = sessionStorage.getItem('playerId'); // Pobierz ID gracza z sesji
      const gameId = 1; // ID gry (możesz ustawić dynamicznie)
      if (playerId) {
        await updatePlayerStats(playerId, gameId, 1, { letter: currentLetter, isCorrect });
      }
    } catch (error) {
      console.error('Error updating letter stats:', error);
      setError('Failed to update letter stats. Please try again later.');
    }
  };

  const renderStars = (points) => {
    if (points === 0) {
      return [];
    }

    const stars = [];
    const fullStars = Math.floor(points / 2);
    const halfStar = points % 2;

    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={`star full ${positions[i]}`}>★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className={`star half ${positions[fullStars]}`}>☆</span>);
    }

    return stars;
  };



  const handleLetterClick = (letter) => {
    speak(`To jest litera ${betterLetter(letter)}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu litery o którą prosi lektor. Za prawidłowe wskazanie literki otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdej literze a zostaniesz mistrzem alfabetu.");
  };

  const handleHelpLettersClick = () => {
    speak("Jeżeli nie poznajesz jakiejś litery kliknij na nią aby ją usłyszeć.");
  };

  return (
    <div class="game-c">
        <div className="header-container">
        <h1>LITERKI</h1>
        <button className="help-button" onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="question-box" onClick={() => speak(`Wskaż literę ${betterLetter(currentLetter)}`)}>
        {guessed ? currentLetter : '?'}
        <span className="speaker-icon" role="img" aria-label="speaker">🔊</span>
      </div>
      {guessed &&       
        <div>
        <button className="new-game-button" onClick={() => generateNewQuestion(letters)}>Nowa Gra</button>
        </div>
      }
      <div className="options-container">
        {!guessed && (
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="letter-button"
              style={{ backgroundColor: buttonColors[index] }}
            >
              {option}
            </button>
          ))
        )}
      </div>
      <div>
        <div className="header-container">
            <h1>ALFABET</h1>
            <button className="help-button" onClick={handleHelpLettersClick}>
                Pomoc <span role="img" aria-label="help">❓🔊</span>
              </button>
        </div>
        <div className="alphabet-container">
          {allLetters.map(letter => (
            <div key={letter} className="letter-box">
              <button className="letter-square" onClick={() => handleLetterClick(letter)}>{letter}</button>
              <div className="stars-square">{renderStars(lettersStats[letter]?.letterStats || 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LetterGame;