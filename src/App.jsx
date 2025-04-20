import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider
import Home from './components/Home';
import GameCatalog from './components/GameCatalog';
import LetterGame from './games/LetterGame/LetterGame';
import GuestLetterGame from './games/LetterGame/LetterGameUnlogged';
import DirectionsGame from './games/DirectionsGame/DirectionsGame';
import DigitGame from './games/DigitsGame/DigitsGame';
import ColorsGame from './games/ColorsGame/ColorsGame';
import FiguresGame from './games/FiguresGame/FiguresGame';
import LoginModal from './popup/LoginModal';
import StatsPage from './pages/StatsPage';
import Navbar from './components/Navbar';
import Header from './components/Header';

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  return (
    <UserProvider>
      <Header />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/games" element={<GameCatalog />} />
        <Route path="/games/letters" element={<LetterGame />} />
        <Route path="/games/letters-unlogged" element={<GuestLetterGame />} />
        <Route path="/games/digits" element={<DigitGame />} />
        <Route path="/games/directions" element={<DirectionsGame />} />
        <Route path="/games/colors" element={<ColorsGame />} />
        <Route path="/games/figures" element={<FiguresGame />} />
        <Route path="/stats" element={<StatsPage />} />

      </Routes>
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </UserProvider>
  );
};

export default App;