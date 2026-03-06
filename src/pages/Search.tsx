import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SongCard } from '../components/SongCard';
import { Search as SearchIcon, X } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [query, setQuery] = useState('');
  const { songs, artists, categories, theme } = useStore();
  const isDark = theme === 'dark';

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase();
    const categoryQ = categoryFilter?.toLowerCase();

    let filteredSongs = songs;
    let filteredArtists = artists;

    if (categoryQ) {
      filteredSongs = songs.filter((s) => s.genre.toLowerCase() === categoryQ);
    }

    if (q) {
      filteredSongs = filteredSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artistName.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q)
      );
      filteredArtists = artists.filter(
        (a) => a.name.toLowerCase().includes(q)
      );
    }

    return { songs: filteredSongs, artists: filteredArtists };
  }, [query, songs, artists, categoryFilter]);

  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Search Header */}
      <div className="sticky top-0 z-10 p-6 pb-0">
        <div className="relative max-w-xl">
          <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, or albums..."
            className={`w-full pl-12 pr-10 py-4 rounded-full text-lg transition focus:ring-2 focus:ring-purple-500 ${
              isDark
                ? 'bg-gray-800 text-white placeholder-gray-500'
                : 'bg-white text-gray-900 placeholder-gray-400 shadow-sm'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          )}
        </div>

        {categoryFilter && (
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Filtering by:
            </span>
            <Link
              to="/search"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white text-sm"
            >
              {categoryFilter}
              <X className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Categories (when no search) */}
      {!query && !categoryFilter && (
        <section className="px-6 py-6">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Browse All
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.name}`}
                className="relative h-40 rounded-xl overflow-hidden group"
                style={{ backgroundColor: category.color }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="relative p-4 h-full flex items-end">
                  <span className="text-white font-bold text-xl">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      {(query || categoryFilter) && (
        <>
          {/* Artists */}
          {filteredResults.artists.length > 0 && !categoryFilter && (
            <section className="px-6 py-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Artists
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {filteredResults.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    className="flex-shrink-0 text-center group"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover shadow-lg group-hover:shadow-xl transition mb-3"
                    />
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {artist.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Artist</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Songs */}
          <section className="px-6 py-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Songs {categoryFilter && `in ${categoryFilter}`}
            </h2>
            {filteredResults.songs.length > 0 ? (
              <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                {filteredResults.songs.map((song, index) => (
                  <SongCard key={song.id} song={song} variant="row" index={index} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No songs found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Popular Songs (when no search) */}
      {!query && !categoryFilter && (
        <section className="px-6 py-6">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Popular Songs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {songs.slice(0, 12).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
