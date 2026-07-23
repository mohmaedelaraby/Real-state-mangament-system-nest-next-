import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const project = searchParams.get('project') ?? '';
  const city = searchParams.get('city') ?? '';
  const hasFilter = Boolean(project || city);

  const updateParam = (key: 'project' | 'city', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('project');
    params.delete('city');
    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return { project, city, hasFilter, updateParam, clearFilters };
}
