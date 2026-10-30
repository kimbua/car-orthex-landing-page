'use client';

import { useMemo, useState } from 'react';
import type { Car } from '@/lib/types';
import CarCard from '@/components/CarCard';

type Filter = 'all' | 'Sedan' | 'SUV' | 'Gran Coupé' | 'Coupé' | 'EV' | 'Petrol' | 'M';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Sedan', label: 'Sedan' },
  { key: 'SUV', label: 'SUV' },
  { key: 'Gran Coupé', label: 'Gran Coupé' },
  { key: 'Coupé', label: 'Coupé' },
  { key: 'EV', label: 'Electric' },
  { key: 'Petrol', label: 'Xăng' },
  { key: 'M', label: 'BMW M' },
];

export default function ModelsFilter({ cars }: { cars: Car[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return cars;
    if (filter === 'M') return cars.filter((c) => c.isM);
    if (filter === 'EV' || filter === 'Petrol') return cars.filter((c) => c.fuel === filter);
    return cars.filter((c) => c.category === filter);
  }, [cars, filter]);

  return (
    <>
      <div className="chips" role="tablist" aria-label="Lọc dòng xe">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`chip ${filter === f.key ? 'chip--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid-cars">
        {filtered.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ color: 'var(--bmw-muted)', padding: '40px 0' }}>Không có dòng xe phù hợp.</p>
      )}
    </>
  );
}
