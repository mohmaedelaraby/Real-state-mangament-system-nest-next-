'use client';

import { Button, Result } from 'antd';

export default function HomeError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Result
      status="error"
      title="Failed to load apartments"
      subTitle={error.message || 'Something went wrong while fetching listings.'}
      extra={
        <Button type="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
