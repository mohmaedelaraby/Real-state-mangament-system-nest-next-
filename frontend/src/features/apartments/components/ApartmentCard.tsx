'use client';

import { Card, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Apartment } from '../types/apartment';

const { Text, Title } = Typography;

interface Props {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: Props) {
  const router = useRouter();
  const coverImage = apartment.images[0];

  return (
    <Card
      hoverable
      onClick={() => router.push(`/apartments/${apartment.id}`)}
      style={{ height: '100%' }}
      styles={{ body: { padding: 16 } }}
      cover={
        coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={apartment.name}
            style={{ height: 180, objectFit: 'cover', width: '100%' }}
          />
        ) : (
          <div
            style={{
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
            }}
          >
            <HomeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
          </div>
        )
      }
    >
      <Title level={5} style={{ marginBottom: 4 }} ellipsis={{ rows: 1 }}>
        {apartment.name} dsadsad
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        {apartment.project}
      </Text>
      <Text style={{ display: 'block' }}>{apartment.area} sqm</Text>
      <Text type="secondary" ellipsis style={{ display: 'block' }}>
        {apartment.address}
      </Text>
    </Card>
  );
}
