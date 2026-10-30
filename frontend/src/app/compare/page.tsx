import { fetchCars } from '@/lib/api';
import CompareClient from '@/components/CompareClient';

export const dynamic = 'force-dynamic';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  let error = false;
  try {
    cars = await fetchCars();
  } catch {
    error = true;
  }

  const initial = (searchParams.ids || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <div className="section-eyebrow">Compare</div>
          <h1 className="section-heading">So sánh xe BMW</h1>
          <p className="section-sub">
            Chọn tối đa 3 mẫu xe để so sánh thông số kỹ thuật cạnh nhau.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {error && (
            <p style={{ color: '#c62828', marginBottom: 24 }}>
              Không thể kết nối dữ liệu từ Backend — hãy kiểm tra dịch vụ API.
            </p>
          )}
          <CompareClient cars={cars} initial={initial} />
        </div>
      </section>
    </>
  );
}
