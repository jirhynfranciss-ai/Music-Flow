import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  TrendingUp,
  Star,
  Music,
  X,
  Save,
} from 'lucide-react';

export const AdminSongs: React.FC = () => {
  const {
    songs,
    artists,
    categories,
    addSong,
    updateSong,
    deleteSong,
    setFeaturedSong,
    setTrendingSong,
    theme,
  } = useStore();

  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    artistName: '',
    album: '',
    albumCover: '',
    duration: 0,
    audioUrl: '',
    genre: '',
    plays: 0,
    releaseDate: '',
    featured: false,
    trending: false,
  });

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      artistId: '',
      artistName: '',
      album: '',
      albumCover: '',
      duration: 0,
      audioUrl: '',
      genre: '',
      plays: 0,
      releaseDate: '',
      featured: false,
      trending: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (song: typeof songs[0]) => {
    setFormData({
      title: song.title,
      artistId: song.artistId,
      artistName: song.artistName,
      album: song.album,
      albumCover: song.albumCover,
      duration: song.duration,
      audioUrl: song.audioUrl,
      genre: song.genre,
      plays: song.plays,
      releaseDate: song.releaseDate,
      featured: song.featured,
      trending: song.trending,
    });
    setEditingId(song.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artist = artists.find((a) => a.id === formData.artistId);
    const songData = {
      ...formData,
      artistName: artist?.name || formData.artistName,
    };

    if (editingId) {
      updateSong(editingId, songData);
    } else {
      addSong(songData);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      deleteSong(id);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen p-6 pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Manage Songs
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            Add Song
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs..."
            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
              isDark
                ? 'bg-gray-800 text-white placeholder-gray-500'
                : 'bg-white text-gray-900 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingId ? 'Edit Song' : 'Add New Song'}
                </h2>
                <button onClick={resetForm} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Artist
                    </label>
                    <select
                      value={formData.artistId}
                      onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select Artist</option>
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>{artist.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Album
                    </label>
                    <input
                      type="text"
                      value={formData.album}
                      onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Genre
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select Genre</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Album Cover URL
                  </label>
                  <input
                    type="url"
                    value={formData.albumCover}
                    onChange={(e) => setFormData({ ...formData, albumCover: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Audio URL (MP3)
                  </label>
                  <input
                    type="url"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Release Date
                    </label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.trending}
                      onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Trending</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? 'Update Song' : 'Add Song'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Songs Table */}
        <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Song
                </th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Artist
                </th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Genre
                </th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </th>
                <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSongs.map((song) => (
                <tr key={song.id} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={song.albumCover} alt={song.title} className="w-10 h-10 rounded object-cover" />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{song.title}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {song.artistName}
                  </td>
                  <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {song.genre}
                  </td>
                  <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDuration(song.duration)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setFeaturedSong(song.id, !song.featured)}
                        className={`p-1 rounded ${song.featured ? 'text-yellow-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${song.featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setTrendingSong(song.id, !song.trending)}
                        className={`p-1 rounded ${song.trending ? 'text-green-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}
                        title="Toggle Trending"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSongs.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No songs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
