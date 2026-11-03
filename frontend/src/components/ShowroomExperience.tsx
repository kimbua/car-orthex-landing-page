'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CarCard from '@/components/CarCard';
import { formatVnd } from '@/lib/format';
import type { Car } from '@/lib/types';

const ROOMS = [
  { id: 'welcome', label: 'Chào mừng', index: '01' },
  { id: 'models', label: 'Dòng xe', index: '02' },
  { id: 'electric', label: 'BMW i', index: '03' },
  { id: 'bmw-m', label: 'BMW M', index: '04' },
  { id: 'experience', label: 'Lái thử', index: '05' },
];

export default function ShowroomExperience({
  cars,
  carsError,
}: {
  cars: Car[];
  carsError: boolean;
}) {
  const [activeRoom, setActiveRoom] = useState(0);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const carSelectorRef = useRef<HTMLDivElement>(null);
  const featured = cars.slice(0, 5);
  const selectedCar = cars[selectedCarIndex];
  const evHero = cars.find((car) => car.slug === 'bmw-i7-xdrive60') || cars.find((car) => car.fuel === 'EV');
  const mHero = cars.find((car) => car.slug === 'bmw-m3-competition') || cars.find((car) => car.isM);

  useEffect(() => {
    const sections = ROOMS.map((room) => document.getElementById(`showroom-panel-${room.id}`))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const roomIndex = ROOMS.findIndex((room) => `showroom-panel-${room.id}` === visible?.target.id);
        if (roomIndex >= 0) setActiveRoom(roomIndex);
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: [0, 0.2, 0.5, 0.8] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const goToRoom = (room: number) => {
    const nextRoom = Math.min(Math.max(room, 0), ROOMS.length - 1);
    setActiveRoom(nextRoom);
    document.getElementById(`showroom-panel-${ROOMS[nextRoom].id}`)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const selectCar = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), cars.length - 1);
    setSelectedCarIndex(nextIndex);
    const selector = carSelectorRef.current;
    const button = selector?.children[nextIndex];
    if (selector && button instanceof HTMLElement) {
      const left = button.offsetLeft;
      const right = left + button.offsetWidth;
      const visibleRight = selector.scrollLeft + selector.clientWidth;
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      if (left < selector.scrollLeft) selector.scrollTo({ left, behavior });
      else if (right > visibleRight) selector.scrollTo({ left: right - selector.clientWidth, behavior });
    }
  };

  return (
    <div className="showroom" id="showroom-journey">
      <div className="showroom__masthead">
        <span>BMW Digital Showroom</span>
        <span>Việt Nam <i aria-hidden="true" /></span>
      </div>

      <div className="showroom__layout">
        <aside className="showroom-guide" aria-label="Lộ trình showroom">
          <div className="showroom-guide__heading">
            <span className="showroom-guide__caption">Hành trình khám phá</span>
            <span className="showroom-guide__count" aria-live="polite">
              {ROOMS[activeRoom].index} <span>/ 05</span>
            </span>
          </div>
          <nav className="showroom-guide__nav" aria-label="Lộ trình showroom">
            {ROOMS.map((room, index) => (
              <a
                key={room.id}
                href={`#showroom-panel-${room.id}`}
                aria-current={activeRoom === index ? 'step' : undefined}
                className={`showroom-guide__item${activeRoom === index ? ' showroom-guide__item--active' : ''}`}
                onClick={() => setActiveRoom(index)}
              >
                <span className="showroom-guide__number">{room.index}</span>
                <span>{room.label}</span>
                <span className="showroom-guide__arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <Link className="showroom-guide__dealer" href="/dealers">
            Tìm đại lý <span aria-hidden="true">↗</span>
          </Link>
        </aside>

        <div className="showroom-stage">
          <section
            className="showroom-room showroom-room--welcome"
            id="showroom-panel-welcome"
            data-active={activeRoom === 0}
            aria-label="Không gian chào mừng"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero__img"
              src={evHero?.heroImage || '/images/cars/bmw-i7-xdrive60-hero.jpg'}
              alt="BMW flagship"
            />
            <div className="hero__veil" />
            <div className="hero__content">
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
              <span className="showroom-room__signature">THE BMW EXPERIENCE</span>
            </div>
            {renderRoomControls(0, goToRoom)}
          </section>

          <section
            className="showroom-room showroom-room--models"
            id="showroom-panel-models"
            data-active={activeRoom === 1}
            aria-label="Không gian khám phá dòng xe"
          >
            <div className="showroom-room__heading">
              <div className="section-eyebrow">Dòng xe</div>
              <h2 className="section-heading">Khám phá dòng xe</h2>
              <p className="section-sub">
                Từ 3 Series thể thao đến X7 đẳng cấp, từ i4 điện thuần khiết đến M3 Competition 530 mã lực.
              </p>
            </div>
            {carsError && (
              <p className="showroom-error">
                Không thể kết nối dữ liệu từ Backend — hãy kiểm tra dịch vụ API.
              </p>
            )}
            {selectedCar && (
              <div className="showroom-hologram" aria-label="Chọn một mẫu xe BMW">
                <div className="showroom-hologram__topline">
                  <span><i aria-hidden="true" /> BMW / VEHICLE SELECT</span>
                  <span>{String(selectedCarIndex + 1).padStart(2, '0')} <b>/ {String(cars.length).padStart(2, '0')}</b></span>
                </div>
                <div className="showroom-hologram__display">
                  <div className="showroom-hologram__rings" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="showroom-hologram__vehicle"
                    src={selectedCar.heroImage}
                    alt={selectedCar.name}
                    key={selectedCar.id}
                  />
                  <div className="showroom-hologram__identity">
                    <span>{selectedCar.series} · {selectedCar.fuel}</span>
                    <h3>{selectedCar.name}</h3>
                    <p>{selectedCar.variant}</p>
                  </div>
                  <div className="showroom-hologram__price">{formatVnd(selectedCar.price)}</div>
                  <Link href={`/models/${selectedCar.slug}`} className="showroom-hologram__discover">
                    Khám phá xe <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                <div className="showroom-hologram__picker">
                  <button
                    type="button"
                    className="showroom-hologram__step"
                    onClick={() => selectCar(selectedCarIndex - 1)}
                    disabled={selectedCarIndex === 0}
                    aria-label="Mẫu xe trước"
                  >
                    ←
                  </button>
                  <div className="showroom-hologram__selector" aria-label="Danh sách mẫu xe" ref={carSelectorRef}>
                    {cars.map((car, index) => (
                      <button
                        key={car.id}
                        type="button"
                        className={`showroom-hologram__car${selectedCarIndex === index ? ' showroom-hologram__car--active' : ''}`}
                        onClick={() => selectCar(index)}
                        aria-pressed={selectedCarIndex === index}
                        aria-label={`Chọn ${car.name}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={car.heroImage} alt="" loading="lazy" />
                        <span>{car.name}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="showroom-hologram__step"
                    onClick={() => selectCar(selectedCarIndex + 1)}
                    disabled={selectedCarIndex === cars.length - 1}
                    aria-label="Mẫu xe tiếp theo"
                  >
                    →
                  </button>
                </div>
                <span className="showroom-hologram__instruction">Chọn mẫu xe để xem chi tiết</span>
              </div>
            )}
            <div className="grid-cars">
              {featured.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <Link href="/models" className="link-cta showroom-room__all-models">Xem tất cả Models ›</Link>
            {renderRoomControls(1, goToRoom)}
          </section>

          <section
            className="showroom-room showroom-room--electric"
            id="showroom-panel-electric"
            data-active={activeRoom === 2}
            aria-label="Không gian BMW i"
          >
            <div className="showroom-editorial">
              <div className="showroom-editorial__copy">
                <div className="section-eyebrow">BMW i</div>
                <h2 className="section-heading">Xe điện thuần khiết.</h2>
                <p className="section-sub">
                  i4, i5, i7 và iX — phạm vi hoạt động lên đến 625 km WLTP, sạc nhanh DC và trải
                  nghiệm vận hành đặc trưng của BMW.
                </p>
                <Link href="/electric" className="btn btn--primary">Khám phá BMW Electric</Link>
              </div>
              <div className="showroom-editorial__image">
                {evHero && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={evHero.heroImage} alt={evHero.name} />
                )}
                <span className="showroom-editorial__index">i / BMW ELECTRIC</span>
              </div>
            </div>
            {renderRoomControls(2, goToRoom)}
          </section>

          <section
            className="showroom-room showroom-room--m"
            id="showroom-panel-bmw-m"
            data-active={activeRoom === 3}
            aria-label="Không gian BMW M"
          >
            <div className="showroom-editorial showroom-editorial--m">
              <div className="showroom-editorial__image">
                {mHero && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={mHero.heroImage} alt={mHero.name} />
                )}
                <span className="showroom-editorial__index">M / MOTORSPORT</span>
              </div>
              <div className="showroom-editorial__copy">
                <div className="m-stripe"><span /><span /><span /></div>
                <div className="section-eyebrow">BMW M</div>
                <h2 className="section-heading">Hiệu năng đỉnh cao.</h2>
                <p className="section-sub">
                  M2, M3 Competition và M4 Competition — 460 đến 530 mã lực, thiết kế thuần M
                  với dấu ấn ba màu huyền thoại.
                </p>
                <Link href="/m" className="btn btn--secondary">Khám phá BMW M</Link>
              </div>
            </div>
            {renderRoomControls(3, goToRoom)}
          </section>

          <section
            className="showroom-room showroom-room--experience"
            id="showroom-panel-experience"
            data-active={activeRoom === 4}
            aria-label="Không gian đăng ký lái thử"
          >
            <div className="showroom-experience__content">
              <div className="section-eyebrow">Test Drive</div>
              <h2 className="section-heading">Sẵn sàng trải nghiệm BMW trên đường phố?</h2>
              <p className="section-sub">
                Đặt hẹn lái thử tại showroom BMW chính hãng gần nhất.
              </p>
              <div className="showroom-experience__actions">
                <Link href="/test-drive" className="btn btn--primary">Đăng ký lái thử</Link>
                <Link href="/dealers" className="btn btn--ghost">Tìm đại lý</Link>
              </div>
              <span className="showroom-experience__number">05</span>
            </div>
            {renderRoomControls(4, goToRoom)}
          </section>
        </div>
      </div>
    </div>
  );
}

function renderRoomControls(
  roomIndex: number,
  goToRoom: (room: number) => void,
) {
  return (
    <div className="showroom-controls">
      <button
        type="button"
        className="showroom-controls__back"
        onClick={() => goToRoom(0)}
        disabled={roomIndex === 0}
      >
        <span aria-hidden="true">↶</span> Trở về điểm bắt đầu
      </button>
      <div className="showroom-controls__actions">
        <button
          type="button"
          className="showroom-controls__step"
          onClick={() => goToRoom(roomIndex - 1)}
          disabled={roomIndex === 0}
          aria-label="Không gian trước"
        >
          ←
        </button>
        <button
          type="button"
          className="showroom-controls__step showroom-controls__step--next"
          onClick={() => goToRoom(roomIndex + 1)}
          disabled={roomIndex === ROOMS.length - 1}
          aria-label="Không gian tiếp theo"
        >
          →
        </button>
      </div>
      <span className="showroom-controls__hint">Dùng mũi tên để khám phá</span>
    </div>
  );
}
