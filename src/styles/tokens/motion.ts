/**
 * MooSic Design System: Motion & Animation Tokens
 */

export const motionTokens = {
  duration: {
    instant: '75ms',
    fast: '150ms',      // Microinterações e hovers rápidos
    normal: '250ms',    // Transições de estados de botões e cards
    slow: '400ms',      // Expansões de modais e painéis
    ambient: '800ms',   // Transições de atmosfera de cores de capas
  },
  easing: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',       // Ease-out refinado Apple/Linear-style
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.15)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const motion = {
  duration: motionTokens.duration,
  easing: motionTokens.easing,
};
