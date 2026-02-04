import React, { useState } from "react";
import MatchChat from "./MatchChat";
import { MessageCircle } from "lucide-react";

const MatchCard = ({ match, onJoin, onCancel, onRemove, onEdit, onLeave, currentUser }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const isCreator = currentUser?.id === match.creator.id;
  // El creador también es un participante. isFull ya considera al creador.
  const isFull = match.participants.length >= match.players_needed + 1;
  
  // Verificar si el usuario actual es participante del partido (incluyendo al creador)
  const isParticipant = isCreator || match.participants.some(
    (p) => p.user.id === currentUser?.id
  );

  return (
    <div
      className={`p-5 rounded-xl border shadow-sm transition-all duration-300 ${
        match.status === "CANCELLED"
          ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
          : isFull
          ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md"
      }`}
    >
      <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
        {match.court}
      </h4>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span className="font-medium">Inicio:</span>{" "}
          {new Date(match.start_time).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Fin:</span>{" "}
          {new Date(match.end_time).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Jugadores:</span>{" "}
          {match.participants.length} / {match.players_needed + 1}
        </p>
        <p>
          <span className="font-medium">Creador:</span> {match.creator.username}
        </p>
        <p>
          <span className="font-medium">Estado:</span>{" "}
          {match.status === "CANCELLED"
            ? "Cancelado"
            : isFull
            ? "Cerrado"
            : "Abierto"}
        </p>
      </div>

      {/* Participantes */}
      <div className="mt-4">
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showParticipants ? "Ocultar" : "Ver"} Participantes (
          {match.participants.length})
        </button>

        {showParticipants && (
          <ul className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg space-y-1">
            {match.participants.map((p) => (
              <li
                key={p.user.id}
                className="flex justify-between items-center text-sm"
              >
                {p.user.username}
                {isCreator && p.user.id !== currentUser.id && (
                  <button
                    className="text-red-500 hover:text-red-700 font-bold"
                    onClick={() => onRemove(match.id, p.user.id)}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap gap-2">
        {match.status === "CANCELLED" ? (
          <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium">
            ❌ Partido Cancelado
          </div>
        ) : (
          <>
            {/* Botones para usuarios no creadores */}
            {!isCreator && (
              <>
                {isParticipant ? (
                  <button
                    onClick={() => onLeave(match.id)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <span>🚪</span> Salir del Partido
                  </button>
                ) : (
                  <button
                    onClick={() => onJoin(match.id)}
                    disabled={isFull}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 ${
                      isFull
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isFull ? (
                      <>
                        <span>🔒</span> Partido Completo
                      </>
                    ) : (
                      <>
                        <span>⚽</span> Unirse al Partido
                      </>
                    )}
                  </button>
                )}
              </>
            )}

            {/* Botones para el creador */}
            {isCreator && (
              <>
                <button
                  onClick={() => onEdit(match)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>✏️</span> Editar
                </button>
                <button
                  onClick={() => onCancel(match.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>❌</span> Cancelar Partido
                </button>
              </>
            )}

            {/* Chat del partido - Solo visible si está lleno y el usuario es participante */}
            {isFull && isParticipant && (
              <button
                onClick={() => setShowChat(!showChat)}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 ${
                  showChat ? "bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat del Grupo</span>
              </button>
            )}
          </>
        )}
      </div>

      {showChat && <MatchChat matchId={match.id} onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default MatchCard;
