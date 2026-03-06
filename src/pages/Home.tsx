import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SongCard } from '../components/SongCard';
import { Play, TrendingUp, Clock, Star, Users } from 'lucide-react';
import { Song } from '../types';

export const Home: React.FC = () => {
  const { songs, artists, categories, currentUser, theme, playQueue } = useStore();
  const isDark = theme === 'dark';

  const trendingSongs = songs.filter((s) => s.trending).slice(0, 6);
  const featuredSongs = songs.filter((s) => s.featured).slice(0, 6);
  const recentlyPlayed = currentUser?.recentlyPlayed
    .map((id: string) => songs.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 6) as Song[] || [];
  const topCharts = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-black' : 'bg-gradient-to-b from-gray-100 via-white to-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative px-6 py-12">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getGreeting()}{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover original music from legendary artists
          </p>
        </div>
      </section>

      {/* Quick Play Section */}
      {currentUser && recentlyPlayed.length > 0 && (
        <section className="px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recentlyPlayed.slice(0, 6).map((song) => (
              <button
                key={song.id}
                onClick={() => playQueue([song])}
                className={`flex items-center gap-3 p-2 rounded-lg transition group ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <img
                  src={song.albumCover}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <span className={`font-medium truncate flex-1 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {song.title}
                </span>
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="px-6 py-6">
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${category.name}`}
              className="relative h-32 rounded-xl overflow-hidden group"
              style={{ backgroundColor: category.color }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="relative p-4 h-full flex items-end">
                <span className="text-white font-bold text-lg">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-pink-500" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Featured Artists
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {artists.slice(0, 6).map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              className="group text-center"
            >
              <div className="relative mb-4">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full aspect-square rounded-full object-cover shadow-lg group-hover:shadow-xl transition"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {artist.name}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {(artist.followers / 1000000).toFixed(1)}M followers
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Songs */}
      <section className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Featured Songs
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Charts
          </h2>
        </div>
        <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          {topCharts.map((song, index) => (
            <SongCard key={song.id} song={song} variant="row" index={index} />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      {currentUser && recentlyPlayed.length > 0 && (
        <section className="px-6 py-6 pb-32">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recently Played
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
