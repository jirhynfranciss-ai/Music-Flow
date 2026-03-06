import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Song, Artist, Playlist, Category, Comment, ThemeMode } from '../types';
import { songs, artists, playlists, categories, users, comments } from '../data/mockData';

interface StoreState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;

  // Music Player
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  volume: number;
  progress: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  playSong: (song: Song) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Data
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
  categories: Category[];
  allUsers: User[];
  comments: Comment[];

  // User Actions
  likeSong: (songId: string) => void;
  unlikeSong: (songId: string) => void;
  addToLibrary: (songId: string) => void;
  removeFromLibrary: (songId: string) => void;
  followArtist: (artistId: string) => void;
  unfollowArtist: (artistId: string) => void;
  addToRecentlyPlayed: (songId: string) => void;
  createPlaylist: (name: string, description: string) => void;
  updatePlaylist: (id: string, data: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addComment: (songId: string, content: string) => void;

  // Admin Actions
  addSong: (song: Omit<Song, 'id'>) => void;
  updateSong: (id: string, data: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  addArtist: (artist: Omit<Artist, 'id'>) => void;
  updateArtist: (id: string, data: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  suspendUser: (userId: string) => void;
  unsuspendUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  setFeaturedSong: (songId: string, featured: boolean) => void;
  setTrendingSong: (songId: string, trending: boolean) => void;
  deleteComment: (commentId: string) => void;
  deletePlaylistAdmin: (playlistId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: (email, password) => {
        const user = get().allUsers.find((u) => u.email === email && !u.suspended);
        if (user && password.length >= 6) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      loginWithGoogle: () => {
        const mockGoogleUser: User = {
          id: `user-${Date.now()}`,
          email: 'googleuser@gmail.com',
          name: 'Google User',
          avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
          role: 'user',
          createdAt: new Date().toISOString(),
          suspended: false,
          likedSongs: [],
          followingArtists: [],
          recentlyPlayed: [],
          library: [],
        };
        set((state) => ({
          allUsers: [...state.allUsers, mockGoogleUser],
          currentUser: mockGoogleUser,
          isAuthenticated: true,
        }));
      },
      register: (email, password, name) => {
        const exists = get().allUsers.find((u) => u.email === email);
        if (exists || password.length < 6) return false;
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          role: 'user',
          createdAt: new Date().toISOString(),
          suspended: false,
          likedSongs: [],
          followingArtists: [],
          recentlyPlayed: [],
          library: [],
        };
        set((state) => ({
          allUsers: [...state.allUsers, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        }));
        return true;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      updateProfile: (data) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = { ...state.currentUser, ...data };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      changePassword: (oldPassword, newPassword) => {
        if (oldPassword.length >= 6 && newPassword.length >= 6) {
          return true;
        }
        return false;
      },

      // Music Player
      currentSong: null,
      isPlaying: false,
      queue: [],
      queueIndex: 0,
      volume: 0.7,
      progress: 0,
      shuffle: false,
      repeat: 'off',
      playSong: (song) => {
        set({ currentSong: song, isPlaying: true, queue: [song], queueIndex: 0, progress: 0 });
        get().addToRecentlyPlayed(song.id);
      },
      playQueue: (songs, startIndex = 0) => {
        if (songs.length === 0) return;
        set({ queue: songs, queueIndex: startIndex, currentSong: songs[startIndex], isPlaying: true, progress: 0 });
        get().addToRecentlyPlayed(songs[startIndex].id);
      },
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      nextSong: () => {
        const { queue, queueIndex, shuffle, repeat } = get();
        if (queue.length === 0) return;
        let nextIndex: number;
        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else if (queueIndex < queue.length - 1) {
          nextIndex = queueIndex + 1;
        } else if (repeat === 'all') {
          nextIndex = 0;
        } else {
          return;
        }
        set({ queueIndex: nextIndex, currentSong: queue[nextIndex], progress: 0 });
        get().addToRecentlyPlayed(queue[nextIndex].id);
      },
      prevSong: () => {
        const { queue, queueIndex } = get();
        if (queue.length === 0 || queueIndex === 0) return;
        const prevIndex = queueIndex - 1;
        set({ queueIndex: prevIndex, currentSong: queue[prevIndex], progress: 0 });
      },
      setVolume: (volume) => set({ volume }),
      setProgress: (progress) => set({ progress }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      toggleRepeat: () =>
        set((state) => ({
          repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off',
        })),

      // Data
      songs,
      artists,
      playlists,
      categories,
      allUsers: users,
      comments,

      // User Actions
      likeSong: (songId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            likedSongs: [...state.currentUser.likedSongs, songId],
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      unlikeSong: (songId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            likedSongs: state.currentUser.likedSongs.filter((id) => id !== songId),
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      addToLibrary: (songId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            library: [...state.currentUser.library, songId],
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      removeFromLibrary: (songId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            library: state.currentUser.library.filter((id) => id !== songId),
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      followArtist: (artistId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            followingArtists: [...state.currentUser.followingArtists, artistId],
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      unfollowArtist: (artistId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = {
            ...state.currentUser,
            followingArtists: state.currentUser.followingArtists.filter((id) => id !== artistId),
          };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      addToRecentlyPlayed: (songId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const recent = [songId, ...state.currentUser.recentlyPlayed.filter((id) => id !== songId)].slice(0, 20);
          const updated = { ...state.currentUser, recentlyPlayed: recent };
          return {
            currentUser: updated,
            allUsers: state.allUsers.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
      createPlaylist: (name, description) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newPlaylist: Playlist = {
          id: `playlist-${Date.now()}`,
          name,
          description,
          cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
          userId: currentUser.id,
          songIds: [],
          isPublic: true,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
      },
      updatePlaylist: (id, data) => {
        set((state) => ({
          playlists: state.playlists.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },
      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        }));
      },
      addSongToPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, songIds: [...p.songIds, songId] } : p
          ),
        }));
      },
      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p
          ),
        }));
      },
      addComment: (songId, content) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          songId,
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [...state.comments, newComment] }));
      },

      // Admin Actions
      addSong: (songData) => {
        const newSong: Song = { ...songData, id: `song-${Date.now()}` };
        set((state) => ({ songs: [...state.songs, newSong] }));
      },
      updateSong: (id, data) => {
        set((state) => ({
          songs: state.songs.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }));
      },
      deleteSong: (id) => {
        set((state) => ({ songs: state.songs.filter((s) => s.id !== id) }));
      },
      addArtist: (artistData) => {
        const newArtist: Artist = { ...artistData, id: `artist-${Date.now()}` };
        set((state) => ({ artists: [...state.artists, newArtist] }));
      },
      updateArtist: (id, data) => {
        set((state) => ({
          artists: state.artists.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }));
      },
      deleteArtist: (id) => {
        set((state) => ({ artists: state.artists.filter((a) => a.id !== id) }));
      },
      addCategory: (categoryData) => {
        const newCategory: Category = { ...categoryData, id: `cat-${Date.now()}` };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
      },
      suspendUser: (userId) => {
        set((state) => ({
          allUsers: state.allUsers.map((u) => (u.id === userId ? { ...u, suspended: true } : u)),
        }));
      },
      unsuspendUser: (userId) => {
        set((state) => ({
          allUsers: state.allUsers.map((u) => (u.id === userId ? { ...u, suspended: false } : u)),
        }));
      },
      deleteUser: (userId) => {
        set((state) => ({
          allUsers: state.allUsers.filter((u) => u.id !== userId),
          playlists: state.playlists.filter((p) => p.userId !== userId),
        }));
      },
      setFeaturedSong: (songId, featured) => {
        set((state) => ({
          songs: state.songs.map((s) => (s.id === songId ? { ...s, featured } : s)),
        }));
      },
      setTrendingSong: (songId, trending) => {
        set((state) => ({
          songs: state.songs.map((s) => (s.id === songId ? { ...s, trending } : s)),
        }));
      },
      deleteComment: (commentId) => {
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        }));
      },
      deletePlaylistAdmin: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
        }));
      },
    }),
    {
      name: 'musicflow-storage',
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        volume: state.volume,
      }),
    }
  )
);
