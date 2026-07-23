'use client';

import { Pagination } from 'antd';
import { ApartmentPaginationProps } from '../interfaces';
import { useApartmentPagination } from '../hooks/useApartmentPagination';

export default function ApartmentPagination({ current, pageSize, total }: ApartmentPaginationProps) {
  const { handleChange } = useApartmentPagination();

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={handleChange}
      showSizeChanger={false}
    />
  );
}
