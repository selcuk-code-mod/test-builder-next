"use client";

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import { DraggableElement } from './DraggableElement';
import { GridOverlay } from './GridOverlay';
import { getSnappedPosition } from '../utils/positioning';
import { checkCollision } from '../utils/collision';
import { useToast } from './Toast';

export const Canvas: React.FC = () => {
  const { 
    elements, 
    addElement, 
    updateElement, 
    selectElement, 
    canvasConfig,
    zoom,
    setZoom
  } = useBuilder();
  
  const { showToast } = useToast();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dynamic canvas height based on elements
  const canvasHeight = React.useMemo(() => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    if (elements.length === 0) return Math.max(viewportHeight, 1000);
    
    const maxY = elements.reduce((max, el) => {
      const y = typeof el.position.y === 'number' ? el.position.y : 0;
      const h = typeof el.size.height === 'number' ? el.size.height : 200;
      return Math.max(max, y + h);
    }, 0);
    
    // Add padding and ensure minimum height
    const calculatedHeight = Math.max(maxY + 200, viewportHeight, 1000);
    return Math.min(calculatedHeight, canvasConfig.maxHeight);
  }, [elements, canvasConfig.maxHeight]);

  const [dragState, setDragState] = React.useState<{
    x: number;
    y: number;
    width: number | string;
    height: number | string;
    isColliding: boolean;
  } | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['SIDEBAR_ITEM', 'CANVAS_ELEMENT'],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item: any, monitor) => {
      const sourceClientOffset = monitor.getSourceClientOffset();
      if (!sourceClientOffset || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
      // Calculate unscaled dimensions
      const unscaledWidth = canvasRect.width / scale;
      const unscaledHeight = canvasRect.height / scale;

      let x = (sourceClientOffset.x - canvasRect.left) / scale;
      let y = (sourceClientOffset.y - canvasRect.top) / scale;

      let snapped = getSnappedPosition(x, y, canvasConfig.grid.size, canvasConfig.grid.snap);
      
      // Resolve dimensions first for boundary checking
      const resolveDim = (val: number | string | undefined, containerSize: number) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.endsWith('%')) {
          return (parseFloat(val) / 100) * containerSize;
        }
        return typeof val === 'number' ? val : 100;
      };

      const tempWidth = resolveDim(item.size?.width, unscaledWidth);
      const tempHeight = resolveDim(item.size?.height, unscaledHeight);
      
      // Clamp to canvas boundaries (prevent overflow from left, top, and right)
      snapped.x = Math.max(0, Math.min(snapped.x, unscaledWidth - tempWidth));
      snapped.y = Math.max(0, snapped.y); // Only top, bottom is unlimited
      
      // Resolve size for collision check using unscaled dimensions
      const resolveDimension = (val: number | string | undefined, containerSize: number) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.endsWith('%')) {
          return (parseFloat(val) / 100) * containerSize;
        }
        // Default fallback if unknown or calc
        return typeof val === 'number' ? val : 100; 
      };

      const widthVal = item.size?.width;
      const heightVal = item.size?.height;

      const width = resolveDimension(widthVal, unscaledWidth);
      const height = resolveDimension(heightVal, unscaledHeight);

      // Check collision using unscaled dimensions
      const isColliding = checkCollision(
        { x: snapped.x, y: snapped.y, width, height },
        elements,
        item.id, // Exclude self if moving
        { width: unscaledWidth, height: unscaledHeight }
      );

      setDragState({
        x: snapped.x,
        y: snapped.y,
        width,
        height,
        isColliding
      });
    },
    drop: (item: any, monitor) => {
      const sourceClientOffset = monitor.getSourceClientOffset();
      if (!sourceClientOffset || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      
      // Calculate unscaled dimensions
      const unscaledWidth = canvasRect.width / scale;
      const unscaledHeight = canvasRect.height / scale;

      let x = (sourceClientOffset.x - canvasRect.left) / scale;
      let y = (sourceClientOffset.y - canvasRect.top) / scale;

      let snapped = getSnappedPosition(x, y, canvasConfig.grid.size, canvasConfig.grid.snap);

      // Resolve dimensions first for boundary checking
      const resolveDim = (val: number | string | undefined, containerSize: number) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.endsWith('%')) {
          return (parseFloat(val) / 100) * containerSize;
        }
        return typeof val === 'number' ? val : 100;
      };

      const tempWidth = resolveDim(item.size?.width, unscaledWidth);
      const tempHeight = resolveDim(item.size?.height, unscaledHeight);
      
      // Clamp to canvas boundaries (prevent overflow from left, top, and right)
      snapped.x = Math.max(0, Math.min(snapped.x, unscaledWidth - tempWidth));
      snapped.y = Math.max(0, snapped.y); // Only top, bottom is unlimited

      // Special handling for Header: Always snap to top
      if (item.type === 'header') {
        snapped.y = 0;
        snapped.x = 0; // Also snap to left
      }

      // Final collision check using unscaled dimensions
      const resolveDimension = (val: number | string | undefined, containerSize: number) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.endsWith('%')) {
          return (parseFloat(val) / 100) * containerSize;
        }
        return typeof val === 'number' ? val : 100;
      };

      const widthVal = item.size?.width;
      const heightVal = item.size?.height;

      const width = resolveDimension(widthVal, unscaledWidth);
      const height = resolveDimension(heightVal, unscaledHeight);
      
      const isColliding = checkCollision(
        { x: snapped.x, y: snapped.y, width, height },
        elements,
        item.id,
        { width: unscaledWidth, height: unscaledHeight }
      );

      // Boundary validation
      const elementBottomY = snapped.y + height;
      
      if (elementBottomY > canvasConfig.maxHeight) {
        showToast('error', `Canvas yükseklik limiti aşıldı! (Max: ${canvasConfig.maxHeight}px)`);
        setDragState(null);
        return;
      }

      if (elementBottomY > canvasConfig.warningThreshold && elementBottomY <= canvasConfig.maxHeight) {
        showToast('warning', `Canvas yükseklik limitine yaklaşıyorsunuz! (${Math.round(elementBottomY)}/${canvasConfig.maxHeight}px)`);
      }

      // if (isColliding) {
      //   // Prevent drop
      //   return;
      // }

      if (item.isNew) {
        addElement(item.type, snapped);
      } else {
        updateElement(item.id, { position: snapped });
      }
      
      setDragState(null);
    },
  }, [elements, canvasConfig, zoom]);

  drop(containerRef);

  // Clear drag state when not over
  React.useEffect(() => {
    if (!isOver) {
      setDragState(null);
    }
  }, [isOver]);

  // Responsive layout override
  const sortedElements = React.useMemo(() => {
    // Mobile stacking logic (< 600px)
    if (windowWidth <= 600) {
      // Sort by Y position to stack correctly
      const sorted = [...elements].sort((a, b) => {
        const aY = typeof a.position.y === 'number' ? a.position.y : 0;
        const bY = typeof b.position.y === 'number' ? b.position.y : 0;
        return aY - bY;
      });

      let currentY = 0;
      const GAP = 20;

      return sorted.map(el => {
        const height = typeof el.size.height === 'number' ? el.size.height : 200;
        
        const override = {
          x: 0,
          y: currentY,
          width: '100%',
          height
        };
        
        currentY += height + GAP;
        
        return { ...el, layoutOverride: override };
      });
    }

    return elements.map(el => ({ ...el, layoutOverride: undefined }));
  }, [elements, windowWidth]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-end px-4 gap-2 z-10">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
          >
            −
          </button>
          <span className="text-sm font-medium w-12 text-center text-gray-700 dark:text-gray-200">{zoom}%</span>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
          >
            +
          </button>
          <button 
            className="px-3 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-700 ml-1"
            onClick={() => setZoom(100)}
          >
            Fit
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto preview-container relative dark:bg-gray-600"
        onClick={() => selectElement(null)}
      >
        <div 
          className="min-h-full w-full flex justify-center p-8 origin-top"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <div 
            ref={canvasRef}
            className="relative bg-white dark:bg-gray-600 shadow-sm transition-all duration-300"
            style={{
              width: '100%',
              maxWidth: '1440px',
              minHeight: '100vh',
              maxHeight: `${canvasConfig.maxHeight}px`,
              height: 'auto',
              boxShadow: '0 0 20px rgba(0,0,0,0.05)'
            }}
          >
            {canvasConfig.grid.enabled && (
              <GridOverlay size={canvasConfig.grid.size} canvasHeight={canvasHeight} />
            )}
            
            {sortedElements.map((el) => (
              <DraggableElement 
                key={el.id} 
                element={el} 
                layoutOverride={el.layoutOverride}
              />
            ))}

            {/* Ghost Element for Drag Feedback */}
            {isOver && dragState && (
              <div
                style={{
                  position: 'absolute',
                  left: dragState.x,
                  top: dragState.y,
                  width: dragState.width,
                  height: dragState.height,
                  border: `2px solid ${dragState.isColliding ? 'red' : '#3b82f6'}`,
                  backgroundColor: dragState.isColliding ? 'rgba(255, 0, 0, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  zIndex: 100,
                  pointerEvents: 'none',
                  transition: 'all 0.1s ease'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
