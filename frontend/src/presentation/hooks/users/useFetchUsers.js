import { useState, useEffect, useMemo } from 'react';

import { GetUserListUseCase } from '../../../application/use-cases/users/get-user-list';
import { ApiUserRepository } from '../../../infrastructure/repositories/api-user-repository';

const ITEMS_PER_PAGE = 10; // Define cuántos elementos mostrar por página

/**
 * Hook personalizado para obtener la lista de usuarios con paginación del lado del cliente.
 * @returns {object} Un objeto con los datos de paginación y funciones.
 */
export const useFetchUsers = () => {
  const [allUsers, setAllUsers] = useState([]); // Almacena todos los usuarios
  const [displayedUsers, setDisplayedUsers] = useState([]); // Almacena los usuarios para la página actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // No usamos useUseCases aquí directamente para GetUserListUseCase porque necesitamos un filtro específico
  // y el UseCaseContext no proporciona filtros por defecto.
  const userRepository = useMemo(() => new ApiUserRepository(), []);
  const getUserListUseCase = useMemo(() => new GetUserListUseCase(userRepository), [userRepository]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      // Obtenemos todos los usuarios cliente
      const response = await getUserListUseCase.execute({ role: 'cliente' });
      const users = Array.isArray(response) ? response : response.results || response.users || [];
      setAllUsers(users);
      setTotalPages(Math.ceil((users?.length || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err);
      console.error('Error al obtener usuarios en useFetchUsers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para obtener todos los usuarios una sola vez
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Efecto para actualizar los usuarios mostrados cuando cambia la página o los datos
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedUsers(allUsers.slice(startIndex, endIndex));
  }, [currentPage, allUsers]);

  // Función para actualizar un usuario en la lista (por ejemplo, después de suspender/reactivar)
  const updateLocalUser = (userId, updatedFields) => {
    setAllUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updatedFields } : user
      )
    );
  };

  // Función para eliminar un usuario de la lista
  const removeLocalUser = (userId) => {
    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  return {
    users: displayedUsers, // Devuelve la lista paginada
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers: allUsers.length, // Devuelve el conteo total
    setCurrentPage,
    fetchAllUsers, // Exponer para recargar la lista si es necesario
    updateLocalUser,
    removeLocalUser,
  };
};
