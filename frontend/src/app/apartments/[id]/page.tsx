'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Descriptions, Skeleton, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ApartmentGallery from '@/features/apartments/components/ApartmentGallery';
import { fetchApartmentById } from '@/features/apartments/api/apartmentsApi';
import { Apartment } from '@/features/apartments/types/apartment';

const { Title, Paragraph, Link: AntLink } = Typography;

export default function ApartmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApartmentById(params.id)
      .then((data) => {
        if (!cancelled) setApartment(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setNotFound(true);
        message.error(err instanceof Error ? err.message : 'Failed to load apartment');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <AntLink onClick={() => router.push('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <ArrowLeftOutlined /> Back to listing
      </AntLink>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : notFound || !apartment ? (
        <Typography.Text type="danger">Apartment not found.</Typography.Text>
      ) : (
        <>
          <ApartmentGallery images={apartment.images} alt={apartment.name} />
          <Title level={2} style={{ marginTop: 24 }}>
            {apartment.name}
          </Title>
          <Paragraph>{apartment.description}</Paragraph>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Project">{apartment.project}</Descriptions.Item>
            <Descriptions.Item label="Unit number">{apartment.unitNumber}</Descriptions.Item>
            <Descriptions.Item label="Address">{apartment.address}</Descriptions.Item>
            <Descriptions.Item label="Area">{apartment.area} sqm</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </div>
  );
}
