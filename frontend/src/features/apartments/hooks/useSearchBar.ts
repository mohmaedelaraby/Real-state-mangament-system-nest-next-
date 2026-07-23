import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/common/hooks/useDebouncedValue';

export function useSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const [value, setValue] = useState(urlSearch);
  const debouncedValue = useDebouncedValue(value, 400);
  const committedRef = useRef(urlSearch);

  useEffect(() => {
    if (debouncedValue === committedRef.current) return;
    committedRef.current = debouncedValue;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set('search', debouncedValue);
    } else {
      params.delete('search');
    }
    params.delete('page');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [debouncedValue]);

  return { value, setValue };
}
