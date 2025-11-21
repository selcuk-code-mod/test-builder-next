"use client";

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

import { FaLightbulb } from 'react-icons/fa';

export const CardElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-3 border border-gray-100 dark:border-gray-700">
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-2">
        <FaLightbulb size={20} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{element.content.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{element.content.description}</p>
    </div>
  );
};
