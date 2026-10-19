import React, { useState } from 'react';
import { Playlist, Song } from '../types/music';
import { storageService } from '../services/storageService';
import {
  ListMusic,
  Plus,
  Trash2,
  Play,
  Music,
  MoreVertical,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PlaylistsViewProps {
  playlists: Playlist[];
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onRefreshPlaylists: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  songs,
  onSelectSong,
  onRefreshPlaylists,
}) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(
    playlists[0]?.id || ''
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [showAddSongModal, setShowAddSongModal] = useState(false);

  const currentPlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const created = storageService.createPlaylist(newPlaylistName, newPlaylistDesc);
    setIsCreatingNew(false);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    onRefreshPlaylists();
    setSelectedPlaylistId(created.id);
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta playlist?')) {
      storageService.deletePlaylist(id);
      onRefreshPlaylists();
      if (selectedPlaylistId === id) {
        setSelectedPlaylistId(playlists.find((p) => p.id !== id)?.id || '');
      }
    }
  };

  const handleRemoveSongFromPlaylist = (songId: string) => {
    if (currentPlaylist) {
      storageService.removeSongFromPlaylist(currentPlaylist.id, songId);
      onRefreshPlaylists();
    }
  };

  const handleAddSong = (songId: string) => {
    if (currentPlaylist) {
      storageService.addSongToPlaylist(currentPlaylist.id, songId);
      onRefreshPlaylists();
      setShowAddSongModal(false);
    }
  };

  const playlistSongs = currentPlaylist
    ? currentPlaylist.songIds
        .map((id) => songs.find((s) => s.id === id))
        .filter((s): s is Song => s !== undefined)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ListMusic className="w-6 h-6 text-emerald-400" />
            <span>Playlists para Cultos e Ensaios</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize seu repertório por ministração, ensaio ou nível de aprendizado.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Playlist</span>
        </button>
      </div>

      {/* New Playlist Form */}
      {isCreatingNew && (
        <form
          onSubmit={handleCreatePlaylist}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
        >
          <h2 className="text-sm font-bold text-white">Criar Nova Playlist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome da Playlist (ex: Culto Jovem, Ensaio Sábado)..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="text"
              placeholder="Descrição ou data do culto (opcional)..."
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Main Content: Sidebar + Songs in Playlist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Playlists Selector List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Suas Playlists ({playlists.length})
          </h2>
          <div className="space-y-2">
            {playlists.map((pl) => {
              const isSelected = pl.id === currentPlaylist?.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlaylistId(pl.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-emerald-400' : 'text-white group-hover:text-slate-200'
                      }`}
                    >
                      {pl.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {pl.songIds.length} louvores · {pl.description || 'Sem descrição'}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(pl.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Playlist Songs */}
        <div className="md:col-span-2 space-y-4">
          {currentPlaylist ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{currentPlaylist.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentPlaylist.description || 'Repertório personalizado para ministração de louvor.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddSongModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Louvor</span>
                  </button>

                  {playlistSongs.length > 0 && (
                    <button
                      onClick={() => onSelectSong(playlistSongs[0])}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Iniciar Playlist</span>
                    </button>
                  )}
                </div>
              </div>

              {/* List of songs in the current playlist */}
              {playlistSongs.length > 0 ? (
                <div className="space-y-2">
                  {playlistSongs.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => onSelectSong(song)}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-slate-500 w-5 text-center">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {song.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{song.artist}</span>
                            <span className="text-slate-600">·</span>
                            <span className="font-mono text-emerald-400">Tom: {song.originalKey}</span>
                            {song.capoSuggestion > 0 && (
                              <>
                                <span className="text-slate-600">·</span>
                                <span className="text-amber-400">Capo {song.capoSuggestion}ª</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSongFromPlaylist(song.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remover desta playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs space-y-2">
                  <Music className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Nenhum louvor adicionado a esta playlist ainda.</p>
                  <button
                    onClick={() => setShowAddSongModal(true)}
                    className="text-emerald-400 hover:underline"
                  >
                    + Adicionar louvor agora
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Selecione uma playlist ao lado.
            </div>
          )}
        </div>
      </div>

      {/* Add Song to Playlist Modal */}
      {showAddSongModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setShowAddSongModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Adicionar Louvor à Playlist</h3>
              <button
                onClick={() => setShowAddSongModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {songs.map((song) => {
                const alreadyIn = currentPlaylist?.songIds.includes(song.id);
                return (
                  <div
                    key={song.id}
                    onClick={() => !alreadyIn && handleAddSong(song.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      alreadyIn
                        ? 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 cursor-pointer'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{song.title}</h4>
                      <p className="text-xs text-slate-400">
                        {song.artist} · Tom: {song.originalKey}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-emerald-400">
                      {alreadyIn ? 'Já adicionada' : '+ Adicionar'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
