import { useEffect, useState } from 'react';

interface RGB {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_COLOR: RGB = { r: 139, g: 92, b: 246 }; // Tailwind violet-500

/**
 * Extrai a cor dominante de uma imagem carregada
 */
function getAverageRGB(imgEl: HTMLImageElement): RGB {
  const blockSize = 5; // visita a cada 5 pixels
  const defaultRGB = DEFAULT_COLOR;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return defaultRGB;
  }

  const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || 100;
  const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || 100;

  context.drawImage(imgEl, 0, 0);

  let data;
  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    // Falha de CORS
    return defaultRGB;
  }

  const length = data.data.length;
  let r = 0, g = 0, b = 0, count = 0;
  let i = -4;

  while ((i += blockSize * 4) < length) {
    ++count;
    r += data.data[i];
    g += data.data[i + 1];
    b += data.data[i + 2];
  }

  // Se a imagem for totalmente preta ou branca pura, evite
  r = ~~(r / count);
  g = ~~(g / count);
  b = ~~(b / count);

  // Evita cores super escuras (bump lightness)
  if (r < 30 && g < 30 && b < 30) {
    r += 30; g += 30; b += 30;
  }

  return { r, g, b };
}

export function useDynamicTheme(imageUrl: string | undefined) {
  const [color, setColor] = useState<RGB>(DEFAULT_COLOR);

  useEffect(() => {
    if (!imageUrl) {
      setColor(DEFAULT_COLOR);
      document.documentElement.style.setProperty('--moosic-accent', `${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}`);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Proxy fallback if we have severe CORS issues (which Deezer sometimes does)
    // we just try directly, if it fails, fallback.
    img.src = imageUrl;

    img.onload = () => {
      const avg = getAverageRGB(img);
      setColor(avg);
      document.documentElement.style.setProperty('--moosic-accent', `${avg.r}, ${avg.g}, ${avg.b}`);
    };

    img.onerror = () => {
      // Falha (CORS ou Not Found)
      setColor(DEFAULT_COLOR);
      document.documentElement.style.setProperty('--moosic-accent', `${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}`);
    };

  }, [imageUrl]);

  return {
    rgb: color,
    rgbString: `${color.r}, ${color.g}, ${color.b}`,
    hex: `#${(1 << 24 | color.r << 16 | color.g << 8 | color.b).toString(16).slice(1)}`
  };
}
