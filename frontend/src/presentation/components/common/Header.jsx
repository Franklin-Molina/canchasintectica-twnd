import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import DarkModeSwitch from './DarkModeSwitch.jsx';

function Header({ openAuthModal }) {
  const { isAuthenticated, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-gray-900 text-white dark:bg-gray-900 dark:text-white shadow-md transition-colors duration-500">
      {/* LOGO */}
      <div className="flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white dark:text-gray-100"
        >
          Sintetica God
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex items-center gap-4">
        <DarkModeSwitch />

        {/* Auth options */}
        {!isAuthenticated ? (
          <>
            <div
              onClick={openAuthModal}
              className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              Iniciar Sesión
            </div>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white font-medium transition-all"
            >
              Registrarse
            </Link>
          </>
        ) : (
          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            {user?.is_staff ? (
              <Link to="/dashboard" className="hover:text-indigo-300">
                Dashboard
              </Link>
            ) : (
              <Link to="/client" className="hover:text-indigo-300">
                Mi Dashboard
              </Link>
            )}

            <button
              onClick={toggleDropdown}
              className="focus:outline-none hover:text-indigo-300"
            >
              <i className="fas fa-user-circle text-2xl"></i>
            </button>
            {dropdownOpen && <ProfileDropdown />}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
