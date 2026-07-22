import { Col, Row, Skeleton } from 'antd';
import PageHeader from '@/features/apartments/components/PageHeader';
import styles from '@/features/apartments/styles/homePage.module.css';

export default function ApartmentsLoading() {
  return (
    <div>
      <PageHeader />

      <div className={styles.container}>
        <div className={styles.heroBlock}>
          <div className={styles.heroTitle}>Find your next place</div>
        </div>

        <Row gutter={[32, 24]}>
          <Col xs={24} md={7} lg={6}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Col>
          <Col xs={24} md={17} lg={18}>
            <Row gutter={[20, 20]}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Col key={idx} xs={24} sm={12} lg={8}>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
