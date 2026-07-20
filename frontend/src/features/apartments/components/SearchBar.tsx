'use client';

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <Input
      size="large"
      allowClear
      placeholder="Search by name, unit number, or project..."
      prefix={<SearchOutlined style={{ opacity: 0.4 }} />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ maxWidth: 520, borderRadius: 13, padding: '10px 16px' }}
    />
  );
}
