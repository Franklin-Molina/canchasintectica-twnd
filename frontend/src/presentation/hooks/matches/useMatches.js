import { useState, useEffect, useCallback } from "react";
import {
  getOpenMatches,
  getMyUpcomingMatches,
  joinMatch,
  leaveMatch,
  cancelMatch,
  removeParticipant,
} from "../../../infrastructure/api/matchesService";

const groupMatchesByCategory = (matches) => {
  const grouped = { Mixto: [], Hombres: [], Mujeres: [] };
  matches.forEach((match) => {
    if (grouped.hasOwnProperty(match.category)) {
      grouped[match.category].push(match);
    }
  });
  return grouped;
};

export const useMatches = () => {
  const [matches, setMatches] = useState({ Mixto: [], Hombres: [], Mujeres: [] });
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [openMatchesData, upcomingMatchesData] = await Promise.all([
        getOpenMatches(),
        getMyUpcomingMatches(),
      ]);
      setMatches(groupMatchesByCategory(openMatchesData));
      setUpcomingMatches(upcomingMatchesData);
    } catch (error) {
      // El manejo de errores ya se hace en el servicio con toasts
      console.error("Error fetching match data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleJoinMatch = async (matchId) => {
    await joinMatch(matchId);
    fetchAllData();
  };

  const handleLeaveMatch = async (matchId) => {
    await leaveMatch(matchId);
    fetchAllData();
  };

  const handleCancelMatch = async (matchId) => {
    await cancelMatch(matchId);
    fetchAllData();
  };

  const handleRemoveParticipant = async (matchId, userIdToRemove) => {
    await removeParticipant(matchId, userIdToRemove);
    fetchAllData();
  };

  return {
    matches,
    upcomingMatches,
    loading,
    fetchAllData,
    handleJoinMatch,
    handleLeaveMatch,
    handleCancelMatch,
    handleRemoveParticipant,
  };
};
