'use client';

import { useEffect, useState } from 'react';
import { Col, Empty, Pagination, Row, Skeleton, message } from 'antd';
import PageHeader from '@/features/apartments/components/PageHeader';
import ApartmentCard from '@/features/apartments/components/ApartmentCard';
import SearchBar from '@/features/apartments/components/SearchBar';
import FilterSidebar from '@/features/apartments/components/FilterSidebar';
import { useDebouncedValue } from '@/features/apartments/hooks/useDebouncedValue';
import { fetchApartments } from '@/features/apartments/api/apartmentsApi';
import { Apartment } from '@/features/apartments/interfaces';
import styles from '@/features/apartments/styles/homePage.module.css';

const PAGE_SIZE = 12;

export default function HomePage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [project, setProject] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, project, city]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApartments({ search: debouncedSearch, project, city, page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setApartments(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        message.error(err instanceof Error ? err.message : 'Failed to load apartments');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, project, city, page]);

  return (
    <div>
      <PageHeader />
      <div className={styles.container}>
        <div className={styles.heroBlock}>
          <div className={styles.heroTitle}>Find your next place</div>
          <div className={styles.heroSubtitle}>
            {total} curated unit{total === 1 ? '' : 's'} across Egypt&apos;s top compounds
          </div>
        </div>

        <div className={styles.searchWrap}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <Row gutter={[32, 24]}>
          <Col xs={24} md={7} lg={6}>
            <FilterSidebar
              project={project}
              city={city}
              onProjectChange={setProject}
              onCityChange={setCity}
            />
          </Col>

          <Col xs={24} md={17} lg={18}>
            {!loading && (
              <div className={styles.resultsCount}>
                {total} result{total === 1 ? '' : 's'}
                {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
              </div>
            )}

            {loading ? (
              <Row gutter={[20, 20]}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Col key={idx} xs={24} sm={12} lg={8}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                ))}
              </Row>
            ) : apartments.length === 0 ? (
              <Empty description="No apartments found" className={styles.emptyState} />
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {apartments.map((apartment) => (
                    <Col key={apartment.id} xs={24} sm={12} lg={8}>
                      <ApartmentCard apartment={apartment} />
                    </Col>
                  ))}
                </Row>
                <div className={styles.paginationWrap}>
                  <Pagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={total}
                    onChange={setPage}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
