import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SongCard } from '../components/SongCard';
import { Play, Shuffle, Heart, Share2, CheckCircle, UserPlus } from 'lucide-react';

export const Artist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    artists,
    songs,
    currentUser,
    followArtist,
    unfollowArtist,
    playQueue,
    theme,
  } = useStore();

  const isDark = theme === 'dark';
  const artist = artists.find((a) => a.id === id);
  const artistSongs = songs.filter((s) => s.artistId === id);
  const isFollowing = currentUser?.followingArtists.includes(id || '');

  if (!artist) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Artist not found</p>
      </div>
    );
  }

  const handleFollow = () => {
    if (!currentUser || !id) return;
    if (isFollowing) {
      unfollowArtist(id);
    } else {
      followArtist(id);
    }
  };

  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      playQueue(artistSongs);
    }
  };

  const handleShuffle = () => {
    if (artistSongs.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      playQueue(shuffled);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {artist.verified && (
              <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
            )}
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-200'}`}>Verified Artist</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">{artist.name}</h1>
          <p className="text-gray-300">{formatFollowers(artist.followers)} followers</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-6 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <Play className="w-6 h-6 text-white ml-1" />
        </button>

        <button
          onClick={handleShuffle}
          className={`p-3 rounded-full transition ${
            isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Shuffle className="w-6 h-6" />
        </button>

        <button
          onClick={handleFollow}
          className={`px-6 py-2 rounded-full border-2 font-semibold transition flex items-center gap-2 ${
            isFollowing
              ? 'border-purple-500 text-purple-500 hover:bg-purple-500/10'
              : isDark
              ? 'border-white text-white hover:bg-white/10'
              : 'border-gray-900 text-gray-900 hover:bg-gray-100'
          }`}
        >
          {isFollowing ? (
            <>
              <Heart className="w-5 h-5 fill-current" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Follow
            </>
          )}
        </button>

        <button
          className={`p-3 rounded-full transition ${
            isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Bio */}
      <section className="px-6 py-4">
        <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          About
        </h2>
        <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {artist.bio}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {artist.genre}
          </span>
        </div>
      </section>

      {/* Popular Songs */}
      <section className="px-6 py-6">
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Popular
        </h2>
        <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
          {artistSongs.slice(0, 5).map((song, index) => (
            <SongCard key={song.id} song={song} variant="row" index={index} showAlbum={false} />
          ))}
        </div>
      </section>

      {/* All Songs */}
      {artistSongs.length > 5 && (
        <section className="px-6 py-6">
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Discography
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {artistSongs.slice(5).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
