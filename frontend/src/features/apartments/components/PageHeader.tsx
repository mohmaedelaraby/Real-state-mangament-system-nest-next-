'use client';

import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

export default function PageHeader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Link href="/" style={{ color: 'inherit' }}>
        <Title level={3} style={{ margin: 0 }}>
          Nawy Apartments
        </Title>
      </Link>
      <Link href="/apartments/new">
        <Button type="primary" icon={<PlusOutlined />}>
          Add Apartment
        </Button>
      </Link>
    </div>
  );
}
