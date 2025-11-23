"use client";

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ElementType, ELEMENT_DEFAULTS } from '../utils/elementDefaults';
import { useBuilder } from '../context/BuilderContext';
import { useTheme } from '../context/ThemeContext';

import { FaHeading, FaParagraph, FaImage, FaLayerGroup, FaSquare, FaChevronLeft, FaChevronRight, FaUndo, FaRedo, FaTrash, FaFileImport, FaFileExport } from 'react-icons/fa';
import { MdViewDay, MdViewStream, MdGridOn, MdGridOff } from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';

const ICON_MAP: Record<ElementType, React.ReactNode> = {
  header: <FaHeading />,
  footer: <MdViewStream />,
  card: <FaSquare />,
  text: <FaParagraph />,
  slider: <FaLayerGroup />,
};

const SidebarItem: React.FC<{ type: ElementType; label: string; isCollapsed: boolean }> = ({ type, label, isCollapsed }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SIDEBAR_ITEM',
    item: { 
      type, 
      isNew: true,
      size: ELEMENT_DEFAULTS[type].size 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-grab transition-all border hover:shadow-md
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
        ${isCollapsed ? 'justify-center' : ''}
        bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800
        text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
      `}
      title={isCollapsed ? label : undefined}
    >
      <span className="text-xl">{ICON_MAP[type]}</span>
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          const canvasWidth = Math.max(window.innerWidth - (isCollapsed ? 80 : 288) - 48, 800);
          const canvasHeight = Math.max(window.innerHeight - 64 - 48, 600);
          importJSON(content, canvasWidth, canvasHeight);
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
    <aside 
      className={`
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className={`p-6 border-b border-gray-200 dark:border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Builder
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">v1.0</p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Components Section */}
        <div className="flex flex-col gap-3">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
              Elements
            </h3>
          )}
          <SidebarItem type="header" label="Header" isCollapsed={isCollapsed} />
          <SidebarItem type="footer" label="Footer" isCollapsed={isCollapsed} />
          <SidebarItem type="card" label="Card" isCollapsed={isCollapsed} />
          <SidebarItem type="text" label="Text Block" isCollapsed={isCollapsed} />
          <SidebarItem type="slider" label="Slider" isCollapsed={isCollapsed} />
        </div>

        {/* Responsive Toolbar Actions (Visible < 950px) */}
        <div className="min-[950px]:hidden flex flex-col gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
              Actions
            </h3>
          )}
          
          <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-row justify-between'} gap-2`}>
            <button onClick={undo} disabled={!canUndo} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-300" title="Undo">
              <FaUndo size={14} />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-300" title="Redo">
              <FaRedo size={14} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300" title="Toggle Theme">
              {theme === 'light' ? <FiMoon size={14} /> : <FiSun size={14} />}
            </button>
          </div>

          <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-row'} gap-2`}>
             <button 
              onClick={() => updateCanvasConfig({ grid: { ...canvasConfig.grid, enabled: !canvasConfig.grid.enabled } })}
              className={`p-2 rounded transition-colors ${canvasConfig.grid.enabled ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Grid"
            >
              {canvasConfig.grid.enabled ? <MdGridOn size={16} /> : <MdGridOff size={16} />}
            </button>
            <button onClick={clearCanvas} className="p-2 rounded hover:bg-red-50 text-red-500" title="Clear Canvas">
              <FaTrash size={14} />
            </button>
          </div>

          <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-col'} gap-2`}>
             <button onClick={handleImport} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 w-full justify-center">
               <FaFileImport size={14} />
               {!isCollapsed && <span>Import</span>}
             </button>
             <button onClick={handleExport} className="flex items-center gap-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm text-blue-600 dark:text-blue-400 w-full justify-center">
               <FaFileExport size={14} />
               {!isCollapsed && <span>Export</span>}
             </button>
          </div>
        </div>
      </div>
      
      {/* Footer User Profile (Mock) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">Demo User</p>
              <p className="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
