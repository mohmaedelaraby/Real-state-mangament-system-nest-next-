import { Skeleton } from 'antd';
import styles from '@/features/apartments/styles/apartmentDetail.module.css';

export default function ApartmentDetailsLoading() {
  return (
    <div className={styles.container}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
}
