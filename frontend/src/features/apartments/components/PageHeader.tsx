'use client';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAWY_GREEN = '#0f6b5c';

export default function PageHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(244, 242, 238, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', flex: 'none' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: NAWY_GREEN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            N
          </div>
          <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>nawy</div>
        </Link>
        <div style={{ flex: 1 }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link
            href="/"
            style={{
              padding: '9px 14px',
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              color: isHome ? NAWY_GREEN : 'rgba(0, 0, 0, 0.55)',
            }}
          >
            Browse
          </Link>
          <Link href="/apartments/new">
            <Button type="primary" icon={<PlusOutlined />}>
              List a unit
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
