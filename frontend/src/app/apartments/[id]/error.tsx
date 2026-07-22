'use client';

import { Button, Result } from 'antd';

export default function ApartmentDetailsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Result
      status="error"
      title="Failed to load apartment"
      subTitle={error.message || 'Something went wrong while fetching this listing.'}
      extra={
        <Button type="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
