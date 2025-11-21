

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

import { FaLightbulb } from 'react-icons/fa';

export const CardElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
      {element.content.image ? (
        <div className="w-full h-48 relative shrink-0">
          <img 
            src={element.content.image} 
            alt={element.content.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-800  flex items-center justify-center shrink-0">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FaLightbulb size={32} />
          </div>
        </div>
      )}
      
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-semibold text-gray-300">{element.content.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">{element.content.description}</p>
      </div>
    </div>
  );
};
