import React, { useState } from 'react';
import { useRouter } from '@/app/routes/router';
import { usePlayer } from '@/stores/playerContext';
import { PlaylistProvider } from '@/stores/playlistStore';
import { Sidebar, Topbar } from '@/components/navigation';
import { PersistentBottomPlayer } from '@/components/player';
import { HomePage } from '@/features/home';
import { SearchPage } from '@/features/search';
import { LibraryPage } from '@/features/library';
import { PlaylistView } from '@/features/playlists';
import { CreatePlaylistModal } from '@/components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from '@/components/modals/AddToPlaylistModal';
import { ResonatorModal } from '@/components/modals/ResonatorModal';

const AppLayoutInner: React.FC = () => {
  const { route, params } = useRouter();
  const { currentTrack } = usePlayer();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cor de destaque dinâmica baseada na capa da faixa ativa
  const dynamicGlow = currentTrack?.accent || '#8B5CF6';

  const renderContent = () => {
    switch (route) {
      case 'app-playlist':
        return <PlaylistView playlistId={params.id || ''} />;
      case 'app-search':
        return <SearchPage initialQuery={searchQuery} onQueryChange={setSearchQuery} />;
      case 'app-library':
        return <LibraryPage />;
      case 'app-home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-text-primary font-sans antialiased overflow-x-hidden selection:bg-brand-purple selection:text-white flex relative">
      {/* Luz Atmosférica Dinâmica de Fundo */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-25 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${dynamicGlow} 0%, transparent 70%)`,
        }}
      />

      {/* 1. Sidebar Fixa / Drawer Mobile */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Coluna Principal de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar Superior Integrada */}
        <Topbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Área de Conteúdo Scrollável (com padding inferior para o player) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-32 focus:outline-none">
          {renderContent()}
        </main>
      </div>

      {/* 3. Player Persistente Fixo no Rodapé (Preservado Intacto) */}
      <PersistentBottomPlayer />

      {/* Modais Globais do Sistema */}
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <ResonatorModal />
    </div>
  );
};

export const AppLayout: React.FC = () => {
  return (
    <PlaylistProvider>
      <AppLayoutInner />
    </PlaylistProvider>
  );
};

