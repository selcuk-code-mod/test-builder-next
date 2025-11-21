import { BuilderElement, ElementType } from './elementDefaults';

/**
 * Normalizes position data from various formats
 */
const normalizePosition = (posData: any): { x: number; y: number } => {
  // Format 1: { x: 100, y: 200 }
  if (typeof posData?.x === 'number' && typeof posData?.y === 'number') {
    return { x: posData.x, y: posData.y };
  }
  
  // Format 2: { position: { x: 100, y: 200 } }
  if (posData?.position?.x !== undefined) {
    return normalizePosition(posData.position);
  }
  
  // Format 3: String calculations like "calc(100% - 80px)"
  if (typeof posData?.y === 'string' && posData.y.includes('calc')) {
    // For now, default to 0, could be enhanced to parse calc expressions
    return { x: posData.x || 0, y: 0 };
  }
  
  // Default
  return { x: 0, y: 0 };
};

/**
 * Normalizes size data from various formats
 */
const normalizeSize = (sizeData: any, posData: any): { width: number | string; height: number | string } => {
  let width: number | string = 300;
  let height: number | string = 200;
  
  // Check in size object
  if (sizeData?.width !== undefined) width = sizeData.width;
  if (sizeData?.height !== undefined) height = sizeData.height;
  
  // Check in position object (common in some formats)
  if (posData?.width !== undefined) width = posData.width;
  if (posData?.height !== undefined) height = posData.height;
  
  // Handle minHeight
  if (posData?.minHeight !== undefined && height === 'auto') {
    height = posData.minHeight;
  }
  
  return { width, height };
};

/**
 * Maps external element types to internal types
 */
const mapElementType = (externalType: string): ElementType => {
  const typeMap: Record<string, ElementType> = {
    'navbar': 'header',
    'nav': 'header',
    'hero': 'slider',
    'banner': 'slider',
    'card': 'card',
    'text-content': 'text',
    'text': 'text',
    'paragraph': 'text',
    'footer': 'footer',
    'slider': 'slider',
    'carousel': 'slider',
  };
  
  return typeMap[externalType.toLowerCase()] || 'card';
};

/**
 * Converts content from various formats to internal format
 */
const normalizeContent = (type: ElementType, externalContent: any): any => {
  if (!externalContent) return {};
  
  switch (type) {
    case 'header':
      return {
        text: externalContent.logoText || externalContent.text || externalContent.title || 'Header',
        style: externalContent.style || 'default',
      };
      
    case 'footer':
      return {
        copyright: externalContent.copyright || externalContent.text || '© 2024',
        links: externalContent.links || externalContent.menuItems || [],
      };
      
    case 'card':
      return {
        title: externalContent.title || 'Card Title',
        description: externalContent.description || externalContent.subtitle || externalContent.text || 'Description',
        image: externalContent.image || '',
      };
      
    case 'text':
      return {
        text: externalContent.plainText || 
              externalContent.text || 
              externalContent.html?.replace(/<[^>]*>/g, '') || 
              'Text content',
      };
      
    case 'slider':
      const slides = externalContent.slides || 
                    (externalContent.title ? [externalContent.title] : ['Slide 1']);
      const images = externalContent.images || [];
      
      return {
        slides: Array.isArray(slides) ? slides : [slides],
        images: Array.isArray(images) ? images : [],
      };
      
    default:
      return externalContent;
  }
};

/**
 * Normalizes responsive data
 */
const normalizeResponsive = (responsiveData: any): BuilderElement['responsive'] => {
  if (!responsiveData || typeof responsiveData !== 'object') return undefined;
  
  const result: any = {};
  
  ['mobile', 'tablet'].forEach(viewport => {
    if (responsiveData[viewport]) {
      const data = responsiveData[viewport];
      result[viewport] = {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      };
    }
  });
  
  return Object.keys(result).length > 0 ? result : undefined;
};

/**
 * Converts any external element format to internal BuilderElement
 */
const convertToInternalFormat = (externalElement: any): BuilderElement | null => {
  try {
    // Determine element type
    const type = mapElementType(externalElement.type || 'card');
    
    // Extract position
    const position = normalizePosition(externalElement);
    
    // Extract size
    const size = normalizeSize(externalElement.size, externalElement.position);
    
    // Extract content
    const content = normalizeContent(type, externalElement.content);
    
    // Extract z-index
    const zIndex = externalElement.zIndex || 
                   externalElement.position?.zIndex || 
                   externalElement.layer || 
                   1;
    
    // Extract responsive
    const responsive = normalizeResponsive(externalElement.responsive);
    
    return {
      id: externalElement.id || crypto.randomUUID(),
      type,
      position,
      size,
      zIndex,
      content,
      responsive,
    };
  } catch (error) {
    console.error('Error converting element:', error, externalElement);
    return null;
  }
};

/**
 * Validates and converts JSON from various formats
 */
export const validateJSON = (json: string): { 
  valid: boolean; 
  errors: string[];
  data?: { elements: BuilderElement[] };
} => {
  try {
    const parsed = JSON.parse(json);
    const errors: string[] = [];
    let elements: any[] = [];
    
    // Format detection and extraction
    if (Array.isArray(parsed)) {
      // Format 1: Direct array of elements
      elements = parsed;
    } else if (parsed.elements && Array.isArray(parsed.elements)) {
      // Format 2: { elements: [...] }
      elements = parsed.elements;
    } else if (parsed.project && parsed.elements) {
      // Format 3: Complex project format with metadata
      elements = parsed.elements;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      // Format 4: { data: [...] }
      elements = parsed.data;
    } else if (parsed.components && Array.isArray(parsed.components)) {
      // Format 5: { components: [...] }
      elements = parsed.components;
    } else {
      errors.push('Could not find elements array in JSON. Supported formats: direct array, {elements: []}, {data: []}, or {components: []}');
      return { valid: false, errors };
    }
    
    // Validate elements exist
    if (elements.length === 0) {
      errors.push('No elements found in JSON');
      return { valid: false, errors };
    }
    
    // Convert all elements
    const convertedElements: BuilderElement[] = [];
    
    elements.forEach((el: any, idx: number) => {
      // Basic validation
      if (!el || typeof el !== 'object') {
        errors.push(`Element ${idx}: Invalid element structure`);
        return;
      }
      
      if (!el.type && !el.elementType && !el.component) {
        errors.push(`Element ${idx}: Missing type field`);
        return;
      }
      
      // Convert to internal format
      const converted = convertToInternalFormat(el);
      
      if (converted) {
        convertedElements.push(converted);
      } else {
        errors.push(`Element ${idx}: Failed to convert element`);
      }
    });
    
    // Check if we have any valid elements
    if (convertedElements.length === 0) {
      errors.push('No valid elements could be converted');
      return { valid: false, errors };
    }
    
    return {
      valid: errors.length === 0,
      errors,
      data: { elements: convertedElements },
    };
    
  } catch (e) {
    return {
      valid: false,
      errors: ['Invalid JSON syntax: ' + (e as Error).message],
    };
  }
};
