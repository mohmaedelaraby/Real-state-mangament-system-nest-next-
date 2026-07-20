'use client';

import { useRouter } from 'next/navigation';
import { Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ApartmentForm from '@/features/apartments/components/ApartmentForm';

const { Title, Link: AntLink } = Typography;

export default function NewApartmentPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <AntLink onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <ArrowLeftOutlined /> Back to listing
      </AntLink>
      <Title level={2}>Add Apartment</Title>
      <ApartmentForm />
    </div>
  );
}
