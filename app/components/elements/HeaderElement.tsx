"use client";

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

export const HeaderElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <header className="w-full h-full bg-gray-900 text-white flex items-center justify-between px-6 shadow-md">
      <h1 className="text-xl font-bold">{element.content.text}</h1>
      <nav>
        <ul className="flex gap-4 text-sm text-gray-300">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};
