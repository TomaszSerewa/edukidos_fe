import React, { createContext, useContext, useState, useEffect } from 'react';

// Tworzenie kontekstu
const UserContext = createContext();

// Provider dla kontekstu
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Pobieranie userId z sessionStorage przy pierwszym renderze
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Zapisywanie userId w sessionStorage przy każdej zmianie
  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do używania kontekstu
export const useUser = () => useContext(UserContext);