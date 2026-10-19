import React, { useState, useMemo } from 'react';
import { CHORD_DATABASE } from '../utils/chords';
import { ChordDiagram } from './ChordDiagram';
import { BookOpen, Search, Filter } from 'lucide-react';

interface ChordLibraryModalProps {
  onClose: () => void;
}

export const ChordLibraryModal: React.FC<ChordLibraryModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const roots = ['all', 'C', 'D', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

  const filteredChords = useMemo(() => {
    return Object.values(CHORD_DATABASE).filter((chord) => {
      const matchesSearch =
        chord.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chord.quality.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRoot = selectedRoot === 'all' || chord.root === selectedRoot;
      const matchesDiff = selectedDifficulty === 'all' || chord.difficulty === selectedDifficulty;
      return matchesSearch && matchesRoot && matchesDiff;
    });
  }, [searchQuery, selectedRoot, selectedDifficulty]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dicionário de Acordes de Violão</h2>
              <p className="text-xs text-slate-400">
                Posições reais validadas para violão acústico e louvores de adoração
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar acorde (ex: C, Em7, Cadd9, F#m, D/F#)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Root note pills and difficulty filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Root note filter */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {roots.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoot(r)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                    selectedRoot === r
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r === 'all' ? 'Todos' : r}
                </button>
              ))}
            </div>

            {/* Difficulty selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[11px]">Nível:</span>
              {(['all', 'Iniciante', 'Intermediário'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-slate-700 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'Todos' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chords Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredChords.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredChords.map((chord) => (
                <div key={chord.symbol} className="flex justify-center">
                  <ChordDiagram chord={chord} size="md" showTips interactiveAudio />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <p>Nenhum acorde encontrado para essa pesquisa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
