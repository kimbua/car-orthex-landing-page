'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { href: '/models', label: 'Models' },
  { href: '/electric', label: 'Electric' },
  { href: '/m', label: 'BMW M' },
  { href: '/dealers', label: 'Find a Dealer' },
  { href: '/test-drive', label: 'Test Drive' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="BMW Digital Showroom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/bmw-roundel.svg" alt="BMW" />
        </Link>

        <nav className="site-header__nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/test-drive" className="btn btn--primary site-header__cta" style={{ padding: '12px 22px' }}>
          Đặt hẹn lái thử
        </Link>

        <button
          type="button"
          className="site-header__burger"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </Link>
        ))}
        <Link href="/test-drive" onClick={() => setOpen(false)}>
          Đặt hẹn lái thử
        </Link>
      </div>
    </header>
  );
}
