import { Track } from '@/types/domain/music';
import { AudioMetrics, PlaylistDNA } from '@/types/domain/playlist';

class PlaylistDnaService {
  /**
   * Função auxiliar para gerar um número determinístico (0.0 a 1.0) baseado em uma string
   */
  private getDeterministicHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 1000) / 1000;
  }

  /**
   * Analisa os metadados de uma faixa individual gerando suas métricas de áudio determinísticas
   */
  public analyzeTrack(track: Track): AudioMetrics {
    const textToSearch = `${track.title} ${track.artistName} ${track.genre || ''}`.toLowerCase();
    const seed = this.getDeterministicHash(track.id);

    // Heurística de alta energia (Trap, Funk, Rock, Metal, Dance, Drill)
    if (
      textToSearch.includes('trap') ||
      textToSearch.includes('funk') ||
      textToSearch.includes('drill') ||
      textToSearch.includes('rock') ||
      textToSearch.includes('metal') ||
      textToSearch.includes('electronic') ||
      textToSearch.includes('dance') ||
      textToSearch.includes('banger')
    ) {
      return {
        energy: Math.round(80 + seed * 18),
        danceability: Math.round(75 + seed * 20),
        atmosphere: Math.round(60 + seed * 25),
        acousticness: Math.round(5 + seed * 20),
        instrumentalness: Math.round(20 + seed * 40),
        valenceMood: Math.round(55 + seed * 35),
        tempoBpm: Math.round(128 + seed * 26),
      };
    }

    // Heurística de baixa energia / acústico / chill (Lofi, MPB, Jazz, Acústico, Piano, Ambient)
    if (
      textToSearch.includes('lofi') ||
      textToSearch.includes('chill') ||
      textToSearch.includes('acústico') ||
      textToSearch.includes('acoustic') ||
      textToSearch.includes('jazz') ||
      textToSearch.includes('piano') ||
      textToSearch.includes('ambient') ||
      textToSearch.includes('mpb') ||
      textToSearch.includes('calm') ||
      textToSearch.includes('slow')
    ) {
      return {
        energy: Math.round(25 + seed * 25),
        danceability: Math.round(35 + seed * 25),
        atmosphere: Math.round(80 + seed * 18),
        acousticness: Math.round(75 + seed * 22),
        instrumentalness: Math.round(40 + seed * 50),
        valenceMood: Math.round(40 + seed * 30),
        tempoBpm: Math.round(75 + seed * 22),
      };
    }

    // Heurística de energia média / urbana / pop / rap / r&b
    if (
      textToSearch.includes('rap') ||
      textToSearch.includes('hip-hop') ||
      textToSearch.includes('r&b') ||
      textToSearch.includes('pop') ||
      textToSearch.includes('soul') ||
      textToSearch.includes('reggae')
    ) {
      return {
        energy: Math.round(62 + seed * 20),
        danceability: Math.round(70 + seed * 20),
        atmosphere: Math.round(68 + seed * 22),
        acousticness: Math.round(20 + seed * 30),
        instrumentalness: Math.round(10 + seed * 35),
        valenceMood: Math.round(55 + seed * 30),
        tempoBpm: Math.round(96 + seed * 28),
      };
    }

    // Fallback determinístico coerente
    return {
      energy: Math.round(50 + seed * 35),
      danceability: Math.round(55 + seed * 30),
      atmosphere: Math.round(60 + seed * 30),
      acousticness: Math.round(25 + seed * 45),
      instrumentalness: Math.round(15 + seed * 40),
      valenceMood: Math.round(50 + seed * 35),
      tempoBpm: Math.round(92 + seed * 35),
    };
  }

  /**
   * Computa a matriz analítica completa do DNA da Playlist
   */
  public computePlaylistDNA(playlistId: string, tracks: Track[]): PlaylistDNA {
    if (!tracks || tracks.length === 0) {
      return {
        playlistId,
        archetypeTitle: 'DNA em Espera',
        archetypeDescription: 'Adicione músicas à sua playlist para desbloquear o diagnóstico do seu DNA sonoro.',
        energy: 0,
        danceability: 0,
        atmosphere: 0,
        moodValence: 0,
        acousticness: 0,
        vocalsRatio: 0,
        tempoAvg: 0,
        artistDiversityRatio: 0,
        genreDiversityRatio: 0,
        uniqueArtistCount: 0,
        totalTracks: 0,
        isAnalyzed: false,
      };
    }

    // Analisa cada faixa
    const trackMetrics = tracks.map((t) => this.analyzeTrack(t));

    // Médias aritméticas
    const sum = trackMetrics.reduce(
      (acc, m) => ({
        energy: acc.energy + m.energy,
        danceability: acc.danceability + m.danceability,
        atmosphere: acc.atmosphere + m.atmosphere,
        moodValence: acc.moodValence + m.valenceMood,
        acousticness: acc.acousticness + m.acousticness,
        instrumentalness: acc.instrumentalness + m.instrumentalness,
        tempoBpm: acc.tempoBpm + m.tempoBpm,
      }),
      {
        energy: 0,
        danceability: 0,
        atmosphere: 0,
        moodValence: 0,
        acousticness: 0,
        instrumentalness: 0,
        tempoBpm: 0,
      }
    );

    const count = tracks.length;
    const energy = Math.round(sum.energy / count);
    const danceability = Math.round(sum.danceability / count);
    const atmosphere = Math.round(sum.atmosphere / count);
    const moodValence = Math.round(sum.moodValence / count);
    const acousticness = Math.round(sum.acousticness / count);
    const vocalsRatio = Math.max(0, 100 - Math.round(sum.instrumentalness / count));
    const tempoAvg = Math.round(sum.tempoBpm / count);

    // Diversidade de Artistas e Gêneros
    const uniqueArtists = new Set(tracks.map((t) => t.artistName.trim().toLowerCase())).size;
    const uniqueGenres = new Set(tracks.map((t) => (t.genre || 'Desconhecido').trim().toLowerCase())).size;

    const artistDiversityRatio = Number((uniqueArtists / count).toFixed(2));
    const genreDiversityRatio = Number((uniqueGenres / count).toFixed(2));

    // Determina o Arquétipo da Playlist
    let archetypeTitle = 'Fluxo Harmônico Equilibrado';
    let archetypeDescription = 'Mistura balanceada de intensidades, timbres orgânicos e cadência versátil.';

    if (energy >= 75 && danceability >= 70) {
      archetypeTitle = '⚡ Pulso Eletrizante & Beat Urbano';
      archetypeDescription = 'Graves contundentes, vocais afiados e alta voltagem rítmica para momentos de pico.';
    } else if (acousticness >= 65 && energy <= 50) {
      archetypeTitle = '🎻 Santuário Acústico & Intimista';
      archetypeDescription = 'Texturas orgânicas, instrumentação refinada e atmosfera calorosa e introspectiva.';
    } else if (atmosphere >= 75 && energy <= 65) {
      archetypeTitle = '🌌 Imersão Atmosférica Noturna';
      archetypeDescription = 'Reverbs expansivos, ambiência envolvente e cadência cadenciada para viagens mentais.';
    } else if (danceability >= 75) {
      archetypeTitle = '🕺 Groove Hipnótico & Movimento';
      archetypeDescription = 'Cadência pulsante projetada para ritmo contínuo, foco corporal e fluidez.';
    } else if (energy >= 70) {
      archetypeTitle = '🔥 Alta Propulsão & Foco';
      archetypeDescription = 'Vibração ascendente e ritmo dinâmico para acelerar a produtividade.';
    }

    return {
      playlistId,
      archetypeTitle,
      archetypeDescription,
      energy,
      danceability,
      atmosphere,
      moodValence,
      acousticness,
      vocalsRatio,
      tempoAvg,
      artistDiversityRatio,
      genreDiversityRatio,
      uniqueArtistCount: uniqueArtists,
      totalTracks: count,
      isAnalyzed: true,
    };
  }
}

export const playlistDnaService = new PlaylistDnaService();
