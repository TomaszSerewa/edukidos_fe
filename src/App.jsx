import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; 
import Home from './components/Home';
import HomeUnlogged from './components/HomeUnlogged'; 
import GameCatalog from './components/GameCatalog';
import LetterGame from './games/LetterGame/LetterGame';
import GuestLetterGame from './gamesUnloged/GuestLetterGame/LetterGameUnlogged';
import DirectionsGame from './gamesUnloged/DirectionsGame/DirectionsGame';
import DigitGame from './gamesUnloged/DigitsGame/DigitsGame';
import GuestColoursGame from './gamesUnloged/GuestColoursGame/GuestColoursGame';
import FiguresGame from './gamesUnloged/FiguresGame/FiguresGame';
import ColoursGame from './games/ColoursGame/ColoursGame';
import StatsPage from './pages/StatsPage';
import Navbar from './components/Navbar';
import Header from './components/Header';
import WelcomePage from './pages/WelcomePage';
import LoginModal from './popup/LoginModal';

const App = () => {
  const [user, setUser] = useState(null); // Stan użytkownika
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Kontrola widoczności modala logowania

  // Sprawdzenie, czy użytkownik jest zalogowany na podstawie localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserAvatar = localStorage.getItem('userAvatar');

    if (storedUserId && storedUserName) {
      setUser({
        id: storedUserId,
        name: storedUserName,
        avatar: storedUserAvatar,
      });
    }
    setIsLoading(false); // Ustawienie ładowania na false po sprawdzeniu
  }, []);

  // Loguj zmiany stanu użytkownika
  useEffect(() => {
    console.log('Stan użytkownika:', user);
  }, [user]);

  const handleLoginSuccess = (userData) => {
    console.log('Dane użytkownika:', userData); // Loguj dane użytkownika
    // Zapisz dane użytkownika w localStorage
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userAvatar', userData.avatar);

    // Ustaw dane użytkownika w stanie
    setUser(userData);

    // Zamknij modal logowania
    setIsLoginModalOpen(false);

    console.log('Zalogowano użytkownika:', userData);
  };

  if (isLoading) {
    // Wyświetl ekran ładowania, jeśli aplikacja sprawdza stan logowania
    return <div>Ładowanie...</div>;
  }

  return (
    <UserProvider>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<HomeUnlogged/>} />
        <Route path="/games" element={<GameCatalog />} />
        <Route path="/games/letters" element={<LetterGame />} />
        <Route path="/gamesUnlogged/letters-unlogged" element={<GuestLetterGame />} />
        <Route path="/gamesUnlogged/digits" element={<DigitGame />} />
        <Route path="/gamesUnlogged/directions" element={<DirectionsGame />} />
        <Route path="/games/colours" element={<ColoursGame />} />
        <Route path="/gamesUnlogged/colours-unloged" element={<GuestColoursGame />} />
        <Route path="/gamesUnlogged/figures" element={<FiguresGame />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
      <div>
        {isLoginModalOpen && (
          <LoginModal
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setIsLoginModalOpen(false)}
          />
        )}
      </div>
    </UserProvider>
  );
};

export default App;