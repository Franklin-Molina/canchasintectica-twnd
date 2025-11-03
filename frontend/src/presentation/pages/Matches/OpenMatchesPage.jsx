import React, { useState, useEffect } from "react";
import api from "../../../infrastructure/api/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CreateMatchForm from "../../components/Matches/CreateMatchForm";
import { useAuth } from "../../context/AuthContext";

const groupMatchesByCategory = (matches) => {
  const grouped = { Mixto: [], Hombres: [], Mujeres: [] };
  matches.forEach((match) => {
    if (grouped.hasOwnProperty(match.category)) {
      grouped[match.category].push(match);
    }
  });
  return grouped;
};

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
    </div>
  );
};

const OpenMatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState({ Mixto: [], Hombres: [], Mujeres: [] });
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const fetchOpenMatches = async () => {
    try {
      const response = await api.get("/api/matches/open-matches/");
      setMatches(groupMatchesByCategory(response.data));
    } catch (error) {
      toast.error("No se pudieron cargar los partidos abiertos.");
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await api.get("/api/matches/open-matches/my-upcoming-matches/");
      setUpcomingMatches(response.data);
    } catch (error) {
      toast.error("No se pudieron cargar tus próximos partidos.");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchOpenMatches(), fetchUpcomingMatches()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleJoinMatch = async (matchId) => {
    try {
      await api.post(`/api/matches/open-matches/${matchId}/join/`);
      toast.success("¡Te has unido al partido!");
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "No se pudo unir al partido.");
    }
  };

  const handleCancelMatch = async (matchId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar partido",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`/api/matches/open-matches/${matchId}/cancel/`);
          toast.success("Partido cancelado.");
          fetchAllData();
          Swal.fire("¡Cancelado!", "El partido ha sido cancelado.", "success");
        } catch {
          Swal.fire("Error", "No se pudo cancelar el partido.", "error");
        }
      }
    });
  };

  const handleRemoveParticipant = async (matchId, userIdToRemove) => {
    Swal.fire({
      title: "¿Expulsar jugador?",
      text: "¡Este jugador será expulsado del partido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, expulsar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`/api/matches/open-matches/${matchId}/remove_participant/`, {
            user_id: userIdToRemove,
          });
          toast.success("Jugador expulsado.");
          fetchAllData();
          Swal.fire("¡Expulsado!", "El jugador ha sido expulsado.", "success");
        } catch {
          Swal.fire("Error", "No se pudo expulsar al jugador.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-gray-600 dark:text-gray-300">
        Cargando partidos...
      </div>
    );
  }

  return (
    <div className="px-6 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Modal */}
      {isModalOpen && (
        <CreateMatchForm
          onClose={handleCloseModal}
          onMatchCreated={fetchAllData}
          match={editingMatch}
        />
      )}

      {/* Próximos partidos */}
      {upcomingMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600 dark:text-indigo-400">
            Mis Próximos Partidos
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onJoin={handleJoinMatch}
                onCancel={handleCancelMatch}
                onRemove={handleRemoveParticipant}
                onEdit={handleEditMatch}
                currentUser={user}
              />
            ))}
          </div>
        </section>
      )}

      {/* Encabezado */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Encuentra tu Partido
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
        >
          Crear Partido
        </button>
      </header>

      {/* Grid de partidos */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(matches).map(([category, matchList]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 dark:border-gray-700 pb-1">
              {category}
            </h2>
            <div className="space-y-4">
              {matchList.length > 0 ? (
                matchList.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onJoin={handleJoinMatch}
                    onCancel={handleCancelMatch}
                    onRemove={handleRemoveParticipant}
                    onEdit={handleEditMatch}
                    currentUser={user}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay partidos abiertos en esta categoría.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenMatchesPage;
