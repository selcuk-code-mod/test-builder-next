export type ElementType = 'header' | 'footer' | 'card' | 'text' | 'slider';

export interface BuilderElement {
  id: string;
  type: ElementType;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
  content?: any;
  responsive?: {
    mobile?: Partial<{ x: number; y: number; width: number | string; height: number | string }>;
    tablet?: Partial<{ x: number; y: number; width: number | string; height: number | string }>;
  };
}

export const ELEMENT_DEFAULTS: Record<ElementType, Partial<BuilderElement>> = {
  header: {
    size: { width: '100%', height: 80 },
    content: { text: 'Site Header', style: 'default' },
    zIndex: 10,
  },
  footer: {
    size: { width: '100%', height: 60 },
    content: { copyright: '© 2024 My Website', links: [] },
    zIndex: 10,
  },
  card: {
    size: { width: 300, height: 200 },
    content: { title: 'Card Title', description: 'This is a content card description.', image: '' },
    zIndex: 1,
    responsive: {
      mobile: { width: '100%' },
    },
  },
  text: {
    size: { width: 400, height: 'auto' },
    content: { text: 'Click to edit this text content.' },
    zIndex: 1,
  },
  slider: {
    size: { width: '100%', height: 400 },
    content: { slides: ['Slide 1', 'Slide 2', 'Slide 3'] },
    zIndex: 1,
  },
};
