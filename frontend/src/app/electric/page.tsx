import Link from 'next/link';
import { fetchCars } from '@/lib/api';
import CarCard from '@/components/CarCard';

export const dynamic = 'force-dynamic';

export default async function ElectricPage() {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  try {
    cars = await fetchCars();
  } catch {
    /* handled below */
  }
  const ev = cars.filter((c) => c.fuel === 'EV');
  const hero = ev.find((c) => c.slug === 'bmw-i7-xdrive60') || ev[0];

  return (
    <>
      <section className="hero">
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="hero__img" src={hero.heroImage} alt={hero.name} />
        )}
        <div className="hero__veil" />
        <div className="container hero__content">
          <div className="hero__eyebrow">BMW i · Electric</div>
          <h1 className="hero__title">Xe điện thuần khiết.</h1>
          <p className="hero__sub">
            i4, i5, i7 và iX — hệ truyền động eDrive của BMW với phạm vi hoạt động lên đến
            625 km WLTP và sạc nhanh DC.
          </p>
          <div className="hero__actions">
            <Link href="/test-drive" className="btn btn--primary">Đăng ký lái thử</Link>
            <Link href="/models" className="btn btn--ghost">Xem tất cả Models</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-eyebrow">BMW Electric</div>
          <h2 className="section-heading">Dòng xe điện BMW</h2>
          <p className="section-sub" style={{ marginBottom: 40 }}>
            Công nghệ eDrive thế hệ mới: mô-tơ điện đồng bộ, pin lithium-ion hiệu suất cao,
            sạc nhanh DC và trải nghiệm vận hành mượt mà đặc trưng BMW.
          </p>
          <div className="grid-cars">
            {ev.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
