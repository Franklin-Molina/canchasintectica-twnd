import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import DashboardNavbar from "./DashboardNavbar.jsx";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isCanchasExpanded, setIsCanchasExpanded] = useState(false);
  const [isReservasExpanded, setIsReservasExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const handleLogout = () => logout();

  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const toggleCanchasMenu = () => setIsCanchasExpanded(!isCanchasExpanded);
  const toggleReservasMenu = () => setIsReservasExpanded(!isReservasExpanded);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (window.innerWidth <= 768) closeSidebar();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth <= 768 &&
        isSidebarOpen
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Overlay en móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static top-0 left-0 h-full w-64 flex-shrink-0 
                  bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                  shadow-md transform transition-transform duration-300 z-40 flex flex-col
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header - Altura fija */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Cancha Admin
          </h2>
        </div>

        {/* MENU - Con scroll interno */}
        <nav className="flex-1 overflow-y-auto p-4 text-gray-700 dark:text-gray-300">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-2 mb-2">
              Cuenta
            </div>

            <Link
              to="/dashboard/perfil"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard/perfil")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-user ${isActiveLink("/dashboard/perfil") ? "text-white" : "text-gray-500"}`}></i> Perfil
            </Link>

            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-4 mb-2">
              Home
            </div>

            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard/home")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-home ${isActiveLink("/") ? "text-white" : "text-gray-500"}`}></i> Inicio
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-tachometer-alt ${isActiveLink("/dashboard") ? "text-white" : "text-gray-500"}`}></i> Dashboard
            </Link>

            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-4 mb-2">
              Gestión
            </div>

            {/* Menú Reservas */}
            <div
              role="button"
              tabIndex="0"
              onClick={toggleReservasMenu}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                isActiveLink("/dashboard/reservas")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <i className={`fas fa-calendar-check ${isActiveLink("/dashboard/reservas") ? "text-white" : "text-gray-500"}`}></i> Reservas
              </span>
              <i
                className={`fas fa-chevron-${isReservasExpanded ? "up" : "down"} ${isActiveLink("/dashboard/reservas") ? "text-white" : "text-gray-500"}`}
              ></i>
            </div>

            {isReservasExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                <Link
                  to="/dashboard/reservas"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveLink("/dashboard/reservas") && location.pathname === '/dashboard/reservas'
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <i className={`fas fa-calendar-alt ${isActiveLink("/dashboard/reservas") && location.pathname === '/dashboard/reservas' ? "text-white" : "text-gray-500"}`}></i> Reservas
                </Link>
                <Link
                  to="/dashboard/reservas/historial"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveLink("/dashboard/reservas/historial")
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <i className={`fas fa-history ${isActiveLink("/dashboard/reservas/historial") ? "text-white" : "text-gray-500"}`}></i> Historial
                </Link>
              </div>
            )}

            {/* Menú Canchas */}
            <div
              role="button"
              tabIndex="0"
              onClick={toggleCanchasMenu}
              className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                isActiveLink("/dashboard/canchas")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <i className={`fas fa-pencil-alt ${isActiveLink("/dashboard/canchas") ? "text-white" : "text-gray-500"}`}></i> Canchas
              </span>
              <i
                className={`fas fa-chevron-${isCanchasExpanded ? "up" : "down"} ${isActiveLink("/dashboard/canchas") ? "text-white" : "text-gray-500"}`}
              ></i>
            </div>

            {isCanchasExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                <Link
                  to="/dashboard/canchas/manage"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveLink("/dashboard/canchas/manage")
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <i className={`fas fa-list ${isActiveLink("/dashboard/canchas/manage") ? "text-white" : "text-gray-500"}`}></i> Gestionar Canchas
                </Link>
                <Link
                  to="/dashboard/canchas/create"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveLink("/dashboard/canchas/create")
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={closeSidebar}
                >
                  <i className={`fas fa-plus ${isActiveLink("/dashboard/canchas/create") ? "text-white" : "text-gray-500"}`}></i> Crear Cancha
                </Link>
              </div>
            )}

            <Link
              to="/dashboard/usuarios"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard/usuarios")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-users ${isActiveLink("/dashboard/usuarios") ? "text-white" : "text-gray-500"}`}></i> Usuarios
            </Link>

            <Link
              to="/dashboard/pagos"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard/pagos")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-dollar-sign ${isActiveLink("/dashboard/pagos") ? "text-white" : "text-gray-500"}`}></i> Pagos
            </Link>

            <Link
              to="/dashboard/estadisticas"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActiveLink("/dashboard/estadisticas")
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={closeSidebar}
            >
              <i className={`fas fa-chart-line ${isActiveLink("/dashboard/estadisticas") ? "text-white" : "text-gray-500"}`}></i> Estadísticas
            </Link>
          </div>
        </nav>

        {/* Footer - Altura flexible */}
        <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 px-4 pt-3 pb-2">
            Salir
          </div>
          <div
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="flex items-center gap-3 px-4 py-3 mx-4 mb-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-700/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
          >
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="h-16 flex-shrink-0">
          <DashboardNavbar toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6 text-gray-800 dark:text-gray-100">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;