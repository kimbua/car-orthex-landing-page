import { fetchCars, fetchDealers } from '@/lib/api';
import TestDriveForm from '@/components/TestDriveForm';

export const dynamic = 'force-dynamic';

export default async function TestDrivePage() {
  const [cars, dealers] = await Promise.all([fetchCars(), fetchDealers()]);

  return (
    <>
      <section className="hero">
        <div className="hero__veil" style={{ background: 'linear-gradient(100deg, rgba(26,33,41,0.95) 0%, rgba(26,33,41,0.7) 55%, rgba(26,33,41,0.35) 100%)' }} />
        <div className="container hero__content" style={{ minHeight: 'auto', paddingBlock: '120px 90px' }}>
          <div className="hero__eyebrow">Test Drive</div>
          <h1 className="hero__title">Đăng ký lái thử.</h1>
          <p className="hero__sub">
            Trải nghiệm BMW của bạn trên đường phố thực tế — chúng tôi sẽ liên hệ xác nhận lịch
            hẹn tại showroom BMW chính hãng gần nhất.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <div className="section-eyebrow">Đặt hẹn</div>
            <h2 className="section-heading" style={{ marginBottom: 28 }}>Thông tin đăng ký</h2>
            <TestDriveForm cars={cars} dealers={dealers} />
          </div>
          <aside>
            <div className="section-eyebrow">Lưu ý</div>
            <div style={{ border: '1px solid var(--bmw-line)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: 'var(--bmw-muted)', fontSize: 14 }}>
                Buổi lái thử kéo dài khoảng 30–45 phút với tư vấn viên BMW, bao gồm đường phố
                và đường cao tốc nội đô (tùy showroom).
              </p>
              <p style={{ color: 'var(--bmw-muted)', fontSize: 14 }}>
                Khách hàng cần mang theo Giấy phép lái xe hợp lệ khi đến showroom.
              </p>
              <p style={{ color: 'var(--bmw-muted)', fontSize: 14 }}>
                Thông tin đăng ký được lưu an toàn tại Backend (PostgreSQL) và chỉ phục vụ mục
                đích liên hệ xác nhận lịch hẹn.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
