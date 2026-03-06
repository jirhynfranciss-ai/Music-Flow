import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Song } from '../types';
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Download,
  Share2,
  ListPlus,
  Plus,
  Clock,
} from 'lucide-react';

interface SongCardProps {
  song: Song;
  variant?: 'card' | 'row' | 'compact';
  index?: number;
  showAlbum?: boolean;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatPlays = (plays: number): string => {
  if (plays >= 1000000000) return `${(plays / 1000000000).toFixed(1)}B`;
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
  return plays.toString();
};

export const SongCard: React.FC<SongCardProps> = ({ song, variant = 'card', index, showAlbum = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    currentUser,
    likeSong,
    unlikeSong,
    addToLibrary,
    playlists,
    addSongToPlaylist,
    theme,
  } = useStore();

  const isDark = theme === 'dark';
  const isCurrentSong = currentSong?.id === song.id;
  const isLiked = currentUser?.likedSongs.includes(song.id);
  const userPlaylists = playlists.filter((p) => p.userId === currentUser?.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (isLiked) {
      unlikeSong(song.id);
    } else {
      likeSong(song.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = song.audioUrl;
    link.download = `${song.title} - ${song.artistName}.mp3`;
    link.click();
  };

  const handleAddToLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      addToLibrary(song.id);
    }
    setShowMenu(false);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song.id);
    setShowMenu(false);
  };

  if (variant === 'row') {
    return (
      <div
        className={`group flex items-center gap-4 p-2 rounded-lg transition cursor-pointer ${
          isCurrentSong
            ? isDark
              ? 'bg-purple-600/20'
              : 'bg-purple-100'
            : isDark
            ? 'hover:bg-white/10'
            : 'hover:bg-gray-100'
        }`}
        onClick={() => playSong(song)}
      >
        {index !== undefined && (
          <span className={`w-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isCurrentSong && isPlaying ? (
              <div className="flex items-center justify-center gap-0.5">
                <div className="w-1 h-3 bg-purple-500 animate-pulse rounded-full" />
                <div className="w-1 h-4 bg-purple-500 animate-pulse rounded-full" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-2 bg-purple-500 animate-pulse rounded-full" style={{ animationDelay: '0.2s' }} />
              </div>
            ) : (
              index + 1
            )}
          </span>
        )}

        <div className="relative">
          <img
            src={song.albumCover}
            alt={song.title}
            className="w-12 h-12 rounded object-cover"
          />
          <button
            onClick={handlePlay}
            className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded`}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isCurrentSong ? 'text-purple-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
            {song.title}
          </p>
          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {song.artistName}
          </p>
        </div>

        {showAlbum && (
          <p className={`hidden md:block w-48 truncate text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {song.album}
          </p>
        )}

        <p className={`hidden sm:block w-20 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatPlays(song.plays)}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition ${
              isLiked ? 'opacity-100' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>

          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatDuration(song.duration)}
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
            >
              <MoreHorizontal className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 py-2 ${
                  isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleAddToLibrary}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add to Library
                </button>
                <button
                  onClick={handleDownload}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: song.title,
                        text: `Check out ${song.title} by ${song.artistName}`,
                      });
                    }
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                {userPlaylists.length > 0 && (
                  <>
                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                    <p className={`px-4 py-1 text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Add to Playlist
                    </p>
                    {userPlaylists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                          isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <ListPlus className="w-4 h-4" />
                        {playlist.name}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card Variant
  return (
    <div
      className={`group p-4 rounded-xl transition cursor-pointer ${
        isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
      }`}
      onClick={() => playSong(song)}
    >
      <div className="relative mb-4">
        <img
          src={song.albumCover}
          alt={song.title}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105 hover:bg-purple-700"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
      </div>

      <h3 className={`font-semibold truncate mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {song.title}
      </h3>
      <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {song.artistName}
      </p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatDuration(song.duration)}
        </div>
        <button
          onClick={handleLike}
          className="p-1"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
      </div>
    </div>
  );
};
