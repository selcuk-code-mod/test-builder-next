"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { ElementType } from '../utils/elementDefaults';

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
    item: { type, isNew: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors border border-gray-700 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <span className="text-xl text-gray-400">{ICON_MAP[type]}</span>
      <span className="font-medium text-gray-200">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Page Builder
        </h2>
      </div>
      
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Components</h3>
        <SidebarItem type="header" label="Header" />
        <SidebarItem type="footer" label="Footer" />
        <SidebarItem type="card" label="Card" />
        <SidebarItem type="text" label="Text Block" />
        <SidebarItem type="slider" label="Slider" />
      </div>
    </aside>
  );
};
