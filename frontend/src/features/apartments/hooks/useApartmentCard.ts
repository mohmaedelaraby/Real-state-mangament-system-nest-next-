import { useRouter } from 'next/navigation';
import { Apartment } from '../interfaces';

export function useApartmentCard(apartment: Apartment) {
  const router = useRouter();
  const coverImage = apartment.images[0];

  const goToDetails = () => router.push(`/apartments/${apartment.id}`);

  return { coverImage, goToDetails };
}
