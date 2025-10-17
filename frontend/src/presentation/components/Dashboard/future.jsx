import React, { useState } from "react";
import { Home, LayoutDashboard, Calendar, Trophy, Users, DollarSign, BarChart3, LogOut, User, ChevronDown, Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [showSubMenu, setShowSubMenu] = useState(false);

  // Datos de ejemplo para las canchas
  const canchas = [
    { id: 1, nombre: "Cancha Fútbol 5", precio: "$50.000", estado: "Disponible" },
    { id: 2, nombre: "Cancha Fútbol 7", precio: "$75.000", estado: "Disponible" },
    { id: 3, nombre: "Cancha Fútbol 11", precio: "$100.000", estado: "Ocupada" },
    { id: 4, nombre: "Cancha Tenis", precio: "$40.000", estado: "Mantenimiento" },
  ];

  const menuItems = [
    { id: "inicio", icon: Home, label: "Inicio", section: "HOME" },
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", section: "HOME", active: true },
    { id: "reservas", icon: Calendar, label: "Reservas", section: "GESTIÓN" },
    { id: "canchas", icon: Trophy, label: "Canchas", section: "GESTIÓN", hasSubmenu: true },
    { id: "usuarios", icon: Users, label: "Usuarios", section: "GESTIÓN" },
    { id: "pagos", icon: DollarSign, label: "Pagos", section: "GESTIÓN" },
    { id: "estadisticas", icon: BarChart3, label: "Estadísticas", section: "GESTIÓN" },
  ];

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-700 border-green-200";
      case "Ocupada":
        return "bg-red-100 text-red-700 border-red-200";
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            {sidebarOpen && (
              <div className="text-white">
                <h1 className="font-bold text-lg">Cancha Admin</h1>
              </div>
            )}
          </div>
        </div>

        {/* Cuenta */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              B
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">Betta</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {["HOME", "GESTIÓN", "SALIR"].map((section) => (
            <div key={section} className="mb-6">
              {sidebarOpen && (
                <div className="px-6 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{section}</p>
                </div>
              )}
              <div className="space-y-1 px-3">
                {section === "SALIR" ? (
                  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!sidebarOpen && "justify-center"}`}>
                    <LogOut className="w-5 h-5" />
                    {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
                  </button>
                ) : (
                  menuItems
                    .filter((item) => item.section === section)
                    .map((item) => (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            setSelectedMenu(item.id);
                            if (item.hasSubmenu) setShowSubMenu(!showSubMenu);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            selectedMenu === item.id
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100"
                          } ${!sidebarOpen && "justify-center"}`}
                        >
                          <item.icon className="w-5 h-5" />
                          {sidebarOpen && (
                            <>
                              <span className="flex-1 text-left font-medium">{item.label}</span>
                              {item.hasSubmenu && (
                                <ChevronDown className={`w-4 h-4 transition-transform ${showSubMenu ? "rotate-180" : ""}`} />
                              )}
                            </>
                          )}
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Administración</h2>
            <p className="text-sm text-gray-500">Gestiona tu sistema deportivo</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:shadow-md transition-all">
              <User className="w-5 h-5" />
              <span>Betta</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Reservas", value: "156", icon: Calendar, color: "from-blue-500 to-cyan-500" },
              { label: "Canchas Activas", value: "8", icon: Trophy, color: "from-purple-500 to-pink-500" },
              { label: "Usuarios", value: "342", icon: Users, color: "from-orange-500 to-red-500" },
              { label: "Ingresos", value: "$2.4M", icon: DollarSign, color: "from-green-500 to-emerald-500" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+12%</span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Gestión de Canchas */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100">
            {/* Header de la tabla */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Gestión de Canchas</h3>
                  <p className="text-sm text-gray-500">Administra y controla tus espacios deportivos</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtrar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                    <Plus className="w-5 h-5" />
                    Nueva Cancha
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {canchas.map((cancha) => (
                    <tr key={cancha.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">#{cancha.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{cancha.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">{cancha.precio}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(cancha.estado)}`}>
                          {cancha.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer de la tabla */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Mostrando <span className="font-semibold">4</span> de <span className="font-semibold">4</span> canchas</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors text-sm font-medium">
                    Anterior
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}