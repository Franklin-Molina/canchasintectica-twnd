import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import Spinner from "../../../components/common/Spinner.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import { useDashboardUsersLogic } from "../../../hooks/dashboard/useDashboardUsersLogic.js"; // Ruta actualizada
import {
  User,
  Trash2,
  Eye,
  UserMinus,
  UserCheck,
  XCircle,
} from "lucide-react";

function DashboardUsersPage() {
  const {
    users, // Ahora se obtiene 'users' del hook
    loading,
    error,
    currentPage, // Añadir currentPage
    totalPages, // Añadir totalPages
    setCurrentPage, // Añadir setCurrentPage
    actionStatus,
    showDeleteModal,
    userToDelete,
    showDetailsModal,
    userDetails,
    isSuspending,
    isReactivating,
    isDeleting,
    handleSuspendUserClick,
    handleReactivateUserClick,
    confirmDelete,
    cancelDelete,
    proceedDeleteClick,
    handleViewDetails,
    handleCloseDetailsModal,
    setSearchTerm,
    setStatusFilter,
  } = useDashboardUsersLogic();

  const { user } = useAuth();

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-center text-red-600 font-medium">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Gestión de Usuarios Cliente
      </h1>

 {/* 🔍 Controles de Filtro y Búsqueda */}
<div className="mb-8 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-4 border border-gray-200 dark:border-gray-700 transition-all">
  
  {/* Campo de búsqueda */}
  <div className="relative flex-grow w-full">
    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
    </span>
    <input
      type="text"
      placeholder="Buscar por nombre, usuario o correo..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 
      text-gray-700 dark:text-gray-200  outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all"
    />
  </div>

  {/* Filtro de estado */}
  <div className="relative w-full sm:w-auto">
    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 14.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-3.586L3.293 6.707A1 1 0 013 6V4z" />
      </svg>
    </span>
    <select
      onChange={(e) => setStatusFilter(e.target.value)}
      className="pl-10 pr-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none appearance-none cursor-pointer transition-all"
    >
      <option value="all">Todos</option>
      <option value="active">Activos</option>
      <option value="suspended">Suspendidos</option>
    </select>
  </div>

</div>


      {/* Mensaje de acción */}
      {actionStatus && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            actionStatus.includes("Error")
              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {actionStatus}
        </div>
      )}

      {/* Tabla */}
      {Array.isArray(users) && users.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Acciones</th>
                <th className="py-3 px-4 text-left">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((clientUser) => (
                <tr
                  key={clientUser.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    {clientUser.username}
                  </td>
                  <td className="py-3 px-4">
                    {clientUser.first_name} {clientUser.last_name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        clientUser.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                      }`}
                    >
                      {clientUser.is_active ? "Activo" : "Suspendido"}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {clientUser.is_active ? (
                      <button
                        onClick={() => handleSuspendUserClick(clientUser.id)}
                        disabled={isSuspending}
                        className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
                      >
                        <UserMinus className="w-4 h-4" />
                        Suspender
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivateUserClick(clientUser.id)}
                        disabled={isReactivating}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                      >
                        <UserCheck className="w-4 h-4" />
                        Reactivar
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(clientUser)}
                      className="inline-flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetails(clientUser)}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-purple-200 dark:hover:bg-purple-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="px-6 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          No se encontraron usuarios cliente.
        </p>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-3 text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Confirmar Eliminación
            </h2>
            <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que deseas eliminar al usuario?
            </p>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Usuario:</strong> {userToDelete.username}
              </p>
              <p>
                <strong>Email:</strong> {userToDelete.email}
              </p>
              <p>
                <strong>Nombre:</strong> {userToDelete.first_name}{" "}
                {userToDelete.last_name}
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={proceedDeleteClick}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {showDetailsModal && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-blue-600">
              Detalles del Usuario
            </h2>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>ID:</strong> {userDetails.id}
              </p>
              <p>
                <strong>Usuario:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Nombre:</strong> {userDetails.first_name}{" "}
                {userDetails.last_name}
              </p>
              <p>
                <strong>Rol:</strong> {userDetails.role}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {userDetails.is_active ? "Activo" : "Suspendido"}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseDetailsModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardUsersPage;
