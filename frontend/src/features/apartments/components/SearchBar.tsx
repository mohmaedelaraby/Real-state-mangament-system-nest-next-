'use client';

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '../styles/searchBar.module.css';
import { SearchBarProps } from '../interfaces';

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Input
      size="large"
      allowClear
      placeholder="Search by name, unit number, or project..."
      prefix={<SearchOutlined className={styles.searchIcon} />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
    />
  );
}
