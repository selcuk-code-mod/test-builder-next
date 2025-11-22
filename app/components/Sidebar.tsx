"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { ElementType, ELEMENT_DEFAULTS } from '../utils/elementDefaults';

import { FaHeading, FaParagraph, FaImage, FaLayerGroup, FaSquare } from 'react-icons/fa';
import { MdViewDay, MdViewStream } from 'react-icons/md';

const ICON_MAP: Record<ElementType, React.ReactNode> = {
  header: <FaHeading />,
  footer: <MdViewStream />,
  card: <FaSquare />,
  text: <FaParagraph />,
  slider: <FaLayerGroup />,
};

const SidebarItem: React.FC<{ type: ElementType; label: string }> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SIDEBAR_ITEM',
    item: { 
      type, 
      isNew: true,
      size: ELEMENT_DEFAULTS[type].size 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-grab hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 hover:shadow-md ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <span className="text-xl text-gray-600 dark:text-gray-400">{ICON_MAP[type]}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Page Builder
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag elements to canvas</p>
      </div>
      
      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Components</h3>
        <SidebarItem type="header" label="Header" />
        <SidebarItem type="footer" label="Footer" />
        <SidebarItem type="card" label="Card" />
        <SidebarItem type="text" label="Text Block" />
        <SidebarItem type="slider" label="Slider" />
      </div>
    </aside>
  );
};
