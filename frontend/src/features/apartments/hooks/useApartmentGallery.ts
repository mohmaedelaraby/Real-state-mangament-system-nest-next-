import { useState } from 'react';

export function useApartmentGallery(images: string[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images[activeIndex];
  const selectImage = (index: number) => setActiveIndex(index);

  return { activeIndex, mainImage, selectImage };
}
