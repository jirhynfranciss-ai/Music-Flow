import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  Users,
  Music,
  Disc3,
  TrendingUp,
  BarChart3,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { songs, artists, allUsers, playlists, theme } = useStore();
  const isDark = theme === 'dark';

  const totalUsers = allUsers.filter((u) => u.role === 'user').length;
  const trendingSongs = songs.filter((s) => s.trending).length;
  const featuredSongs = songs.filter((s) => s.featured).length;
  const totalPlays = songs.reduce((acc, s) => acc + s.plays, 0);

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users',
    },
    {
      label: 'Total Songs',
      value: songs.length,
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/songs',
    },
    {
      label: 'Total Artists',
      value: artists.length,
      icon: Disc3,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/artists',
    },
    {
      label: 'Trending Songs',
      value: trendingSongs,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      link: '/admin/songs',
    },
  ];

  const recentUsers = allUsers
    .filter((u) => u.role === 'user')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topSongs = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 5);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`min-h-screen p-6 pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className={`p-6 rounded-2xl transition hover:scale-105 ${
                isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Plays</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(totalPlays)}
            </p>
          </div>
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Featured Songs</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {featuredSongs}
            </p>
          </div>
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-pink-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Playlists</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {playlists.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Users
              </h2>
              <Link to="/admin/users" className="text-purple-500 text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.suspended
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {user.suspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Songs */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Top Songs
              </h2>
              <Link to="/admin/songs" className="text-purple-500 text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {topSongs.map((song, index) => (
                <div key={song.id} className="flex items-center gap-3">
                  <span className={`w-6 text-center font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {index + 1}
                  </span>
                  <img
                    src={song.albumCover}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {song.title}
                    </p>
                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {song.artistName}
                    </p>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatNumber(song.plays)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
