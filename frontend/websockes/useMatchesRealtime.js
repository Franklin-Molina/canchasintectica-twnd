// src/hooks/useMatchesRealtime.js
import { useEffect, useCallback } from 'react';
import { matchesWebSocket } from '../infrastructure/websocket/matchesWebSocket';

export const useMatchesRealtime = (onUpdate) => {
  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.warn('No token found. WebSocket will not connect.');
      return;
    }

    // Conectar al WebSocket
    matchesWebSocket.connect(token);

    // Suscribirse a las actualizaciones
    const unsubscribe = matchesWebSocket.subscribe((data) => {
      if (onUpdate) {
        onUpdate(data);
      }
    });

    // Cleanup: desconectar cuando el componente se desmonte
    return () => {
      unsubscribe();
      // NO desconectar completamente aquí si otros componentes lo usan
      // matchesWebSocket.disconnect();
    };
  }, [onUpdate]);

  return {
    send: useCallback((data) => {
      matchesWebSocket.send(data);
    }, [])
  };
};
