import Link from 'next/link';
import { Button, Result } from 'antd';

export default function ApartmentNotFound() {
  return (
    <Result
      status="404"
      title="Apartment not found"
      subTitle="This listing doesn't exist or may have been removed."
      extra={
        <Link href="/apartments">
          <Button type="primary">Back to listing</Button>
        </Link>
      }
    />
  );
}
