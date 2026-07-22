import Link from 'next/link';
import { notFound } from 'next/navigation';
import ApartmentGallery from '@/features/apartments/components/ApartmentGallery';
import ApartmentDetails from '@/features/apartments/components/ApartmentDetails';
import { fetchApartmentById } from '@/features/apartments/api/apartmentsApi';
import styles from '@/features/apartments/styles/apartmentDetail.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Server Component (SSR): fetches the single apartment on the server and
 * calls Next's `notFound()` on a miss, which renders this route's
 * `not-found.tsx`. The antd-heavy display markup lives in the separate
 * `ApartmentDetails` Client Component — accessing an antd compound
 * component's sub-property (e.g. `Typography.Title`, `Descriptions.Item`)
 * directly from a Server Component resolves to `undefined` under Turbopack's
 * current client-reference handling, so that rendering is pushed across a
 * `'use client'` boundary instead (see ApartmentDetails.tsx).
 */
export default async function ApartmentDetailsPage({ params }: Props) {
  const { id } = await params;
  const apartment = await fetchApartmentById(id);

  if (!apartment) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/apartments" className={styles.backLink}>
        &larr; Back to listing
      </Link>

      <ApartmentGallery images={apartment.images} alt={apartment.name} />
      <ApartmentDetails apartment={apartment} />
    </div>
  );
}
