import { fetchCars } from '@/lib/api';
import CarCard from '@/components/CarCard';
import ModelsFilter from '@/components/ModelsFilter';

export const dynamic = 'force-dynamic';

export default async function ModelsPage() {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  let carsError = false;
  try {
    cars = await fetchCars();
  } catch {
    carsError = true;
  }

  return (
    <>
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <div className="section-eyebrow">Models</div>
          <h1 className="section-heading">Tất cả dòng xe BMW</h1>
          <p className="section-sub">
            Sedan, SUV, Gran Coupé, xe điện và BMW M — chọn lọc theo phong cách của bạn.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {carsError && (
            <p style={{ color: '#c62828', marginBottom: 24 }}>
              Không thể kết nối dữ liệu từ Backend — hãy kiểm tra dịch vụ API.
            </p>
          )}
          <ModelsFilter cars={cars} />
        </div>
      </section>
    </>
  );
}
