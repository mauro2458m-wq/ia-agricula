import React from 'react';
import { SUPPORTED_CROPS } from '../constants';
import { Crop } from '../types';

interface CropSelectorProps {
  selectedCrop: Crop | null;
  onSelect: (crop: Crop) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ selectedCrop, onSelect }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-emerald-800 mb-4 px-2">Selecione a Cultura</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 px-2">
        {SUPPORTED_CROPS.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onSelect(crop)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
              ${selectedCrop?.id === crop.id
                ? 'border-emerald-600 bg-emerald-100 shadow-md transform scale-105'
                : 'border-white bg-white hover:border-emerald-200 hover:bg-emerald-50 shadow-sm'}
            `}
          >
            <span className="text-3xl mb-1">{crop.emoji}</span>
            <span className="text-xs font-medium text-emerald-900 truncate w-full text-center">{crop.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
