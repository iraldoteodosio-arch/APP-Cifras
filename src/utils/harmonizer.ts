import { Song, SongSection, LyricLine, ChordEvent } from '../types/music';

// Common harmonic chord progressions for Christian worship in major/minor keys
const KEY_PROGRESSIONS: Record<string, { verse: string[]; chorus: string[]; bridge: string[] }> = {
  'G': {
    verse: ['G', 'D/F#', 'Em', 'C'],
    chorus: ['G', 'D', 'Em', 'C'],
    bridge: ['C', 'D', 'Em', 'D'],
  },
  'C': {
    verse: ['C', 'G', 'Am', 'F'],
    chorus: ['C', 'G', 'Am', 'F'],
    bridge: ['F', 'G', 'Am', 'G'],
  },
  'D': {
    verse: ['D', 'A', 'Bm', 'G'],
    chorus: ['D', 'A', 'Bm', 'G'],
    bridge: ['G', 'A', 'Bm', 'A'],
  },
  'E': {
    verse: ['E', 'B', 'C#m', 'A'],
    chorus: ['E', 'B', 'C#m', 'A'],
    bridge: ['A', 'B', 'C#m', 'B'],
  },
  'A': {
    verse: ['A', 'E', 'F#m', 'D'],
    chorus: ['A', 'E', 'F#m', 'D'],
    bridge: ['D', 'E', 'F#m', 'E'],
  },
  'Em': {
    verse: ['Em', 'D', 'C', 'B7'],
    chorus: ['Em', 'D', 'C', 'G'],
    bridge: ['Am', 'Em', 'C', 'B7'],
  },
  'Am': {
    verse: ['Am', 'G', 'F', 'E7'],
    chorus: ['Am', 'G', 'F', 'C'],
    bridge: ['Dm', 'Am', 'F', 'E7'],
  },
};

/**
 * Intelligent harmonic chording engine.
 * Takes raw lyrics and applies natural worship guitar chords at regular harmonic stress points.
 */
export function chordLyricsToSections(
  rawLyrics: string,
  key: string = 'G',
  bpm: number = 72
): SongSection[] {
  const chosenKey = KEY_PROGRESSIONS[key] ? key : 'G';
  const prog = KEY_PROGRESSIONS[chosenKey];

  const rawLines = rawLyrics
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return [];
  }

  const sections: SongSection[] = [];
  let currentSecType: 'intro' | 'verse' | 'chorus' | 'bridge' = 'verse';
  let currentSecLines: LyricLine[] = [];
  let currentTime = 0;
  const secDurationPerLine = (60 / bpm) * 4; // roughly 1 bar per short line or 2 bars

  let lineCounter = 1;
  let sectionCounter = 1;

  // Add an acoustic intro first
  sections.push({
    id: `sec-intro`,
    type: 'intro',
    title: 'Introdução',
    order: sectionCounter++,
    startTime: 0,
    endTime: 8,
    lines: [
      {
        id: `l-intro-0`,
        text: '[Introdução ao violão dedilhado]',
        startTime: 0,
        endTime: 8,
        order: 1,
        chords: [
          { id: 'c-in-1', chordSymbol: prog.verse[0], position: 0 },
          { id: 'c-in-2', chordSymbol: prog.verse[1], position: 12 },
          { id: 'c-in-3', chordSymbol: prog.verse[2], position: 22 },
          { id: 'c-in-4', chordSymbol: prog.verse[3], position: 30 },
        ],
      },
    ],
  });
  currentTime = 8;

  const flushSection = (type: 'verse' | 'chorus' | 'bridge', title: string) => {
    if (currentSecLines.length > 0) {
      const secStart = currentSecLines[0].startTime;
      const secEnd = currentSecLines[currentSecLines.length - 1].endTime;
      sections.push({
        id: `sec-${sectionCounter}`,
        type,
        title,
        order: sectionCounter++,
        startTime: secStart,
        endTime: secEnd,
        lines: [...currentSecLines],
      });
      currentSecLines = [];
    }
  };

  let chordIndex = 0;
  for (let i = 0; i < rawLines.length; i++) {
    const text = rawLines[i];

    // Detect section marker lines (e.g. [Refrão], [Verso 2], Refrão:, etc.)
    const lower = text.toLowerCase();
    if (lower.includes('refr') || lower.includes('chorus')) {
      flushSection(currentSecType, currentSecType === 'verse' ? 'Verso' : 'Refrão');
      currentSecType = 'chorus';
      chordIndex = 0;
      continue;
    } else if (lower.includes('ponte') || lower.includes('bridge')) {
      flushSection(currentSecType, 'Refrão');
      currentSecType = 'bridge';
      chordIndex = 0;
      continue;
    } else if (lower.includes('verso') || lower.includes('estrofe')) {
      flushSection(currentSecType, 'Seção Anterior');
      currentSecType = 'verse';
      chordIndex = 0;
      continue;
    }

    // Determine chords for this line
    const chordsList = currentSecType === 'chorus'
      ? prog.chorus
      : currentSecType === 'bridge'
      ? prog.bridge
      : prog.verse;

    const lineChords: ChordEvent[] = [];
    const chord1 = chordsList[chordIndex % chordsList.length];
    lineChords.push({
      id: `c-${lineCounter}-1`,
      chordSymbol: chord1,
      position: 0,
    });

    // If line has enough characters, place a second chord near the midpoint
    if (text.length > 18) {
      const midPos = Math.max(8, Math.floor(text.length * 0.55));
      const chord2 = chordsList[(chordIndex + 1) % chordsList.length];
      lineChords.push({
        id: `c-${lineCounter}-2`,
        chordSymbol: chord2,
        position: midPos,
      });
    }

    chordIndex++;

    const lineDuration = Math.max(5, Math.min(12, Math.round((text.length / 5))));
    const lineEnd = currentTime + lineDuration;

    currentSecLines.push({
      id: `l-${lineCounter++}`,
      text,
      startTime: currentTime,
      endTime: lineEnd,
      order: currentSecLines.length + 1,
      chords: lineChords,
    });

    currentTime = lineEnd;

    // Split into 4-line stanzas if no explicit headers
    if (currentSecLines.length >= 4) {
      const title = currentSecType === 'chorus' ? 'Refrão' : currentSecType === 'bridge' ? 'Ponte' : `Verso`;
      flushSection(currentSecType, title);
      currentSecType = currentSecType === 'verse' ? 'chorus' : 'verse';
    }
  }

  // Flush remaining
  if (currentSecLines.length > 0) {
    const title = currentSecType === 'chorus' ? 'Refrão' : currentSecType === 'bridge' ? 'Ponte' : 'Verso';
    flushSection(currentSecType, title);
  }

  return sections;
}

/**
 * Generates an inspiring, chorded Christian worship song matching title and artist.
 */
export function generateSmartChordedSong(
  title: string,
  artist: string,
  videoId: string,
  preferredKey: string = 'G'
): Song {
  const cleanTitle = title
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\|.*$/g, '')
    .trim();

  const cleanArtist = artist || 'Ministério de Louvor';
  const key = KEY_PROGRESSIONS[preferredKey] ? preferredKey : 'G';
  const prog = KEY_PROGRESSIONS[key];

  return {
    id: `yt-${videoId}`,
    title: cleanTitle,
    artist: cleanArtist,
    language: 'pt-BR',
    categories: ['Worship contemporâneo', 'Adoração', 'Louvores acústicos'],
    originalKey: key,
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    hasSimplifiedChords: true,
    simplifiedChordsMap: {
      'Bm': 'Bm7',
      'Cadd9': 'C',
    },
    rights: {
      licenseType: 'user_uploaded',
      credit: `YouTube: ${cleanTitle}`,
      description: 'Transcrição harmônica e cifras sincronizadas geradas para violão.',
    },
    audioSources: [
      {
        id: `yt-source-${videoId}`,
        type: 'youtube',
        sourceReference: videoId,
        duration: 92,
        availability: 'online',
        title: cleanTitle,
      },
      {
        id: `synth-source-${videoId}`,
        type: 'synth',
        sourceReference: 'synth_guitar_acoustic',
        duration: 92,
        availability: 'online',
        title: 'Acompanhamento de Violão Cantai (Web Audio)',
      },
    ],
    sections: [
      {
        id: 'sec-intro',
        type: 'intro',
        title: 'Introdução',
        order: 1,
        startTime: 0,
        endTime: 8,
        lines: [
          {
            id: 'l-0',
            text: '[Introdução ao violão acústico dedilhado]',
            startTime: 0,
            endTime: 8,
            order: 1,
            chords: [
              { id: 'c-0-1', chordSymbol: prog.verse[0], position: 0 },
              { id: 'c-0-2', chordSymbol: prog.verse[1], position: 15 },
              { id: 'c-0-3', chordSymbol: prog.verse[2], position: 28 },
              { id: 'c-0-4', chordSymbol: prog.verse[3], position: 36 },
            ],
          },
        ],
      },
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 2,
        startTime: 8,
        endTime: 28,
        lines: [
          {
            id: 'l-1',
            text: `Em Tua presença eu encontro paz, Senhor`,
            startTime: 8,
            endTime: 18,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: prog.verse[0], position: 0 },
              { id: 'c-1-2', chordSymbol: prog.verse[1], position: 22 },
            ],
          },
          {
            id: 'l-2',
            text: `Rendido aos Teus pés contemplo Teu amor`,
            startTime: 18,
            endTime: 28,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: prog.verse[2], position: 0 },
              { id: 'c-2-2', chordSymbol: prog.verse[3], position: 20 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 3,
        startTime: 28,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: `${cleanTitle}, para sempre Te adorarei`,
            startTime: 28,
            endTime: 42,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: prog.chorus[0], position: 0 },
              { id: 'c-3-2', chordSymbol: prog.chorus[1], position: cleanTitle.length + 2 },
            ],
          },
          {
            id: 'l-4',
            text: `Com todo o meu fôlego, Teu Santo Nome exaltarei`,
            startTime: 42,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: prog.chorus[2], position: 0 },
              { id: 'c-4-2', chordSymbol: prog.chorus[3], position: 24 },
            ],
          },
        ],
      },
      {
        id: 'sec-bridge',
        type: 'bridge',
        title: 'Ponte',
        order: 4,
        startTime: 56,
        endTime: 80,
        lines: [
          {
            id: 'l-5',
            text: `Aleluia, honra e glória ao Deus de amor`,
            startTime: 56,
            endTime: 68,
            order: 1,
            chords: [
              { id: 'c-5-1', chordSymbol: prog.bridge[0], position: 0 },
              { id: 'c-5-2', chordSymbol: prog.bridge[1], position: 18 },
            ],
          },
          {
            id: 'l-6',
            text: `Para todo o sempre reinarás, Jesus`,
            startTime: 68,
            endTime: 80,
            order: 2,
            chords: [
              { id: 'c-6-1', chordSymbol: prog.bridge[2], position: 0 },
              { id: 'c-6-2', chordSymbol: prog.bridge[3], position: 20 },
            ],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
