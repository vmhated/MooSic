import React, { useState } from 'react';
import { usePlaylists } from '@/stores/playlistStore';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import {
  X,
  Plus,
  Check,
  ListMusic,
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
} from 'lucide-react';

const ICON_MAP = {
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
};

export const AddToPlaylistModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    pendingTrackForPlaylist,
    playlists,
    addTrackToPlaylist,
    openCreatePlaylistModal,
  } = usePlaylists();

  const [addedIds, setAddedIds] = useState<string[]>([]);

  if (activeModal !== 'add-to-playlist' || !pendingTrackForPlaylist) return null;

  const handleAdd = (playlistId: string) => {
    const success = addTrackToPlaylist(playlistId, pendingTrackForPlaylist);
    if (success) {
      setAddedIds((prev) => [...prev, playlistId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#0E0F14] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-light shadow-md">
              <ListMusic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Adicionar à Playlist</h3>
              <p className="text-xs text-text-muted">Selecione onde deseja salvar esta faixa</p>
            </div>
          </div>

          <button
            onClick={closeModals}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa em Destaque */}
        <div className="my-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5">
          <img
            src={pendingTrackForPlaylist.coverUrl}
            alt={pendingTrackForPlaylist.title}
            className="w-12 h-12 rounded-xl object-cover shadow"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">
              {pendingTrackForPlaylist.title}
            </h4>
            <p className="text-xs text-text-muted truncate">
              {pendingTrackForPlaylist.artistName}
            </p>
          </div>
        </div>

        {/* Lista de Playlists */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none py-1">
          {playlists.length === 0 ? (
            <p className="text-xs text-center text-text-muted py-6">
              Você ainda não tem playlists criadas.
            </p>
          ) : (
            playlists.map((pl) => {
              const theme = PLAYLIST_THEMES[pl.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
              const Icon = ICON_MAP[theme.iconName] || Sparkles;
              const alreadyIn =
                pl.tracks.some((t) => t.id === pendingTrackForPlaylist.id) ||
                addedIds.includes(pl.id);

              return (
                <div
                  key={pl.id}
                  onClick={() => !alreadyIn && handleAdd(pl.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    alreadyIn
                      ? 'bg-white/[0.02] border-white/5 opacity-80 cursor-default'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white flex-shrink-0 shadow`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">{pl.title}</p>
                      <p className="text-[10px] text-text-muted">{pl.tracks.length} músicas</p>
                    </div>
                  </div>

                  <div>
                    {alreadyIn ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        <span>Adicionada</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(pl.id);
                        }}
                        className="px-3 py-1 rounded-full bg-white text-black font-bold text-[11px] hover:scale-105 active:scale-95 transition-all shadow"
                      >
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Ação de Criar Nova Playlist */}
        <div className="pt-4 mt-2 border-t border-white/10">
          <button
            onClick={() => {
              closeModals();
              openCreatePlaylistModal([pendingTrackForPlaylist]);
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/20 hover:border-brand-purple/50 text-xs font-bold text-text-secondary hover:text-white bg-white/[0.02] hover:bg-brand-purple/10 transition-all"
          >
            <Plus className="w-4 h-4 text-brand-purple" />
            <span>Criar Nova Playlist com Esta Faixa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
