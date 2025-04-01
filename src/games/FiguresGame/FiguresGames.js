import React, { useState, useEffect } from 'react';
import './FiguresGame.css'; // Importuj plik CSS

const allFigures = [
  'kwadrat', 'koło', 'trójkąt', 'prostokąt', 'romb', 'pięciokąt', 'sześciokąt', 'siedmiokąt', 'ośmiokąt', 'elipsa'
];

const figureShapes = {
  'kwadrat': '⬛',
  'koło': '⚪',
  'trójkąt': '🔺',
  'prostokąt': '▬',
  'romb': '♦',
  'pięciokąt': '⬟',
  'sześciokąt': '⬢',
  'siedmiokąt': '⬣',
  'ośmiokąt': '⯃',
  'elipsa': '⬭'
};

const GuestFiguresGame = () => {
  const [currentFigure, setCurrentFigure] = useState('');
  const [options, setOptions] = useState([]);
  const [figuresStats, setFiguresStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [filteredFigures, setFilteredFigures] = useState([]);
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
        const storedStats = sessionStorage.getItem('figuresStats');
        let initialStats;
        if (storedStats) {
          initialStats = JSON.parse(storedStats);
          setFiguresStats(initialStats);
        } else {
          initialStats = allFigures.reduce((acc, figure) => {
            acc[figure] = { figureStats: 0 };
            return acc;
          }, {});
          setFiguresStats(initialStats);
          sessionStorage.setItem('figuresStats', JSON.stringify(initialStats));
        }

        const filteredFigures = allFigures.filter(figure => initialStats[figure]?.figureStats < 10);
        setFilteredFigures(filteredFigures);

        await generateNewQuestion(filteredFigures);
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

  const generateNewQuestion = async (filteredFigures) => {
    setGuessed(false);
    try {
      const storedFigure = sessionStorage.getItem('currentFigure');
      let data;
      if (storedFigure) {
        data = { figureToGuess: storedFigure };
      } else {
        const figureToGuess = filteredFigures[Math.floor(Math.random() * filteredFigures.length)];
        data = { figureToGuess };
        sessionStorage.setItem('currentFigure', figureToGuess);
      }
      console.log('Fetched next figure:', data);
      setCurrentFigure(data.figureToGuess);
      speak(`Wskaż figurę ${data.figureToGuess}`);

      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomFigure = filteredFigures[Math.floor(Math.random() * filteredFigures.length)];
        if (randomFigure !== data.figureToGuess) {
          optionsSet.add(randomFigure);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.figureToGuess); 
      console.log('Generated options:', optionsArray); 
      setOptions(optionsArray);

      const colors = optionsArray.map(() => getRandomColor());
      setButtonColors(colors);

    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  const getRandomSuccessMessage = (figure) => {
    const messages = [
      `Brawo, to jest ${figure}`,
      `Super, poznajesz figurę ${figure}`,
      `Tak, to jest ${figure}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...figuresStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { figureStats: 0 };
      }
      if (!updatedStats[currentFigure]) {
        updatedStats[currentFigure] = { figureStats: 0 };
      }

      if (option === currentFigure) {
        setMessage('Correct!');
        updatedStats[option].figureStats += 1;
        setGuessed(true);
        speak(getRandomSuccessMessage(option));
      } else {
        setMessage('Try again!');
        updatedStats[option].figureStats = 0;
        updatedStats[currentFigure].figureStats = 0;
        speak(`To jest ${option}. Spróbuj jeszcze raz.`);
      }

      setFiguresStats(updatedStats);
      sessionStorage.setItem('figuresStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentFigure'); 
    } catch (error) {
      console.error('Error updating figure stats:', error);
      setError('Failed to update figure stats. Please try again later.');
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

  const handleFigureClick = (figure) => {
    speak(`To jest ${figure}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu figury o którą prosi lektor. Za prawidłowe wskazanie figury otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdej figurze a zostaniesz mistrzem figur.");
  };

  const handleHelpFiguresClick = () => {
    speak("Jeżeli nie poznajesz jakiejś figury kliknij na nią aby ją usłyszeć.");
  };

  return (
    <div className="game-container">
      <div className="header-container">
        <h1>FIGURY</h1>
        <button className="help-button" onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="question-box" onClick={() => speak(`Wskaż figurę ${currentFigure}`)}>
        {guessed ? figureShapes[currentFigure] : '?'}
        <span className="speaker-icon" role="img" aria-label="speaker">🔊</span>
      </div>
      {guessed &&       
        <div>
          <button className="new-game-button" onClick={() => generateNewQuestion(filteredFigures)}>Nowa Gra</button>
        </div>
      }
      <div className="options-container">
        {!guessed && (
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="figure-button"
              style={{ backgroundColor: buttonColors[index] }}
            >
              {figureShapes[option]}
            </button>
          ))
        )}
      </div>
      <div>
        <div className="header-container">
            <h1>FIGURY</h1>
            <button className="help-button" onClick={handleHelpFiguresClick}>
                Pomoc <span role="img" aria-label="help">❓🔊</span>
              </button>
        </div>
        <div className="figures-container">
          <div className="figure-box" style={{ gridArea: 'góra' }}>
            <div className="stars-square">{renderStars(figuresStats['góra']?.figureStats || 0)}</div>
            <button className="figure-button" onClick={() => handleFigureClick('góra')}>
              {figureShapes['góra']}
            </button>
          </div>
          <div className="figure-box" style={{ gridArea: 'lewo' }}>
            <div className="stars-square">{renderStars(figuresStats['lewo']?.figureStats || 0)}</div>
            <button className="figure-button" onClick={() => handleFigureClick('lewo')}>
              {figureShapes['lewo']}
            </button>
          </div>
          <div className="figure-box" style={{ gridArea: 'prawo' }}>
            <div className="stars-square">{renderStars(figuresStats['prawo']?.figureStats || 0)}</div>
            <button className="figure-button" onClick={() => handleFigureClick('prawo')}>
              {figureShapes['prawo']}
            </button>
          </div>
          <div className="figure-box" style={{ gridArea: 'dół' }}>
            <div className="stars-square">{renderStars(figuresStats['dół']?.figureStats || 0)}</div>
            <button className="figure-button" onClick={() => handleFigureClick('dół')}>
              {figureShapes['dół']}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestFiguresGame;