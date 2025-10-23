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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'suspended'

  // No usamos useUseCases aquí directamente para GetUserListUseCase porque necesitamos un filtro específico
  // y el UseCaseContext no proporciona filtros por defecto.
  const userRepository = useMemo(() => new ApiUserRepository(), []);
  const getUserListUseCase = useMemo(() => new GetUserListUseCase(userRepository), [userRepository]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchMatch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'suspended' && !user.is_active);

      return searchMatch && statusMatch;
    });
  }, [allUsers, searchTerm, statusFilter]);

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

  // Efecto para actualizar los usuarios mostrados cuando cambia la página o los datos filtrados
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedUsers(filteredUsers.slice(startIndex, endIndex));
    setTotalPages(Math.ceil((filteredUsers?.length || 0) / ITEMS_PER_PAGE));
  }, [currentPage, filteredUsers]);

  // Efecto para resetear la página a 1 cuando los filtros cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
    totalUsers: filteredUsers.length, // Devuelve el conteo total de usuarios filtrados
    setCurrentPage,
    fetchAllUsers, // Exponer para recargar la lista si es necesario
    updateLocalUser,
    removeLocalUser,
    setSearchTerm,
    setStatusFilter,
  };
};
