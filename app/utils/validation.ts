export const validateJSON = (json: string): { 
  valid: boolean; 
  errors: string[];
  data?: any;
} => {
  try {
    const data = JSON.parse(json);
    
    const errors: string[] = [];
    
    if (!data.elements || !Array.isArray(data.elements)) {
      errors.push('Missing or invalid elements array');
    } else {
      data.elements.forEach((el: any, idx: number) => {
        if (!el.id) errors.push(`Element ${idx}: Missing id`);
        if (!el.type) errors.push(`Element ${idx}: Missing type`);
        if (!el.position) errors.push(`Element ${idx}: Missing position`);
        if (typeof el.position?.x !== 'number' || typeof el.position?.y !== 'number') {
           errors.push(`Element ${idx}: Invalid position format`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : undefined,
    };
  } catch (e) {
    return {
      valid: false,
      errors: ['Invalid JSON syntax'],
    };
  }
};
