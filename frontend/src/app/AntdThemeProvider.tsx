'use client';

import { ConfigProvider } from 'antd';

const NAWY_GREEN = '#0f6b5c';

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
