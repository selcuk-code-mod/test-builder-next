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

export default function Home() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <BuilderProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white font-sans flex-row">
            
            {/* Sidebar */}
            <div className="h-full bg-white dark:bg-gray-900 shadow-xl z-20 relative">
              <Sidebar />
            </div>
            
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
