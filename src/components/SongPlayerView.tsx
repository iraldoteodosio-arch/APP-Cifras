import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Song, ChordEvent, SongSection } from '../types/music';
import {
  transposeChord,
  getChordDefinition,
  getSimplifiedChord,
  getCapoShapeKey,
  CHORD_DATABASE,
} from '../utils/chords';
import { playAcousticGuitarChord } from '../utils/audioEngine';
import { storageService } from '../services/storageService';
import { ChordDiagram } from './ChordDiagram';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Heart,
  ArrowLeft,
  Settings,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Music,
  Upload,
  Clock,
  Layers,
  HelpCircle,
  Edit3,
  Youtube,
} from 'lucide-react';

interface SongPlayerViewProps {
  song: Song;
  onBack: () => void;
  onOpenSyncEditor?: (song: Song) => void;
  onOpenTuner?: () => void;
}

export const SongPlayerView: React.FC<SongPlayerViewProps> = ({
  song,
  onBack,
  onOpenSyncEditor,
}) => {
  // Persistence preferences
  const initialPref = useMemo(() => storageService.getSongPreference(song.id), [song.id]);

  // Transposition & Capo state
  const [semitonesShift, setSemitonesShift] = useState<number>(initialPref.semitonesShift || 0);
  const [preferFlats, setPreferFlats] = useState<boolean>(false);
  const [capoFret, setCapoFret] = useState<number>(initialPref.capoPosition || song.capoSuggestion || 0);
  const [useSimplified, setUseSimplified] = useState<boolean>(initialPref.useSimplifiedChords || false);

  const youtubeSource = useMemo(
    () => song.audioSources.find((s) => s.type === 'youtube'),
    [song]
  );

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.8);
  const [audioSourceType, setAudioSourceType] = useState<'synth' | 'user_file' | 'youtube'>(() => {
    const yt = song.audioSources.find((s) => s.type === 'youtube');
    return yt ? 'youtube' : 'synth';
  });
  const [showYoutubeVideo, setShowYoutubeVideo] = useState<boolean>(true);
  const [userAudioFileName, setUserAudioFileName] = useState<string | null>(null);

  // UI & display preferences
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [showChordDiagrams, setShowChordDiagrams] = useState<boolean>(true);
  const [selectedChordForModal, setSelectedChordForModal] = useState<string | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(() => storageService.isFavorite(song.id));
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isWakeLocked, setIsWakeLocked] = useState<boolean>(false);
  const [chordDisplayMode, setChordDisplayMode] = useState<'aligned' | 'badges'>('aligned');

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const lastPlayedChordIdRef = useRef<string | null>(null);
  const wakeLockRef = useRef<unknown>(null);

  // Calculate total duration from sections
  const totalDuration = useMemo(() => {
    let max = 0;
    song.sections.forEach((sec) => {
      if (sec.endTime > max) max = sec.endTime;
    });
    return max || 70;
  }, [song]);

  // Sounding key calculation
  const soundingKey = useMemo(() => {
    return transposeChord(song.originalKey, semitonesShift, preferFlats);
  }, [song.originalKey, semitonesShift, preferFlats]);

  // Chord shape key when capo is applied
  const capoShapeKey = useMemo(() => {
    return getCapoShapeKey(soundingKey, capoFret, preferFlats);
  }, [soundingKey, capoFret, preferFlats]);

  // Transpose and simplify a chord symbol for display
  const transformChordSymbol = (originalSymbol: string): string => {
    let sym = originalSymbol;
    if (useSimplified) {
      sym = getSimplifiedChord(sym);
    }
    // If user has capo, the shape to fret is transposed down by capo frets
    const effectiveShift = semitonesShift - capoFret;
    return transposeChord(sym, effectiveShift, preferFlats);
  };

  // Find all unique chords in this song for the diagram bar
  const uniqueChordsInSong = useMemo(() => {
    const set = new Set<string>();
    song.sections.forEach((sec) => {
      sec.lines.forEach((line) => {
        line.chords.forEach((c) => {
          set.add(transformChordSymbol(c.chordSymbol));
        });
      });
    });
    return Array.from(set);
  }, [song, semitonesShift, capoFret, preferFlats, useSimplified]);

  // Active section and line based on currentTime
  const currentSection = useMemo(() => {
    return song.sections.find(
      (sec) => currentTime >= sec.startTime && currentTime <= sec.endTime
    );
  }, [song, currentTime]);

  const currentLine = useMemo(() => {
    for (const sec of song.sections) {
      for (const line of sec.lines) {
        if (currentTime >= line.startTime && currentTime <= line.endTime) {
          return line;
        }
      }
    }
    return null;
  }, [song, currentTime]);

  // Auto-scroll to current active line smoothly
  useEffect(() => {
    if (autoScrollEnabled && activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLine, autoScrollEnabled]);

  // Wake Lock API handling to keep screen awake during worship
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isWakeLocked) {
        try {
          const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
          wakeLockRef.current = await nav.wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake lock error:', err);
          setIsWakeLocked(false);
        }
      }
    };

    if (isWakeLocked) {
      requestWakeLock();
    } else if (wakeLockRef.current) {
      const lock = wakeLockRef.current as { release?: () => Promise<void> };
      if (typeof lock.release === 'function') {
        lock.release();
      }
      wakeLockRef.current = null;
    }

    return () => {
      if (wakeLockRef.current) {
        const lock = wakeLockRef.current as { release?: () => Promise<void> };
        if (typeof lock.release === 'function') {
          lock.release();
        }
      }
    };
  }, [isWakeLocked]);

  // Audio playback accompaniment loop (for synth and YouTube modes)
  useEffect(() => {
    if (isPlaying && (audioSourceType === 'synth' || audioSourceType === 'youtube')) {
      const intervalMs = 100;
      synthIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (intervalMs / 1000) * playbackRate;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }

          // If in synth mode, trigger strum when reaching a chord event
          if (audioSourceType === 'synth') {
            for (const sec of song.sections) {
              for (const line of sec.lines) {
                for (const chord of line.chords) {
                  if (
                    Math.abs(next - line.startTime) < 0.15 &&
                    lastPlayedChordIdRef.current !== chord.id + Math.floor(next)
                  ) {
                    lastPlayedChordIdRef.current = chord.id + Math.floor(next);
                    const transformed = transformChordSymbol(chord.chordSymbol);
                    playAcousticGuitarChord(transformed, 2.0, volume);
                  }
                }
              }
            }
          }

          return next;
        });
      }, intervalMs);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
    }

    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, [isPlaying, audioSourceType, playbackRate, totalDuration, song, volume, semitonesShift, capoFret, useSimplified]);

  // Save playback progress on leave
  useEffect(() => {
    return () => {
      if (currentTime > 0) {
        storageService.savePlaybackProgress(song.id, currentTime);
      }
      storageService.saveSongPreference({
        songId: song.id,
        preferredKey: soundingKey,
        semitonesShift,
        capoPosition: capoFret,
        useSimplifiedChords: useSimplified,
        lastPositionSeconds: currentTime,
        updatedAt: new Date().toISOString(),
      });
    };
  }, [song.id, currentTime, soundingKey, semitonesShift, capoFret, useSimplified]);

  // Handlers for Audio Controls
  const togglePlay = () => {
    if (audioSourceType === 'user_file' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error(err));
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, time));
    setCurrentTime(clamped);
    if (audioSourceType === 'user_file' && audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const jumpSeconds = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const jumpToSection = (direction: 'next' | 'prev') => {
    if (!song.sections.length) return;
    const sorted = [...song.sections].sort((a, b) => a.startTime - b.startTime);
    if (direction === 'next') {
      const nextSec = sorted.find((s) => s.startTime > currentTime + 1.0);
      if (nextSec) handleSeek(nextSec.startTime);
    } else {
      const prevSec = [...sorted].reverse().find((s) => s.startTime < currentTime - 1.5);
      if (prevSec) handleSeek(prevSec.startTime);
      else handleSeek(0);
    }
  };

  const handleUserFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserAudioFileName(file.name);
      setAudioSourceType('user_file');
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  };

  const toggleFavorite = () => {
    const updated = storageService.toggleFavorite(song.id);
    setIsFavorite(updated);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Font size styling classes
  const lyricsFontSizeClass =
    fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-xl' : fontSize === 'xl' ? 'text-2xl' : 'text-base';
  const chordFontSizeClass =
    fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm';

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Hidden audio element for user file uploads */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current && audioSourceType === 'user_file') {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
              aria-label="Voltar para a biblioteca"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-white truncate tracking-tight">
                {song.title}
              </h1>
              <p className="text-xs text-slate-400 truncate flex items-center gap-2">
                <span>{song.artist}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-emerald-400 font-medium">
                  Tom: {soundingKey}
                </span>
                {capoFret > 0 && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400/90 font-mono">
                      Capo {capoFret}ª (Forma {capoShapeKey})
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions (Favorite, Settings, Fullscreen) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isFavorite
                  ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar louvor'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {onOpenSyncEditor && (
              <button
                onClick={() => onOpenSyncEditor(song)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                title="Abrir editor de sincronização de tempos"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor Sync</span>
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                isSettingsOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="Ajustes de Tom, Capotraste e Visualização"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden md:flex p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              title={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia para palco'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Expandable Settings Drawer */}
      {isSettingsOpen && (
        <section aria-label="Ajustes musicais e de visualização" className="bg-slate-900/95 border-b border-slate-800 px-4 py-4 transition-all">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Transposition and Capo */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tom & Harmonia</span>
              </h2>

              {/* Transpose Controls */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Transpor Tom</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">{soundingKey}</span>
                    {semitonesShift !== 0 && (
                      <span className="text-xs text-emerald-400 font-mono">
                        ({semitonesShift > 0 ? `+${semitonesShift}` : semitonesShift})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSemitonesShift((prev) => prev - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    title="Descer meio tom (-1 semitom)"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setSemitonesShift(0)}
                    disabled={semitonesShift === 0}
                    className="px-2 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Restaurar tom original"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => setSemitonesShift((prev) => prev + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    title="Subir meio tom (+1 semitom)"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Capo Selector */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Capotraste</span>
                  <span className="text-xs text-amber-400 font-medium">
                    {capoFret === 0 ? 'Sem Capotraste' : `${capoFret}ª Casa (Tocar em ${capoShapeKey})`}
                  </span>
                </div>
                <select
                  value={capoFret}
                  onChange={(e) => setCapoFret(Number(e.target.value))}
                  className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value={0}>Sem Capo</option>
                  <option value={1}>1ª Casa</option>
                  <option value={2}>2ª Casa (Ideal)</option>
                  <option value={3}>3ª Casa</option>
                  <option value={4}>4ª Casa</option>
                  <option value={5}>5ª Casa</option>
                </select>
              </div>

              {/* Simplified Chords & Notation Toggle */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={useSimplified}
                    onChange={(e) => setUseSimplified(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                  <span>Acordes Simplificados</span>
                </label>

                <button
                  onClick={() => setPreferFlats(!preferFlats)}
                  className="text-xs text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                >
                  Notação: {preferFlats ? 'Bemóis (♭)' : 'Sustenidos (♯)'}
                </button>
              </div>
            </div>

            {/* Column 2: Typography and Stage Display */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visualização no Palco</span>
              </h2>

              {/* Font Size Selector */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Tamanho da Letra</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                        fontSize === sz
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wake Lock & Auto Scroll */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsWakeLocked(!isWakeLocked)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    isWakeLocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Impede que a tela do celular apague durante o louvor"
                >
                  <Sun className="w-4 h-4" />
                  <span>{isWakeLocked ? 'Tela Sempre Ativa' : 'Manter Tela Ligada'}</span>
                </button>

                <button
                  onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    autoScrollEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{autoScrollEnabled ? 'Rolagem Auto ON' : 'Rolagem Auto OFF'}</span>
                </button>
              </div>

              {/* Toggle Chord Display Mode */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Posicionamento</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg">
                  <button
                    onClick={() => setChordDisplayMode('aligned')}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-all cursor-pointer ${
                      chordDisplayMode === 'aligned'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sobre a Letra
                  </button>
                  <button
                    onClick={() => setChordDisplayMode('badges')}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium transition-all cursor-pointer ${
                      chordDisplayMode === 'badges'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Compacto
                  </button>
                </div>
              </div>

              {/* Toggle Chord Diagrams Drawer */}
              <button
                onClick={() => setShowChordDiagrams(!showChordDiagrams)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Mostrar Diagramas de Acordes</span>
                <span className="text-emerald-400 font-mono">
                  {showChordDiagrams ? 'Visível' : 'Oculto'}
                </span>
              </button>
            </div>

            {/* Column 3: Audio Source & Speed */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fonte de Áudio & Velocidade</span>
              </h2>

              {/* Audio Source Selector */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Modo de Áudio</span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {audioSourceType === 'youtube'
                      ? 'Áudio do YouTube'
                      : audioSourceType === 'synth'
                      ? 'Violão Acústico Sintetizado'
                      : 'Arquivo Local MP3'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {youtubeSource && (
                    <button
                      onClick={() => setAudioSourceType('youtube')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                        audioSourceType === 'youtube'
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-500" />
                      <span>YouTube</span>
                    </button>
                  )}

                  <button
                    onClick={() => setAudioSourceType('synth')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      audioSourceType === 'synth'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Violão Cantai
                  </button>

                  <label
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      audioSourceType === 'user_file'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span className="truncate">{userAudioFileName ? 'Trocar MP3' : 'Enviar MP3'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleUserFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {userAudioFileName && (
                  <p className="text-[11px] text-slate-400 truncate">
                    Arquivo: <span className="text-slate-200">{userAudioFileName}</span>
                  </p>
                )}
              </div>

              {/* Playback Speed */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Velocidade</span>
                </span>
                <div className="flex items-center gap-1">
                  {[0.75, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
        {/* Left Side / Top: Lyrics and Chords Viewer */}
        <main
          ref={lyricsContainerRef}
          className="flex-1 overflow-y-auto space-y-6 pb-36 focus:outline-none"
        >
          {/* Song Overview strip */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                {song.timeSignature}
              </div>
              <div>
                <div className="text-xs text-slate-400">Andamento & Compasso</div>
                <div className="text-sm font-semibold text-white font-mono">
                  {song.bpm} BPM · {song.timeSignature}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">✓ Conteúdo Demonstrativo Cantai</span>
              <span className="text-slate-600">·</span>
              <span>Licença Aberta</span>
            </div>
          </div>

          {/* YouTube Video Player (if song was added from YouTube) */}
          {youtubeSource && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Vídeo do YouTube Sincronizado</span>
                </div>
                <button
                  onClick={() => setShowYoutubeVideo(!showYoutubeVideo)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {showYoutubeVideo ? 'Ocultar Vídeo' : 'Exibir Vídeo'}
                </button>
              </div>

              {showYoutubeVideo && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeSource.sourceReference}?rel=0`}
                    title={song.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          )}

          {/* Sections & Lines */}
          {song.sections.map((section: SongSection) => {
            const isSectionActive = currentSection?.id === section.id;

            return (
              <div
                key={section.id}
                className={`transition-all rounded-2xl p-4 md:p-5 border ${
                  isSectionActive
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/30 border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isSectionActive ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {section.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({formatTime(section.startTime)} - {formatTime(section.endTime)})
                    </span>
                  </div>

                  <button
                    onClick={() => handleSeek(section.startTime)}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                    title="Tocar a partir desta seção"
                  >
                    <span>Ir para seção</span>
                  </button>
                </div>

                {/* Lines in Section */}
                <div className="space-y-4">
                  {section.lines.map((line) => {
                    const isLineActive = currentLine?.id === line.id;

                    return (
                      <div
                        key={line.id}
                        ref={isLineActive ? activeLineRef : null}
                        onClick={() => handleSeek(line.startTime)}
                        className={`group relative p-3 rounded-xl transition-all cursor-pointer ${
                          isLineActive
                            ? 'bg-emerald-500/10 border-l-4 border-emerald-400 pl-4 shadow-sm'
                            : 'hover:bg-slate-800/40 border-l-4 border-transparent'
                        }`}
                      >
                        {/* Chords Layer (rendered above text with aligned position) */}
                        <div className="relative font-mono font-bold text-emerald-400 min-h-[1.75rem] w-full select-none overflow-x-auto whitespace-pre">
                          {line.chords.length > 0 ? (
                            chordDisplayMode === 'aligned' ? (
                              <div className="relative h-6 w-full">
                                {(() => {
                                  let lastEndPos = -1;
                                  return line.chords.map((chord: ChordEvent) => {
                                    const chordSymbol = transformChordSymbol(chord.chordSymbol);
                                    let pos = Math.max(0, chord.position);
                                    if (pos <= lastEndPos) {
                                      pos = lastEndPos + 1;
                                    }
                                    lastEndPos = pos + chordSymbol.length + 1;

                                    return (
                                      <span
                                        key={chord.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedChordForModal(chordSymbol);
                                          playAcousticGuitarChord(chordSymbol);
                                        }}
                                        style={{
                                          position: 'absolute',
                                          left: `${pos}ch`,
                                        }}
                                        className={`px-1.5 py-0.5 rounded font-mono font-extrabold transition-all hover:scale-110 active:scale-95 shadow-sm border border-emerald-500/30 cursor-pointer ${chordFontSizeClass} ${
                                          isLineActive
                                            ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/60 shadow-emerald-500/10'
                                            : 'bg-slate-900/90 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
                                        }`}
                                        title={`Acorde ${chordSymbol} - Toque para ver diagrama e ouvir som no violão`}
                                      >
                                        {chordSymbol}
                                      </span>
                                    );
                                  });
                                })()}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {line.chords.map((chord: ChordEvent) => {
                                  const chordSymbol = transformChordSymbol(chord.chordSymbol);
                                  return (
                                    <span
                                      key={chord.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChordForModal(chordSymbol);
                                        playAcousticGuitarChord(chordSymbol);
                                      }}
                                      className={`px-2 py-0.5 rounded-lg border border-emerald-500/30 font-bold transition-transform hover:scale-110 active:scale-95 cursor-pointer ${chordFontSizeClass} ${
                                        isLineActive
                                          ? 'bg-emerald-500/20 text-emerald-300 font-extrabold'
                                          : 'bg-slate-900/90 text-emerald-400 hover:bg-slate-800'
                                      }`}
                                      title={`Acorde ${chordSymbol} - Toque para ver diagrama`}
                                    >
                                      {chordSymbol}
                                    </span>
                                  );
                                })}
                              </div>
                            )
                          ) : (
                            <div className="h-1" />
                          )}
                        </div>

                        {/* Lyrics Text */}
                        <div
                          className={`tracking-normal leading-relaxed pt-1 whitespace-pre-wrap select-text ${
                            chordDisplayMode === 'aligned' ? 'font-mono' : 'font-sans'
                          } ${lyricsFontSizeClass} ${
                            isLineActive ? 'text-white font-semibold' : 'text-slate-300'
                          }`}
                        >
                          {line.text}
                        </div>

                        {/* Timestamp badge visible on hover */}
                        <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(line.startTime)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>

        {/* Right Side / Drawer: Chord Diagrams for this song */}
        {showChordDiagrams && (
          <aside className="w-full md:w-72 shrink-0 space-y-4">
            <div className="sticky top-20 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Acordes do Louvor</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {uniqueChordsInSong.length} acordes
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Toque no acorde para ouvir o som no violão ou conferir a posição dos dedos:
              </p>

              {/* Grid of Chord Diagrams */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {uniqueChordsInSong.map((sym) => {
                  const def = getChordDefinition(sym) || {
                    symbol: sym,
                    root: sym,
                    quality: '',
                    frets: ['x', 'x', 0, 2, 3, 2],
                    fingers: [null, null, null, 1, 3, 2],
                    difficulty: 'Iniciante',
                  };

                  return (
                    <div key={sym} className="flex justify-center">
                      <ChordDiagram chord={def} size="sm" showTips />
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Modal for Single Chord Detail */}
      {selectedChordForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedChordForModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedChordForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Diagrama de Violão</h3>
            <div className="flex justify-center my-4">
              {(() => {
                const def = getChordDefinition(selectedChordForModal) || {
                  symbol: selectedChordForModal,
                  root: selectedChordForModal,
                  quality: '',
                  frets: ['x', 3, 2, 0, 1, 0],
                  fingers: [null, 3, 2, null, 1, null],
                  difficulty: 'Iniciante',
                };
                return <ChordDiagram chord={def} size="lg" showTips />;
              })()}
            </div>
            <button
              onClick={() => setSelectedChordForModal(null)}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Execution Bar (Controls) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Progress Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <div className="flex-1 relative flex items-center group">
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
              />
            </div>

            <span className="text-xs font-mono text-slate-400 w-10">
              {formatTime(totalDuration)}
            </span>
          </div>

          {/* Primary Buttons */}
          <div className="flex items-center justify-between">
            {/* Left: Previous Section & Rewind */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => jumpToSection('prev')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Seção anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => jumpSeconds(-5)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer text-xs font-mono flex items-center gap-0.5"
                title="Voltar 5 segundos"
              >
                <RotateCcw className="w-4 h-4" />
                <span>5s</span>
              </button>
            </div>

            {/* Center: Play / Pause Big Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Right: Forward & Next Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => jumpSeconds(5)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer text-xs font-mono flex items-center gap-0.5"
                title="Avançar 5 segundos"
              >
                <span>+5s</span>
              </button>

              <button
                onClick={() => jumpToSection('next')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Próxima seção"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
