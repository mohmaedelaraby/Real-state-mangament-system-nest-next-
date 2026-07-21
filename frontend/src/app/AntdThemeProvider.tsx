'use client';

import { ConfigProvider } from 'antd';
import { NAWY_GREEN } from '@/features/apartments/constants';

export default function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: NAWY_GREEN,
          colorLink: NAWY_GREEN,
          borderRadius: 10,
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
