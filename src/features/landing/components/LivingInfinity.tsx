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
 * LivingInfinity: O símbolo ∞ como elemento vivo.
 * Mantém micro-movimentos orgânicos (respiração sutil, ondas de luminosidade e resposta suave ao cursor).
 */
export const LivingInfinity: React.FC<LivingInfinityProps> = ({
  size = 120,
  className = '',
  glowColor = '#8B5CF6',
  glowOpacity = 0.35,
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
                opacity: [glowOpacity * 0.7, glowOpacity * 1.3, glowOpacity * 0.7],
                scale: [0.95, 1.08, 0.95],
              }
        }
        transition={{
          duration: 4,
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
        whileHover={interactive && !shouldReduceMotion ? { scale: 1.06 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <defs>
          <linearGradient id="infinityGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <filter id="infinityGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Halo Path */}
        <motion.path
          d="M 50,50 C 50,22 15,22 15,50 C 15,78 50,78 50,50 C 50,22 85,22 85,50 C 85,78 50,78 50,50 Z"
          transform="translate(50, 0) scale(1)"
          stroke={glowColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          filter="url(#infinityGlowFilter)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [0.15, 0.35, 0.15],
                  strokeWidth: [5, 7, 5],
                }
          }
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Smooth Infinity Path: Smooth Bernoulli Lemniscate Curves */}
        {/* Left Loop: centered around x=58, Right Loop: centered around x=142, Center node: (100, 50) */}
        <motion.path
          d="M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z"
          stroke="url(#infinityGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeWidth: [6, 7.2, 6],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Flowing energy pulse dot along the loop */}
        {!shouldReduceMotion && (
          <motion.circle
            r="4.5"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 6px #FFFFFF)"
            animate={{
              offsetDistance: ['0%', '100%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              offsetPath: "path('M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z')",
            }}
          />
        )}
      </motion.svg>
    </div>
  );
};
