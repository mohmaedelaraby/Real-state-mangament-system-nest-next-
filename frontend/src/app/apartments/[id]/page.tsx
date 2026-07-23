import Link from 'next/link';
import { notFound } from 'next/navigation';
import ApartmentGallery from '@/features/apartments/components/ApartmentGallery';
import ApartmentDetails from '@/features/apartments/components/ApartmentDetails';
import { fetchApartmentById } from '@/features/apartments/api/apartmentsApi';
import styles from '@/features/apartments/styles/apartmentDetail.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApartmentDetailsPage({ params }: Props) {
  const { id } = await params;
  const apartment = await fetchApartmentById(id);

  if (!apartment) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/apartments" className={styles.backLink}>
        <span className={styles.arrow}>&larr;</span> Back to listing
      </Link>

      <div className={styles.galleryBlock}>
        <ApartmentGallery images={apartment.images} alt={apartment.name} />
      </div>
      <ApartmentDetails apartment={apartment} />
    </div>
  );
}
