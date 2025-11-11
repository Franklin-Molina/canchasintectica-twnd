import React from 'react';
import { Eye } from 'lucide-react';

function CourtImageGallery({ court, openModal }) {
  return (
    court.images && court.images.length > 0 && (
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-4">Galería</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {court.images.map(image => (
            <div
              key={image.id}
              className="relative cursor-pointer group"
              onClick={() => openModal(image.image)}
            >
              <img
                src={image.image}
                alt={`Imagen de ${court.name}`}
                className="w-full h-32 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default CourtImageGallery;
