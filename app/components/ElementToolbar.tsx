"use client";

import React from 'react';
import { FiTrash2, FiEdit2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface ElementToolbarProps {
  elementType: string;
  onEdit: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

export const ElementToolbar: React.FC<ElementToolbarProps> = ({
  elementType,
  onEdit,
  onDelete,
  onBringForward,
  onSendBackward,
}) => {
  const isHeader = elementType === 'header';
  const positionClass = isHeader ? '-bottom-10 right-0' : '-top-10 right-0';
  
  return (
    <div className={`absolute ${positionClass} flex items-center gap-1 bg-white dark:bg-gray-800 shadow-lg rounded-md p-1 border border-gray-200 dark:border-gray-700 z-50`}>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded transition-colors"
        title="Edit Properties"
      >
        <FiEdit2 size={14} />
      </button>
      
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
      
      <button
        onClick={(e) => { e.stopPropagation(); onBringForward(); }}
        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded transition-colors"
        title="Bring Forward"
      >
        <FiArrowUp size={14} />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onSendBackward(); }}
        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded transition-colors"
        title="Send Backward"
      >
        <FiArrowDown size={14} />
      </button>
      
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
      
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded transition-colors"
        title="Delete Element"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
};
