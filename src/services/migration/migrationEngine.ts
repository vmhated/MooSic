import { playlistRepository } from '@/repositories/playlist/playlistRepository';
import { likesRepository } from '@/repositories/library/likesRepository';
import { historyRepository } from '@/repositories/listening/historyRepository';
import { logger } from '@/utils/logger';
import { AuthUser } from '@/types/domain/user';

const MIGRATION_VERSION_KEY = 'moosic_migration_version';
const CURRENT_MIGRATION_VERSION = 1;

export class MigrationEngine {
  async runMigration(user: AuthUser): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const storedVersion = parseInt(localStorage.getItem(MIGRATION_VERSION_KEY) || '0', 10);
      
      if (storedVersion >= CURRENT_MIGRATION_VERSION) {
        return;
      }

      logger.info('[MigrationEngine] Iniciando migração local para a nuvem...');
      await this.migrateLikes();
      await this.migratePlaylists(user.id);
      await this.migrateHistory(user.id);

      localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION.toString());
      logger.info('[MigrationEngine] Migração concluída com sucesso.');
    } catch (error) {
      logger.error('[MigrationEngine] Falha na migração:', error);
    }
  }

  private async migrateLikes() {
    const localLikes = localStorage.getItem('moosic_liked_tracks');
    if (!localLikes) return;
    
    try {
      const parsed = JSON.parse(localLikes);
      if (Array.isArray(parsed)) {
        for (const trackId of parsed) {
          const provider = trackId.toString().startsWith('yt_') ? 'youtube' : 'deezer';
          await likesRepository.likeTrack(provider, trackId.toString());
        }
      }
    } catch (e) {
      logger.error('Error migrating likes', e);
    }
  }

  private async migratePlaylists(userId: string) {
    const localPlaylists = localStorage.getItem('moosic_custom_playlists_v3');
    if (!localPlaylists) return;
    
    try {
      const parsed = JSON.parse(localPlaylists);
      if (Array.isArray(parsed)) {
        for (const list of parsed) {
          const playlist = await playlistRepository.createPlaylist({
            user_id: userId,
            name: list.name || 'Minha Playlist Migrada',
            description: list.description || '',
            cover_url: list.coverUrl || null,
          });

          if (list.tracks && Array.isArray(list.tracks)) {
            for (let i = 0; i < list.tracks.length; i++) {
              const t = list.tracks[i];
              if (!t.id) continue;
              const provider = t.id.toString().startsWith('yt_') ? 'youtube' : 'deezer';
              await playlistRepository.addTrackToPlaylist({
                playlist_id: playlist.id,
                provider: provider,
                provider_track_id: t.id.toString(),
                position: i,
              });
            }
          }
        }
      }
    } catch (e) {
      logger.error('Error migrating playlists', e);
    }
  }

  private async migrateHistory(userId: string) {
    const localHistory = localStorage.getItem('moosic_history');
    if (!localHistory) return;
    
    try {
      const parsed = JSON.parse(localHistory);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (!entry.trackId) continue;
          const provider = entry.trackId.toString().startsWith('yt_') ? 'youtube' : 'deezer';
          await historyRepository.logEvent({
            user_id: userId,
            provider,
            provider_track_id: entry.trackId.toString(),
            event_type: 'play',
            timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString(),
            completed: true,
          });
        }
      }
    } catch (e) {
      logger.error('Error migrating history', e);
    }
  }
}

export const migrationEngine = new MigrationEngine();
