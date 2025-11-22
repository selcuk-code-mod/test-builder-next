"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { BuilderElement, ElementType, ELEMENT_DEFAULTS } from '../utils/elementDefaults';
import { validateJSON } from '../utils/validation';

interface CanvasConfig {
  grid: {
    enabled: boolean;
    size: number;
    snap: boolean;
  };
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

interface BuilderState {
  elements: BuilderElement[];
  selectedId: string | null;
  canvasConfig: CanvasConfig;
  history: {
    past: BuilderElement[][];
    future: BuilderElement[][];
  };
}

interface BuilderContextType extends Omit<BuilderState, 'history'> {
  addElement: (type: ElementType, position: { x: number; y: number }) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>, skipHistory?: boolean) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  duplicateElement: (id: string) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportJSON: () => string;
  importJSON: (json: string, canvasWidth?: number, canvasHeight?: number) => void;
  updateCanvasConfig: (config: Partial<CanvasConfig>) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const initialState: BuilderState = {
  elements: [],
  selectedId: null,
  canvasConfig: {
    grid: { enabled: true, size: 20, snap: true },
    viewMode: 'desktop',
  },
  history: {
    past: [],
    future: [],
  },
};

type Action =
  | { type: 'ADD_ELEMENT'; payload: BuilderElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<BuilderElement>; skipHistory?: boolean } }
  | { type: 'REMOVE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'SET_ELEMENTS'; payload: BuilderElement[] }
  | { type: 'UPDATE_CONFIG'; payload: Partial<CanvasConfig> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' };

const builderReducer = (state: BuilderState, action: Action): BuilderState => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      return {
        ...state,
        elements: [...state.elements, action.payload],
        selectedId: action.payload.id,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    case 'UPDATE_ELEMENT': {
      const updatedElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
      );
      return {
        ...state,
        elements: updatedElements,
        history: {
          past: action.payload.skipHistory ? state.history.past : [...state.history.past, state.elements],
          future: [],
        },
      };
    }
    case 'REMOVE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter((el) => el.id !== action.payload),
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedId: action.payload,
      };
    case 'SET_ELEMENTS':
      return {
        ...state,
        elements: action.payload,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        canvasConfig: { ...state.canvasConfig, ...action.payload },
      };
    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future],
        },
      };
    }
    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture,
        },
      };
    }
    case 'CLEAR_CANVAS':
      return {
        ...state,
        elements: [],
        selectedId: null,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    default:
      return state;
  }
};

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const addElement = useCallback((type: ElementType, position: { x: number; y: number }) => {
    const newElement: BuilderElement = {
      id: crypto.randomUUID(),
      type,
      position,
      ...ELEMENT_DEFAULTS[type],
      zIndex: state.elements.length + 1, // Simple auto-increment z-index
    } as BuilderElement;
    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
  }, [state.elements.length]);

  const updateElement = useCallback((id: string, updates: Partial<BuilderElement>, skipHistory: boolean = false) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates, skipHistory } });
  }, []);

  const removeElement = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', payload: id });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  }, []);

  const updateCanvasConfig = useCallback((config: Partial<CanvasConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  // Z-Index Helpers
  const bringToFront = useCallback((id: string) => {
    const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
    updateElement(id, { zIndex: maxZ + 1 });
  }, [state.elements, updateElement]);

  const sendToBack = useCallback((id: string) => {
    const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
    updateElement(id, { zIndex: minZ - 1 });
  }, [state.elements, updateElement]);

  const bringForward = useCallback((id: string) => {
    const el = state.elements.find((e) => e.id === id);
    if (el) updateElement(id, { zIndex: el.zIndex + 1 });
  }, [state.elements, updateElement]);

  const sendBackward = useCallback((id: string) => {
    const el = state.elements.find((e) => e.id === id);
    if (el) updateElement(id, { zIndex: el.zIndex - 1 });
  }, [state.elements, updateElement]);

  const duplicateElement = useCallback((id: string) => {
    const el = state.elements.find((e) => e.id === id);
    if (el) {
      const newElement = {
        ...el,
        id: crypto.randomUUID(),
        position: { 
          x: typeof el.position.x === 'number' ? el.position.x + 20 : el.position.x, 
          y: typeof el.position.y === 'number' ? el.position.y + 20 : el.position.y 
        },
        zIndex: state.elements.length + 1,
      };
      dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    }
  }, [state.elements]);

  const clearCanvas = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ elements: state.elements }, null, 2);
  }, [state.elements]);

  const importJSON = useCallback((json: string, canvasWidth: number = 1200, canvasHeight: number = 800) => {
    const validation = validateJSON(json);
    
    if (validation.valid && validation.data) {
      let elements = validation.data.elements;
      
      // Calculate max bounds of imported elements
      let maxWidth = 0;
      let maxHeight = 0;
      
      elements.forEach(element => {
        // Only consider number values for scaling calculation
        const elX = typeof element.position.x === 'number' ? element.position.x : 0;
        const elY = typeof element.position.y === 'number' ? element.position.y : 0;
        const elWidth = typeof element.size.width === 'number' ? element.size.width : 300;
        const elHeight = typeof element.size.height === 'number' ? element.size.height : 100;
        
        const elementRight = elX + elWidth;
        const elementBottom = elY + elHeight;
        
        maxWidth = Math.max(maxWidth, elementRight);
        maxHeight = Math.max(maxHeight, elementBottom);
      });
      
      // Calculate scale factor if content exceeds canvas (with 10% margin)
      const scaleX = maxWidth > canvasWidth ? (canvasWidth / maxWidth) * 0.9 : 1;
      const scaleY = maxHeight > canvasHeight ? (canvasHeight / maxHeight) * 0.9 : 1;
      const scale = Math.min(scaleX, scaleY); // Keep aspect ratio
      
      // Scale elements if needed
      if (scale < 1) {
        elements = elements.map(element => {
          const scaledElement = { ...element };
          
          // Scale position
          if (typeof element.position.x === 'number') {
            scaledElement.position = {
              ...scaledElement.position,
              x: Math.round(element.position.x * scale)
            };
          }
          if (typeof element.position.y === 'number') {
            scaledElement.position = {
              ...scaledElement.position,
              y: Math.round(element.position.y * scale)
            };
          }
          
          // Scale size
          if (typeof element.size.width === 'number') {
            scaledElement.size = {
              ...scaledElement.size,
              width: Math.round(element.size.width * scale)
            };
          }
          if (typeof element.size.height === 'number') {
            scaledElement.size = {
              ...scaledElement.size,
              height: Math.round(element.size.height * scale)
            };
          }
          
          return scaledElement;
        });
      }
      
      dispatch({ type: 'SET_ELEMENTS', payload: elements });
      
      // Import canvas config if available
      if (validation.data.canvas) {
        updateCanvasConfig(validation.data.canvas);
      }
    } else {
      console.error('Invalid JSON:', validation.errors);
      alert('Invalid JSON: ' + validation.errors.join(', '));
    }
  }, [updateCanvasConfig]);

  // Auto-detect view mode based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newMode: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) {
        newMode = 'mobile';
      } else if (width < 1024) {
        newMode = 'tablet';
      }

      // Only update if changed to avoid loops/re-renders
      if (state.canvasConfig.viewMode !== newMode) {
        updateCanvasConfig({ viewMode: newMode });
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.canvasConfig.viewMode, updateCanvasConfig]);

  return (
    <BuilderContext.Provider
      value={{
        ...state,
        addElement,
        updateElement,
        removeElement,
        selectElement,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        duplicateElement,
        clearCanvas,
        undo,
        redo,
        canUndo: state.history.past.length > 0,
        canRedo: state.history.future.length > 0,
        exportJSON,
        importJSON,
        updateCanvasConfig,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
