import { TasteProfile, TasteEntity, SignalSource } from '@/types/domain/taste';
import { tasteProfileRepository } from '@/repositories/taste/tasteProfileRepository';
import { Artist, Track } from '@/types/domain/music';

/**
 * Service to orchestrate taste profile operations.
 * Handles the domain mapping from Music entities to Taste entities,
 * injecting source and confidence.
 */
export class TasteProfileService {
  
  private toTasteEntity(
    id: string, 
    name: string, 
    coverUrl?: string, 
    source: SignalSource = 'declared', 
    confidence = 1.0
  ): TasteEntity {
    // Parse provider and provider_id from MooSic's generic ID format (e.g. 'deezer-1234')
    const parts = id.split('-');
    let provider = 'unknown';
    let provider_id = id;

    if (parts.length > 1) {
      provider = parts[0];
      provider_id = parts.slice(1).join('-');
    }

    return {
      provider,
      provider_id,
      name,
      cover_url: coverUrl,
      source,
      confidence,
      added_at: new Date().toISOString()
    };
  }

  public artistToTasteEntity(artist: Artist, source: SignalSource = 'declared'): TasteEntity {
    return {
      provider: artist.providerId,
      provider_id: artist.providerArtistId,
      name: artist.name,
      cover_url: artist.avatarUrl,
      source,
      confidence: 1.0,
      added_at: new Date().toISOString(),
    };
  }

  public trackToTasteEntity(track: Track, source: SignalSource = 'declared'): TasteEntity {
    return this.toTasteEntity(track.id, track.title, track.coverUrl, source, 1.0);
  }

  public genreToTasteEntity(genreName: string, source: SignalSource = 'declared'): TasteEntity {
    // Genres might not have a specific provider ID in this architecture, using standard format
    return {
      provider: 'system',
      provider_id: genreName.toLowerCase().replace(/\s+/g, '-'),
      name: genreName,
      source,
      confidence: 1.0,
      added_at: new Date().toISOString()
    };
  }

  /**
   * Saves partial updates to the user's taste profile.
   */
  async saveOnboardingProgress(data: Partial<TasteProfile>): Promise<TasteProfile | null> {
    return tasteProfileRepository.upsertProfile(data);
  }

  /**
   * Retrieves the current taste profile.
   */
  async getProfile(): Promise<TasteProfile | null> {
    return tasteProfileRepository.getProfile();
  }
}

export const tasteProfileService = new TasteProfileService();
