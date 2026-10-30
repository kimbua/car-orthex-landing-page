import { fetchDealers } from '@/lib/api';
import DealersFilter from '@/components/DealersFilter';

export const dynamic = 'force-dynamic';

export default async function DealersPage() {
  let dealers: Awaited<ReturnType<typeof fetchDealers>> = [];
  let error = false;
  try {
    dealers = await fetchDealers();
  } catch {
    error = true;
  }

  return (
    <>
      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <div className="section-eyebrow">Find a Dealer</div>
          <h1 className="section-heading">Hệ thống phân phối BMW</h1>
          <p className="section-sub">
            Mạng lưới showroom BMW chính hãng trên toàn quốc — liên hệ trực tiếp để được tư vấn
            và đặt lịch lái thử.
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
          <DealersFilter dealers={dealers} />
        </div>
      </section>
    </>
  );
}
