import { motion, useReducedMotion } from 'framer-motion';

interface InfiniteDissolveLoopProps {
  className?: string;
}

// 28 partículas de poeira luminosa que se desprendem na dissolução orgânica
const DUST_PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.2;
  const distance = 35 + (i % 5) * 18;
  const t = i / 28;
  const scaleX = 110;
  const scaleY = 45;
  const baseX = (scaleX * Math.cos(t * Math.PI * 2)) / (1 + Math.sin(t * Math.PI * 2) ** 2);
  const baseY = (scaleY * Math.sin(t * Math.PI * 2) * Math.cos(t * Math.PI * 2)) / (1 + Math.sin(t * Math.PI * 2) ** 2);

  return {
    id: i,
    baseX,
    baseY,
    burstX: baseX + Math.cos(angle) * distance,
    burstY: baseY + Math.sin(angle) * distance,
    size: 1.5 + (i % 3) * 1.2,
    color: i % 3 === 0 ? '#E879F9' : i % 2 === 0 ? '#C084FC' : '#818CF8',
  };
});

export function InfiniteDissolveLoop({ className = '' }: InfiniteDissolveLoopProps) {
  const shouldReduceMotion = useReducedMotion();
  const CYCLE_DURATION = 6.2; // Duração do ciclo: preenchimento 100% -> dissolução orgânica em poeira -> renascimento

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto py-16 px-4 flex items-center justify-center select-none overflow-hidden ${className}`}
      aria-label="Loop Infinito MooSic"
    >
      {/* Background Ambient Radial Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[220px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, #8B5CF6 0%, #6366F1 45%, transparent 80%)',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [0.85, 1.15, 1.25, 0.85],
                opacity: [0.15, 0.35, 0.4, 0.15],
              }
        }
        transition={{
          duration: CYCLE_DURATION,
          repeat: Infinity,
          times: [0, 0.5, 0.65, 1],
          ease: 'easeInOut',
        }}
      />

      <div className="relative w-72 sm:w-88 h-36 sm:h-44 flex items-center justify-center">
        {/* SVG DA CURVA DO INFINITO */}
        <svg
          viewBox="0 0 300 150"
          fill="none"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]"
        >
          <defs>
            <linearGradient id="sonicInfiniteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="30%" stopColor="#C084FC" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            <filter id="sonicNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Curva Principal: Ciclo de Preenchimento 100% e Dissolução Orgânica */}
          <motion.path
            d="M 150 75 C 185 25, 260 25, 260 75 C 260 125, 185 125, 150 75 C 115 25, 40 25, 40 75 C 40 125, 115 125, 150 75 Z"
            stroke="url(#sonicInfiniteGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sonicNeonGlow)"
            initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    // Fase 1: Preenche 100% de 0 a 48% do tempo.
                    // Fase 2: Ao atingir 100%, brilha e se dissolve organicamente em fade/desfoque entre 54% e 70%.
                    // Fase 3: Renasce suavemente para o próximo ciclo.
                    pathLength: [0, 1, 1, 1, 0, 0],
                    pathOffset: [0, 0, 0, 0.2, 0.5, 0],
                    opacity: [0.2, 1, 1, 0.8, 0, 0],
                    strokeWidth: [6, 8, 9, 12, 1, 6],
                  }
            }
            transition={{
              duration: CYCLE_DURATION,
              repeat: Infinity,
              times: [0, 0.48, 0.54, 0.62, 0.72, 1],
              ease: 'easeInOut',
            }}
          />

          {/* Cometa de Luz Branca que lidera o preenchimento 100% */}
          <motion.path
            d="M 150 75 C 185 25, 260 25, 260 75 C 260 125, 185 125, 150 75 C 115 25, 40 25, 40 75 C 40 125, 115 125, 150 75 Z"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            initial={shouldReduceMotion ? { pathLength: 0.1 } : { pathLength: 0.08, pathOffset: 0, opacity: 1 }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    pathOffset: [0, 1, 1, 1, 0],
                    opacity: [1, 1, 0, 0, 1],
                  }
            }
            transition={{
              duration: CYCLE_DURATION,
              repeat: Infinity,
              times: [0, 0.48, 0.55, 0.75, 1],
              ease: 'easeInOut',
            }}
          />
        </svg>

        {/* POEIRA LUMINOSA / PARTÍCULAS ORGÂNICAS (Dissolvem da própria curva) */}
        {DUST_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
            initial={{ x: p.baseX, y: p.baseY, opacity: 0, scale: 0 }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [p.baseX, p.baseX, p.baseX, p.burstX, p.burstX * 1.2],
                    y: [p.baseY, p.baseY, p.baseY, p.burstY, p.burstY * 1.2],
                    opacity: [0, 0, 1, 0.85, 0],
                    scale: [0, 0, 1.3, 1.6, 0],
                  }
            }
            transition={{
              duration: CYCLE_DURATION,
              repeat: Infinity,
              times: [0, 0.52, 0.56, 0.68, 0.8],
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Pulso de Luz Central no Fechamento do Infinito */}
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-white blur-[6px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [0, 0, 0.9, 0],
                  scale: [0.5, 0.5, 1.8, 0.6],
                }
          }
          transition={{
            duration: CYCLE_DURATION,
            repeat: Infinity,
            times: [0, 0.48, 0.53, 0.65],
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}
