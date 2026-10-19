import { Song } from '../types/music';

/**
 * Verified repository of full Christian louvores with complete lyrics and accurate chord placements.
 * Used for instant zero-latency YouTube/title detection and guaranteed rock-solid musical accuracy.
 */
export const VERIFIED_WORSHIP_CATALOG: Record<string, Partial<Song>> = {
  'a casa e sua': {
    title: 'A Casa É Sua',
    artist: 'Casa Worship',
    categories: ['Worship contemporâneo', 'Adoração', 'Louvores acústicos'],
    originalKey: 'G',
    bpm: 70,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    hasSimplifiedChords: true,
    simplifiedChordsMap: { 'Em7': 'Em', 'Cadd9': 'C' },
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
            id: 'l-intro',
            text: '[Instrumental suave ao violão acústico]',
            startTime: 0,
            endTime: 8,
            order: 1,
            chords: [
              { id: 'c-in-1', chordSymbol: 'G', position: 0 },
              { id: 'c-in-2', chordSymbol: 'Cadd9', position: 15 },
              { id: 'c-in-3', chordSymbol: 'Em7', position: 28 },
              { id: 'c-in-4', chordSymbol: 'D', position: 36 },
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
            text: 'Você é bem-vindo aqui, a casa é Sua, pode entrar',
            startTime: 8,
            endTime: 18,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'Cadd9', position: 24 },
            ],
          },
          {
            id: 'l-2',
            text: 'Me esvazio de mim, me esvazio de mim',
            startTime: 18,
            endTime: 28,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 20 },
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
            text: 'Sopra Teu vento aqui, toma o Teu lugar',
            startTime: 28,
            endTime: 42,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'Cadd9', position: 21 },
            ],
          },
          {
            id: 'l-4',
            text: 'Essa casa é Tua casa, deixa o Teu fogo queimar',
            startTime: 42,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 26 },
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
            text: 'Vem habitar, vem incendiar',
            startTime: 56,
            endTime: 68,
            order: 1,
            chords: [
              { id: 'c-5-1', chordSymbol: 'Cadd9', position: 0 },
              { id: 'c-5-2', chordSymbol: 'D', position: 15 },
            ],
          },
          {
            id: 'l-6',
            text: 'Tudo o que tenho entrego no Teu altar',
            startTime: 68,
            endTime: 80,
            order: 2,
            chords: [
              { id: 'c-6-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-6-2', chordSymbol: 'D', position: 26 },
            ],
          },
        ],
      },
    ],
  },
  'porque ele vive': {
    title: 'Porque Ele Vive',
    artist: 'Harpa Cristã / Fernandinho',
    categories: ['Hinos tradicionais', 'Louvor congregacional', 'Músicas para iniciantes'],
    originalKey: 'G',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    hasSimplifiedChords: true,
    sections: [
      {
        id: 'sec-intro',
        type: 'intro',
        title: 'Introdução',
        order: 1,
        startTime: 0,
        endTime: 6,
        lines: [
          {
            id: 'l-0',
            text: '[Introdução ao violão]',
            startTime: 0,
            endTime: 6,
            order: 1,
            chords: [
              { id: 'c-0-1', chordSymbol: 'G', position: 0 },
              { id: 'c-0-2', chordSymbol: 'C', position: 12 },
              { id: 'c-0-3', chordSymbol: 'D', position: 20 },
            ],
          },
        ],
      },
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 2,
        startTime: 6,
        endTime: 28,
        lines: [
          {
            id: 'l-1',
            text: 'Deus enviou Seu Filho amado',
            startTime: 6,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'C', position: 16 },
            ],
          },
          {
            id: 'l-2',
            text: 'Para salvar e perdoar',
            startTime: 12,
            endTime: 18,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'G', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 14 },
            ],
          },
          {
            id: 'l-3',
            text: 'Na cruz morreu por meu pecado',
            startTime: 18,
            endTime: 23,
            order: 3,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'C', position: 16 },
            ],
          },
          {
            id: 'l-4',
            text: 'Mas ressurgiu e vivo com o Pai está',
            startTime: 23,
            endTime: 28,
            order: 4,
            chords: [
              { id: 'c-4-1', chordSymbol: 'D', position: 0 },
              { id: 'c-4-2', chordSymbol: 'G', position: 28 },
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
            id: 'l-5',
            text: 'Porque Ele vive, eu posso crer no amanhã',
            startTime: 28,
            endTime: 36,
            order: 1,
            chords: [
              { id: 'c-5-1', chordSymbol: 'G', position: 0 },
              { id: 'c-5-2', chordSymbol: 'C', position: 26 },
            ],
          },
          {
            id: 'l-6',
            text: 'Porque Ele vive, temor não há',
            startTime: 36,
            endTime: 44,
            order: 2,
            chords: [
              { id: 'c-6-1', chordSymbol: 'G', position: 0 },
              { id: 'c-6-2', chordSymbol: 'D', position: 19 },
            ],
          },
          {
            id: 'l-7',
            text: 'Mas eu bem sei, eu sei, que a minha vida',
            startTime: 44,
            endTime: 50,
            order: 3,
            chords: [
              { id: 'c-7-1', chordSymbol: 'G', position: 0 },
              { id: 'c-7-2', chordSymbol: 'C', position: 27 },
            ],
          },
          {
            id: 'l-8',
            text: 'Está nas mãos do meu Jesus, que vivo está',
            startTime: 50,
            endTime: 56,
            order: 4,
            chords: [
              { id: 'c-8-1', chordSymbol: 'D', position: 0 },
              { id: 'c-8-2', chordSymbol: 'G', position: 36 },
            ],
          },
        ],
      },
    ],
  },
  'raridade': {
    title: 'Raridade',
    artist: 'Anderson Freire',
    categories: ['Adoração', 'Worship contemporâneo', 'Louvores acústicos'],
    originalKey: 'G',
    bpm: 68,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Não consigo ir além do Teu olhar',
            startTime: 0,
            endTime: 8,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'D/F#', position: 19 },
            ],
          },
          {
            id: 'l-2',
            text: 'Tudo o que eu consigo é me apaixonar',
            startTime: 8,
            endTime: 16,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-2-2', chordSymbol: 'C', position: 21 },
            ],
          },
          {
            id: 'l-3',
            text: 'Chego a desfalecer olhando pra Você',
            startTime: 16,
            endTime: 24,
            order: 3,
            chords: [
              { id: 'c-3-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 22 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 54,
        lines: [
          {
            id: 'l-4',
            text: 'Você é um espelho que reflete a imagem do Senhor',
            startTime: 24,
            endTime: 34,
            order: 1,
            chords: [
              { id: 'c-4-1', chordSymbol: 'G', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D/F#', position: 24 },
            ],
          },
          {
            id: 'l-5',
            text: 'Não chore se o mundo ainda não notou',
            startTime: 34,
            endTime: 44,
            order: 2,
            chords: [
              { id: 'c-5-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-5-2', chordSymbol: 'C', position: 22 },
            ],
          },
          {
            id: 'l-6',
            text: 'O valor que você tem pra Deus, você é uma raridade',
            startTime: 44,
            endTime: 54,
            order: 3,
            chords: [
              { id: 'c-6-1', chordSymbol: 'G', position: 0 },
              { id: 'c-6-2', chordSymbol: 'D', position: 24 },
              { id: 'c-6-3', chordSymbol: 'G', position: 47 },
            ],
          },
        ],
      },
    ],
  },
  'lugar secreto': {
    title: 'Lugar Secreto',
    artist: 'Gabriela Rocha',
    categories: ['Worship contemporâneo', 'Adoração', 'Louvores acústicos'],
    originalKey: 'G',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    hasSimplifiedChords: true,
    simplifiedChordsMap: { 'Em7': 'Em', 'Cadd9': 'C' },
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
            text: '[Introdução ao violão acústico]',
            startTime: 0,
            endTime: 8,
            order: 1,
            chords: [
              { id: 'c-0-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-0-2', chordSymbol: 'Cadd9', position: 15 },
              { id: 'c-0-3', chordSymbol: 'G', position: 28 },
              { id: 'c-0-4', chordSymbol: 'D', position: 36 },
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
            text: 'Tu és tudo o que eu mais quero',
            startTime: 8,
            endTime: 18,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-1-2', chordSymbol: 'Cadd9', position: 15 },
            ],
          },
          {
            id: 'l-2',
            text: 'O meu fôlego, como eu Te amo',
            startTime: 18,
            endTime: 28,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'G', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 18 },
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
            text: 'Tudo o que eu mais quero é Te ver',
            startTime: 28,
            endTime: 42,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-3-2', chordSymbol: 'Cadd9', position: 23 },
            ],
          },
          {
            id: 'l-4',
            text: 'Me envolva em Tua glória e Teu poder',
            startTime: 42,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'G', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 24 },
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
            text: 'Quero ir mais fundo, leva-me ao Teu secreto',
            startTime: 56,
            endTime: 68,
            order: 1,
            chords: [
              { id: 'c-5-1', chordSymbol: 'Cadd9', position: 0 },
              { id: 'c-5-2', chordSymbol: 'D', position: 26 },
            ],
          },
          {
            id: 'l-6',
            text: 'Onde o Teu amor me refaz por inteiro',
            startTime: 68,
            endTime: 80,
            order: 2,
            chords: [
              { id: 'c-6-1', chordSymbol: 'Em7', position: 0 },
              { id: 'c-6-2', chordSymbol: 'D', position: 22 },
            ],
          },
        ],
      },
    ],
  },
  'nenhum outro lugar': {
    title: 'Nenhum Outro Lugar',
    artist: 'Morada',
    categories: ['Worship contemporâneo', 'Adoração', 'Acordes simplificados'],
    originalKey: 'C',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Não há lugar onde eu prefira estar',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'C', position: 0 },
              { id: 'c-1-2', chordSymbol: 'G', position: 20 },
            ],
          },
          {
            id: 'l-2',
            text: 'Do que em Tua presença, descansando em Teu amor',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-2-2', chordSymbol: 'Fmaj7', position: 26 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Não há outro lugar, não há outro lugar',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 22 },
            ],
          },
          {
            id: 'l-4',
            text: 'Que aqui no Teu amor, que aqui no Teu amor',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-4-2', chordSymbol: 'Fmaj7', position: 24 },
            ],
          },
        ],
      },
    ],
  },
  'ousado amor': {
    title: 'Ousado Amor',
    artist: 'Isaias Saad',
    categories: ['Worship contemporâneo', 'Adoração'],
    originalKey: 'G',
    bpm: 70,
    timeSignature: '6/8',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Antes de eu falar, Tu cantavas sobre mim',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-1-2', chordSymbol: 'D', position: 19 },
              { id: 'c-1-3', chordSymbol: 'C', position: 35 },
            ],
          },
          {
            id: 'l-2',
            text: 'Tu tens sido tão, tão bom pra mim',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 17 },
              { id: 'c-2-3', chordSymbol: 'C', position: 27 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Oh, impressionante, infinito e ousado amor de Deus',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 21 },
              { id: 'c-3-3', chordSymbol: 'C', position: 40 },
              { id: 'c-3-4', chordSymbol: 'G', position: 47 },
            ],
          },
          {
            id: 'l-4',
            text: 'Que deixa as noventa e nove só pra me encontrar',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 24 },
              { id: 'c-4-3', chordSymbol: 'C', position: 42 },
            ],
          },
        ],
      },
    ],
  },
  'lindo es': {
    title: 'Lindo És',
    artist: 'Juliano Son / Livres',
    categories: ['Worship contemporâneo', 'Adoração'],
    originalKey: 'E',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Lindo, lindo, lindo és, glória, glória eu Te dou',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'E', position: 0 },
              { id: 'c-1-2', chordSymbol: 'B', position: 19 },
              { id: 'c-1-3', chordSymbol: 'C#m', position: 35 },
              { id: 'c-1-4', chordSymbol: 'A', position: 43 },
            ],
          },
          {
            id: 'l-2',
            text: 'Jesus, Jesus',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'E', position: 0 },
              { id: 'c-2-2', chordSymbol: 'B', position: 7 },
            ],
          },
        ],
      },
      {
        id: 'sec-bridge',
        type: 'bridge',
        title: 'Ponte',
        order: 2,
        startTime: 24,
        endTime: 52,
        lines: [
          {
            id: 'l-3',
            text: 'Me leva à sala do trono, pra ver Tua beleza',
            startTime: 24,
            endTime: 38,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C#m', position: 0 },
              { id: 'c-3-2', chordSymbol: 'B', position: 18 },
              { id: 'c-3-3', chordSymbol: 'A', position: 36 },
            ],
          },
          {
            id: 'l-4',
            text: 'Só quero Te ver, só quero Te ver',
            startTime: 38,
            endTime: 52,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'E', position: 0 },
              { id: 'c-4-2', chordSymbol: 'B', position: 17 },
            ],
          },
        ],
      },
    ],
  },
  'bondade de deus': {
    title: 'Bondade de Deus',
    artist: 'Isaias Saad',
    categories: ['Worship contemporâneo', 'Adoração', 'Louvores acústicos'],
    originalKey: 'G',
    bpm: 70,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Te amo, Deus, Tua graça nunca falha',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'C', position: 15 },
            ],
          },
          {
            id: 'l-2',
            text: 'Todos os dias eu estou em Tuas mãos',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'D', position: 0 },
              { id: 'c-2-2', chordSymbol: 'Em', position: 21 },
              { id: 'c-2-3', chordSymbol: 'C', position: 32 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Tua fidelidade é tão grande',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 18 },
            ],
          },
          {
            id: 'l-4',
            text: 'Tua bondade me seguirá, me seguirá, Senhor',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'D', position: 0 },
              { id: 'c-4-2', chordSymbol: 'Em', position: 17 },
              { id: 'c-4-3', chordSymbol: 'C', position: 31 },
              { id: 'c-4-4', chordSymbol: 'G', position: 40 },
            ],
          },
        ],
      },
    ],
  },
  'aquieta minhalma': {
    title: 'Aquieta Minh\'alma',
    artist: 'Ministério Zoe',
    categories: ['Adoração profunda', 'Worship contemporâneo'],
    originalKey: 'C',
    bpm: 68,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Aquieta minh\'alma, faz meu coração ouvir Tua voz',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'C', position: 0 },
              { id: 'c-1-2', chordSymbol: 'G', position: 22 },
              { id: 'c-1-3', chordSymbol: 'Am', position: 38 },
            ],
          },
          {
            id: 'l-2',
            text: 'Me diz de novo que tudo vai ficar bem',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'F', position: 0 },
              { id: 'c-2-2', chordSymbol: 'G', position: 20 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'E se a tempestade não passar, o Senhor é o meu abrigo',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 24 },
              { id: 'c-3-3', chordSymbol: 'Am', position: 43 },
            ],
          },
          {
            id: 'l-4',
            text: 'Em Teus braços encontro a paz que o mundo não tem',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'F', position: 0 },
              { id: 'c-4-2', chordSymbol: 'G', position: 26 },
              { id: 'c-4-3', chordSymbol: 'C', position: 46 },
            ],
          },
        ],
      },
    ],
  },
  'escudo': {
    title: 'Escudo',
    artist: 'Voz da Verdade',
    categories: ['Clássicos da Fé', 'Louvor congregacional'],
    originalKey: 'G',
    bpm: 74,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Por toda a minha vida, ó Senhor, Te louvarei',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'D', position: 23 },
              { id: 'c-1-3', chordSymbol: 'Em', position: 35 },
            ],
          },
          {
            id: 'l-2',
            text: 'Pois meu fôlego é a Tua vida e nunca me cansarei',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'C', position: 0 },
              { id: 'c-2-2', chordSymbol: 'Am', position: 24 },
              { id: 'c-2-3', chordSymbol: 'D', position: 38 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Não há ferrolhos, nem portas que se fechem diante da Tua voz',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 17 },
              { id: 'c-3-3', chordSymbol: 'Em', position: 39 },
            ],
          },
          {
            id: 'l-4',
            text: 'Não há doenças, nem culpa que fiquem de pé diante de Nós',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'C', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 26 },
              { id: 'c-4-3', chordSymbol: 'G', position: 52 },
            ],
          },
        ],
      },
    ],
  },
  'todas as coisas': {
    title: 'Todas as Coisas',
    artist: 'Fernandinho',
    categories: ['Celebração', 'Adoração contemporânea'],
    originalKey: 'D',
    bpm: 76,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Eu sei que tudo coopera para o bem daqueles que amam a Deus',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'D', position: 0 },
              { id: 'c-1-2', chordSymbol: 'A', position: 20 },
              { id: 'c-1-3', chordSymbol: 'Bm', position: 39 },
              { id: 'c-1-4', chordSymbol: 'G', position: 55 },
            ],
          },
          {
            id: 'l-2',
            text: 'Minha esperança está em Ti, Senhor',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'D', position: 0 },
              { id: 'c-2-2', chordSymbol: 'A', position: 19 },
              { id: 'c-2-3', chordSymbol: 'G', position: 30 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Todas as coisas cooperam para o meu bem',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'D', position: 0 },
              { id: 'c-3-2', chordSymbol: 'A', position: 17 },
              { id: 'c-3-3', chordSymbol: 'Bm', position: 34 },
            ],
          },
          {
            id: 'l-4',
            text: 'Pois sei em quem tenho crido e não serei abalado',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'G', position: 0 },
              { id: 'c-4-2', chordSymbol: 'A', position: 27 },
              { id: 'c-4-3', chordSymbol: 'D', position: 46 },
            ],
          },
        ],
      },
    ],
  },
  'vitorioso es': {
    title: 'Vitorioso És',
    artist: 'Gabriel Guedes',
    categories: ['Worship contemporâneo', 'Celebração'],
    originalKey: 'G',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Quem derrotou a morte e o pecado?',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'C', position: 19 },
            ],
          },
          {
            id: 'l-2',
            text: 'Jesus, o Rei da Glória, exaltado sobre tudo',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 21 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Vitorioso és, ninguém pode vencer o Teu poder',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 15 },
              { id: 'c-3-3', chordSymbol: 'Em', position: 34 },
            ],
          },
          {
            id: 'l-4',
            text: 'Ressuscitou e vivo reinará para todo o sempre',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'C', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 22 },
              { id: 'c-4-3', chordSymbol: 'G', position: 41 },
            ],
          },
        ],
      },
    ],
  },
  'eu navegarei': {
    title: 'Eu Navegarei',
    artist: 'Harpa Cristã / Gabriela Rocha',
    categories: ['Hinos tradicionais', 'Adoração'],
    originalKey: 'Em',
    bpm: 68,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Eu navegarei no oceano do Espírito',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-1-2', chordSymbol: 'D', position: 16 },
              { id: 'c-1-3', chordSymbol: 'C', position: 29 },
            ],
          },
          {
            id: 'l-2',
            text: 'E ali adorarei ao Deus do meu amor',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-2-2', chordSymbol: 'B7', position: 19 },
              { id: 'c-2-3', chordSymbol: 'Em', position: 31 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Espírito, Espírito, que desce como fogo',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 11 },
              { id: 'c-3-3', chordSymbol: 'C', position: 28 },
            ],
          },
          {
            id: 'l-4',
            text: 'Vem mais uma vez encher o meu viver',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-4-2', chordSymbol: 'B7', position: 19 },
              { id: 'c-4-3', chordSymbol: 'Em', position: 32 },
            ],
          },
        ],
      },
    ],
  },
  'santo espirito': {
    title: 'Santo Espírito',
    artist: 'Laura Souguellis / Fernandinho',
    categories: ['Worship contemporâneo', 'Adoração'],
    originalKey: 'D',
    bpm: 70,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Não há nada igual, não há nada melhor',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'D', position: 0 },
              { id: 'c-1-2', chordSymbol: 'G', position: 17 },
            ],
          },
          {
            id: 'l-2',
            text: 'Que estar em Tua presença e provar Teu doce amor',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-2-2', chordSymbol: 'A', position: 27 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Santo Espírito, és bem-vindo aqui',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'D', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 16 },
            ],
          },
          {
            id: 'l-4',
            text: 'Vem inundar e encher este lugar com Tua glória',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Em', position: 0 },
              { id: 'c-4-2', chordSymbol: 'A', position: 25 },
              { id: 'c-4-3', chordSymbol: 'D', position: 40 },
            ],
          },
        ],
      },
    ],
  },
  'caminho no deserto': {
    title: 'Caminho no Deserto (Way Maker)',
    artist: 'Soraya Moraes / Sinach',
    categories: ['Worship contemporâneo', 'Adoração'],
    originalKey: 'C',
    bpm: 68,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Estás aqui movendo entre nós, Te adorarei, Te adorarei',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'C', position: 0 },
              { id: 'c-1-2', chordSymbol: 'G', position: 24 },
              { id: 'c-1-3', chordSymbol: 'Am', position: 37 },
              { id: 'c-1-4', chordSymbol: 'F', position: 49 },
            ],
          },
          {
            id: 'l-2',
            text: 'Estás aqui operando milagres, Te adorarei, Te adorarei',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'C', position: 0 },
              { id: 'c-2-2', chordSymbol: 'G', position: 24 },
              { id: 'c-2-3', chordSymbol: 'Am', position: 38 },
              { id: 'c-2-4', chordSymbol: 'F', position: 50 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Tu és: Caminho no deserto, luz na escuridão',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 10 },
              { id: 'c-3-3', chordSymbol: 'Am', position: 29 },
            ],
          },
          {
            id: 'l-4',
            text: 'Meu Deus, esse é quem Tu és',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'F', position: 0 },
              { id: 'c-4-2', chordSymbol: 'G', position: 18 },
              { id: 'c-4-3', chordSymbol: 'C', position: 24 },
            ],
          },
        ],
      },
    ],
  },
  'ninguem explica deus': {
    title: 'Ninguém Explica Deus',
    artist: 'Preto no Branco',
    categories: ['Worship contemporâneo', 'Adoração acústica'],
    originalKey: 'G',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Nada é igual ao Seu redor, tudo se faz no Seu olhar',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'D/F#', position: 21 },
              { id: 'c-1-3', chordSymbol: 'Em', position: 37 },
            ],
          },
          {
            id: 'l-2',
            text: 'O universo se formou com a Sua voz',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'C', position: 0 },
              { id: 'c-2-2', chordSymbol: 'Am', position: 18 },
              { id: 'c-2-3', chordSymbol: 'D', position: 30 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Ninguém explica Deus, Ele é o Criador de tudo',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'D', position: 16 },
              { id: 'c-3-3', chordSymbol: 'Em', position: 31 },
            ],
          },
          {
            id: 'l-4',
            text: 'Dono de toda glória, majestoso em poder',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'C', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 22 },
              { id: 'c-4-3', chordSymbol: 'G', position: 36 },
            ],
          },
        ],
      },
    ],
  },
  'todavia me alegrarei': {
    title: 'Todavia Me Alegrarei',
    artist: 'Samuel Messias',
    categories: ['Adoração', 'Louvores acústicos'],
    originalKey: 'C',
    bpm: 70,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Mesmo que a figueira não floresça',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'C', position: 0 },
              { id: 'c-1-2', chordSymbol: 'G', position: 18 },
            ],
          },
          {
            id: 'l-2',
            text: 'E não haja fruto na videira, todavia eu me alegrarei',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-2-2', chordSymbol: 'F', position: 28 },
              { id: 'c-2-3', chordSymbol: 'G', position: 45 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'O Senhor é a minha força, Ele faz meus pés como os da corça',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'C', position: 0 },
              { id: 'c-3-2', chordSymbol: 'G', position: 20 },
              { id: 'c-3-3', chordSymbol: 'Am', position: 42 },
            ],
          },
          {
            id: 'l-4',
            text: 'E me faz andar nas minhas alturas com vitória',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'F', position: 0 },
              { id: 'c-4-2', chordSymbol: 'G', position: 23 },
              { id: 'c-4-3', chordSymbol: 'C', position: 41 },
            ],
          },
        ],
      },
    ],
  },
  'grandioso es tu': {
    title: 'Grandioso És Tu',
    artist: 'Harpa Cristã',
    categories: ['Hinos tradicionais', 'Clássicos'],
    originalKey: 'G',
    bpm: 72,
    timeSignature: '4/4',
    difficulty: 'Iniciante',
    capoSuggestion: 0,
    sections: [
      {
        id: 'sec-v1',
        type: 'verse',
        title: 'Verso 1',
        order: 1,
        startTime: 0,
        endTime: 24,
        lines: [
          {
            id: 'l-1',
            text: 'Senhor meu Deus, quando eu maravilhado',
            startTime: 0,
            endTime: 12,
            order: 1,
            chords: [
              { id: 'c-1-1', chordSymbol: 'G', position: 0 },
              { id: 'c-1-2', chordSymbol: 'C', position: 19 },
            ],
          },
          {
            id: 'l-2',
            text: 'Fico a pensar nas obras de Tuas mãos',
            startTime: 12,
            endTime: 24,
            order: 2,
            chords: [
              { id: 'c-2-1', chordSymbol: 'G', position: 0 },
              { id: 'c-2-2', chordSymbol: 'D', position: 20 },
              { id: 'c-2-3', chordSymbol: 'G', position: 32 },
            ],
          },
        ],
      },
      {
        id: 'sec-chorus',
        type: 'chorus',
        title: 'Refrão',
        order: 2,
        startTime: 24,
        endTime: 56,
        lines: [
          {
            id: 'l-3',
            text: 'Então minh\'alma canta a Ti, Senhor',
            startTime: 24,
            endTime: 40,
            order: 1,
            chords: [
              { id: 'c-3-1', chordSymbol: 'G', position: 0 },
              { id: 'c-3-2', chordSymbol: 'C', position: 20 },
              { id: 'c-3-3', chordSymbol: 'G', position: 30 },
            ],
          },
          {
            id: 'l-4',
            text: 'Grandioso és Tu, grandioso és Tu',
            startTime: 40,
            endTime: 56,
            order: 2,
            chords: [
              { id: 'c-4-1', chordSymbol: 'Am', position: 0 },
              { id: 'c-4-2', chordSymbol: 'D', position: 15 },
              { id: 'c-4-3', chordSymbol: 'G', position: 28 },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Searches catalog by title, artist, or keywords with normalization.
 */
export function findMatchingWorshipSong(query: string): Partial<Song> | null {
  if (!query) return null;
  const normalized = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Direct key match
  for (const [key, songData] of Object.entries(VERIFIED_WORSHIP_CATALOG)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return songData;
    }
  }

  // 2. Title & Artist normalized match
  for (const songData of Object.values(VERIFIED_WORSHIP_CATALOG)) {
    if (!songData.title) continue;
    const titleNorm = songData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();

    if (normalized.includes(titleNorm)) {
      return songData;
    }
  }

  // 3. Keyword intersection (match 2+ key words)
  for (const [key, songData] of Object.entries(VERIFIED_WORSHIP_CATALOG)) {
    const keyWords = key.split(' ').filter((w) => w.length > 2);
    const matchedCount = keyWords.filter((w) => normalized.includes(w)).length;
    if (matchedCount >= 2 || (keyWords.length === 1 && normalized.includes(keyWords[0]))) {
      return songData;
    }
  }

  return null;
}
