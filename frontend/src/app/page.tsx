'use client';

import { useEffect, useState } from 'react';
import { Col, Empty, Pagination, Row, Skeleton, message } from 'antd';
import PageHeader from '@/features/apartments/components/PageHeader';
import ApartmentCard from '@/features/apartments/components/ApartmentCard';
import SearchBar from '@/features/apartments/components/SearchBar';
import { useDebouncedValue } from '@/features/apartments/hooks/useDebouncedValue';
import { fetchApartments } from '@/features/apartments/api/apartmentsApi';
import { Apartment } from '@/features/apartments/types/apartment';

const PAGE_SIZE = 12;

export default function HomePage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(1);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApartments({ search: debouncedSearch, page, limit: PAGE_SIZE })
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
  }, [debouncedSearch, page]);

  return (
    <div>
      <PageHeader />
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Col key={idx} xs={24} sm={12} md={8} lg={6}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Col>
            ))}
          </Row>
        ) : apartments.length === 0 ? (
          <Empty description="No apartments found" style={{ marginTop: 80 }} />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {apartments.map((apartment) => (
                <Col key={apartment.id} xs={24} sm={12} md={8} lg={6}>
                  <ApartmentCard apartment={apartment} />
                </Col>
              ))}
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
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
      </div>
    </div>
  );
}
