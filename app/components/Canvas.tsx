"use client";

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import { DraggableElement } from './DraggableElement';
import { GridOverlay } from './GridOverlay';
import { getSnappedPosition } from '../utils/positioning';

export const Canvas: React.FC = () => {
  const { 
    elements, 
    addElement, 
    updateElement, 
    selectElement, 
    canvasConfig 
  } = useBuilder();
  
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ['SIDEBAR_ITEM', 'CANVAS_ELEMENT'],
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset || !ref.current) return;

      const canvasRect = ref.current.getBoundingClientRect();
      
      // Calculate position relative to canvas
      let x = clientOffset.x - canvasRect.left;
      let y = clientOffset.y - canvasRect.top;

      // Adjust for scroll if needed (ref.current.scrollLeft...)
      
      // If moving existing element, we need to account for the initial grab offset
      // But for simplicity in this 'drop' handler, we might just use the final position.
      // However, 'useDrag' on the element handles the visual movement.
      // We need to update the store.
      
      // Snap to grid
      const snapped = getSnappedPosition(x, y, canvasConfig.grid.size, canvasConfig.grid.snap);

      if (item.isNew) {
        addElement(item.type, snapped);
      } else {
        // For existing elements, we calculate the new position based on delta
        // But here we are calculating absolute position from drop.
        // Since we don't know the exact grab point offset in 'drop' easily without 'monitor.getInitialSourceClientOffset()',
        // let's try to use the delta.
        
        // Actually, for existing elements, it's better to update position during 'hover' or 'drag' end.
        // But 'drop' is fine for final commitment.
        // Let's use the item's current position + delta? No, item doesn't have position in it unless we put it there.
        // Let's rely on the calculation we did above which places the TOP-LEFT of the drag preview at the mouse?
        // No, usually we want the element to stay under the cursor where we grabbed it.
        
        // Better approach for existing elements:
        // The `DraggableElement` component handles its own position updates via `useDrag`? 
        // No, `useDrag` doesn't update state automatically.
        // We need to update state here.
        
        // Let's use the delta approach for existing elements to preserve grab offset.
        const element = elements.find(e => e.id === item.id);
        if (element && delta) {
           let newX = element.position.x + delta.x;
           let newY = element.position.y + delta.y;
           
           const snappedMove = getSnappedPosition(newX, newY, canvasConfig.grid.size, canvasConfig.grid.snap);
           updateElement(item.id, { position: snappedMove });
        }
      }
    },
  });

  drop(ref);

  return (
    <div 
      ref={ref}
      className="flex-1 relative bg-gray-50 dark:bg-black overflow-hidden transition-colors"
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
          borderLeft: canvasConfig.viewMode !== 'desktop' ? '1px solid #333' : 'none',
          borderRight: canvasConfig.viewMode !== 'desktop' ? '1px solid #333' : 'none',
          transition: 'width 0.3s ease'
        }}
      >
        {elements.map((el) => (
          <DraggableElement key={el.id} element={el} />
        ))}
      </div>
    </div>
  );
};
