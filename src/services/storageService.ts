import { DEMO_SONGS } from '../data/demoSongs';
import { Playlist, Song, UserProfile, UserSongPreference } from '../types/music';

const STORAGE_KEYS = {
  SONGS: 'cantai_songs_v1',
  FAVORITES: 'cantai_favorites_v1',
  PLAYLISTS: 'cantai_playlists_v1',
  HISTORY: 'cantai_history_v1',
  PREFERENCES: 'cantai_song_prefs_v1',
  PROFILE: 'cantai_user_profile_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest_user_1',
  displayName: 'Irmão Músico',
  preferredLanguage: 'pt-BR',
  theme: 'dark',
  fontSize: 'md',
  defaultPlaybackRate: 1.0,
  subscriptionStatus: 'free',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-culto-domingo',
    name: 'Culto de Domingo',
    description: 'Louvores congregacionais para ministração do culto.',
    songIds: ['demo-caminho-da-luz', 'demo-graca-infinita', 'demo-santo-e-o-senhor'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pl-iniciantes',
    name: 'Primeiros Louvores no Violão',
    description: 'Músicas com acordes abertos e ritmo fácil para praticar.',
    songIds: ['demo-em-teus-bracos', 'demo-caminho-da-luz'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  // Songs
  getAllSongs(): Song[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure default demo songs are always present and up to date
          const storedIds = new Set(parsed.map((s: Song) => s.id));
          const missingDemos = DEMO_SONGS.filter((d) => !storedIds.has(d.id));
          return [...parsed, ...missingDemos];
        }
      }
    } catch (e) {
      console.warn('Storage read error for songs:', e);
    }
    return DEMO_SONGS;
  },

  getSongById(id: string): Song | undefined {
    const songs = this.getAllSongs();
    return songs.find((s) => s.id === id);
  },

  saveSong(song: Song): void {
    const songs = this.getAllSongs();
    const index = songs.findIndex((s) => s.id === song.id);
    if (index >= 0) {
      songs[index] = { ...song, updatedAt: new Date().toISOString() };
    } else {
      songs.push(song);
    }
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return ['demo-caminho-da-luz'];
  },

  toggleFavorite(songId: string): boolean {
    const favs = this.getFavorites();
    const isFav = favs.includes(songId);
    const updated = isFav ? favs.filter((id) => id !== songId) : [...favs, songId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !isFav;
  },

  isFavorite(songId: string): boolean {
    return this.getFavorites().includes(songId);
  },

  // Playlists
  getPlaylists(): Playlist[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    // Seed default playlists
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(DEFAULT_PLAYLISTS));
    return DEFAULT_PLAYLISTS;
  },

  createPlaylist(name: string, description?: string): Playlist {
    const playlists = this.getPlaylists();
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'Nova Playlist',
      description: description?.trim(),
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    playlists.push(newPlaylist);
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return newPlaylist;
  },

  updatePlaylist(updated: Playlist): void {
    const playlists = this.getPlaylists().map((p) =>
      p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p
    );
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  },

  deletePlaylist(id: string): void {
    const playlists = this.getPlaylists().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  },

  addSongToPlaylist(playlistId: string, songId: string): void {
    const playlists = this.getPlaylists();
    const pl = playlists.find((p) => p.id === playlistId);
    if (pl && !pl.songIds.includes(songId)) {
      pl.songIds.push(songId);
      pl.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    }
  },

  removeSongFromPlaylist(playlistId: string, songId: string): void {
    const playlists = this.getPlaylists();
    const pl = playlists.find((p) => p.id === playlistId);
    if (pl) {
      pl.songIds = pl.songIds.filter((id) => id !== songId);
      pl.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    }
  },

  // History & "Continuar tocando"
  getHistory(): { songId: string; lastPositionSeconds: number; timestamp: string }[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        songId: 'demo-caminho-da-luz',
        lastPositionSeconds: 24,
        timestamp: new Date().toISOString(),
      },
    ];
  },

  savePlaybackProgress(songId: string, positionSeconds: number): void {
    const history = this.getHistory().filter((h) => h.songId !== songId);
    history.unshift({
      songId,
      lastPositionSeconds: Math.floor(positionSeconds),
      timestamp: new Date().toISOString(),
    });
    // Keep last 15 songs in history
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 15)));
  },

  // Song specific preferences (e.g. Transposition, Capo, Simplified)
  getSongPreference(songId: string): UserSongPreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        const map = JSON.parse(stored);
        if (map[songId]) return map[songId];
      }
    } catch (e) {
      console.warn(e);
    }
    return {
      songId,
      preferredKey: '',
      semitonesShift: 0,
      capoPosition: 0,
      useSimplifiedChords: false,
      lastPositionSeconds: 0,
      updatedAt: new Date().toISOString(),
    };
  },

  saveSongPreference(pref: UserSongPreference): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const map = stored ? JSON.parse(stored) : {};
      map[pref.songId] = { ...pref, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(map));
    } catch (e) {
      console.warn(e);
    }
  },

  // User Profile & Subscription
  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_PROFILE;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },
};
