/**
 * Shell Principal da Aplicação MooSic.
 * Estruturado como container inicial para rotas e layouts futuros.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base text-gray-100 p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/20 text-brand-400 font-bold text-3xl border border-brand-500/30 shadow-glow">
          ∞
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">MooSic</h1>
        <p className="text-gray-400 text-sm">
          Estrutura arquitetural inicial concluída com sucesso. Pronto para desenvolvimento incremental de funcionalidades e interface.
        </p>
      </div>
    </div>
  );
}
