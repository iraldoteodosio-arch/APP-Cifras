import React from 'react';
import { ChordDefinition } from '../types/music';
import { playAcousticGuitarChord } from '../utils/audioEngine';
import { Volume2 } from 'lucide-react';

interface ChordDiagramProps {
  chord: ChordDefinition;
  size?: 'sm' | 'md' | 'lg';
  showTips?: boolean;
  interactiveAudio?: boolean;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord,
  size = 'md',
  showTips = false,
  interactiveAudio = true,
}) => {
  const { symbol, quality, frets, fingers, barre, baseFret = 1, tips, simplifiedAlternative } = chord;

  const width = size === 'sm' ? 110 : size === 'lg' ? 180 : 140;
  const height = size === 'sm' ? 140 : size === 'lg' ? 220 : 175;

  const numFrets = 4;
  const numStrings = 6;
  const paddingX = width * 0.18;
  const paddingTop = height * 0.22;
  const paddingBottom = height * 0.12;

  const stringSpacing = (width - paddingX * 2) / (numStrings - 1);
  const fretSpacing = (height - paddingTop - paddingBottom) / numFrets;

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (interactiveAudio) {
      playAcousticGuitarChord(symbol);
    }
  };

  return (
    <div className="inline-flex flex-col items-center bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md transition-all hover:border-emerald-500/50 group select-none">
      {/* Header with Chord Name and Audio Preview Button */}
      <div className="w-full flex items-center justify-between gap-1 mb-1 px-1">
        <div className="flex flex-col">
          <span className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors font-mono">
            {symbol}
          </span>
          {quality && <span className="text-[10px] text-slate-400 leading-none">{quality}</span>}
        </div>
        {interactiveAudio && (
          <button
            type="button"
            onClick={handlePlaySound}
            title="Ouvir acorde no violão"
            className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={`Ouvir acorde ${symbol}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SVG Fretboard */}
      <svg width={width} height={height} className="overflow-visible">
        {/* Base fret indicator if not fret 1 */}
        {baseFret > 1 && (
          <text
            x={paddingX - 10}
            y={paddingTop + fretSpacing * 0.65}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
            fontWeight="bold"
          >
            {baseFret}ª
          </text>
        )}

        {/* Nut (Thick bar for fret 1) or thin top fret */}
        <line
          x1={paddingX}
          y1={paddingTop}
          x2={width - paddingX}
          y2={paddingTop}
          stroke={baseFret === 1 ? '#e2e8f0' : '#475569'}
          strokeWidth={baseFret === 1 ? 4 : 1.5}
          strokeLinecap="round"
        />

        {/* Fret Lines */}
        {Array.from({ length: numFrets }).map((_, i) => {
          const y = paddingTop + (i + 1) * fretSpacing;
          return (
            <line
              key={`fret-${i}`}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#334155"
              strokeWidth="1.5"
            />
          );
        })}

        {/* String Lines (6 strings) */}
        {Array.from({ length: numStrings }).map((_, i) => {
          const x = paddingX + i * stringSpacing;
          // Thicker stroke for low E and A strings
          const strokeWidth = i === 0 ? 2 : i === 1 ? 1.7 : i === 2 ? 1.5 : 1.2;
          return (
            <line
              key={`str-${i}`}
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={paddingTop + numFrets * fretSpacing}
              stroke="#64748b"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Barre Bar */}
        {barre && (
          (() => {
            const fretRelative = barre.fret - (baseFret - 1);
            if (fretRelative >= 1 && fretRelative <= numFrets) {
              const y = paddingTop + (fretRelative - 0.5) * fretSpacing;
              // Strings in barre: 1 is high e (index 5), 6 is low E (index 0)
              const xStart = paddingX + (6 - barre.endString) * stringSpacing;
              const xEnd = paddingX + (6 - barre.startString) * stringSpacing;
              return (
                <g key="barre">
                  <rect
                    x={xStart - 6}
                    y={y - 6}
                    width={xEnd - xStart + 12}
                    height={12}
                    rx={6}
                    fill="#10b981"
                    className="opacity-90"
                  />
                  <text
                    x={(xStart + xEnd) / 2}
                    y={y + 3.5}
                    fill="#042f2e"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    1
                  </text>
                </g>
              );
            }
            return null;
          })()
        )}

        {/* String Indicators: Muted (X) or Open (O) above the nut */}
        {frets.map((fret, stringIdx) => {
          const x = paddingX + stringIdx * stringSpacing;
          const y = paddingTop - 8;

          if (fret === 'x' || fret === -1) {
            return (
              <text
                key={`mute-${stringIdx}`}
                x={x}
                y={y}
                fill="#ef4444"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                ✕
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`open-${stringIdx}`}
                cx={x}
                cy={y - 3}
                r="3.5"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
            );
          }
          return null;
        })}

        {/* Finger Dots on Frets */}
        {frets.map((fret, stringIdx) => {
          if (typeof fret !== 'number' || fret <= 0) return null;

          const fretRelative = fret - (baseFret - 1);
          if (fretRelative < 1 || fretRelative > numFrets) return null;

          // If covered by barre and finger is 1, skip redundant dot
          const finger = fingers[stringIdx];
          if (barre && fret === barre.fret && finger === 1) return null;

          const x = paddingX + stringIdx * stringSpacing;
          const y = paddingTop + (fretRelative - 0.5) * fretSpacing;
          const radius = size === 'sm' ? 6 : size === 'lg' ? 9 : 7.5;

          return (
            <g key={`dot-${stringIdx}`}>
              <circle cx={x} cy={y} r={radius} fill="#10b981" />
              {finger && (
                <text
                  x={x}
                  y={y + 3.5}
                  fill="#042f2e"
                  fontSize={size === 'sm' ? '8' : '10'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* String names indicator */}
      <div className="w-full flex justify-between px-3 text-[9px] text-slate-500 font-mono mt-0.5">
        <span>E</span>
        <span>A</span>
        <span>D</span>
        <span>G</span>
        <span>B</span>
        <span>e</span>
      </div>

      {/* Simplified alternative suggestion */}
      {simplifiedAlternative && (
        <div className="mt-1.5 text-[10px] text-emerald-400/90 text-center">
          Simplificado: <span className="font-bold underline">{simplifiedAlternative}</span>
        </div>
      )}

      {/* Finger tips description */}
      {showTips && tips && (
        <p className="mt-2 text-[11px] text-slate-400 text-center leading-relaxed max-w-[160px]">
          {tips}
        </p>
      )}
    </div>
  );
};
