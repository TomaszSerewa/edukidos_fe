import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);

  const logout = () => {
    setUser(null);
    localStorage.clear(); // Usuń wszystkie dane z localStorage
    window.location.reload(); // Przeładuj stronę
  };

  return { user, setUser, logout };
};