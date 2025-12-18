import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMatches } from "../../hooks/matches/useMatches";
import CreateMatchForm from "../../components/Matches/CreateMatchForm";
import UpcomingMatches from "../../components/Matches/UpcomingMatches";
import MatchCategory from "../../components/Matches/MatchCategory";

const OpenMatchesPage = () => {
  const { user } = useAuth();
  const {
    matches,
    upcomingMatches,
    loading,
    fetchAllData,
    handleJoinMatch,
    handleLeaveMatch,
    handleCancelMatch,
    handleRemoveParticipant,
  } = useMatches();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-gray-600 dark:text-gray-300">
        Cargando partidos...
      </div>
    );
  }

  return (
    <div className="px-6 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {isModalOpen && (
        <CreateMatchForm
          onClose={handleCloseModal}
          onMatchCreated={fetchAllData}
          match={editingMatch}
        />
      )}

      <UpcomingMatches
        matches={upcomingMatches}
        onJoin={handleJoinMatch}
        onLeave={handleLeaveMatch}
        onCancel={handleCancelMatch}
        onRemove={handleRemoveParticipant}
        onEdit={handleEditMatch}
        currentUser={user}
      />

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

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(matches).map(([category, matchList]) => (
          <MatchCategory
            key={category}
            category={category}
            matches={matchList}
            onJoin={handleJoinMatch}
            onLeave={handleLeaveMatch}
            onCancel={handleCancelMatch}
            onRemove={handleRemoveParticipant}
            onEdit={handleEditMatch}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
};

export default OpenMatchesPage;
