"use client";

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import { DraggableElement } from './DraggableElement';
import { GridOverlay } from './GridOverlay';
import { getSnappedPosition } from '../utils/positioning';
import { checkCollision } from '../utils/collision';
import { ELEMENT_DEFAULTS } from '../utils/elementDefaults';

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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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
      
      // Clamp to positive coordinates
      snapped.x = Math.max(0, snapped.x);
      snapped.y = Math.max(0, snapped.y);
      
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

      // Clamp to positive coordinates
      snapped.x = Math.max(0, snapped.x);
      snapped.y = Math.max(0, snapped.y);

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

  // Auto-layout calculation for responsive modes
  const sortedElements = React.useMemo(() => {
    if (canvasConfig.viewMode === 'desktop') {
      return elements.map(el => ({ ...el, layoutOverride: undefined }));
    }

    // Sort elements by Y position (then X) to determine flow order
    const sorted = [...elements].sort((a, b) => {
      const aY = typeof a.position.y === 'number' ? a.position.y : 0;
      const bY = typeof b.position.y === 'number' ? b.position.y : 0;
      if (Math.abs(aY - bY) > 10) return aY - bY; // Tolerance for same row
      
      const aX = typeof a.position.x === 'number' ? a.position.x : 0;
      const bX = typeof b.position.x === 'number' ? b.position.x : 0;
      return aX - bX;
    });

    let currentY = 0;
    let currentRowHeight = 0;
    let col = 0;
    const GAP = 20;

    return sorted.map(el => {
      const viewMode = canvasConfig.viewMode as 'mobile' | 'tablet';
      // Resolve width: check instance override -> type default -> fallback
      const instanceResp = el.responsive?.[viewMode];
      const defaultResp = ELEMENT_DEFAULTS[el.type].responsive?.[viewMode];
      
      // Check if element has specific responsive positioning (manual override)
      if (instanceResp && instanceResp.y !== undefined) {
        // Flush current row if any
        if (col > 0) {
          currentY += currentRowHeight + GAP;
          currentRowHeight = 0;
          col = 0;
        }

        // Update currentY to be below this element if it's further down
        const h = instanceResp.height || el.size.height;
        const y = instanceResp.y;
        
        if (typeof y === 'number' && typeof h === 'number') {
           currentY = Math.max(currentY, y + h + GAP);
        }
        
        return { ...el, layoutOverride: undefined };
      }

      // Otherwise, auto-stack
      const width = instanceResp?.width ?? defaultResp?.width ?? '100%';
      const height = typeof instanceResp?.height === 'number' ? instanceResp.height : 
                     (typeof defaultResp?.height === 'number' ? defaultResp.height :
                     (typeof el.size.height === 'number' ? el.size.height : 200));
      
      // Check if half width (e.g. tablet cards)
      const isHalf = typeof width === 'string' && width.includes('/ 2');
      
      let x: string | number = 0;
      let y = currentY;

      if (isHalf) {
        if (col === 0) {
          x = 0;
          currentRowHeight = Math.max(currentRowHeight, height as number);
          col = 1;
        } else {
          x = '50%';
          currentRowHeight = Math.max(currentRowHeight, height as number);
          col = 0;
          currentY += currentRowHeight + GAP;
          currentRowHeight = 0;
        }
      } else {
        // Full width
        if (col > 0) {
          currentY += currentRowHeight + GAP;
          currentRowHeight = 0;
          col = 0;
          y = currentY;
        }
        x = 0;
        currentY += (height as number) + GAP;
      }

      const override = {
        x,
        y,
        width,
        height
      };

      return { ...el, layoutOverride: override };
    });
  }, [elements, canvasConfig.viewMode]);

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
        className="flex-1 overflow-auto preview-container relative dark:bg-gray-800 "
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
            className="relative bg-white dark:bg-gray-800 shadow-sm transition-all duration-300"
            style={{
              // Simulate view mode width
              width: canvasConfig.viewMode === 'mobile' ? '375px' : canvasConfig.viewMode === 'tablet' ? '768px' : '100%',
              minHeight: canvasConfig.viewMode === 'desktop' ? '100%' : '800px',
              height: 'auto',
              boxShadow: '0 0 20px rgba(0,0,0,0.05)'
            }}
          >
            {canvasConfig.grid.enabled && (
              <GridOverlay size={canvasConfig.grid.size} />
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
