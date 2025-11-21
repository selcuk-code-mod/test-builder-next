

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

export const TextElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full bg-gray-800 p-2">
      <p className="text-gray-300">{element.content.text}</p>
    </div>
  );
};
