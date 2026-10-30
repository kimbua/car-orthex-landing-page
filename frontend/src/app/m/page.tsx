import Link from 'next/link';
import { fetchCars } from '@/lib/api';
import CarCard from '@/components/CarCard';

export const dynamic = 'force-dynamic';

export default async function MPage() {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  try {
    cars = await fetchCars();
  } catch {
    /* handled below */
  }
  const m = cars.filter((c) => c.isM);
  const hero = m.find((c) => c.slug === 'bmw-m3-competition') || m[0];

  return (
    <>
      <section className="hero">
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="hero__img" src={hero.heroImage} alt={hero.name} />
        )}
        <div className="hero__veil" />
        <div className="container hero__content">
          <div className="m-stripe"><span /><span /><span /></div>
          <div className="hero__eyebrow">BMW M · Motorsport</div>
          <h1 className="hero__title">Hiệu năng đỉnh cao.</h1>
          <p className="hero__sub">
            M2, M3 Competition và M4 Competition — động cơ M TwinPower Turbo,
            460 đến 530 mã lực, khung gầm tinh chỉnh trên đường đua.
          </p>
          <div className="hero__actions">
            <Link href="/test-drive" className="btn btn--primary">Đăng ký lái thử</Link>
            <Link href="/models" className="btn btn--ghost">Xem tất cả Models</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="m-stripe"><span /><span /><span /></div>
          <div className="section-eyebrow">BMW M</div>
          <h2 className="section-heading">Dòng xe BMW M</h2>
          <p className="section-sub" style={{ marginBottom: 40 }}>
            Ba màu M huyền thoại — xanh, xanh đậm, đỏ — xuất hiện đúng nơi thuộc về hiệu năng cao nhất.
          </p>
          <div className="grid-cars">
            {m.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
