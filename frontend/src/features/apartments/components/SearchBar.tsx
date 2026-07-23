'use client';

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../styles/searchBar.module.css';
import { useSearchBar } from '../hooks/useSearchBar';

export default function SearchBar() {
  const { value, setValue } = useSearchBar();

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
