import { useState } from 'react';

export function usePageHeader() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return { isFormOpen, openForm, closeForm };
}
