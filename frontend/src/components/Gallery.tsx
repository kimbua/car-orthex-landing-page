'use client';

import { useState } from 'react';
import type { Car } from '@/lib/types';

export default function Gallery({ car }: { car: Car }) {
  const [tab, setTab] = useState<'Exterior' | 'Interior'>('Exterior');
  const images = tab === 'Exterior' ? car.galleryExterior : car.galleryInterior;
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  if (images.length === 0) {
    return (
      <div className="gallery__main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={car.heroImage} alt={car.name} />
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__tabs">
        <button
          type="button"
          className={`gallery__tab ${tab === 'Exterior' ? 'gallery__tab--active' : ''}`}
          onClick={() => { setTab('Exterior'); setActive(0); }}
        >
          Exterior
        </button>
        <button
          type="button"
          className={`gallery__tab ${tab === 'Interior' ? 'gallery__tab--active' : ''}`}
          onClick={() => { setTab('Interior'); setActive(0); }}
        >
          Interior
        </button>
      </div>
      <div className="gallery__main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={`${car.name} ${tab.toLowerCase()}`} />
      </div>
      <div className="gallery__thumbs">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className={`gallery__thumb ${i === active ? 'gallery__thumb--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Ảnh ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
