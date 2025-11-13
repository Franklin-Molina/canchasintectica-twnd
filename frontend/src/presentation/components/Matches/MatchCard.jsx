import React, { useState } from "react";
import MatchChat from "../Chat/MatchChat";

const MatchCard = ({ match, onJoin, onCancel, onRemove, onEdit, currentUser }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const isCreator = currentUser?.id === match.creator.id;
  const isFull = match.participants.length >= match.players_needed + 1;

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
        {!isCreator && (
          <button
            onClick={() => onJoin(match.id)}
            disabled={isFull || match.status === "CANCELLED"}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${
              isFull || match.status === "CANCELLED"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isFull
              ? "Completo"
              : match.status === "CANCELLED"
              ? "Cancelado"
              : "Unirse"}
          </button>
        )}

        {isCreator && match.status !== "CANCELLED" && (
          <>
            <button
              onClick={() => onEdit(match)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium"
            >
              Editar
            </button>
            {!isFull && (
              <button
                onClick={() => onCancel(match.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
              >
                Cancelar
              </button>
            )}
          </>
        )}
      </div>

      {/* Chat del partido */}
      {(isCreator || match.participants.some(p => p.user.id === currentUser?.id)) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h5 className="text-md font-semibold mb-2">Chat del Partido</h5>
          <MatchChat matchId={match.id} />
        </div>
      )}
    </div>
  );
};

export default MatchCard;
