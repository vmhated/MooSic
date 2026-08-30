interface MooMarkProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

/**
 * Componente do Símbolo Gráfico da marca MooSic.
 * Representa o símbolo derivado do conceito dos dois "O"s (Infinito) sem recorrer a clichês como notas ou fones.
 * É uma implementação vetorial independente e facilmente substituível quando a arte final da marca for definida.
 */
export function MooMark({ size = 32, glow = true, className = '' }: MooMarkProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-surface-elevated border border-surface-border transition-all ${
        glow ? 'shadow-glow border-brand-purple/40' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      aria-label="MooSic Symbol"
    >
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1818 8C15.867 8 13.9113 9.4935 12 12C10.0887 14.5065 8.13303 16 5.81818 16C3.70949 16 2 14.2107 2 12C2 9.78934 3.70949 8 5.81818 8C8.13303 8 10.0887 9.4935 12 12C13.9113 14.5065 15.867 16 18.1818 16C20.2905 16 22 14.2107 22 12C22 9.78934 20.2905 8 18.1818 8Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-purple"
        />
      </svg>
    </div>
  );
}
