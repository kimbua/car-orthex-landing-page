import Link from 'next/link';
import { fetchCars } from '@/lib/api';
import CarCard from '@/components/CarCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  let carsError = false;
  try {
    cars = await fetchCars();
  } catch {
    carsError = true;
  }

  const featured = cars.slice(0, 5);
  const evHero = cars.find((c) => c.slug === 'bmw-i7-xdrive60') || cars.find((c) => c.fuel === 'EV');
  const mHero = cars.find((c) => c.slug === 'bmw-m3-competition') || cars.find((c) => c.isM);

  return (
    <>
      {/* ---------- HERO: full-bleed dark ---------- */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero__img"
          src={evHero?.heroImage || '/images/cars/bmw-i7-xdrive60-hero.jpg'}
          alt="BMW flagship"
        />
        <div className="hero__veil" />
        <div className="container hero__content">
          <div className="hero__eyebrow">BMW Digital Showroom · Việt Nam</div>
          <h1 className="hero__title">Niềm vui cầm lái.</h1>
          <p className="hero__sub">
            Khám phá hệ thống dòng xe BMW chính hãng — Sedan, SUV, xe điện thuần khiết BMW i
            và hiệu năng đỉnh cao BMW M.
          </p>
          <div className="hero__actions">
            <Link href="/models" className="btn btn--primary">Khám phá</Link>
            <Link href="/test-drive" className="btn btn--ghost">Đăng ký lái thử</Link>
          </div>
        </div>
      </section>

      {/* ---------- MODEL EXPLORER: light ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-eyebrow">Dòng xe</div>
          <h2 className="section-heading">Khám phá dòng xe</h2>
          <p className="section-sub" style={{ marginBottom: 40 }}>
            Từ 3 Series thể thao đến X7 đẳng cấp, từ i4 điện thuần khiết đến M3 Competition 530 mã lực.
          </p>
          {carsError && (
            <p style={{ color: '#c62828', marginBottom: 24 }}>
              Không thể kết nối dữ liệu từ Backend — hãy kiểm tra dịch vụ API.
            </p>
          )}
          <div className="grid-cars">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <Link href="/models" className="link-cta">Xem tất cả Models ›</Link>
          </div>
        </div>
      </section>

      {/* ---------- DARK HERO BAND: Electric ---------- */}
      <section className="section section--dark">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="section-eyebrow" style={{ color: '#9cc0f0' }}>BMW i</div>
            <h2 className="section-heading">Xe điện thuần khiết.</h2>
            <p className="section-sub" style={{ color: '#c9d2dc', marginBottom: 32 }}>
              i4, i5, i7 và iX — phạm vi hoạt động lên đến 625 km WLTP, sạc nhanh DC và trải
              nghiệm vận hành đặc trưng của BMW.
            </p>
            <Link href="/electric" className="btn btn--primary">Khám phá BMW Electric</Link>
          </div>
          <div>
            {evHero && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={evHero.heroImage}
                alt={evHero.name}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ---------- LIGHT: BMW M ---------- */}
      <section className="section section--surface">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'center' }}>
          <div>
            {mHero && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={mHero.heroImage}
                alt={mHero.name}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
              />
            )}
          </div>
          <div>
            <div className="m-stripe"><span /><span /><span /></div>
            <div className="section-eyebrow">BMW M</div>
            <h2 className="section-heading">Hiệu năng đỉnh cao.</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              M2, M3 Competition và M4 Competition — 460 đến 530 mã lực, thiết kế thuần M
              với dấu ấn ba màu huyền thoại.
            </p>
            <Link href="/m" className="btn btn--secondary">Khám phá BMW M</Link>
          </div>
        </div>
      </section>

      {/* ---------- DARK CTA BAND ---------- */}
      <section className="section section--dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="section-eyebrow" style={{ color: '#9cc0f0' }}>Test Drive</div>
          <h2 className="section-heading" style={{ maxWidth: 640, margin: '0 auto 18px' }}>
            Sẵn sàng trải nghiệm BMW trên đường phố?
          </h2>
          <p className="section-sub" style={{ color: '#c9d2dc', margin: '0 auto 36px' }}>
            Đặt hẹn lái thử tại showroom BMW chính hãng gần nhất.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/test-drive" className="btn btn--primary">Đăng ký lái thử</Link>
            <Link href="/dealers" className="btn btn--ghost">Tìm đại lý</Link>
          </div>
        </div>
      </section>
    </>
  );
}
