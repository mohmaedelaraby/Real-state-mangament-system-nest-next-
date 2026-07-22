import Link from 'next/link';
import { Button, Result } from 'antd';
import PageHeader from '@/features/apartments/components/PageHeader';

export default function GlobalNotFound() {
  return (
    <div>
      <PageHeader />
      <Result
        status="404"
        title="Page not found"
        subTitle="The page you're looking for doesn't exist."
        extra={
          <Link href="/apartments">
            <Button type="primary">Go to listings</Button>
          </Link>
        }
      />
    </div>
  );
}
