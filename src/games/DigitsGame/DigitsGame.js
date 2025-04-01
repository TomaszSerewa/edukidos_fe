import React, { useState, useEffect } from 'react';
import './DigitsGame.css'; // Importuj plik CSS

const allDigits = '0123456789'.split('');

const GuestDigitGame = () => {
  const [currentDigit, setCurrentDigit] = useState('');
  const [options, setOptions] = useState([]);
  const [digitsStats, setDigitsStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [digits, setDigits] = useState([]);
  let polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));

  useEffect(() => {
    const loadVoices = async () => {
      return new Promise(async (resolve) => {
        let voices = await speechSynthesis.getVoices();
        if (voices.length !== 0) {
          setVoices(voices);
          polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = async () => {
            voices = await speechSynthesis.getVoices();
            setVoices(voices);
            polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));
            resolve();
          };
        }
      });
    };

    const initializeGame = async () => {
      try {
        const storedStats = sessionStorage.getItem('digitsStats');
        let initialStats;
        if (storedStats) {
          initialStats = JSON.parse(storedStats);
          setDigitsStats(initialStats);
        } else {
          initialStats = allDigits.reduce((acc, digit) => {
            acc[digit] = { digitStats: 0 };
            return acc;
          }, {});
          setDigitsStats(initialStats);
          sessionStorage.setItem('digitsStats', JSON.stringify(initialStats));
        }

        const filteredDigits = allDigits.filter(digit => initialStats[digit]?.digitStats < 10);
        setDigits(filteredDigits);

        await generateNewQuestion(filteredDigits);
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to initialize game. Please try again later.');
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

  const generateNewQuestion = async (filteredDigits) => {
    setGuessed(false);
    try {
      const storedDigit = sessionStorage.getItem('currentDigit');
      let data;
      if (storedDigit) {
        data = { digitToGuess: storedDigit };
      } else {
        const digitToGuess = filteredDigits[Math.floor(Math.random() * filteredDigits.length)];
        data = { digitToGuess };
        sessionStorage.setItem('currentDigit', digitToGuess);
      }
      console.log('Fetched next digit:', data);
      setCurrentDigit(data.digitToGuess);
      speak(`Wskaż cyfrę ${data.digitToGuess}`);

      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomDigit = filteredDigits[Math.floor(Math.random() * filteredDigits.length)];
        if (randomDigit !== data.digitToGuess) {
          optionsSet.add(randomDigit);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.digitToGuess); 
      console.log('Generated options:', optionsArray); 
      setOptions(optionsArray);

      const colors = optionsArray.map(() => getRandomColor());
      setButtonColors(colors);

    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  const getRandomSuccessMessage = (digit) => {
    const messages = [
      `Brawo, to cyfra ${digit}`,
      `Super, poznajesz cyfrę ${digit}`,
      `Tak, to cyfra ${digit}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...digitsStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { digitStats: 0 };
      }
      if (!updatedStats[currentDigit]) {
        updatedStats[currentDigit] = { digitStats: 0 };
      }

      if (option === currentDigit) {
        setMessage('Correct!');
        updatedStats[option].digitStats += 1;
        setGuessed(true);
        speak(getRandomSuccessMessage(option));
      } else {
        setMessage('Try again!');
        updatedStats[option].digitStats = 0;
        updatedStats[currentDigit].digitStats = 0;
        speak(`To jest cyfra ${option}. Spróbuj jeszcze raz.`);
      }

      setDigitsStats(updatedStats);
      sessionStorage.setItem('digitsStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentDigit'); 
    } catch (error) {
      console.error('Error updating digit stats:', error);
      setError('Failed to update digit stats. Please try again later.');
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

  const handleDigitClick = (digit) => {
    speak(`To jest cyfra ${digit}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu cyfry o którą prosi lektor. Za prawidłowe wskazanie cyfry otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdej cyfrze a zostaniesz mistrzem cyfr.");
  };

  const handleHelpDigitsClick = () => {
    speak("Jeżeli nie poznajesz jakiejś cyfry kliknij na nią aby ją usłyszeć.");
  };

  return (
    <div class="game-c">
        <div className="header-container">
        <h1>CYFRY</h1>
        <button className="help-button" onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="question-box" onClick={() => speak(`Wskaż cyfrę ${currentDigit}`)}>
        {guessed ? currentDigit : '?'}
        <span className="speaker-icon" role="img" aria-label="speaker">🔊</span>
      </div>
      {guessed &&       
        <div>
        <button className="new-game-button" onClick={() => generateNewQuestion(digits)}>Nowa Gra</button>
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
            <h1>CYFRY</h1>
            <button className="help-button" onClick={handleHelpDigitsClick}>
                Pomoc <span role="img" aria-label="help">❓🔊</span>
              </button>
        </div>
        <div className="alphabet-container">
          {allDigits.map(digit => (
            <div key={digit} className="letter-box">
              <button className="letter-square" onClick={() => handleDigitClick(digit)}>{digit}</button>
              <div className="stars-square">{renderStars(digitsStats[digit]?.digitStats || 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDigitGame;