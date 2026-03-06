import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SongCard } from '../components/SongCard';
import { Song } from '../types';
import {
  Camera,
  Edit2,
  Lock,
  Music,
  Heart,
  ListMusic,
  Users,
  Save,
  X,
  Plus,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    updateProfile,
    changePassword,
    playlists,
    songs,
    artists,
    createPlaylist,
    theme,
  } = useStore();

  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'overview' | 'liked' | 'library' | 'playlists' | 'following' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userPlaylists = playlists.filter((p) => p.userId === currentUser.id);
  const likedSongs = currentUser.likedSongs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[];
  const librarySongs = currentUser.library
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[];
  const followingArtists = currentUser.followingArtists
    .map((id) => artists.find((a) => a.id === id))
    .filter(Boolean);

  const handleSaveProfile = () => {
    if (editName.trim()) {
      updateProfile({
        name: editName.trim(),
        avatar: editAvatar.trim() || currentUser.avatar,
      });
      setIsEditing(false);
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }
    const success = changePassword(oldPassword, newPassword);
    if (success) {
      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage('Current password is incorrect');
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), '');
      setNewPlaylistName('');
      setShowNewPlaylist(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Music },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'library', label: 'Library', icon: ListMusic },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'settings', label: 'Settings', icon: Lock },
  ] as const;

  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`relative p-6 ${isDark ? 'bg-gradient-to-b from-purple-900/50 to-gray-900' : 'bg-gradient-to-b from-purple-100 to-gray-50'}`}>
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-40 h-40 rounded-full object-cover shadow-2xl"
            />
            {isEditing && (
              <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition">
                <Camera className="w-8 h-8 text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Profile
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
                  placeholder="Your name"
                />
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className={`w-full bg-transparent border-b border-gray-500 outline-none text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  placeholder="Avatar URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className={`text-4xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser.name}
                </h1>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentUser.email}
                </p>
                <div className={`flex items-center gap-4 mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>{userPlaylists.length} playlists</span>
                  <span>•</span>
                  <span>{followingArtists.length} following</span>
                  <span>•</span>
                  <span>{likedSongs.length} liked songs</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`px-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-500'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {likedSongs.length > 0 && (
              <section>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recently Liked
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {likedSongs.slice(0, 6).map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              </section>
            )}

            {userPlaylists.length > 0 && (
              <section>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your Playlists
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                      className={`p-4 rounded-xl text-left transition ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-full aspect-square rounded-lg object-cover mb-3"
                      />
                      <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {playlist.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {playlist.songIds.length} songs
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
            {likedSongs.length > 0 ? (
              likedSongs.map((song, index) => (
                <SongCard key={song.id} song={song} variant="row" index={index} />
              ))
            ) : (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No liked songs yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
            {librarySongs.length > 0 ? (
              librarySongs.map((song, index) => (
                <SongCard key={song.id} song={song} variant="row" index={index} />
              ))
            ) : (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <ListMusic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your library is empty</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <button
              onClick={() => setShowNewPlaylist(true)}
              className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
              Create Playlist
            </button>

            {showNewPlaylist && (
              <div className={`mb-6 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className={`w-full px-4 py-2 rounded-lg border mb-3 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewPlaylist(false)}
                    className={`px-4 py-2 rounded-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className={`p-4 rounded-xl text-left transition ${
                    isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full aspect-square rounded-lg object-cover mb-3"
                  />
                  <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {playlist.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {playlist.songIds.length} songs
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {followingArtists.length > 0 ? (
              followingArtists.map((artist) => (
                <button
                  key={artist!.id}
                  onClick={() => navigate(`/artist/${artist!.id}`)}
                  className="text-center group"
                >
                  <img
                    src={artist!.image}
                    alt={artist!.name}
                    className="w-full aspect-square rounded-full object-cover shadow-lg group-hover:shadow-xl transition mb-3"
                  />
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {artist!.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Artist</p>
                </button>
              ))
            ) : (
              <div className={`col-span-full text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>You're not following any artists</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={`max-w-md space-y-6`}>
            <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Change Password
              </h3>
              <div className="space-y-4">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {passwordMessage && (
                  <p className={`text-sm ${passwordMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                    {passwordMessage}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
