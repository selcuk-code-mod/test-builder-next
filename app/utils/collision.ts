import { BuilderElement } from './elementDefaults';

export interface CollisionResult {
  hasCollision: boolean;
  collidingElements: string[]; // IDs
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getRect = (element: BuilderElement): Rect => {
  const width = typeof element.size.width === 'number' ? element.size.width : 0; // Simplification for % widths for now
  const height = typeof element.size.height === 'number' ? element.size.height : 0;
  return {
    x: element.position.x,
    y: element.position.y,
    width,
    height,
  };
};

const isOverlapping = (rect1: Rect, rect2: Rect): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

export const checkCollision = (
  elementId: string,
  position: { x: number; y: number },
  size: { width: number | string; height: number | string },
  allElements: BuilderElement[]
): CollisionResult => {
  const collidingElements: string[] = [];
  
  // Convert current element to rect
  // Note: This is a basic implementation. Percentage widths need container context to be accurate.
  // For now, we assume pixel values or skip collision for complex layouts if needed.
  const currentRect: Rect = {
    x: position.x,
    y: position.y,
    width: typeof size.width === 'number' ? size.width : 100, // Fallback
    height: typeof size.height === 'number' ? size.height : 100,
  };

  for (const other of allElements) {
    if (other.id === elementId) continue;

    const otherRect = getRect(other);
    // Skip if other element has non-numeric dimensions for now, or handle them
    if (otherRect.width === 0 || otherRect.height === 0) continue;

    if (isOverlapping(currentRect, otherRect)) {
      collidingElements.push(other.id);
    }
  }

  return {
    hasCollision: collidingElements.length > 0,
    collidingElements,
  };
};
