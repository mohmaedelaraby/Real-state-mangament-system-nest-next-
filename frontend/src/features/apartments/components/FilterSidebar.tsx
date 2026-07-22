'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CheckOutlined } from '@ant-design/icons';
import { PROJECTS, CITIES } from '../constants';
import styles from '../styles/filterSidebar.module.css';
import { FilterGroupProps } from '../interfaces';

function FilterGroup({ title, items, selected, onSelect }: FilterGroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.groupTitle}>{title}</div>
      <div className={styles.itemsList}>
        {items.map((value) => {
          const on = selected === value;
          return (
            <div
              key={value}
              onClick={() => onSelect(on ? '' : value)}
              className={`${styles.item} ${on ? styles.itemActive : ''}`}
            >
              <div className={`${styles.checkbox} ${on ? styles.checkboxActive : ''}`}>
                {on ? <CheckOutlined className={styles.checkIcon} /> : null}
              </div>
              <span className={`${styles.label} ${on ? styles.labelActive : ''}`}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterSidebar() {
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

  return (
    <div className={styles.sidebar}>
      <div className={styles.headerRow}>
        <div className={styles.headerTitle}>Filters</div>
        {hasFilter ? (
          <span onClick={clearFilters} className={styles.clear}>
            Clear
          </span>
        ) : null}
      </div>
      <FilterGroup
        title="Project"
        items={PROJECTS}
        selected={project}
        onSelect={(value) => updateParam('project', value)}
      />
      <FilterGroup
        title="City"
        items={CITIES}
        selected={city}
        onSelect={(value) => updateParam('city', value)}
      />
    </div>
  );
}
