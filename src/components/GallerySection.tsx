import React, { useState } from 'react';
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { GalleryImage } from '../types';

interface GallerySectionProps {
  images: GalleryImage[];
  onOpenAdmin: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ images, onOpenAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Events', 'Programmes', 'Campaigns', 'Social Activities', 'College Life'];

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
              <span>Visual Moments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Photo & Activity Gallery
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Capturing student welfare camps, blood donations, cultural festivals, and community service at Narasinha Dutt College.
            </p>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0 self-start md:self-auto"
          >
            + Upload Photo (Admin)
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer aspect-4/3 shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Hover overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {img.category}
                </span>
                <h4 className="font-bold text-sm leading-snug">{img.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-1">
                  <span>{img.date}</span>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-150">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-400 uppercase">
                {filteredImages[lightboxIndex].category} ({lightboxIndex + 1} / {filteredImages.length})
              </span>
              <h3 className="text-base sm:text-lg font-bold">
                {filteredImages[lightboxIndex].title}
              </h3>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image with Nav Buttons */}
          <div className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center my-auto">
            <button
              onClick={prevImage}
              className="absolute left-2 sm:-left-12 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-orange-600 transition-colors z-10"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={filteredImages[lightboxIndex].imageUrl}
              alt={filteredImages[lightboxIndex].title}
              className="max-h-[72vh] max-w-full rounded-lg object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <button
              onClick={nextImage}
              className="absolute right-2 sm:-right-12 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-orange-600 transition-colors z-10"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption / Description Bar */}
          <div className="w-full max-w-3xl text-center text-slate-300 text-xs sm:text-sm pb-2">
            {filteredImages[lightboxIndex].description && (
              <p className="bg-slate-900/70 py-2 px-4 rounded-xl border border-slate-800">
                {filteredImages[lightboxIndex].description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
