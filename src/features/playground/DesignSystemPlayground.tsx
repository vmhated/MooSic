import { useState } from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { MooMark } from '@/components/common/MooMark';
import { Button, Input, Card, Artwork, Badge, Tabs, Slider } from '@/components/ui';
import { Search, Play, Heart, Sparkles, Volume2, Layers } from 'lucide-react';

export function DesignSystemPlayground() {
  const [activeTab, setActiveTab] = useState('overview');
  const [inputValue, setInputValue] = useState('');
  const [sliderVal, setSliderVal] = useState(65);

  const tabsList = [
    { id: 'overview', label: 'Visão Geral', count: 12 },
    { id: 'branding', label: 'Marca & Tipografia' },
    { id: 'components', label: 'Componentes UI' },
    { id: 'tokens', label: 'Tokens & Cores' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans p-4 sm:p-8 max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header do Playground */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <MooLogo size="md" />
            <Badge variant="brand" size="sm">
              Design System v1.0 (Fase 1)
            </Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Ambiente interno de demonstração e validação visual dos tokens, componentes e tipografia oficial.
          </p>
        </div>
        <Tabs items={tabsList} activeId={activeTab} onChange={setActiveTab} />
      </header>

      {/* SEÇÃO 1: MARCA & IDENTIDADE (MooLogo & MooMark) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            1. Marca & Identidade Visual
          </h2>
          <p className="text-xs text-text-secondary">
            Wordmark oficial baseada em <strong className="text-white font-brand">Manrope</strong> e o símbolo vetorial <strong className="text-white">MooMark</strong> derivado do conceito de infinito.
          </p>
        </div>

        <Card variant="surface" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MooLogo Demo */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                MooLogo (Wordmark em Manrope)
              </span>
              <div className="space-y-4 p-4 rounded-xl bg-surface-elevated border border-surface-border">
                <div>
                  <span className="text-[10px] text-text-muted block mb-1">Size XL (66px)</span>
                  <MooLogo size="xl" />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block mb-1">Size LG (36px)</span>
                  <MooLogo size="lg" />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block mb-1">Size MD (24px)</span>
                  <MooLogo size="md" />
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block mb-1">Size SM (18px)</span>
                  <MooLogo size="sm" />
                </div>
              </div>
            </div>

            {/* MooMark Demo */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                MooMark (Símbolo do Infinito ∞)
              </span>
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border flex items-center gap-6 flex-wrap">
                <div className="text-center space-y-2">
                  <MooMark size={64} glow={true} />
                  <span className="text-[10px] text-text-muted block">64px (Glow)</span>
                </div>
                <div className="text-center space-y-2">
                  <MooMark size={48} glow={true} />
                  <span className="text-[10px] text-text-muted block">48px</span>
                </div>
                <div className="text-center space-y-2">
                  <MooMark size={36} glow={false} />
                  <span className="text-[10px] text-text-muted block">36px</span>
                </div>
                <div className="text-center space-y-2">
                  <MooMark size={28} glow={false} />
                  <span className="text-[10px] text-text-muted block">28px</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* SEÇÃO 2: ESCALA TIPOGRÁFICA OFICIAL */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-purple" />
            2. Escala Tipográfica (Plus Jakarta Sans)
          </h2>
          <p className="text-xs text-text-secondary">
            Toda a interface do produto utiliza exclusivamente a fonte <strong className="text-white">Plus Jakarta Sans</strong>.
          </p>
        </div>

        <Card variant="surface" className="space-y-4">
          <div className="divide-y divide-surface-border">
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">Display (36px / Extrabold)</span>
              <span className="text-4xl font-extrabold tracking-tight text-white font-sans">
                Música sem limites
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">H1 (28px / Bold)</span>
              <span className="text-2xl font-bold text-white font-sans">
                Descobertas da Semana
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">H2 (22px / Semibold)</span>
              <span className="text-xl font-semibold text-white font-sans">
                Álbuns em Destaque
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">H3 (18px / Semibold)</span>
              <span className="text-lg font-semibold text-white font-sans">
                Starboy - The Weeknd
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">Title (16px / Medium)</span>
              <span className="text-base font-medium text-white font-sans">
                Lista de Reprodução Principal
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">Body (14px / Regular)</span>
              <span className="text-sm text-text-secondary font-sans">
                Explore milhões de músicas e crie playlists personalizadas com sincronização de letras.
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">BodySmall (13px / Regular)</span>
              <span className="text-xs text-text-secondary font-sans">
                Duração total: 42 min • 12 faixas • Lançado em 2024
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">Label (12px / Medium)</span>
              <span className="text-xs font-medium text-brand-purple uppercase tracking-wider font-sans">
                RECOMENDADO PARA VOCÊ
              </span>
            </div>
            <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-mono w-32">Caption (11px / Regular)</span>
              <span className="text-[11px] text-text-muted font-sans">
                © 2026 MooSic Platform Inc. Todos os direitos reservados.
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* SEÇÃO 3: DESIGN TOKENS DE CORES */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans">3. Palette & Tokens de Cores Base</h2>
          <p className="text-xs text-text-secondary">
            Cores semânticas oficiais do aplicativo em modo Dark.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <div className="p-3 rounded-xl bg-background border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-background border border-surface-border"></div>
            <span className="text-xs font-medium block">Background</span>
            <span className="text-[10px] font-mono text-text-muted block">#09090B</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-surface border border-surface-border"></div>
            <span className="text-xs font-medium block">Surface</span>
            <span className="text-[10px] font-mono text-text-muted block">#111116</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-surface-elevated border border-surface-border"></div>
            <span className="text-xs font-medium block">Elevated</span>
            <span className="text-[10px] font-mono text-text-muted block">#19191F</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-surface-border"></div>
            <span className="text-xs font-medium block">Border</span>
            <span className="text-[10px] font-mono text-text-muted block">#292930</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-brand-purple"></div>
            <span className="text-xs font-medium block">Brand Purple</span>
            <span className="text-[10px] font-mono text-text-muted block">#8B5CF6</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-text-primary"></div>
            <span className="text-xs font-medium block">Text Primary</span>
            <span className="text-[10px] font-mono text-text-muted block">#F5F5F7</span>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-2 text-center">
            <div className="w-full h-10 rounded-lg bg-text-secondary"></div>
            <span className="text-xs font-medium block">Text Secondary</span>
            <span className="text-[10px] font-mono text-text-muted block">#B8B8C2</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PRIMITIVOS UI (BUTTONS, INPUTS, CARDS, ARTWORK, SLIDERS) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans">4. Componentes Primitivos de UI</h2>
          <p className="text-xs text-text-secondary">
            Componentes universais preparados para Web e Mobile (Expo / RN Web).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Variantes de Botões */}
          <Card variant="surface" className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Botões (Button)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Play className="w-4 h-4 fill-current" />}>
                Tocar Agora
              </Button>
              <Button variant="secondary" leftIcon={<Heart className="w-4 h-4" />}>
                Favoritar
              </Button>
              <Button variant="outline">Detalhes</Button>
              <Button variant="ghost">Cancelar</Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="sm">
                Pequeno
              </Button>

              <Button variant="primary" size="md">
                Médio
              </Button>
              <Button variant="primary" size="lg">
                Grande
              </Button>
              <Button variant="primary" disabled>
                Desabilitado
              </Button>
            </div>
          </Card>

          {/* Inputs & Busca */}
          <Card variant="surface" className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Campos de Texto (Input)</h3>
            <div className="space-y-3">
              <Input
                placeholder="Buscar música, artista ou álbum..."
                leftIcon={<Search className="w-4 h-4" />}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Nome da Playlist"
                placeholder="Ex: Minhas Favoritas 2026"
              />
              <Input
                label="Campo com Erro"
                value="Texto inválido"
                error="Informe um título válido para continuar."
              />
            </div>
          </Card>

          {/* Artwork & Cover Display */}
          <Card variant="surface" className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Artwork / Capas</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center space-y-1">
                <Artwork size="xl" glow={true} />
                <span className="text-[10px] text-text-muted block">Size XL (192px)</span>
              </div>
              <div className="text-center space-y-1">
                <Artwork size="lg" />
                <span className="text-[10px] text-text-muted block">Size LG (96px)</span>
              </div>
              <div className="text-center space-y-1">
                <Artwork size="md" />
                <span className="text-[10px] text-text-muted block">Size MD (56px)</span>
              </div>
              <div className="text-center space-y-1">
                <Artwork size="sm" />
                <span className="text-[10px] text-text-muted block">Size SM (40px)</span>
              </div>
            </div>
          </Card>

          {/* Badges, Sliders & Controls */}
          <Card variant="surface" className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary">Badges & Sliders</h3>

            <div className="space-y-2">
              <span className="text-xs text-text-muted block">Badges Semânticas</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="brand">MooSic Original</Badge>
                <Badge variant="surface">Pop Rock</Badge>
                <Badge variant="outline">EXPLICIT</Badge>
                <Badge variant="accent">MusicBrainz</Badge>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-brand-purple" /> Volume / Seek Slider
                </span>
                <span className="font-mono text-text-muted">{sliderVal}%</span>
              </div>
              <Slider value={sliderVal} onChange={setSliderVal} />
            </div>
          </Card>
        </div>
      </section>

      {/* CARD DE EXEMPLO INTEGRADO */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-sans">5. Demonstração de Card Integrado</h2>
        <Card variant="elevated" interactive={true} className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <Artwork size="md" glow={true} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white text-base font-sans">Midnight Echoes</h4>
                <Badge variant="brand" size="sm">Hi-Fi</Badge>
              </div>
              <p className="text-xs text-text-secondary font-sans">
                Synthetic Waves • Álbum: Neon Horizon (2026)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}>
              Ouvir
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
