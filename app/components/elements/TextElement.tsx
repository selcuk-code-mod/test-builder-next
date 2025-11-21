"use client";

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

export const TextElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full p-2">
      <p className="text-gray-800 dark:text-gray-200">{element.content.text}</p>
    </div>
  );
};
