import React, { useState, useEffect, useRef } from 'react';
import { ChromaticTuner, TunerResult, GUITAR_STRINGS, playAcousticGuitarChord } from '../utils/audioEngine';
import { Mic, MicOff, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TunerModalProps {
  onClose: () => void;
}

export const TunerModal: React.FC<TunerModalProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [tunerResult, setTunerResult] = useState<TunerResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedString, setSelectedString] = useState<number | null>(null);

  const tunerRef = useRef<ChromaticTuner | null>(null);

  const startTuner = async () => {
    setErrorMsg(null);
    try {
      tunerRef.current = new ChromaticTuner();
      await tunerRef.current.start((result) => {
        setTunerResult(result);
      });
      setIsListening(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Não foi possível acessar o microfone. Verifique as permissões do seu navegador.');
      setIsListening(false);
    }
  };

  const stopTuner = () => {
    if (tunerRef.current) {
      tunerRef.current.stop();
      tunerRef.current = null;
    }
    setIsListening(false);
    setTunerResult(null);
  };

  useEffect(() => {
    return () => {
      if (tunerRef.current) {
        tunerRef.current.stop();
      }
    };
  }, []);

  // Play reference pitch for standard guitar tuning
  const playReferenceTone = (note: string) => {
    playAcousticGuitarChord(note.charAt(0), 1.8, 0.6);
  };

  const cents = tunerResult ? tunerResult.cents : 0;
  // Needle position in percentage: 0% (-50 cents) to 100% (+50 cents), center at 50%
  const needlePercent = Math.max(0, Math.min(100, 50 + cents));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Afinador Cromático de Violão</h2>
              <p className="text-xs text-slate-400">Afinação padrão 440 Hz (E - A - D - G - B - e)</p>
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
          {/* Error notice if micro permission denied */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Central Meter Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient in-tune glow */}
            {tunerResult?.isInTune && (
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
            )}

            {/* Note Display */}
            <div className="text-center mb-4">
              <div className="text-5xl font-black font-mono tracking-tighter text-white">
                {tunerResult ? tunerResult.note : '—'}
                {tunerResult && (
                  <span className="text-xl text-slate-500 font-normal ml-1">
                    {tunerResult.octave}
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                {tunerResult ? `${tunerResult.frequency} Hz` : 'Toque uma corda'}
              </div>
            </div>

            {/* Needle Gauge */}
            <div className="w-full max-w-xs space-y-2">
              <div className="relative h-6 bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden">
                {/* Center Target Marker */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 bg-emerald-500 z-10" />

                {/* Needle */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 rounded-full transition-all duration-75 shadow-md -ml-1.25"
                  style={{
                    left: `${needlePercent}%`,
                    backgroundColor: tunerResult?.isInTune
                      ? '#10b981'
                      : Math.abs(cents) < 15
                      ? '#f59e0b'
                      : '#ef4444',
                  }}
                />
              </div>

              {/* Ticks and Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>♭ Bemol (-50)</span>
                <span className="text-emerald-400 font-bold">Afinação Perfeita (0)</span>
                <span>Sustenido (+50) ♯</span>
              </div>
            </div>

            {/* Tuning Status Badge */}
            <div className="mt-4">
              {tunerResult?.isInTune ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Afinado!</span>
                </div>
              ) : tunerResult ? (
                <span
                  className={`text-xs font-mono font-medium ${
                    cents < 0 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {cents < 0 ? `Suba a afinação (${cents} cents)` : `Abaixe a afinação (+${cents} cents)`}
                </span>
              ) : (
                <span className="text-xs text-slate-500">Aguardando som do violão...</span>
              )}
            </div>
          </div>

          {/* Start / Stop Microphone Button */}
          <div className="flex justify-center">
            {isListening ? (
              <button
                onClick={stopTuner}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-rose-950/40"
              >
                <MicOff className="w-4 h-4" />
                <span>Parar Afinador</span>
              </button>
            ) : (
              <button
                onClick={startTuner}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Ativar Microfone & Afinar</span>
              </button>
            )}
          </div>

          {/* Guitar Strings Reference Tuning (by ear) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tons de Referência das 6 Cordas
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {GUITAR_STRINGS.map((str) => (
                <button
                  key={str.stringNumber}
                  onClick={() => {
                    setSelectedString(str.stringNumber);
                    playReferenceTone(str.note);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    tunerResult?.closestGuitarString?.stringNumber === str.stringNumber
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title={`Ouvir tom da corda ${str.name}`}
                >
                  <div className="text-[10px] text-slate-500">{str.stringNumber}ª</div>
                  <div className="text-sm font-mono font-bold">{str.note.replace(/[0-9]/, '')}</div>
                  <Volume2 className="w-3 h-3 mx-auto mt-1 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
