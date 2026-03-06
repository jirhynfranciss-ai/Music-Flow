import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, currentUser, logout, isAuthenticated } = useStore();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`sticky top-0 z-10 px-6 py-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl`}>
      <div className="flex items-center justify-between">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${isDark ? 'bg-black/40 hover:bg-black/60' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </button>
          <button
            onClick={() => navigate(1)}
            className={`p-2 rounded-full ${isDark ? 'bg-black/40 hover:bg-black/60' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <ChevronRight className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated && currentUser ? (
            <>
              {/* Notifications */}
              <button className={`p-2 rounded-full relative ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <Bell className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {currentUser.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition ${isDark ? 'bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600'}`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className={`px-4 py-2 rounded-full font-medium transition ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
