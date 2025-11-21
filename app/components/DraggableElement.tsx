"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { BuilderElement } from '../utils/elementDefaults';
import { useBuilder } from '../context/BuilderContext';
import { HeaderElement } from './elements/HeaderElement';
import { FooterElement } from './elements/FooterElement';
import { CardElement } from './elements/CardElement';
import { TextElement } from './elements/TextElement';
import { SliderElement } from './elements/SliderElement';
import { ResizeHandles } from './ResizeHandles';
import { snapToGrid } from '../utils/positioning';

const ElementComponents = {
  header: HeaderElement,
  footer: FooterElement,
  card: CardElement,
  text: TextElement,
  slider: SliderElement,
};

interface DraggableElementProps {
  element: BuilderElement;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {
  const { 
    selectElement, 
    selectedId, 
    updateElement, 
    canvasConfig, 
  } = useBuilder();
  
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedId === element.id;
  const [isResizing, setIsResizing] = useState(false);

  // Drag logic
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CANVAS_ELEMENT',
    item: { id: element.id, type: element.type, isNew: false },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Hide default drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Connect drag source to ref
  drag(ref);

  // Resize Logic
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = typeof element.size.width === 'number' ? element.size.width : ref.current?.offsetWidth || 0;
    const startHeight = typeof element.size.height === 'number' ? element.size.height : ref.current?.offsetHeight || 0;
    const startLeft = element.position.x;
    const startTop = element.position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes('e')) newWidth = startWidth + deltaX;
      if (direction.includes('w')) {
        newWidth = startWidth - deltaX;
        newX = startLeft + deltaX;
      }
      if (direction.includes('s')) newHeight = startHeight + deltaY;
      if (direction.includes('n')) {
        newHeight = startHeight - deltaY;
        newY = startTop + deltaY;
      }

      // Grid Snap for Resize
      if (canvasConfig.grid.snap) {
        if (direction.includes('e') || direction.includes('w')) newWidth = snapToGrid(newWidth, canvasConfig.grid.size);
        if (direction.includes('s') || direction.includes('n')) newHeight = snapToGrid(newHeight, canvasConfig.grid.size);
        if (direction.includes('w')) newX = snapToGrid(newX, canvasConfig.grid.size);
        if (direction.includes('n')) newY = snapToGrid(newY, canvasConfig.grid.size);
      }

      // Min size constraint
      if (newWidth < 50) newWidth = 50;
      if (newHeight < 20) newHeight = 20;

      // Update without history during drag
      updateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY },
      }, true);
      
      // Store final values in a temp way if needed, or just rely on the fact that 
      // the state IS updated, just not the history.
      // But for the final commit, we need to trigger a history save.
      // We can do this by calling updateElement again with the SAME values but history: false.
      // However, we need the values.
      (handleMouseUp as any).finalState = {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY },
      };
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Commit final state to history
      const finalState = (handleMouseUp as any).finalState;
      if (finalState) {
        updateElement(element.id, finalState, false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const Component = ElementComponents[element.type];

  // Responsive Styles
  const getStyles = () => {
    const { viewMode } = canvasConfig;
    let width = element.size.width;
    let height = element.size.height;
    let x = element.position.x;
    let y = element.position.y;

    if (viewMode !== 'desktop' && element.responsive?.[viewMode]) {
      const resp = element.responsive[viewMode]!;
      if (resp.width !== undefined) width = resp.width;
      if (resp.height !== undefined) height = resp.height;
      if (resp.x !== undefined) x = resp.x;
      if (resp.y !== undefined) y = resp.y;
    }

    return {
      left: x,
      top: y,
      width,
      height,
      zIndex: element.zIndex,
    };
  };

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      className={`absolute group ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{
        ...getStyles(),
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <Component element={element} />
      
      {isSelected && !isDragging && (
        <ResizeHandles onResizeStart={handleResizeStart} />
      )}
      
      {/* Label for debug/visual */}
      <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {element.type} ({Math.round(element.position.x)}, {Math.round(element.position.y)})
      </div>
    </div>
  );
};
