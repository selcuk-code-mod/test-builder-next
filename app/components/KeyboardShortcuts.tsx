"use client";

import { useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';

export const KeyboardShortcuts = () => {
  const { 
    selectedId, 
    removeElement, 
    duplicateElement, 
    undo, 
    redo 
  } = useBuilder();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        console.log('Delete key pressed', selectedId);
        if (selectedId) {
          removeElement(selectedId);
        }
      }

      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (selectedId) {
          duplicateElement(selectedId);
        }
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      
      // Redo with Ctrl+Y
      if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, removeElement, duplicateElement, undo, redo]);

  return null;
};
