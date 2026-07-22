'use client';

import { Typography } from 'antd';
import { HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ApartmentCardProps } from '../interfaces';
import { formatPrice } from '../constants';
import styles from '../styles/apartmentCard.module.css';

const { Text } = Typography;

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  const router = useRouter();
  const coverImage = apartment.images[0];

  return (
    <div className={styles.card} onClick={() => router.push(`/apartments/${apartment.id}`)}>
      <div className={styles.imageWrap}>
        {coverImage ? (
          <img src={coverImage} alt={apartment.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <HomeOutlined className={styles.placeholderIcon} />
          </div>
        )}
        <div className={styles.badge}>{apartment.project}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <Text strong className={styles.title} ellipsis>
            {apartment.name}
          </Text>
          <Text className={styles.unitNumber}>{apartment.unitNumber}</Text>
        </div>
        <div className={styles.address}>
          <EnvironmentOutlined /> {apartment.address}
        </div>
        <div className={styles.statsRow}>
          <span>
            <b className={styles.statValue}>{apartment.area}</b> m²
          </span>
          <span>
            <b className={styles.statValue}>{apartment.beds}</b> bd
          </span>
          <span>
            <b className={styles.statValue}>{apartment.baths}</b> ba
          </span>
          <span className={styles.price}>{formatPrice(apartment.price)}</span>
        </div>
      </div>
    </div>
  );
}
