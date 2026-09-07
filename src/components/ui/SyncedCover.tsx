import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncedCoverProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackColor?: string; // Optional hex or rgb color to show while loading
}

/**
 * A highly optimized Image component that eliminates flashing, blank alt-texts, 
 * and layout shifts by handling image load events and cross-fading gracefully.
 */
export const SyncedCover: React.FC<SyncedCoverProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackColor = 'rgba(255,255,255,0.05)'
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [nextSrc, setNextSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // If src changes, we want to download the new one in the background
    // before we replace the currently visible image.
    if (src !== currentSrc && src !== nextSrc) {
      setIsLoading(true);
      setHasError(false);
      setNextSrc(src);
      
      const img = new Image();
      img.src = src || '';
      img.onload = () => {
        // Once downloaded, we swap the visible source
        setCurrentSrc(src);
        setNextSrc(undefined);
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        // On error, we just keep the old image or show fallback
      };
    }
  }, [src, currentSrc, nextSrc]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ backgroundColor: fallbackColor }}
    >
      <AnimatePresence mode="popLayout">
        {!hasError && currentSrc && (
          <motion.img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0.4 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      {/* Loading Skeleton Overlay */}
      <AnimatePresence>
        {(isLoading || (!currentSrc && !hasError)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full bg-white/5 animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
