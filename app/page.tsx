"use client";

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider } from './context/BuilderContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <BuilderProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white font-sans flex-col md:flex-row">
            
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40 shrink-0">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <FiMenu size={24} />
              </button>
              <span className="font-bold text-lg">Page Builder</span>
              <div className="w-8" /> {/* Spacer for balance */}
            </div>

            {/* Sidebar Wrapper */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
              md:relative md:translate-x-0 md:shadow-none md:flex md:h-full md:z-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {/* Mobile Close Button */}
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-50"
              >
                <FiX size={20} />
              </button>
              <Sidebar />
            </div>

            {/* Sidebar Backdrop */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
              <Toolbar />
              <Canvas />
            </div>
            
            <KeyboardShortcuts />
          </div>
        </BuilderProvider>
      </DndProvider>
    </ThemeProvider>
  );
}
