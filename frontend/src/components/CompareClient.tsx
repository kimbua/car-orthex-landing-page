'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Car, CompareData } from '@/lib/types';
import { formatVnd } from '@/lib/format';

export default function CompareClient({ cars, initial }: { cars: Car[]; initial: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial.filter((s) => cars.some((c) => c.slug === s)));
  const [data, setData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (selected.length === 0) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErr(null);
    fetch(`/api/compare?ids=${selected.join(',')}`, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.message || `HTTP ${r.status}`);
        }
        return r.json() as Promise<CompareData>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const addCar = (slug: string) => {
    if (!slug || selected.includes(slug) || selected.length >= 3) return;
    setSelected((s) => [...s, slug]);
  };

  const removeCar = (slug: string) => {
    setSelected((s) => s.filter((x) => x !== slug));
  };

  const options = useMemo(
    () => cars.filter((c) => !selected.includes(c.slug)),
    [cars, selected],
  );

  const cols = Math.max(selected.length, 1);

  return (
    <>
      <div className="compare-selector">
        <select
          aria-label="Chọn xe để so sánh"
          value=""
          onChange={(e) => addCar(e.target.value)}
          disabled={selected.length >= 3}
        >
          <option value="">
            {selected.length >= 3 ? 'Đã đạt tối đa 3 xe' : '— Chọn xe để so sánh —'}
          </option>
          {options.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} {c.variant}
            </option>
          ))}
        </select>
        {selected.map((slug) => {
          const car = cars.find((c) => c.slug === slug)!;
          return (
            <div key={slug} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--bmw-line)', padding: '10px 14px' }}>
              <span style={{ fontWeight: 700 }}>{car.name}</span>
              <button type="button" className="compare-strip__remove" onClick={() => removeCar(slug)} aria-label={`Bỏ ${car.name}`}>
                ×
              </button>
            </div>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p style={{ color: 'var(--bmw-muted)', padding: '40px 0' }}>
          Hãy chọn ít nhất một mẫu xe để bắt đầu so sánh.
        </p>
      )}

      {loading && <p style={{ color: 'var(--bmw-muted)' }}>Đang tải dữ liệu so sánh…</p>}
      {err && <p style={{ color: '#c62828' }}>{err}</p>}

      {data && !loading && (
        <>
          <div className="compare-head-cards" style={{ ['--compare-cols' as string]: cols }}>
            {data.cars.map((car) => (
              <Link key={car.slug} href={`/models/${car.slug}`} className="car-card">
                <div className="car-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.heroImage} alt={car.name} />
                </div>
                <div className="car-card__body" style={{ padding: 14 }}>
                  <div className="car-card__name" style={{ fontSize: 17 }}>{car.name}</div>
                  <div className="car-card__variant">{car.variant}</div>
                  <div className="car-card__price">{formatVnd(car.price)}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="compare-strip" style={{ ['--compare-cols' as string]: cols }}>
            {data.rows.map((row) => (
              <div key={row.label} style={{ display: 'contents' }}>
                <div className="compare-strip__label compare-strip__head">{row.label}</div>
                {row.values.map((v, i) => (
                  <div className="compare-strip__cell" key={i}>
                    {v ?? '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
