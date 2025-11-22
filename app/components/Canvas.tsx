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
    canvasConfig 
  } = useBuilder();
  
  const ref = useRef<HTMLDivElement>(null);

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
      if (!sourceClientOffset || !ref.current) return;

      const canvasRect = ref.current.getBoundingClientRect();
      let x = sourceClientOffset.x - canvasRect.left;
      let y = sourceClientOffset.y - canvasRect.top;

      const snapped = getSnappedPosition(x, y, canvasConfig.grid.size, canvasConfig.grid.snap);
      
      // Resolve size for collision check
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

      const width = resolveDimension(widthVal, canvasRect.width);
      const height = resolveDimension(heightVal, canvasRect.height);

      // Check collision
      const isColliding = checkCollision(
        { x: snapped.x, y: snapped.y, width, height },
        elements,
        item.id, // Exclude self if moving
        { width: canvasRect.width, height: canvasRect.height }
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
      if (!sourceClientOffset || !ref.current) return;

      const canvasRect = ref.current.getBoundingClientRect();
      let x = sourceClientOffset.x - canvasRect.left;
      let y = sourceClientOffset.y - canvasRect.top;

      const snapped = getSnappedPosition(x, y, canvasConfig.grid.size, canvasConfig.grid.snap);

      // Final collision check
      const resolveDimension = (val: number | string | undefined, containerSize: number) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.endsWith('%')) {
          return (parseFloat(val) / 100) * containerSize;
        }
        return typeof val === 'number' ? val : 100;
      };

      const widthVal = item.size?.width;
      const heightVal = item.size?.height;

      const width = resolveDimension(widthVal, canvasRect.width);
      const height = resolveDimension(heightVal, canvasRect.height);
      
      const isColliding = checkCollision(
        { x: snapped.x, y: snapped.y, width, height },
        elements,
        item.id,
        { width: canvasRect.width, height: canvasRect.height }
      );

      if (isColliding) {
        // Prevent drop
        return;
      }

      if (item.isNew) {
        addElement(item.type, snapped);
      } else {
        updateElement(item.id, { position: snapped });
      }
      
      setDragState(null);
    },
  }, [elements, canvasConfig]);

  drop(ref);

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
    <div 
      ref={ref}
      className="flex-1 relative bg-gray-50 dark:bg-gray-200 overflow-hidden transition-colors"
      onClick={() => selectElement(null)}
    >
      {canvasConfig.grid.enabled && (
        <GridOverlay size={canvasConfig.grid.size} />
      )}
      
      <div 
        className="w-full h-full relative"
        style={{
          // Simulate view mode width
          width: canvasConfig.viewMode === 'mobile' ? '375px' : canvasConfig.viewMode === 'tablet' ? '768px' : '100%',
          margin: '0 auto',
          borderLeft: canvasConfig.viewMode !== 'desktop' ? '1px solid #e5e7eb' : 'none',
          borderRight: canvasConfig.viewMode !== 'desktop' ? '1px solid #e5e7eb' : 'none',
          transition: 'width 0.3s ease'
        }}
      >
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
  );
};
