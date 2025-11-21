

import React from 'react';
import { BuilderElement } from '../../utils/elementDefaults';

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const FooterElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  return (
    <footer className="w-full h-full bg-gray-800 text-gray-400 flex flex-col items-center justify-center gap-2 text-sm">
      <p>{element.content.copyright}</p>
      <div className="flex gap-4 mt-1">
        <FaFacebook className="hover:text-white cursor-pointer transition-colors" />
        <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
        <FaInstagram className="hover:text-white cursor-pointer transition-colors" />
        <FaLinkedin className="hover:text-white cursor-pointer transition-colors" />
      </div>
    </footer>
  );
};
