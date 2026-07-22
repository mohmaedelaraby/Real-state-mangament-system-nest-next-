'use client';

import { Button, Result } from 'antd';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle={error.message || 'An unexpected error occurred.'}
      extra={
        <Button type="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
