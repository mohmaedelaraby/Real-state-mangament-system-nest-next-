'use client';

import { Pagination } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApartmentPaginationProps } from '../interfaces';

export default function ApartmentPagination({ current, pageSize, total }: ApartmentPaginationProps) {
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

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
