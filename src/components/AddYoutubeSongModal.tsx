import React, { useState } from 'react';
import { Song, ChordEvent } from '../types/music';
import { storageService } from '../services/storageService';
import { transposeChord } from '../utils/chords';
import {
  Youtube,
  Sparkles,
  Music,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FileText,
  Sliders,
  Play,
  RotateCcw,
  Edit2,
  Save,
} from 'lucide-react';

interface AddYoutubeSongModalProps {
  onClose: () => void;
  onSongCreated: (song: Song) => void;
}

const POPULAR_SUGGESTIONS = [
  {
    title: 'A Casa É Sua',
    artist: 'Casa Worship',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=0Qc0a3Lw5bA',
  },
  {
    title: 'Porque Ele Vive',
    artist: 'Harpa Cristã / Fernandinho',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=vV_X1V2XvjA',
  },
  {
    title: 'Raridade',
    artist: 'Anderson Freire',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=kY6vEwR8WkM',
  },
  {
    title: 'Lugar Secreto',
    artist: 'Gabriela Rocha',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=5V4fWv8x8w0',
  },
  {
    title: 'Nenhum Outro Lugar',
    artist: 'Morada',
    key: 'C',
    url: 'https://www.youtube.com/watch?v=q6g4gXJv_7U',
  },
  {
    title: 'Ousado Amor',
    artist: 'Isaias Saad',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=k6hF1L9wBwE',
  },
  {
    title: 'Bondade de Deus',
    artist: 'Isaias Saad',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=1F5d_0Dq5nA',
  },
  {
    title: 'Aquieta Minh\'alma',
    artist: 'Ministério Zoe',
    key: 'C',
    url: 'https://www.youtube.com/watch?v=9V4d8wFq7bA',
  },
  {
    title: 'Escudo',
    artist: 'Voz da Verdade',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=m7B5s_8s7dA',
  },
  {
    title: 'Vitorioso És',
    artist: 'Gabriel Guedes',
    key: 'G',
    url: 'https://www.youtube.com/watch?v=z8B3q9f7s2A',
  },
];

export const AddYoutubeSongModal: React.FC<AddYoutubeSongModalProps> = ({
  onClose,
  onSongCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'paste_lyrics'>('youtube');
  const [url, setUrl] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [lyricsInput, setLyricsInput] = useState('');
  const [selectedKey, setSelectedKey] = useState('G');

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preview & Confirmation State
  const [transcribedSong, setTranscribedSong] = useState<Song | null>(null);
  const [isEditingInPreview, setIsEditingInPreview] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewArtist, setPreviewArtist] = useState('');
  const [previewKey, setPreviewKey] = useState('G');

  const handleTranscribe = async (targetUrl?: string, hintTitle?: string, hintArtist?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      setErrorMsg('Por favor, insira o link ou URL de um vídeo do YouTube.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      setCurrentStep('Conectando ao vídeo do YouTube...');
      await new Promise((r) => setTimeout(r, 400));

      setCurrentStep('Detectando título, artista e tom musical...');

      const response = await fetch('/api/youtube/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: finalUrl,
          titleHint: hintTitle || titleInput,
          artistHint: hintArtist || artistInput,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao processar o vídeo do YouTube.');
      }

      setCurrentStep('Mapeando acordes de violão sobre a letra...');
      const data = await response.json();

      if (data.success && data.song) {
        setTranscribedSong(data.song);
        setPreviewTitle(data.song.title);
        setPreviewArtist(data.song.artist);
        setPreviewKey(data.song.originalKey || 'G');
        setIsLoading(false);
      } else {
        throw new Error('Não foi possível gerar as cifras com a letra deste vídeo.');
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMsg(err.message || 'Falha ao analisar a música. Verifique o link e tente novamente.');
      setIsLoading(false);
    }
  };

  const handleHarmonizeLyrics = async () => {
    if (!lyricsInput.trim()) {
      setErrorMsg('Por favor, digite ou cole a letra da música.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setCurrentStep('Harmonizando letra e posicionando acordes de violão...');

    try {
      const response = await fetch('/api/youtube/harmonize-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput.trim() || 'Novo Louvor Cifrado',
          artist: artistInput.trim() || 'Ministério de Louvor',
          key: selectedKey,
          bpm: 72,
          rawLyrics: lyricsInput.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao cifrar a letra.');
      }

      const data = await response.json();
      if (data.success && data.song) {
        setTranscribedSong(data.song);
        setPreviewTitle(data.song.title);
        setPreviewArtist(data.song.artist);
        setPreviewKey(data.song.originalKey || 'G');
        setIsLoading(false);
      } else {
        throw new Error('Não foi possível processar a letra.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao harmonizar letra.');
      setIsLoading(false);
    }
  };

  const handleSaveAndPlay = () => {
    if (!transcribedSong) return;

    const finalSong: Song = {
      ...transcribedSong,
      title: previewTitle || transcribedSong.title,
      artist: previewArtist || transcribedSong.artist,
      originalKey: previewKey || transcribedSong.originalKey,
    };

    storageService.saveSong(finalSong);
    onSongCreated(finalSong);
  };

  const shiftPreviewKey = (delta: number) => {
    const newKey = transposeChord(previewKey, delta);
    setPreviewKey(newKey);
    if (transcribedSong) {
      const updatedSections = transcribedSong.sections.map((sec) => ({
        ...sec,
        lines: sec.lines.map((line) => ({
          ...line,
          chords: line.chords.map((c) => ({
            ...c,
            chordSymbol: transposeChord(c.chordSymbol, delta),
          })),
        })),
      }));
      setTranscribedSong({
        ...transcribedSong,
        originalKey: newKey,
        sections: updatedSections,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Cifrador com Letra do YouTube</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                  IA Harmônica
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Detecta o tom musical e gera a letra completa com os acordes alinhados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white rounded-xl text-lg cursor-pointer disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-spin">
                  <Loader2 className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Cifrando o Louvor com a Letra...</h3>
                <p className="text-xs text-emerald-400 font-mono animate-pulse">
                  {currentStep}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                Estamos extraindo o tom musical exato, transcrevendo todas as estrofes e posicionando os acordes de violão sobre as palavras certas.
              </p>
            </div>
          ) : transcribedSong ? (
            /* PREVIEW & CONFIRMATION SCREEN */
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Música Cifrada com Sucesso!</h3>
                    <p className="text-xs text-emerald-400">
                      Letra completa e acordes de violão sincronizados prontos para tocar.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setTranscribedSong(null)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cifrar Outra
                </button>
              </div>

              {/* Song Meta Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {isEditingInPreview ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={previewTitle}
                          onChange={(e) => setPreviewTitle(e.target.value)}
                          placeholder="Título do Louvor"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                        />
                        <input
                          type="text"
                          value={previewArtist}
                          onChange={(e) => setPreviewArtist(e.target.value)}
                          placeholder="Artista ou Ministério"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-base font-bold text-white">{previewTitle}</h4>
                        <p className="text-xs text-slate-400">{previewArtist}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingInPreview(!isEditingInPreview)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isEditingInPreview ? 'Concluir' : 'Editar Nome'}</span>
                    </button>
                  </div>
                </div>

                {/* Musical Controls (Key Transpose, BPM) */}
                <div className="pt-2 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tom Detectado</div>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <button
                        onClick={() => shiftPreviewKey(-1)}
                        className="w-5 h-5 rounded bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                        title="Descer meio tom"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-emerald-400 font-mono">{previewKey}</span>
                      <button
                        onClick={() => shiftPreviewKey(1)}
                        className="w-5 h-5 rounded bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                        title="Subir meio tom"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Andamento</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {transcribedSong.bpm} BPM
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Compasso</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {transcribedSong.timeSignature || '4/4'}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Estrofes</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {transcribedSong.sections.length} seções
                    </div>
                  </div>
                </div>
              </div>

              {/* Chords & Lyrics Scrollable Sheet Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Visualização das Cifras com a Letra:</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Acordes posicionados sobre as sílabas</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-64 overflow-y-auto space-y-4 font-mono text-xs">
                  {transcribedSong.sections.map((section) => (
                    <div key={section.id} className="space-y-2.5 pb-2 border-b border-slate-900 last:border-b-0">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                        [{section.title}]
                      </div>
                      <div className="space-y-3">
                        {section.lines.map((line) => (
                          <div key={line.id} className="space-y-0.5">
                            {/* Chords row positioned over letters */}
                            <div className="relative text-emerald-400 font-bold select-none h-4">
                              {line.chords.map((chord) => (
                                <span
                                  key={chord.id}
                                  style={{ position: 'absolute', left: `${chord.position}ch` }}
                                  className="text-emerald-300 font-extrabold"
                                >
                                  {chord.chordSymbol}
                                </span>
                              ))}
                            </div>
                            {/* Lyric text */}
                            <div className="text-slate-200 tracking-wide select-text">
                              {line.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTranscribedSong(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndPlay}
                  className="flex-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Salvar Louvor e Tocar Agora</span>
                </button>
              </div>
            </div>
          ) : (
            /* INPUT SCREEN (YOUTUBE LINK OR PASTE LYRICS) */
            <>
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('youtube')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'youtube'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-rose-500" />
                  <span>Link do YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('paste_lyrics')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'paste_lyrics'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Colar Letra & Cifrar</span>
                </button>
              </div>

              {activeTab === 'youtube' ? (
                <>
                  {/* YouTube URL input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Link ou URL do Vídeo do YouTube
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=... ou youtu.be/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      O sistema identifica o louvor, extrai o tom no violão e gera a letra completa com os acordes.
                    </p>
                  </div>

                  {/* Suggestions Grid */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ou experimente louvores populares já afinados:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {POPULAR_SUGGESTIONS.map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setUrl(item.url);
                            handleTranscribe(item.url, item.title, item.artist);
                          }}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer group flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate flex items-center gap-2">
                              <span>{item.artist}</span>
                              <span className="text-emerald-400 font-mono font-bold">Tom {item.key}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTranscribe()}
                      className="flex-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Detectar Tom e Cifrar com a Letra</span>
                    </button>
                  </div>
                </>
              ) : (
                /* TAB 2: PASTE LYRICS DIRECTLY */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[11px] font-semibold text-slate-400">Título do Louvor</label>
                      <input
                        type="text"
                        placeholder="Ex: Santo Deus"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[11px] font-semibold text-slate-400">Artista / Ministério</label>
                      <input
                        type="text"
                        placeholder="Ex: Gabriela Rocha"
                        value={artistInput}
                        onChange={(e) => setArtistInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[11px] font-semibold text-slate-400">Tom de Violão Desejado</label>
                      <select
                        value={selectedKey}
                        onChange={(e) => setSelectedKey(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {['G', 'C', 'D', 'E', 'A', 'Em', 'Am'].map((k) => (
                          <option key={k} value={k}>
                            Tom: {k}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Cole a Letra da Música (com ou sem cabeçalhos de estrofe):
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Cole aqui as estrofes da música...
Exemplo:
Você é bem-vindo aqui, a casa é Sua, pode entrar
Me esvazio de mim, me esvazio de mim
Sopra Teu vento aqui, toma o Teu lugar..."
                      value={lyricsInput}
                      onChange={(e) => setLyricsInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-white placeholder-slate-500 font-sans focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleHarmonizeLyrics}
                      className="flex-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Harmonizar e Cifrar para Violão</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
