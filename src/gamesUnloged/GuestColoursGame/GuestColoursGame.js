import React, { useState, useEffect } from 'react';
import style from './GuestColoursGame.module.css';

const allColors = [
  'czerwony', 'niebieski', 'zielony', 'żółty', 'pomarańczowy',
  'fioletowy', 'różowy', 'brązowy', 'czarny', 'biały', 'błękitny', 'szary'
];

const colorMap = {
  'czerwony': '#FF0000',
  'niebieski': '#0000FF',
  'zielony': '#008000',
  'żółty': '#FFFF00',
  'pomarańczowy': '#FFA500',
  'fioletowy': '#800080',
  'różowy': '#FFC0CB',
  'brązowy': '#A52A2A',
  'czarny': '#000000',
  'biały': '#FFFFFF',
  'błękitny': '#00BFFF',
  'szary': '#808080'
};

const GuestColoursGame = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [options, setOptions] = useState([]);
  const [colorsStats, setColorsStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [buttonColors, setButtonColors] = useState([]);
  const [colors, setColors] = useState([]);
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
        const storedStats = sessionStorage.getItem('colorsStats');
        let initialStats;
        if (storedStats) {
          initialStats = JSON.parse(storedStats);
          setColorsStats(initialStats);
        } else {
          initialStats = allColors.reduce((acc, color) => {
            acc[color] = { colorStats: 0 };
            return acc;
          }, {});
          setColorsStats(initialStats);
          sessionStorage.setItem('colorsStats', JSON.stringify(initialStats));
        }

        const filteredColors = allColors.filter(color => initialStats[color]?.colorStats < 10);
        setColors(filteredColors);

        await generateNewQuestion(filteredColors);
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

  const generateNewQuestion = async (filteredColors) => {
    setGuessed(false);
    try {
      const storedColor = sessionStorage.getItem('currentColor');
      let data;
      if (storedColor) {
        data = { colorToGuess: storedColor };
      } else {
        const colorToGuess = filteredColors[Math.floor(Math.random() * filteredColors.length)];
        data = { colorToGuess };
        sessionStorage.setItem('currentColor', colorToGuess);
      }
      setCurrentColor(data.colorToGuess);
      speak(`Wskaż kolor ${data.colorToGuess}`);

      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomColor = filteredColors[Math.floor(Math.random() * filteredColors.length)];
        if (randomColor !== data.colorToGuess) {
          optionsSet.add(randomColor);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.colorToGuess); 
      setOptions(optionsArray);

      const colors = optionsArray.map(color => colorMap[color]);
      setButtonColors(colors);

    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  const getRandomSuccessMessage = (color) => {
    const messages = [
      `Brawo, to kolor ${color}`,
      `Super, poznajesz kolor ${color}`,
      `Tak, to kolor ${color}`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...colorsStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { colorStats: 0 };
      }
      if (!updatedStats[currentColor]) {
        updatedStats[currentColor] = { colorStats: 0 };
      }

      if (option === currentColor) {
        setMessage('Correct!');
        updatedStats[option].colorStats += 1;
        setGuessed(true);
        speak(getRandomSuccessMessage(option));
      } else {
        setMessage('Try again!');
        updatedStats[option].colorStats = 0;
        updatedStats[currentColor].colorStats = 0;
        speak(`To jest kolor ${option}. Spróbuj jeszcze raz.`);
      }

      setColorsStats(updatedStats);
      sessionStorage.setItem('colorsStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentColor'); 
    } catch (error) {
      console.error('Error updating color stats:', error);
      setError('Failed to update color stats. Please try again later.');
    }
  };

  const renderStars = (points) => {
    if (points === 0) {
      return [];
    }

    const stars = [];
    const fullStars = Math.floor(points / 2);
    const halfStar = points % 2;

    const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={`${style.star} ${style.full} ${style[positions[i]]}`}>★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className={`${style.star} ${style.half} ${style[positions[fullStars]]}`}>☆</span>);
    }

    return stars;
  };

  const handleColorClick = (color) => {
    speak(`To jest kolor ${color}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu koloru o który prosi lektor. Za prawidłowe wskazanie koloru otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdym kolorze a zostaniesz mistrzem kolorów.");
  };

  const handleHelpColorsClick = () => {
    speak("Jeżeli nie poznajesz jakiegoś koloru kliknij na niego aby go usłyszeć.");
  };

  return (
    <div className={style.gameC}>
      <div className={style.headerContainer}>
        <h1>KOLORY</h1>
        <button className={style.helpButton} onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className={style.errorMessage}>{error}</p>}
      <div className={style.questionBox} onClick={() => speak(`Wskaż kolor ${currentColor}`)}>
        ?
        <span className={style.speakerIcon} role="img" aria-label="speaker">🔊</span>
      </div>
      {guessed &&       
        <div>
          <button className={style.newGameButton} onClick={() => generateNewQuestion(colors)}>Nowa Gra</button>
        </div>
      }
      <div className={style.optionsContainer}>
        {!guessed && (
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={style.letterButton}
              style={{ backgroundColor: buttonColors[index] }}
            >
              {option}
            </button>
          ))
        )}
      </div>
      <div>
        <div className={style.headerContainer}>
          <h1>KOLORY</h1>
          <button className={style.helpButton} onClick={handleHelpColorsClick}>
            Pomoc <span role="img" aria-label="help">❓🔊</span>
          </button>
        </div>
        <div className={style.alphabetContainer}>
          {allColors.map(color => (
            <div key={color} className={style.letterBox}>
              <button
                className={style.letterSquare}
                style={{ backgroundColor: colorMap[color] }}
                onClick={() => handleColorClick(color)}
              >
                {color}
              </button>
              <div className={style.starsSquare}>{renderStars(colorsStats[color]?.colorStats || 0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestColoursGame;