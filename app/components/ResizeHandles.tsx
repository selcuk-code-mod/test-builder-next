"use client";

import React from 'react';

interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, direction: string) => void;
}

const HANDLE_STYLES = "absolute w-3 h-3 bg-blue-500 border border-white rounded-full z-50";

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart }) => {
  return (
    <>
      {/* Corners */}
      <div className={`${HANDLE_STYLES} -top-1.5 -left-1.5 cursor-nw-resize`} onMouseDown={(e) => onResizeStart(e, 'nw')} />
      <div className={`${HANDLE_STYLES} -top-1.5 -right-1.5 cursor-ne-resize`} onMouseDown={(e) => onResizeStart(e, 'ne')} />
      <div className={`${HANDLE_STYLES} -bottom-1.5 -left-1.5 cursor-sw-resize`} onMouseDown={(e) => onResizeStart(e, 'sw')} />
      <div className={`${HANDLE_STYLES} -bottom-1.5 -right-1.5 cursor-se-resize`} onMouseDown={(e) => onResizeStart(e, 'se')} />
      
      {/* Edges */}
      <div className={`${HANDLE_STYLES} -top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize`} onMouseDown={(e) => onResizeStart(e, 'n')} />
      <div className={`${HANDLE_STYLES} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize`} onMouseDown={(e) => onResizeStart(e, 's')} />
      <div className={`${HANDLE_STYLES} top-1/2 -translate-y-1/2 -left-1.5 cursor-w-resize`} onMouseDown={(e) => onResizeStart(e, 'w')} />
      <div className={`${HANDLE_STYLES} top-1/2 -translate-y-1/2 -right-1.5 cursor-e-resize`} onMouseDown={(e) => onResizeStart(e, 'e')} />
    </>
  );
};
