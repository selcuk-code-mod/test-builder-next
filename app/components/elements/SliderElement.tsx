"use client";

import React, { useState } from 'react';
import { BuilderElement } from '../../utils/elementDefaults';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const SliderElement: React.FC<{ element: BuilderElement }> = ({ element }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = element.content.images || [];
  const slides = element.content.slides || [];
  const hasImages = images.length > 0;
  const totalSlides = hasImages ? images.length : slides.length;

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden group rounded-lg">
      {/* Slide Content */}
      {hasImages ? (
        <div className="absolute inset-0">
          <img
            src={images[activeIndex]}
            alt={`Slide ${activeIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
          {slides[activeIndex]}
        </div>
      )}

      {/* Navigation Buttons */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Empty State */}
      {!hasImages && slides.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No images added yet</p>
        </div>
      )}
    </div>
  );
};
