import React from 'react';

export interface SliderProps {
  value: number; // 0 a 100
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ariaLabel = 'Slider',
  className = '',
}: SliderProps) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <div className={`relative flex items-center w-full group py-1.5 cursor-pointer ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
      />
      {/* Track base */}
      <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden relative">
        {/* Track fill */}
        <div
          className="h-full bg-brand-purple rounded-full transition-all group-hover:bg-brand-hover"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Thumb handle */}
      <div
        className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform scale-0 group-hover:scale-100 pointer-events-none -ml-1.5"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}
