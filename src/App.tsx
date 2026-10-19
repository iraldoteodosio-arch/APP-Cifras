import React, { useState, useEffect, useMemo } from 'react';
import { Song, Playlist, UserProfile } from './types/music';
import { storageService } from './services/storageService';
import { SongPlayerView } from './components/SongPlayerView';
import { SyncEditorModal } from './components/SyncEditorModal';
import { TunerModal } from './components/TunerModal';
import { MetronomeModal } from './components/MetronomeModal';
import { ChordLibraryModal } from './components/ChordLibraryModal';
import { PlaylistsView } from './components/PlaylistsView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { AddYoutubeSongModal } from './components/AddYoutubeSongModal';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/PWAInstallButton';
import {
  Search,
  Play,
  Heart,
  Music,
  Mic,
  Music2,
  BookOpen,
  Filter,
  CheckCircle2,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Youtube,
} from 'lucide-react';

const HERO_IMAGE_PATH = '/src/assets/images/cantai_hero_acoustic_1792415890317.jpg';
const WORSHIP_REHEARSAL_IMAGE = '/src/assets/images/cantai_community_worship_1792415891288.jpg';

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => storageService.getAllSongs());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => storageService.getPlaylists());
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());

  // Navigation & Active Song
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'playlists' | 'favorites' | 'tests'>('home');
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedKey, setSelectedKey] = useState<string>('all');

  // Modals
  const [showTuner, setShowTuner] = useState(false);
  const [showMetronome, setShowMetronome] = useState(false);
  const [showChordLibrary, setShowChordLibrary] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [showAddYoutubeModal, setShowAddYoutubeModal] = useState(false);
  const [editingSyncSong, setEditingSyncSong] = useState<Song | null>(null);
  const [showToolsSheet, setShowToolsSheet] = useState(false);

  // Refresh songs or playlists when storage updates
  const refreshData = () => {
    setSongs(storageService.getAllSongs());
    setPlaylists(storageService.getPlaylists());
    setFavorites(storageService.getFavorites());
  };

  // Last played song for "Continuar Tocando"
  const history = useMemo(() => storageService.getHistory(), []);
  const lastPlayedItem = history[0];
  const lastPlayedSong = lastPlayedItem ? songs.find((s) => s.id === lastPlayedItem.songId) : songs[0];

  // Categories list
  const categories = [
    'all',
    'Worship contemporâneo',
    'Louvor congregacional',
    'Adoração',
    'Hinos tradicionais',
    'Louvores acústicos',
    'Músicas para iniciantes',
    'Acordes simplificados',
  ];

  // Filtered songs
  const filteredSongs = useMemo(() => {
    return songs.filter((s) => {
      const matchQuery =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || s.categories.includes(selectedCategory);

      const matchDifficulty =
        selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;

      const matchKey = selectedKey === 'all' || s.originalKey === selectedKey;

      return matchQuery && matchCategory && matchDifficulty && matchKey;
    });
  }, [songs, searchQuery, selectedCategory, selectedDifficulty, selectedKey]);

  // Handle song selection
  const handleOpenSong = (song: Song) => {
    setActiveSong(song);
  };

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    storageService.toggleFavorite(songId);
    setFavorites(storageService.getFavorites());
  };

  // If a song is currently being played, render the high-priority SongPlayerView
  if (activeSong) {
    return (
      <SongPlayerView
        song={activeSong}
        onBack={() => {
          setActiveSong(null);
          refreshData();
        }}
        onOpenSyncEditor={(songToEdit) => setEditingSyncSong(songToEdit)}
        onOpenTuner={() => setShowTuner(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <OfflineIndicator />

      {/* Desktop/Tablet 3-Zone Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'tests') {
            setShowTestRunner(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenTuner={() => setShowTuner(true)}
        onOpenMetronome={() => setShowMetronome(true)}
        onOpenChords={() => setShowChordLibrary(true)}
        onOpenSubscription={() => setShowSubscription(true)}
        onOpenAddYoutube={() => setShowAddYoutubeModal(true)}
        userProfile={userProfile}
      />

      {/* Main Tab Views */}
      <main className="flex-1 pb-24 md:pb-12">
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
              <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  {/* Category breadcrumb */}
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <span>Música Cristã</span>
                    <span aria-hidden="true">·</span>
                    <span>Violão Acústico</span>
                    <span aria-hidden="true">·</span>
                    <span>Cifras Sincronizadas</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Seu louvor, seu violão, <br className="hidden sm:inline" />
                    <span className="text-emerald-400">sua adoração.</span>
                  </h1>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                    Acompanhe a letra e os acordes sincronizados em tempo real com áudio
                    autorizado. Altere o tom, calcule o capotraste e aprenda as posições reais
                    no braço do violão.
                  </p>

                  {/* Hero Quick CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {lastPlayedSong && (
                      <button
                        onClick={() => handleOpenSong(lastPlayedSong)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>Continuar Tocando</span>
                      </button>
                    )}

                    <button
                      onClick={() => setShowAddYoutubeModal(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>Cifrar do YouTube</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('explore')}
                      className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Explorar Biblioteca
                    </button>
                  </div>

                  {/* Musical Quick Tools Bar */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setShowTuner(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Afinador Cromático</span>
                    </button>

                    <button
                      onClick={() => setShowMetronome(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Music2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Metrônomo Digital</span>
                    </button>

                    <button
                      onClick={() => setShowChordLibrary(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dicionário de Acordes</span>
                    </button>
                  </div>
                </div>

                {/* Hero Image Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                    <img
                      src={HERO_IMAGE_PATH}
                      alt="Violão acústico no palco em atmosfera de adoração e louvor"
                      className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          Louvor em Destaque
                        </div>
                        <div className="text-sm font-bold text-white">
                          Caminho da Tua Luz
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenSong(songs[0])}
                        className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow hover:bg-emerald-400 transition-transform active:scale-95 cursor-pointer"
                        title="Tocar louvor em destaque"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Categories Carousel / Filter */}
            <section className="max-w-6xl mx-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Categorias & Ministrações
                  </h2>
                  <p className="text-xs text-slate-400">
                    Selecione pelo estilo de culto, tempo musical ou facilidade para violão
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentTab('explore');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Todas as Categorias' : cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Popular Demonstrative Songs Grid */}
            <section className="max-w-6xl mx-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Louvores Sincronizados
                  </h2>
                  <p className="text-xs text-slate-400">
                    Toque acompanhado pelo violão virtual e acompanhamento acústico em tempo real
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('explore')}
                  className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Todos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {songs.map((song) => {
                  const isFav = favorites.includes(song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => handleOpenSong(song)}
                      className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                              {song.categories[0] || 'Louvor'}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                              {song.title}
                            </h3>
                            <p className="text-xs text-slate-400">{song.artist}</p>
                          </div>

                          <button
                            onClick={(e) => handleToggleFavorite(e, song.id)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isFav
                                ? 'text-rose-500 bg-rose-500/10'
                                : 'text-slate-500 hover:text-white hover:bg-slate-800'
                            }`}
                            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Song specs */}
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                            Tom: {song.originalKey}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                            {song.bpm} BPM
                          </span>
                          {song.capoSuggestion > 0 && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Capo {song.capoSuggestion}ª
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card bottom action */}
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Áudio Sincronizado</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Setlist / Ensaio Banner */}
            <section className="max-w-6xl mx-auto px-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                    Preparação Ministerial
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Monte o repertório do próximo culto ou ensaio
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
                    Crie listas com os tons ideais para o seu ministro de louvor, memorize as
                    passagens com o metrônomo e toque sem interrupções.
                  </p>
                  <button
                    onClick={() => setCurrentTab('playlists')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer mt-2"
                  >
                    <span>Ver Minhas Playlists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-800">
                  <img
                    src={WORSHIP_REHEARSAL_IMAGE}
                    alt="Ensaio de louvor com violão acústico e partitura"
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Explore / Biblioteca View */}
        {currentTab === 'explore' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Biblioteca Musical Cantai
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Busca completa por título, artista, tom, capotraste e nível de dificuldade
                </p>
              </div>

              <button
                onClick={() => setShowAddYoutubeModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Youtube className="w-4 h-4" />
                <span>+ Cifrar do YouTube</span>
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar louvor pelo título, artista ou trecho..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-md"
              />
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Categoria:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'Todas' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Key selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Tom:</span>
                <select
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todos os Tons</option>
                  <option value="C">C (Dó)</option>
                  <option value="D">D (Ré)</option>
                  <option value="E">E (Mi)</option>
                  <option value="G">G (Sol)</option>
                  <option value="A">A (Lá)</option>
                </select>
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Dificuldade:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Todas</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {filteredSongs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.map((song) => {
                  const isFav = favorites.includes(song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => handleOpenSong(song)}
                      className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                              {song.categories[0]}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                              {song.title}
                            </h3>
                            <p className="text-xs text-slate-400">{song.artist}</p>
                          </div>
                          <button
                            onClick={(e) => handleToggleFavorite(e, song.id)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isFav ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            Tom: {song.originalKey}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {song.bpm} BPM
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {song.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <span>{song.sections.length} seções mapeadas</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Music className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm">Nenhum louvor encontrado com os filtros selecionados.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSelectedKey('all');
                  }}
                  className="text-xs text-emerald-400 underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Playlists View */}
        {currentTab === 'playlists' && (
          <PlaylistsView
            playlists={playlists}
            songs={songs}
            onSelectSong={handleOpenSong}
            onRefreshPlaylists={refreshData}
          />
        )}

        {/* Favorites View */}
        {currentTab === 'favorites' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-current" />
                <span>Seus Louvores Favoritos</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Acesse rapidamente as músicas marcadas com o coração
              </p>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites
                  .map((id) => songs.find((s) => s.id === id))
                  .filter((s): s is Song => s !== undefined)
                  .map((song) => (
                    <div
                      key={song.id}
                      onClick={() => handleOpenSong(song)}
                      className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                              {song.categories[0]}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                              {song.title}
                            </h3>
                            <p className="text-xs text-slate-400">{song.artist}</p>
                          </div>
                          <button
                            onClick={(e) => handleToggleFavorite(e, song.id)}
                            className="p-2 rounded-xl text-rose-500 bg-rose-500/10 cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-3">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            Tom: {song.originalKey}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {song.bpm} BPM
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <span>Tocar agora</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Heart className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm">Você ainda não favoritou nenhum louvor.</p>
                <button
                  onClick={() => setCurrentTab('explore')}
                  className="text-xs text-emerald-400 underline cursor-pointer"
                >
                  Explorar louvores para favoritar
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'tests') {
            setShowTestRunner(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenToolsSheet={() => setShowToolsSheet(true)}
      />

      {/* Mobile Tools Action Sheet */}
      {showToolsSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 md:hidden"
          onClick={() => setShowToolsSheet(false)}
        >
          <div
            className="w-full bg-slate-900 border border-slate-700 rounded-t-3xl p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">
              Ferramentas Musicais
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setShowToolsSheet(false);
                  setShowTuner(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2 text-center"
              >
                <Mic className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Afinador</span>
              </button>

              <button
                onClick={() => {
                  setShowToolsSheet(false);
                  setShowMetronome(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2 text-center"
              >
                <Music2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Metrônomo</span>
              </button>

              <button
                onClick={() => {
                  setShowToolsSheet(false);
                  setShowChordLibrary(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2 text-center"
              >
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Acordes</span>
              </button>

              <button
                onClick={() => {
                  setShowToolsSheet(false);
                  setShowTestRunner(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2 text-center"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Testes (100%)</span>
              </button>
            </div>

            <button
              onClick={() => setShowToolsSheet(false)}
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {showTuner && <TunerModal onClose={() => setShowTuner(false)} />}
      {showMetronome && <MetronomeModal onClose={() => setShowMetronome(false)} />}
      {showChordLibrary && <ChordLibraryModal onClose={() => setShowChordLibrary(false)} />}
      {showSubscription && (
        <SubscriptionModal
          onClose={() => setShowSubscription(false)}
          userProfile={userProfile}
          onProfileUpdated={(updated) => setUserProfile(updated)}
        />
      )}
      {showTestRunner && <TestRunnerModal onClose={() => setShowTestRunner(false)} />}
      {editingSyncSong && (
        <SyncEditorModal
          song={editingSyncSong}
          onClose={() => setEditingSyncSong(null)}
          onSave={(updated) => {
            setSongs(storageService.getAllSongs());
            setEditingSyncSong(null);
          }}
        />
      )}
      {showAddYoutubeModal && (
        <AddYoutubeSongModal
          onClose={() => setShowAddYoutubeModal(false)}
          onSongCreated={(newSong) => {
            setSongs(storageService.getAllSongs());
            setShowAddYoutubeModal(false);
            setActiveSong(newSong);
          }}
        />
      )}
    </div>
  );
}
