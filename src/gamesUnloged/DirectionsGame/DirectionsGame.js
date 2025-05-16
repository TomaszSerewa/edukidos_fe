import React, { useState, useEffect } from 'react';
import './DirectionsGame.css'; // Importuj plik CSS

const directions = ['lewo', 'prawo', 'góra', 'dół'];

const directionArrows = {
  'lewo': '←',
  'prawo': '→',
  'góra': '↑',
  'dół': '↓'
};

const GuestDirectionGame = () => {
  const [currentDirection, setCurrentDirection] = useState('');
  const [options, setOptions] = useState([]);
  const [directionsStats, setDirectionsStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [filteredDirections, setFilteredDirections] = useState([]);
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
        const storedStats = sessionStorage.getItem('directionsStats');
        let initialStats;
        if (storedStats) {
          initialStats = JSON.parse(storedStats);
          setDirectionsStats(initialStats);
        } else {
          initialStats = directions.reduce((acc, direction) => {
            acc[direction] = { directionStats: 0 };
            return acc;
          }, {});
          setDirectionsStats(initialStats);
          sessionStorage.setItem('directionsStats', JSON.stringify(initialStats));
        }

        const filteredDirections = directions.filter(direction => initialStats[direction]?.directionStats < 10);
        setFilteredDirections(filteredDirections);

        await generateNewQuestion(filteredDirections);
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

  const generateNewQuestion = async (filteredDirections) => {
    setGuessed(false);
    try {
      const storedDirection = sessionStorage.getItem('currentDirection');
      let data;
      if (storedDirection) {
        data = { directionToGuess: storedDirection };
      } else {
        const directionToGuess = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
        data = { directionToGuess };
        sessionStorage.setItem('currentDirection', directionToGuess);
      }
      console.log('Fetched next direction:', data);
      setCurrentDirection(data.directionToGuess);
      speak(`Wskaż kierunek ${data.directionToGuess}`);

      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomDirection = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
        if (randomDirection !== data.directionToGuess) {
          optionsSet.add(randomDirection);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.directionToGuess); 
      console.log('Generated options:', optionsArray); 
      setOptions(optionsArray);

      const colors = optionsArray.map(() => getRandomColor());
      setButtonColors(colors);

    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  const getRandomSuccessMessage = (direction) => {
    const messages = [
      `Brawo, to jest ${direction}`,
      `Super, poznajesz kierunek ${direction}`,
      `Tak, to jest ${direction}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...directionsStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { directionStats: 0 };
      }
      if (!updatedStats[currentDirection]) {
        updatedStats[currentDirection] = { directionStats: 0 };
      }

      if (option === currentDirection) {
        setMessage('Correct!');
        updatedStats[option].directionStats += 1;
        setGuessed(true);
        speak(getRandomSuccessMessage(option));
      } else {
        setMessage('Try again!');
        updatedStats[option].directionStats = 0;
        updatedStats[currentDirection].directionStats = 0;
        speak(`To jest ${option}. Spróbuj jeszcze raz.`);
      }

      setDirectionsStats(updatedStats);
      sessionStorage.setItem('directionsStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentDirection'); 
    } catch (error) {
      console.error('Error updating direction stats:', error);
      setError('Failed to update direction stats. Please try again later.');
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

  const handleDirectionClick = (direction) => {
    speak(`To jest ${direction}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu kierunku o który prosi lektor. Za prawidłowe wskazanie kierunku otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdym kierunku a zostaniesz mistrzem kierunków.");
  };

  const handleHelpDirectionsClick = () => {
    speak("Jeżeli nie poznajesz jakiegoś kierunku kliknij na niego aby go usłyszeć.");
  };

  return (
    <div class="game-c">
        <div className="header-container">
        <h1>KIERUNKI</h1>
        <button className="help-button" onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="question-box" onClick={() => speak(`Wskaż kierunek ${currentDirection}`)}>
        ?
        <span className="speaker-icon" role="img" aria-label="speaker">🔊</span>
      </div>
      {guessed &&       
        <div>
        <button className="new-game-button" onClick={() => generateNewQuestion(filteredDirections)}>Nowa Gra</button>
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
              {directionArrows[option]}
            </button>
          ))
        )}
      </div>
      <div>
        <div className="header-container">
            <h1>KIERUNKI</h1>
            <button className="help-button" onClick={handleHelpDirectionsClick}>
                Pomoc <span role="img" aria-label="help">❓🔊</span>
              </button>
        </div>

      </div>
      <div className="directions-container">
        <div className="direction-box" >
          <div className="stars-square">{renderStars(directionsStats['góra']?.directionStats || 0)}</div>
          <button className="direction-square" onClick={() => handleDirectionClick('góra')}>
            {directionArrows['góra']}
          </button>
        </div>
        <div className="directions-row">
          <div className="direction-box">
            <div className="stars-square">{renderStars(directionsStats['lewo']?.directionStats || 0)}</div>
            <button className="direction-square" onClick={() => handleDirectionClick('lewo')}>
              {directionArrows['lewo']}
            </button>
          </div>
          <div className="direction-box" >
            <div className="stars-square">{renderStars(directionsStats['prawo']?.directionStats || 0)}</div>
            <button className="direction-square" onClick={() => handleDirectionClick('prawo')}>
              {directionArrows['prawo']}
            </button>
          </div>
        </div>
        <div className="direction-box" >
          <div className="stars-square">{renderStars(directionsStats['dół']?.directionStats || 0)}</div>
          <button className="direction-square" onClick={() => handleDirectionClick('dół')}>
            {directionArrows['dół']}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDirectionGame;