import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface LivingInfinityProps {
  size?: number;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  interactive?: boolean;
}

/**
 * LivingInfinity: O símbolo ∞ como elemento vivo e calmo.
 * Mantém micro-movimentos orgânicos (respiração sutil e resposta suave ao cursor).
 */
export const LivingInfinity: React.FC<LivingInfinityProps> = ({
  size = 120,
  className = '',
  glowColor = '#8B5CF6',
  glowOpacity = 0.25,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.55 }}
      aria-label="MooSic Living Infinity Symbol"
    >
      {/* Dynamic Ambient Glow Behind Infinity */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, rgba(139, 92, 246, 0) 70%)`,
          opacity: glowOpacity,
        }}
        animate={
          shouldReduceMotion
            ? { opacity: glowOpacity }
            : {
                opacity: [glowOpacity * 0.8, glowOpacity * 1.15, glowOpacity * 0.8],
                scale: [0.98, 1.03, 0.98],
              }
        }
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* SVG Living Infinity Path */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 overflow-visible"
        whileHover={interactive && !shouldReduceMotion ? { scale: 1.04 } : undefined}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="infinityGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Path */}
        <motion.path
          d="M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z"
          stroke={glowColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          className="blur-xs"
        />

        {/* Primary Infinity Path */}
        <motion.path
          d="M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z"
          stroke="url(#infinityGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeWidth: [4.8, 5.4, 4.8],
                  scale: [1, 1.015, 1],
                }
          }
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
};
