import React, { useState } from 'react';
import { usePlaylists } from '@/stores/playlistStore';
import { useRouter } from '@/app/routes/router';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import { PlaylistThemeId } from '@/types/domain/playlist';
import { musicService } from '@/services/music/musicService';
import {
  X,
  Sparkles,
  Flame,
  Radio,
  Zap,
  Compass,
  Disc,
  Wand2,
} from 'lucide-react';

const ICON_MAP = {
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
};

const SEED_PRESETS = [
  { label: 'Sem faixas iniciais (Vazia)', query: '' },
  { label: 'Alquimia Trap & Hip-Hop', query: 'Matue BK Trap Brasil' },
  { label: 'Alquimia Pop Global', query: 'Dua Lipa The Weeknd Pop' },
  { label: 'Alquimia Lo-Fi & Foco', query: 'Lofi Chill Beats Study' },
  { label: 'Alquimia Indie Rock', query: 'Arctic Monkeys Tame Impala' },
  { label: 'Alquimia Eletrônica & Synth', query: 'Daft Punk Rufus Du Sol' },
];

export const CreatePlaylistModal: React.FC = () => {
  const { activeModal, closeModals, createPlaylist } = usePlaylists();
  const { navigate } = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<PlaylistThemeId>('cyberpunk-neon');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (activeModal !== 'create-playlist') return null;

  const currentThemeObj = PLAYLIST_THEMES[selectedTheme];
  const IconComponent = ICON_MAP[currentThemeObj.iconName] || Sparkles;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsGenerating(true);
    let initialTracks: any[] = [];

    if (selectedSeed) {
      try {
        const res = await musicService.search(selectedSeed);
        if (res.tracks && res.tracks.length > 0) {
          initialTracks = res.tracks.slice(0, 8);
        }
      } catch {
        // Segue vazia em caso de erro
      }
    }

    const newPlaylist = createPlaylist({
      title,
      description,
      themeId: selectedTheme,
      initialTracks,
    });

    setIsGenerating(false);
    closeModals();
    navigate(`/app/playlist/${newPlaylist.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow dinâmico de fundo */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-40 transition-colors duration-500"
          style={{ backgroundColor: currentThemeObj.accent }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/20 shadow-md"
              style={{ backgroundColor: `${currentThemeObj.accent}25` }}
            >
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Criar Nova Playlist</h3>
              <p className="text-xs text-text-muted">Personalize sua atmosfera e faixas no MooSic</p>
            </div>
          </div>

          <button
            onClick={closeModals}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-5 pt-5 relative z-10">
          {/* Card Preview Dinâmico */}
          <div
            className={`p-4 rounded-2xl bg-gradient-to-r ${currentThemeObj.gradient} border border-white/20 flex items-center gap-4 shadow-lg transition-all duration-300`}
          >
            <div className="w-14 h-14 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-7 h-7 text-white drop-shadow" />
            </div>
            <div className="min-w-0 flex-1 text-white">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full">
                {currentThemeObj.name}
              </span>
              <h4 className="font-black text-base truncate mt-0.5">
                {title.trim() || 'Nome da sua Playlist'}
              </h4>
              <p className="text-xs text-white/75 truncate">
                {description.trim() || 'Descrição e vibração sonora...'}
              </p>
            </div>
          </div>

          {/* Nome da Playlist */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Nome da Playlist *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Foco Quântico, Madrugada Trap, Sunset Vibes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/15 focus:border-brand-purple rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-muted outline-none transition-all"
            />
          </div>

          {/* Descrição Opcional */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Descrição (Opcional)
            </label>
            <input
              type="text"
              placeholder="Sobre o que é essa playlist?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/15 focus:border-brand-purple rounded-xl px-4 py-2 text-xs text-white placeholder-text-muted outline-none transition-all"
            />
          </div>

          {/* Seletor de Tema Visual Cromático */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Identidade Cromática
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.keys(PLAYLIST_THEMES) as PlaylistThemeId[]).map((tId) => {
                const theme = PLAYLIST_THEMES[tId];
                const isSelected = selectedTheme === tId;
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => setSelectedTheme(tId)}
                    className={`relative h-12 rounded-xl bg-gradient-to-br ${theme.gradient} border transition-all ${
                      isSelected
                        ? 'border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)] ring-2 ring-white/50'
                        : 'border-white/20 opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                    title={theme.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Alquimia Sonora (Preenchimento Inteligente) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-light flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Alquimia Sonora (Gerar faixas automáticas)</span>
            </label>
            <select
              value={selectedSeed}
              onChange={(e) => setSelectedSeed(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/15 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            >
              {SEED_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.query} className="bg-[#0E0F14] text-white">
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isGenerating}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Gerando Sintonia...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Criar Playlist</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
