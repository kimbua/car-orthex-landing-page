'use client';

import { useMemo, useState } from 'react';
import type { Dealer } from '@/lib/types';

export default function DealersFilter({ dealers }: { dealers: Dealer[] }) {
  const cities = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.city))).sort((a, b) => a.localeCompare(b, 'vi')),
    [dealers],
  );
  const [city, setCity] = useState<string>('all');

  const filtered = city === 'all' ? dealers : dealers.filter((d) => d.city === city);

  return (
    <>
      <div className="chips">
        <button type="button" className={`chip ${city === 'all' ? 'chip--active' : ''}`} onClick={() => setCity('all')}>
          Tất cả ({dealers.length})
        </button>
        {cities.map((c) => {
          const count = dealers.filter((d) => d.city === c).length;
          return (
            <button key={c} type="button" className={`chip ${city === c ? 'chip--active' : ''}`} onClick={() => setCity(c)}>
              {c} ({count})
            </button>
          );
        })}
      </div>
      <div className="dealer-grid">
        {filtered.map((d) => (
          <div className="dealer-card" key={d.id}>
            <div className="dealer-card__city">{d.city}</div>
            <h3>{d.name}</h3>
            <p>{d.address}</p>
            <p>Giờ mở cửa: {d.hours}</p>
            <div className="dealer-card__phone">
              <a href={`tel:${d.phone.replace(/\s/g, '')}`}>{d.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
