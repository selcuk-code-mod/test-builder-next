import { BuilderElement } from './elementDefaults';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const checkCollision = (
  targetRect: Rect,
  elements: BuilderElement[],
  excludeId?: string,
  containerSize?: { width: number; height: number }
): boolean => {
  const resolveValue = (val: number | string | undefined, max: number, isSize: boolean = false): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.endsWith('%')) {
      return (parseFloat(val) / 100) * max;
    }
    if (val === 'auto') {
      return 50; // Default estimate for auto size
    }
    // Fallback: if it's a size and we can't parse it, maybe default to full width? 
    // But for safety, if we don't know, let's assume 0 to avoid false positives, 
    // unless it's a common case.
    return 0;
  };

  return elements.some((el) => {
    if (el.id === excludeId) return false;

    // If no container size provided, we can only check absolute values
    // But to support the user request, we really expect containerSize to be passed.
    const cWidth = containerSize?.width || 1000; // Default fallback if missing
    const cHeight = containerSize?.height || 1000;

    const x = resolveValue(el.position.x, cWidth);
    const y = resolveValue(el.position.y, cHeight);
    const width = resolveValue(el.size.width, cWidth, true);
    const height = resolveValue(el.size.height, cHeight, true);

    if (width <= 0 || height <= 0) return false;

    const elRect = { x, y, width, height };

    return (
      targetRect.x < elRect.x + elRect.width &&
      targetRect.x + targetRect.width > elRect.x &&
      targetRect.y < elRect.y + elRect.height &&
      targetRect.y + targetRect.height > elRect.y
    );
  });
};
