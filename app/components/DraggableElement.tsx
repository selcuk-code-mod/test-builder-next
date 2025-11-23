"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { BuilderElement, ELEMENT_DEFAULTS } from '../utils/elementDefaults';
import { useBuilder } from '../context/BuilderContext';
import { HeaderElement } from './elements/HeaderElement';
import { FooterElement } from './elements/FooterElement';
import { CardElement } from './elements/CardElement';
import { TextElement } from './elements/TextElement';
import { SliderElement } from './elements/SliderElement';
import { ResizeHandles } from './ResizeHandles';
import { snapToGrid } from '../utils/positioning';
import { ElementToolbar } from './ElementToolbar';
import { ElementSettingsModal } from './ElementSettingsModal';

interface DraggableElementProps {
  element: BuilderElement;
  layoutOverride?: {
    x: number | string;
    y: number | string;
    width?: number | string;
    height?: number | string;
  };
}

export const DraggableElement: React.FC<DraggableElementProps> = ({ element, layoutOverride }) => {
  const { 
    selectElement, 
    selectedId, 
    updateElement, 
    canvasConfig,
    removeElement,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    zoom,
  } = useBuilder();
  
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedId === element.id;
  const [isResizing, setIsResizing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Drag logic
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CANVAS_ELEMENT',
    item: { 
      id: element.id, 
      type: element.type, 
      isNew: false,
      size: element.size,
      responsive: element.responsive 
    },
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
    // Use offsetLeft/Top for starting position if position is string (like '50%' or 'calc')
    const startLeft = typeof element.position.x === 'number' ? element.position.x : ref.current?.offsetLeft || 0;
    const startTop = typeof element.position.y === 'number' ? element.position.y : ref.current?.offsetTop || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const scale = zoom / 100;
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

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

  // Responsive Styles
  const getStyles = () => {
    const { viewMode } = canvasConfig;
    let width = element.size.width;
    let height = element.size.height;
    let x: number | string = element.position.x;
    let y: number | string = element.position.y;

    if (viewMode !== 'desktop') {
      const resp = element.responsive?.[viewMode];
      const defaultResp = ELEMENT_DEFAULTS[element.type].responsive?.[viewMode];
      
      // Width priority: responsive > default > layoutOverride > fallback (100%)
      if (resp?.width !== undefined) width = resp.width;
      else if (defaultResp?.width !== undefined) width = defaultResp.width;
      else if (layoutOverride?.width !== undefined) width = layoutOverride.width;
      else width = '100%';

      // Height priority: responsive > default > layoutOverride > fallback (current size)
      if (resp?.height !== undefined) height = resp.height;
      else if (defaultResp?.height !== undefined) height = defaultResp.height;
      else if (layoutOverride?.height !== undefined) height = layoutOverride.height;
      
      // X priority: responsive > default > layoutOverride > fallback (0)
      if (resp?.x !== undefined) x = resp.x;
      else if (defaultResp?.x !== undefined) x = defaultResp.x;
      else if (layoutOverride?.x !== undefined) x = layoutOverride.x;
      else x = 0;

      // Y priority: responsive > default > layoutOverride > fallback (current pos)
      if (resp?.y !== undefined) y = resp.y;
      else if (defaultResp?.y !== undefined) y = defaultResp.y;
      else if (layoutOverride?.y !== undefined) y = layoutOverride.y;
      // If neither, we keep the desktop Y (which might be weird, but usually layoutOverride covers it)
    }

    return {
      left: x,
      top: y,
      width,
      height,
      zIndex: element.zIndex,
      maxWidth: '100%', // Ensure it never overflows container width
    };
  };

  return (
    <>
      <div
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        className={`absolute group ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        style={{
          ...getStyles(),
          position: 'absolute',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Toolbar */}
        {isSelected && (
          <>
            <ElementToolbar 
              elementType={element.type}
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={() => removeElement(element.id)}
              onBringForward={() => bringForward(element.id)}
              onSendBackward={() => sendBackward(element.id)}
            />
            
            {/* Z-Index Indicator */}
            <div className={`absolute bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg font-mono ${
              element.type === 'header' ? '-bottom-8 right-40' : '-top-10 left-0'
            }`}>
              Z: {element.zIndex}
            </div>
          </>
        )}

        {/* Resizers */}
        {isSelected && (
          <ResizeHandles onResizeStart={handleResizeStart} />
        )}
        
        {/* Element Content */}
        <div className="w-full h-full overflow-hidden bg-white !dark:bg-gray-300 shadow-sm rounded-sm">
          {element.type === 'header' && <HeaderElement element={element} />}
          {element.type === 'footer' && <FooterElement element={element} />}
          {element.type === 'card' && <CardElement element={element} />}
          {element.type === 'text' && <TextElement element={element} />}
          {element.type === 'slider' && <SliderElement element={element} />}
        </div>
      </div>

      {/* Settings Modal */}
      {isEditModalOpen && (
        <ElementSettingsModal 
          elementId={element.id} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
};
