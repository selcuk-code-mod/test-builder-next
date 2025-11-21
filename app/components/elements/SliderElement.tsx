"use client";

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

export const SliderElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden group">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
        {element.content.slides[0]}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
      </div>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        ←
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </button>
    </div>
  );
};
