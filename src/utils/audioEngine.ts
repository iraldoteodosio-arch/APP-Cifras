import { parseChord } from './chords';

// Frequency table for standard chromatic scale notes in Hz (A4 = 440Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99,
};

// Standard 6-string guitar tuning notes
export const GUITAR_STRINGS = [
  { stringNumber: 6, note: 'E2', frequency: 82.41, name: '6ª Corda (Mi grave)' },
  { stringNumber: 5, note: 'A2', frequency: 110.00, name: '5ª Corda (Lá)' },
  { stringNumber: 4, note: 'D3', frequency: 146.83, name: '4ª Corda (Ré)' },
  { stringNumber: 3, note: 'G3', frequency: 196.00, name: '3ª Corda (Sol)' },
  { stringNumber: 2, note: 'B3', frequency: 246.94, name: '2ª Corda (Si)' },
  { stringNumber: 1, note: 'E4', frequency: 329.63, name: '1ª Corda (Mi aguda)' },
];

/**
 * Shared AudioContext singleton with lazy initialization on user interaction.
 */
class AudioContextManager {
  private static instance: AudioContext | null = null;

  public static getContext(): AudioContext {
    if (!AudioContextManager.instance) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      AudioContextManager.instance = new AudioCtx();
    }
    if (AudioContextManager.instance.state === 'suspended') {
      AudioContextManager.instance.resume();
    }
    return AudioContextManager.instance;
  }
}

/**
 * Synthesizes a realistic acoustic guitar pluck or chord strum using Web Audio API.
 */
export function playAcousticGuitarChord(chordSymbol: string, duration: number = 2.5, volume: number = 0.5): void {
  try {
    const ctx = AudioContextManager.getContext();
    const now = ctx.currentTime;

    // Approximate chord notes frequencies
    const notes = getFrequenciesForChord(chordSymbol);
    if (!notes || notes.length === 0) return;

    notes.forEach((freq, idx) => {
      // Strum delay: simulate human finger strumming across strings (15-20ms per string)
      const strumDelay = idx * 0.022;
      const startTime = now + strumDelay;

      // Primary string oscillator (harmonic pluck)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Lowpass filter simulates acoustic wood resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, startTime);
      filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(freq * 0.5, startTime);

      // Acoustic envelope: sharp attack, warm natural decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime((volume / notes.length) * 1.3, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      bodyGain.gain.setValueAtTime(0.0001, startTime);
      bodyGain.gain.exponentialRampToValueAtTime(volume * 0.15, startTime + 0.015);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      osc.start(startTime);
      bodyOsc.start(startTime);

      osc.stop(startTime + duration + 0.1);
      bodyOsc.stop(startTime + duration + 0.1);
    });
  } catch (err) {
    console.warn('Audio synthesis warning:', err);
  }
}

/**
 * Maps chord symbol to musical frequencies (fundamental notes of guitar shape).
 */
function getFrequenciesForChord(chordSymbol: string): number[] {
  const parsed = parseChord(chordSymbol);
  if (!parsed) return [NOTE_FREQUENCIES['G2'], NOTE_FREQUENCIES['D3'], NOTE_FREQUENCIES['G3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['G4'] || 392];

  const root = parsed.root;
  const isMinor = parsed.quality.includes('m') && !parsed.quality.includes('maj');

  switch (root) {
    case 'C':
      return [NOTE_FREQUENCIES['C3'], NOTE_FREQUENCIES['E3'], NOTE_FREQUENCIES['G3'], NOTE_FREQUENCIES['C4'], NOTE_FREQUENCIES['E4']];
    case 'D':
      return isMinor
        ? [NOTE_FREQUENCIES['D3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['F4'] || 349.23]
        : [NOTE_FREQUENCIES['D3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['F#4']];
    case 'E':
      return isMinor
        ? [NOTE_FREQUENCIES['E2'], NOTE_FREQUENCIES['B2'], NOTE_FREQUENCIES['E3'], NOTE_FREQUENCIES['G3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['E4']]
        : [NOTE_FREQUENCIES['E2'], NOTE_FREQUENCIES['B2'], NOTE_FREQUENCIES['E3'], NOTE_FREQUENCIES['G#3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['E4']];
    case 'F':
      return [NOTE_FREQUENCIES['F2'], NOTE_FREQUENCIES['C3'], NOTE_FREQUENCIES['F3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['C4'], NOTE_FREQUENCIES['F4'] || 349.23];
    case 'F#':
      return isMinor
        ? [NOTE_FREQUENCIES['F#2'], NOTE_FREQUENCIES['C#3'], NOTE_FREQUENCIES['F#3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['C#4'], NOTE_FREQUENCIES['F#4'] || 369.99]
        : [NOTE_FREQUENCIES['F#2'], NOTE_FREQUENCIES['C#3'], NOTE_FREQUENCIES['F#3'], NOTE_FREQUENCIES['A#3'], NOTE_FREQUENCIES['C#4'], NOTE_FREQUENCIES['F#4'] || 369.99];
    case 'G':
      return [NOTE_FREQUENCIES['G2'], NOTE_FREQUENCIES['B2'], NOTE_FREQUENCIES['D3'], NOTE_FREQUENCIES['G3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['G4'] || 392];
    case 'A':
      return isMinor
        ? [NOTE_FREQUENCIES['A2'], NOTE_FREQUENCIES['E3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['C4'], NOTE_FREQUENCIES['E4']]
        : [NOTE_FREQUENCIES['A2'], NOTE_FREQUENCIES['E3'], NOTE_FREQUENCIES['A3'], NOTE_FREQUENCIES['C#4'], NOTE_FREQUENCIES['E4']];
    case 'B':
      return isMinor
        ? [NOTE_FREQUENCIES['B2'], NOTE_FREQUENCIES['F#3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['F#4'] || 369.99]
        : [NOTE_FREQUENCIES['B2'], NOTE_FREQUENCIES['F#3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['D#4'], NOTE_FREQUENCIES['F#4'] || 369.99];
    default:
      return [NOTE_FREQUENCIES['G2'], NOTE_FREQUENCIES['D3'], NOTE_FREQUENCIES['G3'], NOTE_FREQUENCIES['B3'], NOTE_FREQUENCIES['D4'], NOTE_FREQUENCIES['E4']];
  }
}

/**
 * High-precision Metronome class using Web Audio clock.
 */
export class Metronome {
  private bpm: number = 72;
  private isPlaying: boolean = false;
  private timerWorker: number | null = null;
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  private beatsPerBar: number = 4;
  private onBeatCallback?: (beat: number, isAccent: boolean) => void;

  constructor(bpm: number = 72, beatsPerBar: number = 4) {
    this.bpm = bpm;
    this.beatsPerBar = beatsPerBar;
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(30, Math.min(260, newBpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setBeatsPerBar(beats: number) {
    this.beatsPerBar = beats;
  }

  public setOnBeat(callback: (beat: number, isAccent: boolean) => void) {
    this.onBeatCallback = callback;
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentBeat = 0;
    const ctx = AudioContextManager.getContext();
    this.nextNoteTime = ctx.currentTime + 0.05;

    const lookahead = 25.0; // milliseconds
    const scheduleAheadTime = 0.1; // seconds

    const scheduler = () => {
      while (this.nextNoteTime < ctx.currentTime + scheduleAheadTime) {
        this.scheduleBeat(this.currentBeat, this.nextNoteTime);
        this.advanceBeat();
      }
      if (this.isPlaying) {
        this.timerWorker = window.setTimeout(scheduler, lookahead);
      }
    };

    scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerWorker) {
      clearTimeout(this.timerWorker);
      this.timerWorker = null;
    }
    this.currentBeat = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private advanceBeat() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
    this.currentBeat = (this.currentBeat + 1) % this.beatsPerBar;
  }

  private scheduleBeat(beat: number, time: number) {
    const ctx = AudioContextManager.getContext();
    const isAccent = beat === 0;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = isAccent ? 1200 : 800;
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.045);

    if (this.onBeatCallback) {
      const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
      setTimeout(() => {
        if (this.isPlaying && this.onBeatCallback) {
          this.onBeatCallback(beat, isAccent);
        }
      }, delayMs);
    }
  }
}

/**
 * Chromatic Guitar Tuner using Web Audio API and Autocorrelation Pitch Detection.
 */
export interface TunerResult {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  closestGuitarString?: typeof GUITAR_STRINGS[0];
  isInTune: boolean;
  clarity: number; // 0 to 1 confidence
}

export class ChromaticTuner {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private isListening: boolean = false;
  private buffer: Float32Array<ArrayBuffer> = new Float32Array(new ArrayBuffer(2048 * 4));
  private rafId: number | null = null;
  private onPitchDetected?: (result: TunerResult | null) => void;

  public async start(onPitch: (result: TunerResult | null) => void): Promise<void> {
    this.onPitchDetected = onPitch;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.audioContext = AudioContextManager.getContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      source.connect(this.analyser);
      this.isListening = true;
      this.tick();
    } catch (err) {
      console.error('Microphone access error for tuner:', err);
      throw err;
    }
  }

  public stop(): void {
    this.isListening = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  private tick = () => {
    if (!this.isListening || !this.analyser) return;

    this.analyser.getFloatTimeDomainData(this.buffer);
    const result = this.detectPitch(this.buffer, this.audioContext!.sampleRate);
    if (this.onPitchDetected) {
      this.onPitchDetected(result);
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  /**
   * Autocorrelation algorithm to find fundamental frequency f0.
   */
  private detectPitch(buffer: Float32Array, sampleRate: number): TunerResult | null {
    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i++) {
      sumSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumSquares / buffer.length);
    // Ignore silence or very low noise floor
    if (rms < 0.012) return null;

    // Autocorrelation
    const r: number[] = new Array(buffer.length).fill(0);
    for (let lag = 0; lag < buffer.length; lag++) {
      let sum = 0;
      for (let i = 0; i < buffer.length - lag; i++) {
        sum += buffer[i] * buffer[i + lag];
      }
      r[lag] = sum;
    }

    // Find first dip
    let d = 0;
    while (d < r.length - 1 && r[d] > r[d + 1]) {
      d++;
    }

    // Find maximum after dip
    let maxVal = -1;
    let maxLag = -1;
    for (let i = d; i < r.length; i++) {
      if (r[i] > maxVal) {
        maxVal = r[i];
        maxLag = i;
      }
    }

    if (maxLag === -1 || maxVal / r[0] < 0.35) return null;

    // Parabolic interpolation for fine frequency precision
    let fineLag = maxLag;
    if (maxLag > 0 && maxLag < r.length - 1) {
      const alpha = r[maxLag - 1];
      const beta = r[maxLag];
      const gamma = r[maxLag + 1];
      fineLag = maxLag + (gamma - alpha) / (2 * (2 * beta - alpha - gamma));
    }

    const freq = sampleRate / fineLag;
    // Guitar range: ~65 Hz (Drop D/C) up to ~550 Hz (high E string 12th fret)
    if (freq < 65 || freq > 600) return null;

    return this.frequencyToNote(freq, maxVal / r[0]);
  }

  private frequencyToNote(freq: number, clarity: number): TunerResult {
    // 69 = A4 (440Hz)
    const midiNum = 69 + 12 * Math.log2(freq / 440);
    const roundedMidi = Math.round(midiNum);
    const cents = Math.round((midiNum - roundedMidi) * 100);

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[((roundedMidi % 12) + 12) % 12];
    const octave = Math.floor(roundedMidi / 12) - 1;

    // Find nearest guitar string
    let closestGuitarString: typeof GUITAR_STRINGS[0] | undefined;
    let minDiff = Infinity;
    for (const gString of GUITAR_STRINGS) {
      const diff = Math.abs(gString.frequency - freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestGuitarString = gString;
      }
    }

    return {
      frequency: Math.round(freq * 10) / 10,
      note: noteName,
      octave,
      cents,
      closestGuitarString,
      isInTune: Math.abs(cents) <= 4,
      clarity,
    };
  }
}
