

import React from 'react';

interface GridOverlayProps {
  size: number;
  opacity?: number;
  canvasHeight?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ size, opacity = 0.1, canvasHeight }) => {
  return (
    <div 
      className="absolute top-0 left-0 pointer-events-none z-0"
      style={{
        width: '100%',
        height: canvasHeight ? `${canvasHeight}px` : '100%',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,${opacity}) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,${opacity}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`
      }}
    />
  );
};
