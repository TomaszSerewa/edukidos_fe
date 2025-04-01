import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameCatalog from './components/GameCatalog';
import LetterGame from './games/LetterGame/LetterGame';
import DirectionsGame from './games/DirectionsGame/DirectionsGame';
import DigitGame from './games/DigitsGame/DigitsGame';
import ColorsGame from './games/ColorsGame/ColorsGame';
import FiguresGame from './games/FiguresGame/FiguresGame';

import Navbar from './components/Navbar';
import Header from './components/Header';

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <>
      <Header setUserId={setUserId} />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/games" element={<GameCatalog />} />
        <Route path="/games/letters" element={<LetterGame userId={userId} />} />
        <Route path="/games/digits" element={<DigitGame userId={userId} />} />
        <Route path="/games/directions" element={<DirectionsGame userId={userId} />} />
        <Route path="/games/colors" element={<ColorsGame userId={userId} />} />
        <Route path="/games/figures" element={<FiguresGame userId={userId} />} />



      </Routes>
    </>
  );
};

export default App;