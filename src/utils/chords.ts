import { ChordDefinition } from '../types/music';

export const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_SCALE  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Map flats to standard chromatic index
const NOTE_TO_INDEX: Record<string, number> = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11,
};

/**
 * Transposes a single note by given semitones.
 */
export function transposeNote(note: string, semitones: number, preferFlats: boolean = false): string {
  if (!note) return note;
  const index = NOTE_TO_INDEX[note];
  if (index === undefined) return note;

  const targetScale = preferFlats ? FLAT_SCALE : SHARP_SCALE;
  const newIndex = ((index + semitones) % 12 + 12) % 12;
  return targetScale[newIndex];
}

/**
 * Parses chord symbol into:
 * - root Note (e.g. "D", "F#", "Bb")
 * - quality/extension (e.g. "m", "7", "maj7", "sus4", "add9")
 * - optional slash bass note (e.g. "F#" in "D/F#")
 */
export function parseChord(chord: string): { root: string; quality: string; bass?: string } | null {
  if (!chord || typeof chord !== 'string') return null;
  const trimmed = chord.trim();
  if (!trimmed) return null;

  // Split by slash bass if present
  const parts = trimmed.split('/');
  const mainPart = parts[0];
  const bassPart = parts.length > 1 ? parts[1] : undefined;

  // Root note regex: [A-G] optionally followed by # or b
  const match = mainPart.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;

  return {
    root: match[1],
    quality: match[2] || '',
    bass: bassPart ? bassPart.trim() : undefined,
  };
}

/**
 * Transposes an entire chord symbol including slash bass (e.g. "D/F#" transposed +2 -> "E/G#").
 */
export function transposeChord(chord: string, semitones: number, preferFlats: boolean = false): string {
  if (semitones === 0) return chord;
  const parsed = parseChord(chord);
  if (!parsed) return chord;

  const newRoot = transposeNote(parsed.root, semitones, preferFlats);
  const newBass = parsed.bass ? transposeNote(parsed.bass, semitones, preferFlats) : undefined;

  return newBass ? `${newRoot}${parsed.quality}/${newBass}` : `${newRoot}${parsed.quality}`;
}

/**
 * Computes the recommended playing shape for a given capo position.
 * E.g., if the sounding key is A and capo is on fret 2, playing shape key is G.
 */
export function getCapoShapeKey(soundingKey: string, capoFret: number, preferFlats: boolean = false): string {
  if (capoFret <= 0) return soundingKey;
  return transposeNote(soundingKey, -capoFret, preferFlats);
}

/**
 * Calculate the sounding key when playing a shape with a capo.
 * E.g., playing C shape with Capo 2 sounds in D.
 */
export function getSoundingKeyWithCapo(shapeKey: string, capoFret: number, preferFlats: boolean = false): string {
  if (capoFret <= 0) return shapeKey;
  return transposeNote(shapeKey, capoFret, preferFlats);
}

/**
 * Suggests an easy capo position for difficult keys like Ab, Bb, Eb, F, B.
 */
export function suggestCapoForKey(key: string): { capo: number; shapeKey: string; reason: string } | null {
  const easyKeys = ['C', 'G', 'D', 'E', 'A', 'Em', 'Am'];
  const parsed = parseChord(key);
  if (!parsed) return null;

  // If already an open chord favorite, no capo needed
  if (easyKeys.includes(parsed.root)) {
    return { capo: 0, shapeKey: key, reason: 'Tom original já utiliza acordes abertos fáceis.' };
  }

  // Check capos 1 through 5 for matching easy open keys
  for (let capo = 1; capo <= 5; capo++) {
    const shape = transposeNote(parsed.root, -capo, false);
    if (['G', 'C', 'D', 'E', 'A'].includes(shape)) {
      return {
        capo,
        shapeKey: `${shape}${parsed.quality}`,
        reason: `Coloque o capotraste na casa ${capo} e toque com as formas simples de ${shape}.`,
      };
    }
  }

  return null;
}

/**
 * Simplified chords dictionary for beginner musicians.
 * Maps barre or difficult chords to beginner-friendly harmonic equivalents.
 */
export const SIMPLIFIED_CHORD_MAP: Record<string, string> = {
  'F': 'Fmaj7',      // Fmaj7 is open and avoids the barre
  'Fm': 'Fm7',
  'Bm': 'Bm7',      // Bm7 without full barre
  'B': 'B7',
  'F#m': 'F#m7',
  'C#m': 'C#m7',
  'G#m': 'G#m7',
  'Bb': 'Bbmaj7',
  'D#': 'Eb',
};

export function getSimplifiedChord(symbol: string): string {
  const parsed = parseChord(symbol);
  if (!parsed) return symbol;

  // Check direct lookup
  if (SIMPLIFIED_CHORD_MAP[parsed.root + parsed.quality]) {
    const simplified = SIMPLIFIED_CHORD_MAP[parsed.root + parsed.quality];
    return parsed.bass ? `${simplified}/${parsed.bass}` : simplified;
  }

  // If major barre chord without map, return as-is
  return symbol;
}

/**
 * Comprehensive real guitar chord database (6 strings: Low E, A, D, G, B, High e)
 * frets: -1 or 'x' = mute, 0 = open string, 1+ = fret number
 * fingers: 1: indicator, 2: middle, 3: ring, 4: pinky, null: none
 */
export const CHORD_DATABASE: Record<string, ChordDefinition> = {
  'C': {
    symbol: 'C',
    root: 'C',
    quality: 'Maior',
    frets: ['x', 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    difficulty: 'Iniciante',
    tips: 'Deixe as cordas soltas (Sol e Mi aguda) soarem limpas sem abafar.',
  },
  'Cadd9': {
    symbol: 'Cadd9',
    root: 'C',
    quality: 'add9',
    frets: ['x', 3, 2, 0, 3, 3],
    fingers: [null, 2, 1, null, 3, 4],
    difficulty: 'Iniciante',
    tips: 'Muito usado em louvores worship. Dedo 3 e 4 ficam firmes nas cordas 1 e 2.',
  },
  'C7': {
    symbol: 'C7',
    root: 'C',
    quality: 'com 7ª',
    frets: ['x', 3, 2, 3, 1, 0],
    fingers: [null, 3, 2, 4, 1, null],
    difficulty: 'Iniciante',
    tips: 'O dedo 4 (mínimo) entra na 3ª corda, 3ª casa.',
  },
  'Cmaj7': {
    symbol: 'Cmaj7',
    root: 'C',
    quality: '7M',
    frets: ['x', 3, 2, 0, 0, 0],
    fingers: [null, 3, 2, null, null, null],
    difficulty: 'Iniciante',
    tips: 'Apenas dois dedos. Som suave e contemplativo.',
  },
  'D': {
    symbol: 'D',
    root: 'D',
    quality: 'Maior',
    frets: ['x', 'x', 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    difficulty: 'Iniciante',
    tips: 'Toque a partir da 4ª corda (Ré solta). Evite as cordas graves.',
  },
  'D/F#': {
    symbol: 'D/F#',
    root: 'D',
    quality: 'com baixo em F#',
    frets: [2, 0, 0, 2, 3, 2],
    fingers: [1, null, null, 2, 4, 3],
    difficulty: 'Iniciante',
    tips: 'O polegar ou o indicador pode alcançar a 6ª corda na casa 2.',
  },
  'Dm': {
    symbol: 'Dm',
    root: 'D',
    quality: 'Menor',
    frets: ['x', 'x', 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    difficulty: 'Iniciante',
    tips: 'Estique suavemente o dedo 1 na 1ª corda, 1ª casa.',
  },
  'D7': {
    symbol: 'D7',
    root: 'D',
    quality: 'com 7ª',
    frets: ['x', 'x', 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    difficulty: 'Iniciante',
    tips: 'Triângulo invertido nas três primeiras cordas.',
  },
  'Dsus4': {
    symbol: 'Dsus4',
    root: 'D',
    quality: 'sus4',
    frets: ['x', 'x', 0, 2, 3, 3],
    fingers: [null, null, null, 1, 2, 4],
    difficulty: 'Iniciante',
    tips: 'Excelente acorde de passagem antes de resolver em D maior.',
  },
  'E': {
    symbol: 'E',
    root: 'E',
    quality: 'Maior',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    difficulty: 'Iniciante',
    tips: 'Todas as seis cordas podem soar livremente com potência.',
  },
  'Em': {
    symbol: 'Em',
    root: 'E',
    quality: 'Menor',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    difficulty: 'Iniciante',
    tips: 'O acorde mais simples do violão, apenas dois dedos.',
  },
  'Em7': {
    symbol: 'Em7',
    root: 'E',
    quality: 'Menor com 7ª',
    frets: [0, 2, 2, 0, 3, 3],
    fingers: [null, 1, 2, null, 3, 4],
    difficulty: 'Iniciante',
    tips: 'Forma worship clássica, muito brilhante e harmônica.',
  },
  'E7': {
    symbol: 'E7',
    root: 'E',
    quality: 'com 7ª',
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    difficulty: 'Iniciante',
    tips: 'Deixe a 4ª corda solta para soar a sétima menor (Ré).',
  },
  'F': {
    symbol: 'F',
    root: 'F',
    quality: 'Maior com Pestana',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 1, startString: 1, endString: 6 },
    difficulty: 'Intermediário',
    simplifiedAlternative: 'Fmaj7',
    tips: 'Se a pestana completa cansar, use Fmaj7 (cordas 4, 3, 2, 1) como alternativa simplificada.',
  },
  'Fmaj7': {
    symbol: 'Fmaj7',
    root: 'F',
    quality: '7M (Simplificado)',
    frets: ['x', 'x', 3, 2, 1, 0],
    fingers: [null, null, 3, 2, 1, null],
    difficulty: 'Iniciante',
    tips: 'Excelente substituto para o Fá com pestana em louvores acústicos.',
  },
  'F#m': {
    symbol: 'F#m',
    root: 'F#',
    quality: 'Menor com Pestana',
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 2, startString: 1, endString: 6 },
    difficulty: 'Intermediário',
    simplifiedAlternative: 'F#m7',
    tips: 'Pestana na casa 2 cobrindo todas as cordas.',
  },
  'F#m7': {
    symbol: 'F#m7',
    root: 'F#',
    quality: 'Menor com 7ª',
    frets: [2, 4, 2, 2, 2, 2],
    fingers: [1, 3, 1, 1, 1, 1],
    barre: { fret: 2, startString: 1, endString: 6 },
    difficulty: 'Iniciante',
    tips: 'Retire o dedo 4 do F#m para obter uma sonoridade aberta.',
  },
  'G': {
    symbol: 'G',
    root: 'G',
    quality: 'Maior',
    frets: [3, 2, 0, 0, 3, 3],
    fingers: [2, 1, null, null, 3, 4],
    difficulty: 'Iniciante',
    tips: 'Forma com 4 dedos (Sol e Ré agudo pressionados) tem som bem encorpado.',
  },
  'G/B': {
    symbol: 'G/B',
    root: 'G',
    quality: 'com baixo em Si',
    frets: ['x', 2, 0, 0, 3, 3],
    fingers: [null, 1, null, null, 3, 4],
    difficulty: 'Iniciante',
    tips: 'Acorde de passagem clássico entre C e Am ou G e C.',
  },
  'G7': {
    symbol: 'G7',
    root: 'G',
    quality: 'com 7ª',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, null, null, null, 1],
    difficulty: 'Iniciante',
    tips: 'O dedo 1 marca o Fá na 1ª corda, preparando a resolução em C.',
  },
  'A': {
    symbol: 'A',
    root: 'A',
    quality: 'Maior',
    frets: ['x', 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    difficulty: 'Iniciante',
    tips: 'Os três dedos ficam juntos na 2ª casa. Toque a partir da 5ª corda.',
  },
  'Am': {
    symbol: 'Am',
    root: 'A',
    quality: 'Menor',
    frets: ['x', 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    difficulty: 'Iniciante',
    tips: 'Mesma forma do Mi Maior (E), porém descendo uma corda.',
  },
  'Am7': {
    symbol: 'Am7',
    root: 'A',
    quality: 'Menor com 7ª',
    frets: ['x', 0, 2, 0, 1, 0],
    fingers: [null, null, 2, null, 1, null],
    difficulty: 'Iniciante',
    tips: 'Apenas dois dedos, muito confortável e expressivo.',
  },
  'A7': {
    symbol: 'A7',
    root: 'A',
    quality: 'com 7ª',
    frets: ['x', 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    difficulty: 'Iniciante',
    tips: 'A 3ª corda fica solta.',
  },
  'Asus4': {
    symbol: 'Asus4',
    root: 'A',
    quality: 'sus4',
    frets: ['x', 0, 2, 2, 3, 0],
    fingers: [null, null, 1, 2, 4, null],
    difficulty: 'Iniciante',
    tips: 'Suspensão com o dedo mínimo na 3ª casa da 2ª corda.',
  },
  'B': {
    symbol: 'B',
    root: 'B',
    quality: 'Maior com Pestana',
    frets: ['x', 2, 4, 4, 4, 2],
    fingers: [null, 1, 2, 3, 4, 1],
    barre: { fret: 2, startString: 1, endString: 5 },
    difficulty: 'Avançado',
    simplifiedAlternative: 'B7',
    tips: 'Pode ser substituído por B7 para evitar a pestana fechada.',
  },
  'Bm': {
    symbol: 'Bm',
    root: 'B',
    quality: 'Menor com Pestana',
    frets: ['x', 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    barre: { fret: 2, startString: 1, endString: 5 },
    difficulty: 'Intermediário',
    simplifiedAlternative: 'Bm7',
    tips: 'Pestana na casa 2 da 5ª até a 1ª corda. Pratique apoiando bem o dedo 1.',
  },
  'Bm7': {
    symbol: 'Bm7',
    root: 'B',
    quality: 'Menor com 7ª (Simplificado)',
    frets: ['x', 2, 0, 2, 3, 0],
    fingers: [null, 1, null, 2, 3, null],
    difficulty: 'Iniciante',
    tips: 'Ótimo substituto para o Bm em violão acústico, sem pestana obrigatória!',
  },
  'B7': {
    symbol: 'B7',
    root: 'B',
    quality: 'com 7ª',
    frets: ['x', 2, 1, 2, 0, 2],
    fingers: [null, 2, 1, 3, null, 4],
    difficulty: 'Iniciante',
    tips: 'Acorde aberto sem pestana, excelente para resolver em E ou Em.',
  },
  'C#m': {
    symbol: 'C#m',
    root: 'C#',
    quality: 'Menor com Pestana',
    frets: ['x', 4, 6, 6, 5, 4],
    fingers: [null, 1, 3, 4, 2, 1],
    barre: { fret: 4, startString: 1, endString: 5 },
    baseFret: 4,
    difficulty: 'Intermediário',
    simplifiedAlternative: 'C#m7',
    tips: 'Mesma digitação do Bm, avançada 2 casas até a casa 4.',
  },
  'C#m7': {
    symbol: 'C#m7',
    root: 'C#',
    quality: 'Menor com 7ª (Simplificado)',
    frets: ['x', 4, 6, 4, 5, 0],
    fingers: [null, 1, 3, 1, 2, null],
    baseFret: 4,
    difficulty: 'Iniciante',
    tips: 'Deixar a 1ª corda solta cria um lindo timbre moderno.',
  },
  'G#m': {
    symbol: 'G#m',
    root: 'G#',
    quality: 'Menor',
    frets: [4, 6, 6, 4, 4, 4],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 4, startString: 1, endString: 6 },
    baseFret: 4,
    difficulty: 'Intermediário',
    tips: 'Pestana completa na 4ª casa.',
  },
  'Bb': {
    symbol: 'Bb',
    root: 'Bb',
    quality: 'Maior',
    frets: ['x', 1, 3, 3, 3, 1],
    fingers: [null, 1, 2, 3, 4, 1],
    barre: { fret: 1, startString: 1, endString: 5 },
    difficulty: 'Intermediário',
    tips: 'Pestana na casa 1.',
  },
  'Eb': {
    symbol: 'Eb',
    root: 'Eb',
    quality: 'Maior',
    frets: ['x', 6, 8, 8, 8, 6],
    fingers: [null, 1, 2, 3, 4, 1],
    baseFret: 6,
    difficulty: 'Intermediário',
    tips: 'Forma de Lá maior transposta para a 6ª casa.',
  },
};

/**
 * Retrieves chord definition from database or builds a fallback shape if unknown.
 */
export function getChordDefinition(symbol: string): ChordDefinition | undefined {
  if (!symbol) return undefined;
  const clean = symbol.trim();
  if (CHORD_DATABASE[clean]) return CHORD_DATABASE[clean];

  // Try ignoring slash bass
  const parsed = parseChord(clean);
  if (parsed) {
    const rootQuality = `${parsed.root}${parsed.quality}`;
    if (CHORD_DATABASE[rootQuality]) return CHORD_DATABASE[rootQuality];
    if (CHORD_DATABASE[parsed.root]) return CHORD_DATABASE[parsed.root];
  }

  return undefined;
}
