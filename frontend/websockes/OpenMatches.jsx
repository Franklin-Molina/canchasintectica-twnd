// Ejemplo de cómo usar en tu componente OpenMatches
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMatchesRealtime } from '../hooks/useMatchesRealtime';
import { 
  getOpenMatches, 
  joinMatch, 
  leaveMatch, 
  cancelMatch, 
  removeParticipant 
} from '../services/matchService';
import MatchCard from '../components/MatchCard';

const OpenMatches = ({ currentUser }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar partidos inicialmente
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOpenMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Manejar actualizaciones en tiempo real
  const handleRealtimeUpdate = useCallback((data) => {
    console.log('📡 Actualización en tiempo real recibida:', data);

    switch (data.type) {
      case 'match_created':
        // Agregar nuevo partido a la lista
        setMatches(prev => [data.match, ...prev]);
        toast.info(`🎾 Nuevo partido creado en ${data.match.court}`);
        break;

      case 'match_updated':
        // Actualizar partido existente
        setMatches(prev => 
          prev.map(m => m.id === data.match.id ? data.match : m)
        );
        toast.info(`📝 Partido actualizado: ${data.match.court}`);
        break;

      case 'participant_joined':
        // Actualizar lista de participantes
        setMatches(prev =>
          prev.map(m =>
            m.id === data.match_id
              ? { ...m, participants: data.participants }
              : m
          )
        );
        toast.success(`👋 ${data.user.username} se unió al partido`);
        break;

      case 'participant_left':
        // Actualizar lista de participantes
        setMatches(prev =>
          prev.map(m =>
            m.id === data.match_id
              ? { ...m, participants: data.participants }
              : m
          )
        );
        toast.info(`🚪 ${data.user.username} abandonó el partido`);
        break;

      case 'participant_removed':
        // Actualizar lista de participantes
        setMatches(prev =>
          prev.map(m =>
            m.id === data.match_id
              ? { ...m, participants: data.participants }
              : m
          )
        );
        toast.warning(`❌ ${data.user.username} fue expulsado del partido`);
        break;

      case 'match_cancelled':
        // Marcar partido como cancelado
        setMatches(prev =>
          prev.map(m =>
            m.id === data.match_id
              ? { ...m, status: 'CANCELLED' }
              : m
          )
        );
        toast.error(`🚫 Partido cancelado: ${data.match.court}`);
        break;

      case 'match_deleted':
        // Remover partido de la lista
        setMatches(prev => prev.filter(m => m.id !== data.match_id));
        toast.info(`🗑️ Partido eliminado`);
        break;

      default:
        console.log('Tipo de actualización desconocido:', data.type);
    }
  }, []);

  // Conectar al WebSocket
  useMatchesRealtime(handleRealtimeUpdate);

  // Handlers para las acciones
  const handleJoin = async (matchId) => {
    try {
      await joinMatch(matchId);
      // La actualización vendrá por WebSocket
    } catch (error) {
      console.error('Error joining match:', error);
    }
  };

  const handleLeave = async (matchId) => {
    try {
      await leaveMatch(matchId);
      // La actualización vendrá por WebSocket
    } catch (error) {
      console.error('Error leaving match:', error);
    }
  };

  const handleCancel = async (matchId) => {
    try {
      await cancelMatch(matchId);
      // La actualización vendrá por WebSocket
    } catch (error) {
      console.error('Error cancelling match:', error);
    }
  };

  const handleRemove = async (matchId, userId) => {
    try {
      await removeParticipant(matchId, userId);
      // La actualización vendrá por WebSocket
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleEdit = (match) => {
    // Tu lógica de edición
    console.log('Edit match:', match);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Partidos Abiertos
      </h1>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay partidos disponibles en este momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              currentUser={currentUser}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onCancel={handleCancel}
              onRemove={handleRemove}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenMatches;
