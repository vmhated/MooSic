import React, { useState, useEffect } from 'react';
import { usePlaylists } from '@/stores/playlistStore';
import { binauralResonator, ResonatorPresetId } from '@/services/audio/binauralResonatorService';
import { RESONATOR_PRESETS } from '@/constants/playlistThemes';
import {
  X,
  Volume2,
  Power,
  Waves,
  Info,
} from 'lucide-react';

export const ResonatorModal: React.FC = () => {
  const { activeModal, closeModals } = usePlaylists();
  const [resonatorState, setResonatorState] = useState(binauralResonator.getState());

  useEffect(() => {
    const unsub = binauralResonator.subscribe((state) => {
      setResonatorState(state);
    });
    return unsub;
  }, []);

  if (activeModal !== 'resonator') return null;

  const currentPresetObj =
    RESONATOR_PRESETS.find((p) => p.id === resonatorState.preset) || RESONATOR_PRESETS[0];

  const handleToggle = () => {
    binauralResonator.toggle();
  };

  const handleSelectPreset = (id: ResonatorPresetId) => {
    binauralResonator.setPreset(id);
    if (!resonatorState.isRunning) {
      binauralResonator.start(id);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    binauralResonator.setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0D0E15] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Glow dinâmico de fundo com a cor do preset */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[110px] pointer-events-none opacity-35 transition-all duration-700"
          style={{ backgroundColor: currentPresetObj.bgGlow }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg transition-all ${
                resonatorState.isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/50'
              }`}
            >
              <Waves className={`w-5 h-5 ${resonatorState.isRunning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">MooSic Resonator</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-purple/20 text-brand-light px-2 py-0.5 rounded-full border border-brand-purple/30">
                  Exclusivo
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Frequências de sintonia mental sobrepostas à sua música
              </p>
            </div>
          </div>

          <button
            onClick={closeModals}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizador Osciloscópico de Frequência */}
        <div className="my-5 p-5 rounded-2xl bg-black/50 border border-white/10 relative overflow-hidden flex flex-col items-center text-center space-y-3">
          {/* Ondas sonoras animadas com CSS puro */}
          <div className="flex items-center justify-center gap-1.5 h-12 w-full py-2">
            {[35, 60, 40, 85, 95, 55, 75, 100, 70, 45, 90, 60, 30, 80, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  resonatorState.isRunning ? 'bg-gradient-to-t from-brand-purple to-emerald-400' : 'bg-white/15 h-2'
                }`}
                style={{
                  height: resonatorState.isRunning ? `${h}%` : '4px',
                  animation: resonatorState.isRunning ? `pulse 1.2s infinite ease-in-out ${i * 0.08}s` : 'none',
                }}
              />
            ))}
          </div>

          <div>
            <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400">
              {resonatorState.isRunning ? '● Frequência Ativa em Camada Contínua' : '○ Resonator Desligado'}
            </span>
            <h4 className="text-xl font-black text-white tracking-tight mt-0.5">
              {currentPresetObj.name}
            </h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 leading-relaxed">
              {currentPresetObj.description}
            </p>
          </div>

          {/* Botão Principal de Ativação / Desativação */}
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 ${
              resonatorState.isRunning
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
                : 'bg-white hover:bg-white/90 text-black'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{resonatorState.isRunning ? 'Desativar Frequência' : 'Ativar Frequência'}</span>
          </button>
        </div>

        {/* Seletor de Frequências Disponíveis */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center justify-between">
            <span>Selecione a Sintonia</span>
            <span className="text-[10px] text-text-muted">Síntese Pura Web Audio</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {RESONATOR_PRESETS.map((preset) => {
              const isSelected = resonatorState.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id as ResonatorPresetId)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white/10 border-white text-white shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-bold text-brand-light block truncate">
                    {preset.tag}
                  </span>
                  <p className="text-xs font-black text-white truncate mt-0.5">{preset.name.split('•')[0]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider de Volume / Nível de Camada */}
        <div className="space-y-1.5 pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-text-muted" />
              <span>Intensidade da Camada Harmônica</span>
            </span>
            <span className="font-mono text-white">
              {Math.round(resonatorState.volume * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={resonatorState.volume}
            onChange={handleVolumeChange}
            className="w-full accent-brand-purple h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-text-muted flex items-center gap-1">
            <Info className="w-3 h-3 text-text-muted" />
            <span>Mantenha entre 15% e 35% para que a frequência se misture suavemente à sua música.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
