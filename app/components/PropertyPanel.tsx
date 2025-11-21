"use client";

import React from 'react';
import { useBuilder } from '../context/BuilderContext';

export const PropertyPanel: React.FC = () => {
  const { 
    selectedId, 
    elements, 
    updateElement, 
    bringToFront, 
    sendToBack, 
    bringForward, 
    sendBackward,
    removeElement
  } = useBuilder();

  const selectedElement = elements.find(el => el.id === selectedId);

  if (!selectedElement) {
    return (
      <aside className="w-72 bg-gray-900 border-l border-gray-800 p-6 text-gray-500 flex items-center justify-center">
        <p>Select an element to edit properties</p>
      </aside>
    );
  }

  const handleSizeChange = (dim: 'width' | 'height', value: string) => {
    const num = parseInt(value);
    updateElement(selectedElement.id, {
      size: {
        ...selectedElement.size,
        [dim]: isNaN(num) ? value : num
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      updateElement(selectedElement.id, {
        position: {
          ...selectedElement.position,
          [axis]: num
        }
      });
    }
  };

  const handleContentChange = (key: string, value: string) => {
    updateElement(selectedElement.id, {
      content: {
        ...selectedElement.content,
        [key]: value
      }
    });
  };

  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">Properties</h2>
        <p className="text-xs text-gray-500">ID: {selectedElement.id.slice(0, 8)}...</p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Layout */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">X</label>
              <input 
                type="number" 
                value={Math.round(selectedElement.position.x)} 
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Y</label>
              <input 
                type="number" 
                value={Math.round(selectedElement.position.y)} 
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Width</label>
              <input 
                type="text" 
                value={selectedElement.size.width} 
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Height</label>
              <input 
                type="text" 
                value={selectedElement.size.height} 
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Layering */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layering (Z-Index: {selectedElement.zIndex})</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => bringForward(selectedElement.id)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 rounded">Bring Forward</button>
            <button onClick={() => sendBackward(selectedElement.id)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 rounded">Send Backward</button>
            <button onClick={() => bringToFront(selectedElement.id)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 rounded">Bring to Front</button>
            <button onClick={() => sendToBack(selectedElement.id)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 rounded">Send to Back</button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</h3>
          {Object.entries(selectedElement.content).map(([key, value]) => {
            if (key === 'style') return null; // Skip style object for now
            if (Array.isArray(value)) return null; // Skip arrays for now (like slider slides)
            
            return (
              <div key={key}>
                <label className="text-xs text-gray-400 block mb-1 capitalize">{key}</label>
                {key === 'description' || key === 'text' ? (
                  <textarea
                    value={value as string}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-800">
          <button 
            onClick={() => removeElement(selectedElement.id)}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded text-sm font-medium transition-colors"
          >
            Delete Element
          </button>
        </div>
      </div>
    </aside>
  );
};
