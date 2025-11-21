"use client";

import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

export const Toolbar: React.FC = () => {
  const { 
    undo, redo, canUndo, canRedo, 
    clearCanvas, 
    canvasConfig, updateCanvasConfig,
    exportJSON, importJSON
  } = useBuilder();
  
  const { theme, toggleTheme } = useTheme();

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
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 justify-between shadow-sm z-10">
      <div className="flex items-center gap-3">
        {/* View Mode Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'desktop' })}
            className={`p-2 rounded transition-all ${
              canvasConfig.viewMode === 'desktop' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Desktop View"
          >
            <FiMonitor size={18} />
          </button>
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'tablet' })}
            className={`p-2 rounded transition-all ${
              canvasConfig.viewMode === 'tablet' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Tablet View"
          >
            <FiTablet size={18} />
          </button>
          <button 
            onClick={() => updateCanvasConfig({ viewMode: 'mobile' })}
            className={`p-2 rounded transition-all ${
              canvasConfig.viewMode === 'mobile' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Mobile View"
          >
            <FiSmartphone size={18} />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />

        {/* Grid Controls */}
        <button 
          onClick={() => updateCanvasConfig({ grid: { ...canvasConfig.grid, enabled: !canvasConfig.grid.enabled } })}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
            canvasConfig.grid.enabled 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Toggle Grid"
        >
          Grid
        </button>
        <button 
          onClick={() => updateCanvasConfig({ grid: { ...canvasConfig.grid, snap: !canvasConfig.grid.snap } })}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
            canvasConfig.grid.snap 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Toggle Snap to Grid"
        >
          Snap
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Undo/Redo */}
        <button 
          onClick={undo} 
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-all"
          title="Undo (Ctrl+Z)"
        >
          ↩️
        </button>
        <button 
          onClick={redo} 
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-all"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↪️
        </button>
        
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />

        {/* Actions */}
        <button 
          onClick={clearCanvas}
          className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition-all"
        >
          Clear
        </button>

        <button 
          onClick={handleImport}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium transition-all"
        >
          Import
        </button>
        <button 
          onClick={handleExport}
          className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm transition-all"
        >
          Export
        </button>
      </div>
    </div>
  );
};
