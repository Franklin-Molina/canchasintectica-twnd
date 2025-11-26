// hooks/useReservas.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(0);

  useEffect(() => {
    // Recibir reservas iniciales
    socket.on('reservasIniciales', (data) => {
      setReservas(data);
    });

    // Escuchar nuevas reservas en tiempo real
    socket.on('reservaCreada', (nuevaReserva) => {
      setReservas(prev => [...prev, nuevaReserva]);
      setUltimaActualizacion(0);
      // Reproducir sonido de notificación
      new Audio('/notification.mp3').play();
    });

    // Escuchar eliminaciones
    socket.on('reservaEliminada', (id) => {
      setReservas(prev => prev.filter(r => r.id !== id));
    });

    return () => {
      socket.off('reservasIniciales');
      socket.off('reservaCreada');
      socket.off('reservaEliminada');
    };
  }, []);

  const eliminarReserva = (id) => {
    socket.emit('eliminarReserva', id);
  };

  return { reservas, ultimaActualizacion, eliminarReserva };
};