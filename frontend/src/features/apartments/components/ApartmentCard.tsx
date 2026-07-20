'use client';

import { useState } from 'react';
import { Typography } from 'antd';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Apartment } from '../types/apartment';
import { formatPrice } from '../constants';

const { Text } = Typography;
const NAWY_GREEN = '#0f6b5c';

interface Props {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const coverImage = apartment.images[0];

  return (
    <div
      onClick={() => router.push(`/apartments/${apartment.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: hovered ? '0 14px 34px rgba(0, 0, 0, 0.10)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'transform .18s, box-shadow .18s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative' }}>
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={apartment.name}
            style={{ height: 190, objectFit: 'cover', width: '100%', display: 'block' }}
          />
        ) : (
          <div
            style={{
              height: 190,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #dfe6e3, #c7d3ce)',
            }}
          >
            <HomeOutlined style={{ fontSize: 40, color: 'rgba(0, 0, 0, 0.25)' }} />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '5px 10px',
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.92)',
            fontSize: 12,
            fontWeight: 600,
            color: NAWY_GREEN,
          }}
        >
          {apartment.project}
        </div>
      </div>
      <div style={{ padding: '15px 16px 17px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
          <Text strong style={{ fontSize: 16, letterSpacing: '-0.01em' }} ellipsis>
            {apartment.name}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)', fontWeight: 600, flex: 'none' }}>
            {apartment.unitNumber}
          </Text>
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(0, 0, 0, 0.5)',
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <EnvironmentOutlined /> {apartment.address}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 13,
            paddingTop: 13,
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: 13,
            color: 'rgba(0, 0, 0, 0.6)',
            alignItems: 'center',
          }}
        >
          <span>
            <b style={{ color: '#161512' }}>{apartment.area}</b> m²
          </span>
          <span>
            <b style={{ color: '#161512' }}>{apartment.beds}</b> bd
          </span>
          <span>
            <b style={{ color: '#161512' }}>{apartment.baths}</b> ba
          </span>
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: NAWY_GREEN }}>
            {formatPrice(apartment.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
