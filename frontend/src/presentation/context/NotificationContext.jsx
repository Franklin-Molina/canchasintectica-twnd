import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000); // La notificación desaparece después de 4 segundos
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
