import Link from 'next/link';
import { notFound } from 'next/navigation';
import { default as nextDynamic } from 'next/dynamic';
import { fetchCar, fetchCars } from '@/lib/api';
import { formatVnd, specValue } from '@/lib/format';
import Gallery from '@/components/Gallery';
import CarCard from '@/components/CarCard';

const Engine3D = nextDynamic(() => import('@/components/Engine3D'), {
  ssr: false,
  loading: () => (
    <div className="engine3d" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b95a1' }}>
      Đang tải mô hình 3D động cơ…
    </div>
  ),
});

export const dynamic = 'force-dynamic';

const SPEC_ROWS: { key: string; label: string; unit: string }[] = [
  { key: 'engine', label: 'Động cơ', unit: '' },
  { key: 'powerHp', label: 'Công suất', unit: 'mã lực' },
  { key: 'powerKw', label: 'Công suất', unit: 'kW' },
  { key: 'torque', label: 'Mô-men xoắn', unit: 'Nm' },
  { key: 'transmission', label: 'Hộp số', unit: '' },
  { key: 'drivetrain', label: 'Hệ dẫn động', unit: '' },
  { key: 'accel0_100', label: '0–100 km/h', unit: 's' },
  { key: 'topSpeed', label: 'Tốc độ tối đa', unit: 'km/h' },
  { key: 'batteryKwh', label: 'Dung lượng pin', unit: 'kWh' },
  { key: 'rangeWltpKm', label: 'Phạm vi hoạt động (WLTP)', unit: 'km' },
  { key: 'fuelConsumption', label: 'Tiêu thụ nhiên liệu / năng lượng', unit: '' },
];

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  let car;
  try {
    car = await fetchCar(params.slug);
  } catch {
    notFound();
  }

  let related: Awaited<ReturnType<typeof fetchCars>> = [];
  try {
    const all = await fetchCars();
    related = all.filter((c) => c.slug !== car.slug && (c.category === car.category || c.series === car.series)).slice(0, 4);
  } catch {
    /* ignore */
  }

  const keySpecs = [
    { value: specValue(car.specs, 'powerHp'), unit: 'HP', label: 'Công suất' },
    { value: specValue(car.specs, 'torque'), unit: 'Nm', label: 'Mô-men xoắn' },
    { value: specValue(car.specs, 'accel0_100'), unit: 's', label: '0–100 km/h' },
    { value: specValue(car.specs, car.fuel === 'EV' ? 'rangeWltpKm' : 'topSpeed'), unit: car.fuel === 'EV' ? 'km' : 'km/h', label: car.fuel === 'EV' ? 'Phạm vi WLTP' : 'Tốc độ tối đa' },
  ];

  return (
    <>
      {/* ---------- Title block ---------- */}
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/models">Models</Link> / <span>{car.name}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', marginTop: 20 }}>
            <div>
              <div className={`badge-fuel ${car.fuel === 'EV' ? 'badge-fuel--ev' : ''}`}>{car.fuel === 'EV' ? 'Electric' : 'Xăng'}</div>
              <h1 className="section-heading" style={{ marginBottom: 4 }}>{car.name} {car.variant}</h1>
              <p style={{ color: 'var(--bmw-muted)' }}>{car.category} · {car.year} · {String(car.specs?.drivetrain || '')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{formatVnd(car.price)}</div>
              {car.priceNote && <div style={{ color: 'var(--bmw-muted)', fontSize: 13 }}>{car.priceNote}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28 }}>
            <Link href="/test-drive" className="btn btn--primary">Đăng ký lái thử</Link>
            <Link href={`/compare?ids=${car.slug}`} className="btn btn--secondary">So sánh xe</Link>
          </div>
        </div>
      </section>

      {/* ---------- Hero image ---------- */}
      <section className="container" style={{ paddingBottom: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={car.heroImage} alt={car.name} style={{ width: '100%', aspectRatio: '16/7', objectFit: 'cover' }} />
      </section>

      {/* ---------- Key specs ---------- */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="key-specs">
            {keySpecs.map((s) => (
              <div className="key-spec" key={s.label}>
                <div className="key-spec__value">
                  {s.value ?? '—'} {s.value !== null && <span style={{ fontSize: '0.5em', color: 'var(--bmw-muted)' }}>{s.unit}</span>}
                </div>
                <div className="key-spec__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Description + gallery ---------- */}
      <section className="section">
        <div className="container detail-layout">
          <div>
            <div className="section-eyebrow">Tổng quan</div>
            <h2 className="section-heading" style={{ fontSize: 34 }}>Về {car.name}</h2>
            <p style={{ fontSize: 17, marginTop: 16, maxWidth: 640 }}>{car.description}</p>
            <p className="src-note">
              Nguồn dữ liệu: <a href={car.sourceUrl} target="_blank" rel="noreferrer">{car.sourceName}</a>
            </p>
          </div>
          <Gallery car={car} />
        </div>
      </section>

      {/* ---------- Engine 3D (BMW M only) ---------- */}
      {car.isM && (
        <section className="section section--dark">
          <div className="container">
            <div className="section-eyebrow" style={{ color: '#9cc0f0' }}>Engine 3D · Khám phá</div>
            <h2 className="section-heading">Động cơ {String(car.specs?.engine || 'M TwinPower Turbo')}</h2>
            <p className="section-sub" style={{ color: '#c9d2dc', marginBottom: 32 }}>
              Mô phỏng theo kiến trúc thật của động cơ <strong style={{ color: '#fff' }}>S58</strong>:
              I6 2.993 cc (bore 84 mm × stroke 90 mm), nắp máy closed-deck nhôm,
              <strong style={{ color: '#fff' }}> hai turbo mono-scroll</strong> (mỗi cái 3 xi-lanh),
              intercooler air-to-liquid tích hợp trong intake plenum, DOHC 4 van/xi-lanh + Double VANOS,
              phun xăng trực tiếp. Piston, trục khuỷu (thứ tự nổ 1-5-3-6-2-4) và turbo chuyển động liên tục.
            </p>
            <Engine3D
              engineLabel={String(car.specs?.engine || '')}
              power={specValue(car.specs, 'powerHp') ? `${specValue(car.specs, 'powerHp')} mã lực` : null}
              torque={specValue(car.specs, 'torque') ? `${specValue(car.specs, 'torque')} Nm` : null}
            />
          </div>
        </section>
      )}

      {/* ---------- Technical specifications ---------- */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-eyebrow">Thông số kỹ thuật</div>
          <h2 className="section-heading">Technical Specifications</h2>
          <div style={{ maxWidth: 860, marginTop: 28 }}>
            <table className="spec-table">
              <tbody>
                {SPEC_ROWS.map((row) => {
                  const v = specValue(car.specs, row.key);
                  if (v === null) return null;
                  return (
                    <tr key={row.key}>
                      <th>{row.label}</th>
                      <td>{v} {row.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-eyebrow">Liên quan</div>
            <h2 className="section-heading">Có thể bạn quan tâm</h2>
            <div className="grid-cars" style={{ marginTop: 32 }}>
              {related.map((r) => (
                <CarCard key={r.id} car={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
