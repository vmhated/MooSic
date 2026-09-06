import { Track } from '@/types/domain/music';
import { FlowTrack, FlowRecommendationReason, RecommendationContext } from '@/types/domain/flow';
import { musicService } from '@/services/music/musicService';
import { getArtistAffinity, normalizeArtistKey } from './relatedArtistsMap';
import { logger } from '@/utils/logger';

function normalizeTrackKey(track: { title: string; artistName: string }): string {
  const normTitle = track.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  const normArtist = track.artistName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  return `${normTitle}__${normArtist}`;
}

interface ScoredCandidate {
  track: Track;
  reason: FlowRecommendationReason;
  score: number;
}

export class MooSicFlowService {
  /**
   * Gera uma sequência harmônica de recomendações para o MooSic Flow
   */
  async generateFlow(context: RecommendationContext): Promise<FlowTrack[]> {
    const {
      seedTrack,
      currentTrack,
      recentTrackIds = [],
      recentArtistNames = [],
      excludeTrackIds = [],
      limit = 12,
    } = context;

    if (!seedTrack) {
      return [];
    }

    const anchorTrack = currentTrack || seedTrack;
    const seedArtist = seedTrack.artistName;
    const affinity = getArtistAffinity(seedArtist) || getArtistAffinity(anchorTrack.artistName);

    // 1. Identifica fontes de busca contextual
    const relatedArtists = affinity?.relatedArtists || [];
    const genreTags = affinity?.genres || (seedTrack.genre ? [seedTrack.genre] : ['Pop', 'R&B', 'Hip-Hop']);
    const discoveryTags = affinity?.discoveryGenres || ['Indie', 'Lo-Fi', 'Alternative'];

    // 2. Busca paralela federada de candidatos
    const queries: { query: string; reason: FlowRecommendationReason; baseWeight: number }[] = [
      // A. Mesmo artista
      { query: seedArtist, reason: 'same_artist', baseWeight: 1.0 },
    ];

    // B. Artistas relacionados (pega os 2 primeiros mais fortes)
    if (relatedArtists.length > 0) {
      queries.push({
        query: `${relatedArtists[0]} ${relatedArtists[1] || ''}`.trim(),
        reason: 'related_artist',
        baseWeight: 0.88,
      });
    }

    // C. Mesmo Gênero / Vibe
    if (genreTags.length > 0) {
      queries.push({
        query: `${genreTags[0]} ${genreTags[1] || ''}`.trim(),
        reason: 'same_genre',
        baseWeight: 0.78,
      });
    }

    // D. Descoberta compatível
    if (discoveryTags.length > 0) {
      queries.push({
        query: discoveryTags[0],
        reason: 'discovery',
        baseWeight: 0.68,
      });
    }

    const searchPromises = queries.map(async (q) => {
      try {
        const res = await musicService.search(q.query);
        return {
          tracks: res.tracks || [],
          reason: q.reason,
          baseWeight: q.baseWeight,
        };
      } catch {
        return { tracks: [], reason: q.reason, baseWeight: q.baseWeight };
      }
    });

    const searchResults = await Promise.allSettled(searchPromises);

    // 3. Pool de Candidatos Brutos
    const rawCandidates: ScoredCandidate[] = [];
    for (const result of searchResults) {
      if (result.status === 'fulfilled') {
        const { tracks, reason, baseWeight } = result.value;
        tracks.forEach((track, idx) => {
          // Positional decay dentro dos resultados do provider
          const rankScore = Math.max(0.1, 1 - idx * 0.05);
          rawCandidates.push({
            track,
            reason,
            score: baseWeight * rankScore,
          });
        });
      }
    }

    // Se o catálogo retornou poucos candidatos, adiciona destaques curados como fallback
    if (rawCandidates.length < 10) {
      try {
        const featured = await musicService.getFeaturedTracks();
        featured.forEach((track, idx) => {
          rawCandidates.push({
            track,
            reason: 'discovery',
            score: 0.5 - idx * 0.02,
          });
        });
      } catch {}
    }

    // 4. Deduplicação e Filtragem de Exclusões
    const excludedIds = new Set<string>([
      seedTrack.id,
      anchorTrack.id,
      ...excludeTrackIds,
      ...recentTrackIds,
    ]);

    const seenTrackKeys = new Set<string>();
    // Registra a chave da seed para não duplicar
    seenTrackKeys.add(normalizeTrackKey(seedTrack));
    if (anchorTrack.id !== seedTrack.id) {
      seenTrackKeys.add(normalizeTrackKey(anchorTrack));
    }

    const uniqueCandidates: ScoredCandidate[] = [];
    let filteredDuplicatesCount = 0;
    let filteredRecentCount = 0;

    for (const item of rawCandidates) {
      const track = item.track;
      if (!track || !track.id) continue;

      if (excludedIds.has(track.id)) {
        filteredRecentCount++;
        continue;
      }

      const key = normalizeTrackKey(track);
      if (seenTrackKeys.has(key)) {
        filteredDuplicatesCount++;
        continue;
      }

      seenTrackKeys.add(key);

      // Penalidade de repetição recente de artista
      const normArtist = normalizeArtistKey(track.artistName);
      const isSeedArtist = normArtist === normalizeArtistKey(seedArtist);
      const recentArtistCount = recentArtistNames.filter(
        (a) => normalizeArtistKey(a) === normArtist
      ).length;

      let adjustedScore = item.score;
      if (recentArtistCount > 0) {
        adjustedScore -= recentArtistCount * 0.15;
      }

      uniqueCandidates.push({
        track,
        reason: isSeedArtist ? 'same_artist' : item.reason,
        score: adjustedScore,
      });
    }

    // 5. Agrupamento por Categoria para a Distribuição Harmônica (Weaver)
    const sameArtistPool = uniqueCandidates
      .filter((c) => c.reason === 'same_artist')
      .sort((a, b) => b.score - a.score);

    const relatedArtistPool = uniqueCandidates
      .filter((c) => c.reason === 'related_artist')
      .sort((a, b) => b.score - a.score);

    const sameGenrePool = uniqueCandidates
      .filter((c) => c.reason === 'same_genre')
      .sort((a, b) => b.score - a.score);

    const discoveryPool = uniqueCandidates
      .filter((c) => c.reason === 'discovery')
      .sort((a, b) => b.score - a.score);

    // 6. Tecelão Harmônico (Harmonic Distribution Weaver)
    // Padrão de slots:
    // Slot 0: Same Artist
    // Slot 1: Same Artist / Related
    // Slot 2: Related Artist
    // Slot 3: Same Genre
    // Slot 4: Same Artist
    // Slot 5: Related Artist
    // Slot 6: Discovery
    // Slot 7: Same Genre
    // Slot 8: Same Artist
    // Slot 9: Related / Discovery
    // ...
    const slotPattern: FlowRecommendationReason[] = [
      'same_artist',
      'same_artist',
      'related_artist',
      'same_genre',
      'same_artist',
      'related_artist',
      'discovery',
      'same_genre',
      'same_artist',
      'discovery',
      'related_artist',
      'same_genre',
    ];

    const finalFlow: FlowTrack[] = [];
    const usedTrackIds = new Set<string>();

    const popBestCandidate = (targetReason: FlowRecommendationReason): ScoredCandidate | null => {
      let pool: ScoredCandidate[] = [];
      if (targetReason === 'same_artist') pool = sameArtistPool;
      else if (targetReason === 'related_artist') pool = relatedArtistPool;
      else if (targetReason === 'same_genre') pool = sameGenrePool;
      else pool = discoveryPool;

      // Procura primeiro no pool do motivo desejado
      for (let i = 0; i < pool.length; i++) {
        const item = pool[i];
        if (!usedTrackIds.has(item.track.id)) {
          pool.splice(i, 1);
          return item;
        }
      }

      // Se o pool desejado esgotou, busca no pool geral ordenado por score
      for (const item of uniqueCandidates) {
        if (!usedTrackIds.has(item.track.id)) {
          return item;
        }
      }

      return null;
    };

    let lastArtistNorm = normalizeArtistKey(anchorTrack.artistName);
    let consecutiveArtistCount = 1;

    for (let slot = 0; slot < limit; slot++) {
      const desiredReason = slotPattern[slot % slotPattern.length];
      let candidate = popBestCandidate(desiredReason);

      // Se o candidato exceder 2 faixas consecutivas do mesmo artista, tenta buscar um artista diferente
      if (candidate) {
        const candArtistNorm = normalizeArtistKey(candidate.track.artistName);
        if (candArtistNorm === lastArtistNorm && consecutiveArtistCount >= 2) {
          // Busca um candidato com artista diferente
          const altCandidate = uniqueCandidates.find(
            (c) =>
              !usedTrackIds.has(c.track.id) &&
              normalizeArtistKey(c.track.artistName) !== lastArtistNorm
          );
          if (altCandidate) {
            candidate = altCandidate;
          }
        }
      }

      if (!candidate) {
        break;
      }

      usedTrackIds.add(candidate.track.id);
      const candArtistNorm = normalizeArtistKey(candidate.track.artistName);
      if (candArtistNorm === lastArtistNorm) {
        consecutiveArtistCount++;
      } else {
        lastArtistNorm = candArtistNorm;
        consecutiveArtistCount = 1;
      }

      finalFlow.push({
        ...candidate.track,
        flowReason: candidate.reason,
        flowScore: Math.round(candidate.score * 100) / 100,
        flowSeedId: seedTrack.id,
        flowSeedTitle: seedTrack.title,
        flowSeedArtist: seedTrack.artistName,
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      logger.info(
        `[MooSic Flow] Seed: "${seedTrack.title}" (${seedArtist}) | Candidatos Brutos: ${rawCandidates.length} | Duplicatas: ${filteredDuplicatesCount} | Recentes: ${filteredRecentCount} | Flow Gerado: ${finalFlow.length}`
      );
    }

    return finalFlow;
  }
}

export const moosicFlowService = new MooSicFlowService();
