import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BMW Digital Showroom — Khám phá dòng xe BMW tại Việt Nam',
  description:
    'BMW Digital Showroom: 3 Series, 5 Series, 7 Series, X1, X3, X5, X7, i4, i5, i7, iX, M2, M3, M4 — giá tham khảo, thông số kỹ thuật, so sánh xe và đăng ký lái thử.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
