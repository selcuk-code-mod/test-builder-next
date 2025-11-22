"use client";

import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { fileToBase64, validateImageFile, compressImage } from '../utils/imageUtils';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

export const PropertyPanel: React.FC = () => {
  const { 
    selectedId, 
    elements, 
    updateElement, 
    bringToFront, 
    sendToBack, 
    bringForward, 
    sendBackward,
    removeElement
  } = useBuilder();

  const selectedElement = elements.find(el => el.id === selectedId);

  if (!selectedElement) {
    return (
      <aside className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 text-gray-500 dark:text-gray-400 flex items-center justify-center">
        <p>Select an element to edit properties</p>
      </aside>
    );
  }

  const handleSizeChange = (dim: 'width' | 'height', value: string) => {
    const num = parseInt(value, 10);
    updateElement(selectedElement.id, {
      size: {
        ...selectedElement.size,
        [dim]: isNaN(num) ? value : num
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const num = parseInt(value, 10);
    updateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: isNaN(num) ? value : num
      }
    });
  };

  const handleContentChange = (key: string, value: string) => {
    updateElement(selectedElement.id, {
      content: {
        ...selectedElement.content,
        [key]: value
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      let base64 = await fileToBase64(file);
      // Compress image to reduce size
      base64 = await compressImage(base64, 1200);
      
      const currentImages = selectedElement.content.images || [];
      
      // Limit to 10 images
      if (currentImages.length >= 10) {
        alert('Maximum 10 images allowed per slider');
        return;
      }

      updateElement(selectedElement.id, {
        content: {
          ...selectedElement.content,
          images: [...currentImages, base64]
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = selectedElement.content.images || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    
    updateElement(selectedElement.id, {
      content: {
        ...selectedElement.content,
        images: newImages
      }
    });
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Properties</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {selectedElement.id.slice(0, 8)}...</p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Layout */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">X</label>
              <input 
                type="text" 
                value={selectedElement.position.x} 
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Y</label>
              <input 
                type="text" 
                value={selectedElement.position.y} 
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Width</label>
              <input 
                type="text" 
                value={selectedElement.size.width} 
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Height</label>
              <input 
                type="text" 
                value={selectedElement.size.height} 
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Layering */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layering (Z-Index: {selectedElement.zIndex})</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => bringForward(selectedElement.id)} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs py-1.5 rounded transition-colors">Bring Forward</button>
            <button onClick={() => sendBackward(selectedElement.id)} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs py-1.5 rounded transition-colors">Send Backward</button>
            <button onClick={() => bringToFront(selectedElement.id)} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs py-1.5 rounded transition-colors">Bring to Front</button>
            <button onClick={() => sendToBack(selectedElement.id)} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs py-1.5 rounded transition-colors">Send to Back</button>
          </div>
        </div>

        {/* Slider Images */}
        {selectedElement.type === 'slider' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slider Images</h3>
            
            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded cursor-pointer transition-colors border-2 border-dashed border-blue-300 dark:border-blue-700">
              <FiUpload size={16} />
              <span className="text-sm font-medium">Add Image</span>
              <input 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Thumbnails */}
            {selectedElement.content.images && selectedElement.content.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedElement.content.images.map((img: string, index: number) => (
                  <div key={index} className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <FiTrash2 size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-0.5 px-1 text-center">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedElement.content.images?.length || 0}/10 images
            </p>
          </div>
        )}

        {/* Card Image */}
        {selectedElement.type === 'card' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Image</h3>
            
            {!selectedElement.content.image ? (
              <label className="flex items-center justify-center gap-2 w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded cursor-pointer transition-colors border-2 border-dashed border-blue-300 dark:border-blue-700">
                <FiUpload size={16} />
                <span className="text-sm font-medium">Upload Image</span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    const validation = validateImageFile(file);
                    if (!validation.valid) {
                      alert(validation.error);
                      return;
                    }
                    try {
                      let base64 = await fileToBase64(file);
                      base64 = await compressImage(base64, 800); // Smaller max width for cards
                      updateElement(selectedElement.id, {
                        content: { ...selectedElement.content, image: base64 }
                      });
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('Failed to upload image');
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                <img 
                  src={selectedElement.content.image} 
                  alt="Card image"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => updateElement(selectedElement.id, { content: { ...selectedElement.content, image: '' } })}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</h3>
          {Object.entries(selectedElement.content).map(([key, value]) => {
            if (key === 'style') return null; // Skip style object for now
            if (key === 'images') return null; // Skip images array (handled above)
            if (key === 'image') return null; // Skip image string (handled in specific section)
            if (Array.isArray(value)) return null; // Skip other arrays
            
            return (
              <div key={key}>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1 capitalize">{key}</label>
                {key === 'description' || key === 'text' ? (
                  <textarea
                    value={value as string}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => removeElement(selectedElement.id)}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2 rounded text-sm font-medium transition-colors"
          >
            Delete Element
          </button>
        </div>
      </div>
    </aside>
  );
};
