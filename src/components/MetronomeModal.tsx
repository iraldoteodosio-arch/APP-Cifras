import React, { useState, useEffect, useRef } from 'react';
import { Metronome } from '../utils/audioEngine';
import { Play, Pause, Plus, Minus, Volume2, Music2 } from 'lucide-react';

interface MetronomeModalProps {
  onClose: () => void;
  initialBpm?: number;
}

export const MetronomeModal: React.FC<MetronomeModalProps> = ({
  onClose,
  initialBpm = 72,
}) => {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [beatsPerBar, setBeatsPerBar] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  const metronomeRef = useRef<Metronome | null>(null);

  useEffect(() => {
    metronomeRef.current = new Metronome(bpm, beatsPerBar);
    metronomeRef.current.setOnBeat((beat) => {
      setCurrentBeat(beat);
    });

    return () => {
      if (metronomeRef.current) {
        metronomeRef.current.stop();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!metronomeRef.current) return;
    if (isPlaying) {
      metronomeRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(0);
    } else {
      metronomeRef.current.setBpm(bpm);
      metronomeRef.current.setBeatsPerBar(beatsPerBar);
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };

  const updateBpm = (newVal: number) => {
    const clamped = Math.max(30, Math.min(250, newVal));
    setBpm(clamped);
    if (metronomeRef.current) {
      metronomeRef.current.setBpm(clamped);
    }
  };

  const updateBeatsPerBar = (beats: number) => {
    setBeatsPerBar(beats);
    if (metronomeRef.current) {
      metronomeRef.current.setBeatsPerBar(beats);
    }
  };

  // Tempo markings
  const getTempoName = (val: number) => {
    if (val < 60) return 'Largo (Muito Lento)';
    if (val < 76) return 'Adagio / Adoração Tranquila';
    if (val < 108) return 'Andante / Louvor Congregacional';
    if (val < 120) return 'Moderato / Celebração';
    if (val < 168) return 'Allegro / Festivo';
    return 'Presto (Muito Rápido)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Metrônomo Digital</h2>
              <p className="text-xs text-slate-400">Relógio de áudio de alta precisão</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* BPM Visual Center */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-black font-mono tracking-tighter text-emerald-400 mb-1">
              {bpm}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Batidas por Minuto (BPM)
            </div>
            <div className="text-xs text-emerald-500/90 font-medium mt-1">
              {getTempoName(bpm)}
            </div>

            {/* Visual Beat Beads */}
            <div className="flex items-center gap-3 mt-6">
              {Array.from({ length: beatsPerBar }).map((_, idx) => {
                const isActive = isPlaying && currentBeat === idx;
                const isAccent = idx === 0;

                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-75 ${
                      isActive
                        ? isAccent
                          ? 'bg-emerald-400 text-slate-950 scale-125 shadow-lg shadow-emerald-400/50'
                          : 'bg-emerald-500/80 text-slate-950 scale-110'
                        : isAccent
                        ? 'bg-slate-800 border-2 border-emerald-500/40 text-slate-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick BPM adjusters */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => updateBpm(bpm - 5)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              title="-5 BPM"
            >
              -5
            </button>
            <button
              onClick={() => updateBpm(bpm - 1)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              title="-1 BPM"
            >
              -1
            </button>
            <button
              onClick={() => updateBpm(bpm + 1)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              title="+1 BPM"
            >
              +1
            </button>
            <button
              onClick={() => updateBpm(bpm + 5)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
              title="+5 BPM"
            >
              +5
            </button>
          </div>

          {/* Slider */}
          <div>
            <input
              type="range"
              min={40}
              max={220}
              value={bpm}
              onChange={(e) => updateBpm(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Time Signature Selector */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Compasso:</span>
            <div className="flex gap-1">
              {[
                { beats: 2, label: '2/4' },
                { beats: 3, label: '3/4' },
                { beats: 4, label: '4/4' },
                { beats: 6, label: '6/8' },
              ].map((sig) => (
                <button
                  key={sig.beats}
                  onClick={() => updateBeatsPerBar(sig.beats)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    beatsPerBar === sig.beats
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sig.label}
                </button>
              ))}
            </div>
          </div>

          {/* Big Play / Stop Button */}
          <button
            onClick={togglePlay}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Parar Metrônomo</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Iniciar Metrônomo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
