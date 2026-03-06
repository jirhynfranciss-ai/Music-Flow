import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SongCard } from '../components/SongCard';
import { Song } from '../types';
import {
  Play,
  Shuffle,
  MoreHorizontal,
  Edit2,
  Trash2,
  Clock,
  Music,
} from 'lucide-react';

export const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    playlists,
    songs,
    currentUser,
    updatePlaylist,
    deletePlaylist,
    playQueue,
    theme,
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const isDark = theme === 'dark';
  const playlist = playlists.find((p) => p.id === id);

  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map((songId: string) => songs.find((s) => s.id === songId))
      .filter(Boolean) as Song[];
  }, [playlist, songs]);

  const totalDuration = useMemo(() => {
    return playlistSongs.reduce((acc: number, song: Song) => acc + song.duration, 0);
  }, [playlistSongs]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  if (!playlist) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Playlist not found</p>
      </div>
    );
  }

  const isOwner = currentUser?.id === playlist.userId;

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playQueue(playlistSongs);
    }
  };

  const handleShuffle = () => {
    if (playlistSongs.length > 0) {
      const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);
      playQueue(shuffled);
    }
  };

  const handleEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updatePlaylist(playlist.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlist.id);
      navigate('/');
    }
  };

  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`relative p-6 ${isDark ? 'bg-gradient-to-b from-purple-900/50 to-gray-900' : 'bg-gradient-to-b from-purple-100 to-gray-50'}`}>
        <div className="flex gap-6">
          {/* Cover */}
          <div className="flex-shrink-0">
            <img
              src={playlist.cover}
              alt={playlist.name}
              className="w-48 h-48 rounded-xl object-cover shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-end">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Playlist
            </span>

            {isEditing ? (
              <div className="mt-2 space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full text-3xl font-bold bg-transparent border-b-2 border-purple-500 outline-none ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                  placeholder="Playlist name"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`w-full bg-transparent border-b border-gray-500 outline-none ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  placeholder="Add description"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className={`text-4xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {playlist.name}
                </h1>
                {playlist.description && (
                  <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {playlist.description}
                  </p>
                )}
                <div className={`flex items-center gap-2 mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Music className="w-4 h-4" />
                  <span>{playlistSongs.length} songs</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={playlistSongs.length === 0}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <Play className="w-6 h-6 text-white ml-1" />
        </button>

        <button
          onClick={handleShuffle}
          disabled={playlistSongs.length === 0}
          className={`p-3 rounded-full transition ${
            isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Shuffle className="w-6 h-6" />
        </button>

        {isOwner && (
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-3 rounded-full transition ${
                isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <MoreHorizontal className="w-6 h-6" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl py-2 z-10 ${
                  isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <button
                  onClick={handleEdit}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit playlist
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete playlist
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Songs */}
      <section className="px-6 py-4">
        {playlistSongs.length > 0 ? (
          <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
            {playlistSongs.map((song: Song, index: number) => (
              <SongCard key={song.id} song={song} variant="row" index={index} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">This playlist is empty</p>
            <p className="text-sm mt-1">Add songs to get started</p>
          </div>
        )}
      </section>
    </div>
  );
};
