import { useState, useEffect } from 'react';

// Hook para gestionar el refresco automático y el tiempo transcurrido.
export const useAutoRefresh = (callback, interval = 10000, dependency) => {
  const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState(0);

  // Efecto para el refresco automático de datos.
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      if (callback) {
        callback();
      }
    }, interval);

    return () => clearInterval(autoRefreshInterval);
  }, [callback, interval]);

  // Efecto para reiniciar el contador después de una actualización.
  useEffect(() => {
    setTimeSinceLastUpdate(0);
  }, [dependency]); // Se reinicia cuando la dependencia cambia.

  // Efecto para el contador de segundos.
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeSinceLastUpdate(prev => prev + 1);
    }, 1000); // Se actualiza cada segundo.

    return () => clearInterval(timerInterval);
  }, []);

  // Función para formatear el tiempo en un formato legible.
  const formatearTiempo = (segundos) => {
    if (segundos < 60) return `hace ${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `hace ${minutos}min`;
    const horas = Math.floor(minutos / 60);
    return `hace ${horas}h`;
  };

  return {
    timeSinceLastUpdate: formatearTiempo(timeSinceLastUpdate)
  };
};
