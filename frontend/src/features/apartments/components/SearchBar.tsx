'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../styles/searchBar.module.css';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const [value, setValue] = useState(urlSearch);
  const debouncedValue = useDebouncedValue(value, 400);
  const committedRef = useRef(urlSearch);

  useEffect(() => {
    if (debouncedValue === committedRef.current) return;
    committedRef.current = debouncedValue;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set('search', debouncedValue);
    } else {
      params.delete('search');
    }
    params.delete('page');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [debouncedValue]);

  return (
    <Input
      size="large"
      allowClear
      placeholder="Search by name, unit number, or project..."
      prefix={<SearchOutlined className={styles.searchIcon} />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.input}
    />
  );
}
