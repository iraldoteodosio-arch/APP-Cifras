import React, { useState, useEffect, useRef } from 'react';
import { Song, SongSection, LyricLine } from '../types/music';
import { storageService } from '../services/storageService';
import { playAcousticGuitarChord } from '../utils/audioEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Save,
  Clock,
  Plus,
  Trash2,
  Check,
  Radio,
  FileDown,
  Info,
} from 'lucide-react';

interface SyncEditorModalProps {
  song: Song;
  onClose: () => void;
  onSave: (updatedSong: Song) => void;
}

export const SyncEditorModal: React.FC<SyncEditorModalProps> = ({
  song,
  onClose,
  onSave,
}) => {
  const [editedSong, setEditedSong] = useState<Song>(() => JSON.parse(JSON.stringify(song)));
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      const step = 0.1;
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + step;
          return next;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Keyboard shortcut: Spacebar to mark active line or Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in an input, don't trigger spacebar marker
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateTime = (sectionId: string, lineId: string, field: 'startTime' | 'endTime', value: number) => {
    setEditedSong((prev) => {
      const copy: Song = JSON.parse(JSON.stringify(prev));
      const sec = copy.sections.find((s) => s.id === sectionId);
      if (sec) {
        const line = sec.lines.find((l) => l.id === lineId);
        if (line) {
          line[field] = Math.max(0, Math.round(value * 10) / 10);
        }
      }
      return copy;
    });
  };

  const handleUpdateLineText = (sectionId: string, lineId: string, newText: string) => {
    setEditedSong((prev) => {
      const copy: Song = JSON.parse(JSON.stringify(prev));
      const sec = copy.sections.find((s) => s.id === sectionId);
      if (sec) {
        const line = sec.lines.find((l) => l.id === lineId);
        if (line) {
          line.text = newText;
        }
      }
      return copy;
    });
  };

  // Mark current playback time onto a specific line's startTime
  const markLineStartTime = (sectionId: string, lineId: string) => {
    handleUpdateTime(sectionId, lineId, 'startTime', currentTime);
    setActiveLineId(lineId);
    setFeedbackMsg(`Tempo ${currentTime.toFixed(1)}s gravado com sucesso!`);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  // Mark line's endTime
  const markLineEndTime = (sectionId: string, lineId: string) => {
    handleUpdateTime(sectionId, lineId, 'endTime', currentTime);
    setFeedbackMsg(`Fim ${currentTime.toFixed(1)}s marcado!`);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const handleSaveAll = () => {
    storageService.saveSong(editedSong);
    onSave(editedSong);
    setFeedbackMsg('Todas as alterações e marcadores foram salvos!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(editedSong, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${editedSong.id}-sync.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatSecs = (val: number) => val.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Editor de Sincronização de Marcadores</span>
            </h2>
            <p className="text-xs text-slate-400">
              {editedSong.title} — Ajuste os tempos exatos em segundos de cada estrofe e linha da música.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              title="Exportar marcadores como arquivo JSON"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar JSON</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl text-lg ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live Audio / Clock Bar */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Voltar ao início (0.0s)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tempo Atual:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {currentTime.toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Quick tips & feedback */}
          <div className="flex items-center gap-4">
            {feedbackMsg && (
              <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg animate-pulse">
                {feedbackMsg}
              </span>
            )}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Dica: Use espaço para Play/Pause. Clique em "Marcar Início" para sincronizar ao vivo!</span>
            </div>
          </div>
        </div>

        {/* Scrollable Editor Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {editedSong.sections.map((section: SongSection) => (
            <div
              key={section.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
            >
              {/* Section Header with Section Start/End */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                    {section.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({section.type})</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span>Início Seção:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={section.startTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEditedSong((prev) => {
                          const copy = JSON.parse(JSON.stringify(prev));
                          const s = copy.sections.find((item: SongSection) => item.id === section.id);
                          if (s) s.startTime = val;
                          return copy;
                        });
                      }}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-center text-white"
                    />
                    <span>s</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span>Fim Seção:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={section.endTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEditedSong((prev) => {
                          const copy = JSON.parse(JSON.stringify(prev));
                          const s = copy.sections.find((item: SongSection) => item.id === section.id);
                          if (s) s.endTime = val;
                          return copy;
                        });
                      }}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-center text-white"
                    />
                    <span>s</span>
                  </div>
                </div>
              </div>

              {/* Lines in Section */}
              <div className="space-y-3">
                {section.lines.map((line: LyricLine) => {
                  const isCurrent = currentTime >= line.startTime && currentTime <= line.endTime;

                  return (
                    <div
                      key={line.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      {/* Top Row: Chords attached */}
                      <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400">
                        <span className="text-[11px] text-slate-500">Acordes:</span>
                        {line.chords.map((c) => (
                          <span
                            key={c.id}
                            className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold"
                          >
                            {c.chordSymbol} (pos: {c.position})
                          </span>
                        ))}
                      </div>

                      {/* Middle Row: Line text input */}
                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => handleUpdateLineText(section.id, line.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-500 mb-3"
                      />

                      {/* Bottom Row: Numeric Timing & Quick Mark buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Início:</span>
                            <input
                              type="number"
                              step="0.5"
                              value={line.startTime}
                              onChange={(e) =>
                                handleUpdateTime(
                                  section.id,
                                  line.id,
                                  'startTime',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-center text-white"
                            />
                            <span className="text-slate-500">s</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Fim:</span>
                            <input
                              type="number"
                              step="0.5"
                              value={line.endTime}
                              onChange={(e) =>
                                handleUpdateTime(
                                  section.id,
                                  line.id,
                                  'endTime',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-center text-white"
                            />
                            <span className="text-slate-500">s</span>
                          </div>
                        </div>

                        {/* Quick Tap Buttons to sync with current audio time */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => markLineStartTime(section.id, line.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-medium transition-colors cursor-pointer border border-emerald-500/30"
                          >
                            Marcar Início ({currentTime.toFixed(1)}s)
                          </button>

                          <button
                            type="button"
                            onClick={() => markLineEndTime(section.id, line.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                          >
                            Marcar Fim ({currentTime.toFixed(1)}s)
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
