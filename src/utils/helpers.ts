/**
 * Utilitários gerais do sistema MooSic
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
