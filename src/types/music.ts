export type SongDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export type SectionType = 
  | 'intro'
  | 'verse'
  | 'pre-chorus'
  | 'chorus'
  | 'bridge'
  | 'instrumental'
  | 'outro';

export interface ChordEvent {
  id: string;
  chordSymbol: string;
  position: number; // Character index in the lyric line
  optionalBass?: string; // e.g. "F#" in "D/F#"
  duration?: number;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  order: number;
  chords: ChordEvent[];
}

export interface SongSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  startTime: number;
  endTime: number;
  lines: LyricLine[];
}

export interface AudioSource {
  id: string;
  type: 'synth' | 'authorized_url' | 'user_file' | 'youtube';
  sourceReference: string;
  duration: number;
  licenseReference?: string;
  availability: 'online' | 'local_session';
  title?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  composers?: string[];
  language: string;
  categories: string[];
  originalKey: string;
  bpm: number;
  timeSignature: string; // e.g. "4/4", "3/4", "6/8"
  difficulty: SongDifficulty;
  capoSuggestion: number; // 0 for no capo
  capoEasyKey?: string;   // e.g. "C" when capo 2 for D
  audioSources: AudioSource[];
  sections: SongSection[];
  rights: {
    licenseType: 'original_demo' | 'public_domain' | 'licensed' | 'user_uploaded';
    credit: string;
    description: string;
  };
  hasSimplifiedChords?: boolean;
  simplifiedChordsMap?: Record<string, string>; // e.g. { "Bm": "Bm7", "F": "Fmaj7" }
  createdAt: string;
  updatedAt: string;
}

export interface ChordDefinition {
  symbol: string;
  root: string;
  quality: string;
  frets: (number | 'x')[]; // 6 strings: E A D G B e (low E to high e). -1 or 'x' for mute, 0 for open
  fingers: (number | null)[]; // 1: Index, 2: Middle, 3: Ring, 4: Pinky
  barre?: {
    fret: number;
    fromFret?: number;
    startString: number; // 1 to 6 (1 = high e, 6 = low E)
    endString: number;
  };
  baseFret?: number; // usually 1, or higher if high up the neck
  difficulty: SongDifficulty;
  simplifiedAlternative?: string;
  tips?: string;
}

export interface UserSongPreference {
  songId: string;
  preferredKey: string;
  semitonesShift: number;
  capoPosition: number;
  useSimplifiedChords: boolean;
  lastPositionSeconds: number;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  songPreferences?: Record<string, { key?: string; capo?: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  preferredLanguage: 'pt-BR' | 'pt-PT' | 'en' | 'es';
  theme: 'dark' | 'light';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  defaultPlaybackRate: number;
  subscriptionStatus: 'free' | 'premium';
  createdAt: string;
}
