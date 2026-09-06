const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MooSic/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function getDeezerArtist(query) {
  const data = await fetchJson(`https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}&limit=1`);
  if (data && data.data && data.data[0]) {
    const item = data.data[0];
    const pic = item.picture_xl || item.picture_big;
    const ok = await checkUrl(pic);
    if (ok) return { name: item.name, avatar: pic };
  }
  return null;
}

async function getDeezerAlbum(query) {
  const data = await fetchJson(`https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=1`);
  if (data && data.data && data.data[0]) {
    const item = data.data[0];
    const cover = item.cover_xl || item.cover_big;
    const ok = await checkUrl(cover);
    if (ok) return { title: item.title, artist: item.artist?.name, cover };
  }
  return null;
}

const ARTIST_QUERIES = [
  { id: 'matue', name: 'Matuê', genre: 'Trap Brasil / Hip-Hop', bio: 'Matheus Brasileiro Aguiar, pioneiro do trap nacional e fundador da 30PRAUM.', origin: 'Fortaleza, CE - Brasil', listeners: '8.4M ouvintes mensais', featuredTrack: 'Máquina do Tempo', topAlbums: ['333', 'Máquina do Tempo'] },
  { id: 'the_weeknd', name: 'The Weeknd', genre: 'R&B / Synthpop', bio: 'Abel Makkonen Tesfaye, ícone global do R&B e pop contemporâneo.', origin: 'Toronto - Canadá', listeners: '112.5M ouvintes mensais', featuredTrack: 'Blinding Lights', topAlbums: ['After Hours', 'Starboy', 'Dawn FM'] },
  { id: 'bk', name: "BK'", genre: 'Rap Nacional / Lírica Urbana', bio: 'Abebe Bikila, o BK\', uma das vozes líricas mais aclamadas do hip-hop nacional.', origin: 'Rio de Janeiro, RJ - Brasil', listeners: '3.6M ouvintes mensais', featuredTrack: 'Planos', topAlbums: ['ICARUS', 'Castelos & Ruínas', 'Gigantes'] },
  { id: 'dua_lipa', name: 'Dua Lipa', genre: 'Disco Pop / Dance-Pop', bio: 'Cantora britânica vencedora de múltiplos Grammys, ícone nu-disco mundial.', origin: 'Londres - Reino Unido', listeners: '68.3M ouvintes mensais', featuredTrack: 'Levitating', topAlbums: ['Future Nostalgia', 'Radical Optimism'] },
  { id: 'djonga', name: 'Djonga', genre: 'Rap Nacional / Hardcore Hip-Hop', bio: 'Gustavo Pereira Neves, o Djonga, contundente e histórico letrista do rap brasileiro.', origin: 'Belo Horizonte, MG - Brasil', listeners: '4.2M ouvintes mensais', featuredTrack: 'Leal', topAlbums: ['Ladrão', 'Heresia', 'O Menino que Queria Ser Deus'] },
  { id: 'sabotage', name: 'Sabotage', genre: 'Rap Nacional / Clássico & Patrimônio', bio: 'Mauro Mateus dos Santos, o eterno Maestro do Canão, patrimônio da cultura brasileira.', origin: 'São Paulo, SP - Brasil', listeners: '1.8M ouvintes mensais', featuredTrack: 'Um Bom Lugar', topAlbums: ['Rap É Compromisso'] },
  { id: 'racionais_mcs', name: "Racionais MC's", genre: 'Rap Nacional / Crônica Social', bio: 'O maior expoente cultural do rap brasileiro, liderado por Mano Brown.', origin: 'São Paulo, SP - Brasil', listeners: '5.1M ouvintes mensais', featuredTrack: 'Vida Loka (Pt. 1)', topAlbums: ['Sobrevivendo no Inferno', 'Nada como um Dia após o Outro Dia'] },
  { id: 'criolo', name: 'Criolo', genre: 'MPB / Rap / Samba', bio: 'Cantor, compositor e poeta paulistano aclamado internacionalmente.', origin: 'São Paulo, SP - Brasil', listeners: '2.3M ouvintes mensais', featuredTrack: 'Não Existe Amor em SP', topAlbums: ['Nó na Orelha', 'Convoque Seu Buda'] },
  { id: 'daft_punk', name: 'Daft Punk', genre: 'Electronic / French House', bio: 'Lendário duo francês pioneiro da música eletrônica mundial.', origin: 'Paris - França', listeners: '23.8M ouvintes mensais', featuredTrack: 'Instant Crush', topAlbums: ['Random Access Memories', 'Discovery'] },
  { id: 'frank_ocean', name: 'Frank Ocean', genre: 'Alternative R&B / Neo-Soul', bio: 'Compositor e vanguardista cultuado mundialmente por Blonde e Channel Orange.', origin: 'Nova Orleans, LA - EUA', listeners: '35.4M ouvintes mensais', featuredTrack: 'Pink + White', topAlbums: ['Blonde', 'Channel Orange'] },
  { id: 'lofi_girl', name: 'Lofi Girl', genre: 'Chillhop / Lo-Fi Beats', bio: 'O maior hub global de música lo-fi e frequências de estudo.', origin: 'Paris - França', listeners: '14.2M ouvintes mensais', featuredTrack: 'Study Beats', topAlbums: ['Morning Coffee', 'Midnight Study'] },
  { id: 'teto', name: 'Teto', genre: 'Trap Brasil / Melodic Trap', bio: 'Fenômeno do trap nacional e destaque da 30PRAUM.', origin: 'Jacobina, BA - Brasil', listeners: '6.5M ouvintes mensais', featuredTrack: 'Minha Vida É Um Filme', topAlbums: ['Prévia'] },
  { id: 'wiu', name: 'WIU', genre: 'Trap Brasil / Autotune R&B', bio: 'Produtor musical e cantor cearense, arquiteto de múltiplos sucessos.', origin: 'Fortaleza, CE - Brasil', listeners: '6.1M ouvintes mensais', featuredTrack: 'Coração de Gelo', topAlbums: ['Manual de Como Amar Errado'] },
  { id: 'veigh', name: 'Veigh', genre: 'Trap Brasil / R&B Urbano', bio: 'Fenômeno do streaming nacional com Dos Prédios Deluxe.', origin: 'Itapevi, SP - Brasil', listeners: '8.9M ouvintes mensais', featuredTrack: 'Novo Balanço', topAlbums: ['Dos Prédios Deluxe'] },
  { id: 'kayblack', name: 'KayBlack', genre: 'Trap / Funk / R&B Urbano', bio: 'Cantor e compositor paulista conhecido pelo timbre marcante no EP Contradições.', origin: 'São Paulo, SP - Brasil', listeners: '7.2M ouvintes mensais', featuredTrack: 'Segredo', topAlbums: ['Contradições'] },
  { id: 'filipe_ret', name: 'Filipe Ret', genre: 'Trap / Rap Nacional', bio: 'Ícone do rap e trap carioca, fundador da NadaMal.', origin: 'Rio de Janeiro, RJ - Brasil', listeners: '8.1M ouvintes mensais', featuredTrack: 'Melhor Agora', topAlbums: ['LUME', 'Imaterial', 'Audaz'] },
  { id: 'mc_cabelinho', name: 'MC Cabelinho', genre: 'Trap / Funk Carioca / R&B', bio: 'Destaque na conexão entre o trap e o funk carioca.', origin: 'Rio de Janeiro, RJ - Brasil', listeners: '7.8M ouvintes mensais', featuredTrack: 'Minha Cura', topAlbums: ['LITTLE LOVE'] },
  { id: 'orochi', name: 'Orochi', genre: 'Trap Brasil / Mainstreet', bio: 'Fundador da Mainstreet Records e campeão de rimas.', origin: 'São Gonçalo, RJ - Brasil', listeners: '6.9M ouvintes mensais', featuredTrack: 'Amor de Fim de Noite', topAlbums: ['Vida Cara', 'Lobo'] },
  { id: 'caetano_veloso', name: 'Caetano Veloso', genre: 'MPB / Tropicália', bio: 'Patrimônio vivo da música popular brasileira e da Tropicália.', origin: 'Santo Amaro, BA - Brasil', listeners: '4.8M ouvintes mensais', featuredTrack: 'Você é Linda', topAlbums: ['Transa', 'Tropicália'] },
  { id: 'tim_maia', name: 'Tim Maia', genre: 'Soul Brasileiro / Funk / MPB', bio: 'O eterno Síndico do soul e funk brasileiro.', origin: 'Rio de Janeiro, RJ - Brasil', listeners: '3.9M ouvintes mensais', featuredTrack: 'Não Quero Dinheiro (Só Quero Amar)', topAlbums: ['Tim Maia Racional Vol. 1', 'O Descobridor dos Sete Mares'] },
  { id: 'liniker', name: 'Liniker', genre: 'MPB / Soul Brasileiro / Samba', bio: 'Cantora e compositora brasileira vencedora do Grammy Latino.', origin: 'Araraquara, SP - Brasil', listeners: '3.8M ouvintes mensais', featuredTrack: 'Caju', topAlbums: ['CAJU', 'Indigo Borboleta Anil'] },
  { id: 'travis_scott', name: 'Travis Scott', genre: 'Trap / Hip-Hop Psicodélico', bio: 'Visionário norte-americano por trás de ASTROWORLD e UTOPIA.', origin: 'Houston, TX - EUA', listeners: '74.2M ouvintes mensais', featuredTrack: 'FE!N', topAlbums: ['UTOPIA', 'ASTROWORLD', 'Rodeo'] },
  { id: 'kendrick_lamar', name: 'Kendrick Lamar', genre: 'Conscious Hip-Hop', bio: 'Ganhador do Prêmio Pulitzer e múltiplos Grammys.', origin: 'Compton, CA - EUA', listeners: '65.8M ouvintes mensais', featuredTrack: 'Not Like Us', topAlbums: ['DAMN.', 'good kid, m.A.A.d city', 'GNX'] },
  { id: 'billie_eilish', name: 'Billie Eilish', genre: 'Alt-Pop / Dark Wave', bio: 'Cantora e compositora que redefiniu a estética pop global.', origin: 'Los Angeles, CA - EUA', listeners: '98.6M ouvintes mensais', featuredTrack: 'BIRDS OF A FEATHER', topAlbums: ['HIT ME HARD AND SOFT', 'Happier Than Ever'] },
  { id: 'arctic_monkeys', name: 'Arctic Monkeys', genre: 'Indie Rock', bio: 'Banda britânica de rock de Sheffield, liderada por Alex Turner.', origin: 'Sheffield - Reino Unido', listeners: '48.5M ouvintes mensais', featuredTrack: 'Do I Wanna Know?', topAlbums: ['AM', 'Favourite Worst Nightmare'] },
  { id: 'tame_impala', name: 'Tame Impala', genre: 'Psychedelic Pop / Synth-Pop', bio: 'Projeto psicodélico e visionário de Kevin Parker.', origin: 'Perth - Austrália', listeners: '32.1M ouvintes mensais', featuredTrack: 'The Less I Know The Better', topAlbums: ['Currents', 'The Slow Rush'] },
  { id: 'sza', name: 'SZA', genre: 'R&B Contemporâneo / Neo-Soul', bio: 'Líder global da TDE com os aclamados álbuns Ctrl e SOS.', origin: 'St. Louis, MO - EUA', listeners: '72.4M ouvintes mensais', featuredTrack: 'Kill Bill', topAlbums: ['SOS', 'Ctrl'] },
  { id: 'queen', name: 'Queen', genre: 'Classic Rock / Progressive Rock', bio: 'Lendária banda britânica liderada por Freddie Mercury.', origin: 'Londres - Reino Unido', listeners: '51.3M ouvintes mensais', featuredTrack: 'Bohemian Rhapsody', topAlbums: ['A Night at the Opera', 'The Game'] },
];

const ALBUM_QUERIES = [
  { id: 'maquina_do_tempo', title: 'Máquina do Tempo', query: 'Matue Maquina do Tempo', artist: 'Matuê', year: 2020, label: '30PRAUM / Sony Music', genre: 'Trap Brasil', tracks: 7, badge: 'Master 24b / 48kHz' },
  { id: 'matue_333', title: '333', query: 'Matue 333', artist: 'Matuê', year: 2024, label: '30PRAUM', genre: 'Trap Brasil', tracks: 12, badge: 'Master 24b / 96kHz' },
  { id: 'after_hours', title: 'After Hours', query: 'The Weeknd After Hours', artist: 'The Weeknd', year: 2020, label: 'XO / Republic Records', genre: 'R&B / Synthwave', tracks: 14, badge: 'Spatial Audio 24b' },
  { id: 'starboy', title: 'Starboy', query: 'The Weeknd Starboy', artist: 'The Weeknd', year: 2016, label: 'XO / Republic Records', genre: 'R&B / Electro-Pop', tracks: 18, badge: 'Master 24b' },
  { id: 'dawn_fm', title: 'Dawn FM', query: 'The Weeknd Dawn FM', artist: 'The Weeknd', year: 2022, label: 'XO / Republic Records', genre: 'Synth-Pop / Dance', tracks: 16, badge: 'Spatial Audio 24b' },
  { id: 'icarus', title: 'ICARUS', query: 'BK ICARUS', artist: "BK'", year: 2022, label: 'Gigantes / Altafonte', genre: 'Rap Nacional', tracks: 13, badge: 'Hi-Res Lossless' },
  { id: 'castelos_e_ruinas', title: 'Castelos & Ruínas', query: 'BK Castelos e Ruinas', artist: "BK'", year: 2016, label: 'Pirâmide Perdida', genre: 'Rap Nacional', tracks: 13, badge: 'Studio Master 24b' },
  { id: 'gigantes', title: 'Gigantes', query: 'BK Gigantes', artist: "BK'", year: 2018, label: 'Pirâmide Perdida', genre: 'Rap Nacional', tracks: 12, badge: 'Master 24b' },
  { id: 'future_nostalgia', title: 'Future Nostalgia', query: 'Dua Lipa Future Nostalgia', artist: 'Dua Lipa', year: 2020, label: 'Warner Records', genre: 'Nu-Disco / Pop', tracks: 11, badge: 'Spatial Audio 24b' },
  { id: 'radical_optimism', title: 'Radical Optimism', query: 'Dua Lipa Radical Optimism', artist: 'Dua Lipa', year: 2024, label: 'Warner Records', genre: 'Pop Psicodélico', tracks: 11, badge: 'Spatial Audio 24b' },
  { id: 'ladrao', title: 'Ladrão', query: 'Djonga Ladrao', artist: 'Djonga', year: 2019, label: 'Ceia Ent. / A Quadrilha', genre: 'Rap Nacional', tracks: 10, badge: 'Studio Master 24b' },
  { id: 'heresia', title: 'Heresia', query: 'Djonga Heresia', artist: 'Djonga', year: 2017, label: 'Ceia Ent.', genre: 'Rap Nacional', tracks: 10, badge: 'Master 24b' },
  { id: 'o_menino_que_queria_ser_deus', title: 'O Menino que Queria Ser Deus', query: 'Djonga O Menino que Queria Ser Deus', artist: 'Djonga', year: 2018, label: 'Ceia Ent.', genre: 'Rap Nacional', tracks: 10, badge: 'Master 24b' },
  { id: 'rap_e_compromisso', title: 'Rap É Compromisso', query: 'Sabotage Rap e Compromisso', artist: 'Sabotage', year: 2000, label: 'Cosa Nostra / Som Brasil', genre: 'Rap Nacional Clássico', tracks: 11, badge: 'Remaster 24b' },
  { id: 'nada_como_um_dia', title: 'Nada como um Dia após o Outro Dia', query: 'Racionais Nada como um Dia', artist: "Racionais MC's", year: 2002, label: 'Cosa Nostra Fonográfica', genre: 'Rap Nacional', tracks: 21, badge: 'Master Duplo 24b' },
  { id: 'sobrevivendo_no_inferno', title: 'Sobrevivendo no Inferno', query: 'Racionais Sobrevivendo no Inferno', artist: "Racionais MC's", year: 1997, label: 'Cosa Nostra Fonográfica', genre: 'Rap Nacional', tracks: 12, badge: 'Patrimônio Nacional 24b' },
  { id: 'no_na_orelha', title: 'Nó na Orelha', query: 'Criolo No na Orelha', artist: 'Criolo', year: 2011, label: 'Oloko Records', genre: 'MPB / Rap / Samba', tracks: 10, badge: 'Audiophile Master 24b' },
  { id: 'random_access_memories', title: 'Random Access Memories', query: 'Daft Punk Random Access Memories', artist: 'Daft Punk', year: 2013, label: 'Columbia / Daft Life', genre: 'Disco / Funk / Electronic', tracks: 13, badge: 'Studio Master 24b' },
  { id: 'discovery', title: 'Discovery', query: 'Daft Punk Discovery', artist: 'Daft Punk', year: 2001, label: 'Virgin / Daft Life', genre: 'French House / Synth', tracks: 14, badge: 'Master 24b' },
  { id: 'blonde', title: 'Blonde', query: 'Frank Ocean Blonde', artist: 'Frank Ocean', year: 2016, label: 'Boys Don\'t Cry', genre: 'Alternative R&B', tracks: 17, badge: 'Master Lossless' },
  { id: 'channel_orange', title: 'Channel Orange', query: 'Frank Ocean Channel Orange', artist: 'Frank Ocean', year: 2012, label: 'Def Jam', genre: 'Neo-Soul / R&B', tracks: 17, badge: 'Hi-Res 24b' },
  { id: 'manual_de_como_amar_errado', title: 'Manual de Como Amar Errado', query: 'WIU Manual de Como Amar Errado', artist: 'WIU', year: 2022, label: '30PRAUM', genre: 'Trap / R&B', tracks: 10, badge: 'Master 24b' },
  { id: 'dos_predios_deluxe', title: 'Dos Prédios Deluxe', query: 'Veigh Dos Predios Deluxe', artist: 'Veigh', year: 2023, label: 'Supernova Ent.', genre: 'Trap Brasil', tracks: 19, badge: 'Master 24b' },
  { id: 'filipe_ret_lume', title: 'LUME', query: 'Filipe Ret LUME', artist: 'Filipe Ret', year: 2022, label: 'NadaMal / Som Livre', genre: 'Trap Brasil', tracks: 11, badge: 'Master 24b' },
  { id: 'utopia', title: 'UTOPIA', query: 'Travis Scott UTOPIA', artist: 'Travis Scott', year: 2023, label: 'Cactus Jack / Epic Records', genre: 'Hip-Hop / Trap', tracks: 19, badge: 'Spatial Audio 24b' },
  { id: 'astroworld', title: 'ASTROWORLD', query: 'Travis Scott ASTROWORLD', artist: 'Travis Scott', year: 2018, label: 'Cactus Jack / Grand Hustle', genre: 'Trap / Psicodélico', tracks: 17, badge: 'Master 24b' },
  { id: 'kendrick_damn', title: 'DAMN.', query: 'Kendrick Lamar DAMN', artist: 'Kendrick Lamar', year: 2017, label: 'Top Dawg / Aftermath', genre: 'Hip-Hop', tracks: 14, badge: 'Master 24b' },
  { id: 'billie_hit_me_hard_and_soft', title: 'HIT ME HARD AND SOFT', query: 'Billie Eilish HIT ME HARD AND SOFT', artist: 'Billie Eilish', year: 2024, label: 'Darkroom / Interscope Records', genre: 'Alt-Pop', tracks: 10, badge: 'Spatial Audio 24b' },
  { id: 'arctic_monkeys_am', title: 'AM', query: 'Arctic Monkeys AM', artist: 'Arctic Monkeys', year: 2013, label: 'Domino Recording Co.', genre: 'Indie Rock', tracks: 12, badge: 'Studio Master 24b' },
  { id: 'tame_impala_currents', title: 'Currents', query: 'Tame Impala Currents', artist: 'Tame Impala', year: 2015, label: 'Modular / Interscope', genre: 'Psychedelic Pop', tracks: 13, badge: 'Master 24b' },
];

(async () => {
  console.log('Resolving Artists...');
  const resolvedArtists = {};
  for (const a of ARTIST_QUERIES) {
    const res = await getDeezerArtist(a.name);
    if (res && res.avatar) {
      console.log(`[OK] Artist: ${a.name} -> ${res.avatar}`);
      resolvedArtists[a.id] = {
        ...a,
        avatarUrl: res.avatar,
        bannerUrl: res.avatar,
        normalizedNames: [a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), a.id],
        verified: true,
      };
    } else {
      console.log(`[FAIL] Artist: ${a.name}`);
    }
  }

  console.log('\nResolving Albums...');
  const resolvedAlbums = {};
  for (const alb of ALBUM_QUERIES) {
    const res = await getDeezerAlbum(alb.query);
    if (res && res.cover) {
      console.log(`[OK] Album: ${alb.title} -> ${res.cover}`);
      resolvedAlbums[alb.id] = {
        id: alb.id,
        title: alb.title,
        normalizedTitles: [alb.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), alb.id],
        artistName: alb.artist,
        coverUrl: res.cover,
        releaseYear: alb.year,
        label: alb.label,
        genre: alb.genre,
        totalTracks: alb.tracks,
        hiResBadge: alb.badge,
      };
    } else {
      console.log(`[FAIL] Album: ${alb.title}`);
    }
  }

  fs.writeFileSync('scratch/resolved_data.json', JSON.stringify({ artists: resolvedArtists, albums: resolvedAlbums }, null, 2));
  console.log('\nDone! Saved to scratch/resolved_data.json');
})();
