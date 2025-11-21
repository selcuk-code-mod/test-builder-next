"use client";

import React from 'react';
import { useBuilder } from '../context/BuilderContext';

export const Toolbar: React.FC = () => {
  const { 
    undo, redo, canUndo, canRedo, 
    clearCanvas, 
    canvasConfig, updateCanvasConfig,
    exportJSON, importJSON
  } = useBuilder();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importJSON(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-builder-export.json';
    a.click();
  };

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between shadow-sm z-10">
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'desktop' })}
            className={`p-2 rounded ${canvasConfig.viewMode === 'desktop' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-500'}`}
            title="Desktop"
          >
            🖥️
          </button>
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'tablet' })}
            className={`p-2 rounded ${canvasConfig.viewMode === 'tablet' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-500'}`}
            title="Tablet"
          >
            📱
          </button>
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'mobile' })}
            className={`p-2 rounded ${canvasConfig.viewMode === 'mobile' ? 'bg-white dark:bg-gray-700 shadow' : 'text-gray-500'}`}
            title="Mobile"
          >
            📲
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

        <button 
          onClick={() => updateCanvasConfig({ grid: { ...canvasConfig.grid, enabled: !canvasConfig.grid.enabled } })}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${canvasConfig.grid.enabled ? 'text-blue-500' : 'text-gray-500'}`}
          title="Toggle Grid"
        >
          Grid
        </button>
        <button 
          onClick={() => updateCanvasConfig({ grid: { ...canvasConfig.grid, snap: !canvasConfig.grid.snap } })}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${canvasConfig.grid.snap ? 'text-blue-500' : 'text-gray-500'}`}
          title="Toggle Snap"
        >
          Snap
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={undo} 
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          ↩️
        </button>
        <button 
          onClick={redo} 
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↪️
        </button>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

        <button 
          onClick={clearCanvas}
          className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          Clear
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

        <button 
          onClick={handleImport}
          className="px-3 py-1.5 text-sm bg-gray-400 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded"
        >
          Import
        </button>
        <button 
          onClick={handleExport}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm"
        >
          Export
        </button>
      </div>
    </div>
  );
};
