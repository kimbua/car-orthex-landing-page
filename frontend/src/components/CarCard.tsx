import Link from 'next/link';
import type { Car } from '@/lib/types';
import { formatVnd } from '@/lib/format';

export default function CarCard({ car }: { car: Car }) {
  return (
    <article className="car-card">
      <Link href={`/models/${car.slug}`} className="car-card__media" aria-label={car.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={car.heroImage} alt={car.name} loading="lazy" />
      </Link>
      <div className="car-card__body">
        <h3 className="car-card__name">{car.name}</h3>
        <div className="car-card__variant">
          {car.variant}
          {car.isM ? ' · BMW M' : ''} · {car.category}
        </div>
        <div className="car-card__price">
          {formatVnd(car.price)}
          {car.priceNote && <small>{car.priceNote}</small>}
        </div>
        <div className="car-card__cta">
          <Link href={`/models/${car.slug}`} className="link-cta">
            Khám phá ›
          </Link>
        </div>
      </div>
    </article>
  );
}
