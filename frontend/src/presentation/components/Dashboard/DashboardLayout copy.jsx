import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menuItems } from './menuConfig.jsx';
import Header from '../common/Header';
import { ChevronDown, X, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();

  const userRole = user?.role || 'cliente';
  const currentMenuItems = menuItems[userRole] || [];

  useEffect(() => {
    // Activar submenús que contienen el enlace activo
    const activeSubmenus = {};
    currentMenuItems.forEach((item, index) => {
      if (item.submenu && item.submenu.some(subItem => location.pathname.startsWith(subItem.to))) {
        activeSubmenus[index] = true;
      }
    });
    setOpenSubmenus(activeSubmenus);
  }, [location.pathname, currentMenuItems]);

  const toggleSubmenu = (index) => {
    setOpenSubmenus(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  const NavItem = ({ item, index }) => {
    const isActive = item.submenu
      ? item.submenu.some(subItem => location.pathname.startsWith(subItem.to))
      : location.pathname === item.to;

    if (item.submenu) {
      return (
        <li>
          <button
            onClick={() => toggleSubmenu(index)}
            className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${openSubmenus[index] ? 'rotate-180' : ''}`} />
          </button>
          {openSubmenus[index] && (
            <ul className="pl-8 pt-2 space-y-2">
              {item.submenu.map((subItem) => (
                <NavItem key={subItem.to} item={subItem} />
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li>
        <NavLink
          to={item.to}
          end={item.to === '/' || item.to === '/dashboard' || item.to === '/client' || item.to === '/adminglobal'}
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive: isNavLinkActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isNavLinkActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

        <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Panel {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col justify-between flex-grow p-4 overflow-y-auto">
            <ul className="space-y-2">
              {currentMenuItems.map((item, index) => (
                <NavItem key={item.label || item.to} item={item} index={index} />
              ))}
            </ul>
            
            <div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/20 rounded-xl font-medium transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
              <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-4">
                © {new Date().getFullYear()} CanchaBase
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10 transition-all overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
