"use client";

import React from 'react';

interface GridOverlayProps {
  size: number;
  opacity?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ size, opacity = 0.1 }) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,${opacity}) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,${opacity}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`
      }}
    />
  );
};
