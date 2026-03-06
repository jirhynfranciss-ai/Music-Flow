import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home,
  Search,
  Library,
  Heart,
  PlusCircle,
  Music2,
  ListMusic,
  Settings,
  Users,
  BarChart3,
  Disc3,
  FolderOpen,
  Shield,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, playlists, theme } = useStore();

  const isDark = theme === 'dark';
  const isAdmin = currentUser?.role === 'admin';

  const userLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Your Library' },
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin/songs', icon: Music2, label: 'Manage Songs' },
    { to: '/admin/artists', icon: Users, label: 'Manage Artists' },
    { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    { to: '/admin/users', icon: Shield, label: 'Manage Users' },
    { to: '/admin/playlists', icon: ListMusic, label: 'Playlists' },
  ];

  const userPlaylists = playlists.filter((p) => p.userId === currentUser?.id);

  return (
    <aside className={`w-64 h-screen fixed left-0 top-0 flex flex-col ${isDark ? 'bg-black' : 'bg-gray-100'} z-20`}>
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Disc3 className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MusicFlow</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 mb-4">
        <ul className="space-y-1">
          {userLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Liked Songs & Create Playlist */}
      {currentUser && (
        <div className={`px-3 py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <Link
            to="/liked"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
              location.pathname === '/liked'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            Liked Songs
          </Link>
        </div>
      )}

      {/* User Playlists */}
      {currentUser && userPlaylists.length > 0 && (
        <div className={`flex-1 overflow-y-auto px-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <div className="py-4">
            <h3 className={`px-4 text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Your Playlists
            </h3>
            <ul className="space-y-1">
              {userPlaylists.map((playlist) => (
                <li key={playlist.id}>
                  <Link
                    to={`/playlist/${playlist.id}`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition truncate ${
                      location.pathname === `/playlist/${playlist.id}`
                        ? isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-gray-200 text-gray-900'
                        : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ListMusic className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{playlist.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Admin Section */}
      {isAdmin && (
        <div className={`px-3 py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <h3 className={`px-4 text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Admin Panel
          </h3>
          <ul className="space-y-1">
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Profile / Settings */}
      {currentUser && (
        <div className={`p-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.name}
              </p>
              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isAdmin ? 'Administrator' : 'Premium User'}
              </p>
            </div>
            <Settings className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </Link>
        </div>
      )}
    </aside>
  );
};
