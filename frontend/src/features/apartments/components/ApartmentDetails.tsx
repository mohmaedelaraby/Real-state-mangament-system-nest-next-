'use client';

import { Typography } from 'antd';
import {
  BorderOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  GoldOutlined,
} from '@ant-design/icons';
import { ApartmentDetailsProps } from '../interfaces';
import { formatPrice } from '../constants';
import styles from '../styles/apartmentDetail.module.css';

const { Title, Paragraph } = Typography;

export default function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.badgeRow}>
            <span className={styles.projectBadge}>{apartment.project}</span>
            <span className={styles.unitBadge}>Unit {apartment.unitNumber}</span>
          </div>
          <Title level={2} className={styles.title}>
            {apartment.name}
          </Title>
          <div className={styles.address}>
            <EnvironmentOutlined />
            {apartment.address}, {apartment.city}
          </div>
        </div>
        <div className={styles.price}>{formatPrice(apartment.price)}</div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <BorderOutlined className={styles.statIcon} />
          <span className={styles.statValue}>{apartment.area} m²</span>
          <span className={styles.statLabel}>Area</span>
        </div>
        <div className={styles.statItem}>
          <DashboardOutlined className={styles.statIcon} />
          <span className={styles.statValue}>{apartment.beds}</span>
          <span className={styles.statLabel}>Beds</span>
        </div>
        <div className={styles.statItem}>
          <GoldOutlined className={styles.statIcon} />
          <span className={styles.statValue}>{apartment.baths}</span>
          <span className={styles.statLabel}>Baths</span>
        </div>
      </div>

      <div className={styles.description}>
        <Title level={4} className={styles.sectionTitle}>
          About this unit
        </Title>
        <Paragraph className={styles.descriptionText}>{apartment.description}</Paragraph>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Project</div>
          <Paragraph className={styles.infoValue}>{apartment.project}</Paragraph>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Unit number</div>
          <Paragraph className={styles.infoValue}>{apartment.unitNumber}</Paragraph>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>City</div>
          <Paragraph className={styles.infoValue}>{apartment.city}</Paragraph>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>Address</div>
          <Paragraph className={styles.infoValue}>{apartment.address}</Paragraph>
        </div>
      </div>
    </>
  );
}
