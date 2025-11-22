

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

import { FaLightbulb } from 'react-icons/fa';

export const CardElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
      {element.content.image ? (
        <div className="w-full h-1/2 relative shrink-0 border-b">
          <img 
            src={element.content.image} 
            alt={element.content.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-1/2 bg-gray-800 flex items-center justify-center shrink-0 border-b border-gray-600">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FaLightbulb size={32} />
          </div>
        </div>
      )}
      
      <div className="p-4 flex flex-col gap-2 h-1/2 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-300 shrink-0">{element.content.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed overflow-y-auto scrollbar-hide">{element.content.description}</p>
      </div>
    </div>
  );
};
