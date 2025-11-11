import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  CalendarDays,
  History,
  Users,
  User,
  Menu,
  X,
} from "lucide-react";
import Header from "../common/Header.jsx";


const ClientDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Inicio", icon: <Home className="w-5 h-5" /> },
    { to: "bookings", label: "Mis Reservas", icon: <CalendarDays className="w-5 h-5" /> },
    { to: "history", label: "Historial", icon: <History className="w-5 h-5" /> },
    { to: "matches", label: "Buscar Partido", icon: <Users className="w-5 h-5" /> },
    { to: "profile", label: "Mi Perfil", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />


      {/* Botón móvil */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Overlay oscuro en móvil */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Panel Cliente
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-grow p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={() => setIsSidebarOpen(false)} // cerrar menú en móvil
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            © {new Date().getFullYear()} CanchaBase
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 md:p-10 transition-all overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
