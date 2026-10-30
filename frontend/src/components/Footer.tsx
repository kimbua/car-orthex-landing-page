import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/bmw-roundel.svg" alt="BMW" />
            <p style={{ marginTop: 18, color: '#8b95a1', fontSize: 13, maxWidth: 320 }}>
              BMW Digital Showroom — trải nghiệm trực tuyến dòng xe BMW chính hãng tại Việt Nam.
              Thông số &amp; giá tham khảo từ BMW Việt Nam, cập nhật theo từng thời điểm.
            </p>
          </div>
          <div>
            <div className="site-footer__title">Khám phá</div>
            <ul className="site-footer__links">
              <li><Link href="/models">Tất cả Models</Link></li>
              <li><Link href="/electric">BMW Electric</Link></li>
              <li><Link href="/m">BMW M</Link></li>
              <li><Link href="/compare">So sánh xe</Link></li>
            </ul>
          </div>
          <div>
            <div className="site-footer__title">Mua xe</div>
            <ul className="site-footer__links">
              <li><Link href="/test-drive">Đăng ký lái thử</Link></li>
              <li><Link href="/dealers">Hệ thống phân phối</Link></li>
            </ul>
          </div>
          <div>
            <div className="site-footer__title">BMW Việt Nam</div>
            <ul className="site-footer__links">
              <li><a href="https://www.bmw.vn/vi/index.html" target="_blank" rel="noreferrer">bmw.vn</a></li>
              <li><a href="https://www.bmw.com/en/index.html" target="_blank" rel="noreferrer">bmw.com</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 BMW Digital Showroom. Dữ liệu demo từ nguồn công khai BMW — chỉ mang tính tham khảo.</span>
          <span>BMW — Sheer Driving Pleasure · Niềm vui cầm lái</span>
        </div>
      </div>
    </footer>
  );
}
