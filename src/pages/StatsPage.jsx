import React from 'react';

const StatsPage = () => {
  const userName = localStorage.getItem('userName');

  return (
    <div>
      <h1>Statystyki gracza</h1>
      <p>Witaj, {userName}! Oto Twoje statystyki:</p>
      {/* Tutaj możesz dodać szczegóły statystyk */}
    </div>
  );
};

export default StatsPage;