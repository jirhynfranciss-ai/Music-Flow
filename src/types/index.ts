export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
  suspended: boolean;
  likedSongs: string[];
  followingArtists: string[];
  recentlyPlayed: string[];
  library: string[];
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
  followers: number;
  genre: string;
  verified: boolean;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  album: string;
  albumCover: string;
  duration: number;
  audioUrl: string;
  genre: string;
  plays: number;
  releaseDate: string;
  featured: boolean;
  trending: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  userId: string;
  songIds: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  songId: string;
  content: string;
  createdAt: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  theme: ThemeMode;
  currentUser: User | null;
  isAuthenticated: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  volume: number;
  progress: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}
