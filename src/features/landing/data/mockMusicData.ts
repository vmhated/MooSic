export interface MockTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  accent: string; // Hex color for subtle ambient backlight
  accentRgb: string;
  duration: string;
  genre: string;
  badge?: string;
  lyricsSnippet?: {
    time: string;
    text: string;
    highlight?: boolean;
  }[];
}

export const MOCK_HERO_TRACKS: MockTrack[] = [
  {
    id: 'racionais-vida-loka',
    title: 'Vida Loka (Pt. 1)',
    artist: "Racionais MC's",
    album: 'Nada como um Dia após o Outro Dia',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/ca/fd/3fcafdad-07c1-c752-7878-39dfd32b3b28/0.jpg/600x600bb.jpg',
    accent: '#8B5CF6', // MooSic Purple
    accentRgb: '139, 92, 246',
    duration: '5:03',
    genre: 'Rap Nacional / Hip-Hop',
    badge: 'MooSic Masterpiece',
    lyricsSnippet: [
      { time: '0:15', text: 'Fé em Deus que ele é justo, ei, irmão, nunca se esqueça' },
      { time: '0:32', text: 'Na caminhada tem que ser um passo de cada vez', highlight: true },
      { time: '0:50', text: 'Vida loka, cabulosa, o tempo passa e a gente aprende' },
      { time: '1:10', text: 'Um brinde aos guerreiros que estão na luta' },
    ],
  },
  {
    id: 'sabotage-bom-lugar',
    title: 'Um Bom Lugar',
    artist: 'Sabotage',
    album: 'Rap É Compromisso',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/ea/09/bbea09b3-1cae-5bd6-39c1-13046493ceca/702730616994_cover.jpg/600x600bb.jpg',
    accent: '#3B82F6', // Electric Blue
    accentRgb: '59, 130, 246',
    duration: '5:05',
    genre: 'Rap Nacional / Clássico',
    badge: 'Patrimônio da Quebrada',
    lyricsSnippet: [
      { time: '0:12', text: 'Um bom lugar se constrói com humildade, pé no chão' },
      { time: '0:30', text: 'Respeito e atitude, no Brooklin ou no Japão', highlight: true },
      { time: '0:48', text: 'O rap é compromisso, não é viagem' },
      { time: '1:05', text: 'Na rima da quebrada a nossa voz tem mensagem' },
    ],
  },
  {
    id: 'bk-castelos-ruinas',
    title: 'Planos',
    artist: "BK'",
    album: 'Castelos & Ruínas',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5c/a5/92/5ca592ca-ed9b-441a-a9d7-3a8930a8dff4/689407286431.jpg/600x600bb.jpg',
    accent: '#EC4899', // Vivid Magenta
    accentRgb: '236, 72, 153',
    duration: '4:12',
    genre: 'Rap / Poesia Urbana',
    badge: 'Áudio 24-Bit',
    lyricsSnippet: [
      { time: '0:14', text: 'Fizemos planos pra vida inteira' },
      { time: '0:35', text: 'Construindo impérios do topo da ladeira', highlight: true },
      { time: '0:55', text: 'Na selva de concreto cada vitória é rara' },
      { time: '1:15', text: 'Seguindo em frente sem perder a nossa cara' },
    ],
  },
  {
    id: 'matue-333',
    title: 'Máquina do Tempo',
    artist: 'Matuê',
    album: '333 / Máquina do Tempo',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/ac/95/9cac9567-6ffa-e640-d619-46564733b11f/196874248850.jpg/600x600bb.jpg',
    accent: '#F59E0B', // Amber
    accentRgb: '245, 158, 11',
    duration: '3:30',
    genre: 'Trap / Rap Nacional',
    badge: 'Lossless Master',
    lyricsSnippet: [
      { time: '0:15', text: 'Viagens no tempo, vivendo além do que sonhei' },
      { time: '0:32', text: 'Conectando frequências que ninguém nunca ouviu', highlight: true },
      { time: '0:50', text: 'Do Ceará pro mundo na velocidade da luz' },
      { time: '1:08', text: 'A música não para e a energia nos conduz' },
    ],
  },
  {
    id: 'criolo-no-orelha',
    title: 'Não Existe Amor em SP',
    artist: 'Criolo',
    album: 'Nó na Orelha',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/88/93/d2889362-b21e-5312-3a3a-7c3b0b1de635/8445162082815_Cover.jpg/600x600bb.jpg',
    accent: '#10B981', // Emerald Mint
    accentRgb: '16, 185, 129',
    duration: '4:40',
    genre: 'MPB / Rap / Crônica Urbana',
    badge: 'Studio Hi-Fi',
    lyricsSnippet: [
      { time: '0:15', text: 'Não existe amor em SP, os bares estão cheios de almas tão vazias' },
      { time: '0:35', text: 'A ganância deita e rola, a cidade não dorme', highlight: true },
      { time: '0:55', text: 'Um labirinto místico onde a rima se expande' },
      { time: '1:15', text: 'No meio da cinzenta a poesia ainda renasce' },
    ],
  },
  {
    id: 'daft-punk-ram',
    title: 'Instant Crush',
    artist: 'Daft Punk feat. Julian Casablancas',
    album: 'Random Access Memories',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg',
    accent: '#A855F7', // Deep Violet
    accentRgb: '168, 85, 247',
    duration: '5:37',
    genre: 'Synth-Pop / Electronic',
    badge: 'Spatial Audio 24-Bit',
    lyricsSnippet: [
      { time: '0:20', text: "I didn't want to be the one to forget" },
      { time: '0:42', text: 'I thought about what you said, all the things that we had', highlight: true },
      { time: '1:05', text: 'And we will never be alone again' },
      { time: '1:25', text: "Cause it's all inside the infinite flow" },
    ],
  },
];
