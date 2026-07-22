'use client';

import { Descriptions, Typography } from 'antd';
import { ApartmentDetailsProps } from '../interfaces';
import styles from '../styles/apartmentDetail.module.css';

const { Title, Paragraph } = Typography;

export default function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  return (
    <>
      <Title level={2} className={styles.title}>
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
  );
}
