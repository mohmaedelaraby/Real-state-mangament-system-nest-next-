'use client';

import { CheckOutlined } from '@ant-design/icons';
import { PROJECTS, CITIES } from '../constants';

const NAWY_GREEN = '#0f6b5c';

interface Props {
  project: string;
  city: string;
  onProjectChange: (project: string) => void;
  onCityChange: (city: string) => void;
}

function FilterGroup({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(0, 0, 0, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '.06em',
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map((value) => {
          const on = selected === value;
          return (
            <div
              key={value}
              onClick={() => onSelect(on ? '' : value)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '7px 8px',
                borderRadius: 8,
                cursor: 'pointer',
                background: on ? 'rgba(15, 107, 92, 0.09)' : 'transparent',
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 4,
                  border: on ? 'none' : '1.5px solid rgba(0, 0, 0, 0.25)',
                  background: on ? NAWY_GREEN : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                  marginTop: 1,
                }}
              >
                {on ? <CheckOutlined style={{ color: '#fff', fontSize: 10 }} /> : null}
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: on ? 700 : 500,
                  color: on ? NAWY_GREEN : 'rgba(0, 0, 0, 0.68)',
                  lineHeight: 1.35,
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterSidebar({ project, city, onProjectChange, onCityChange }: Props) {
  const hasFilter = Boolean(project || city);

  return (
    <div
      style={{
        position: 'sticky',
        top: 80,
        background: '#fff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: 16,
        padding: '18px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800 }}>Filters</div>
        {hasFilter ? (
          <span
            onClick={() => {
              onProjectChange('');
              onCityChange('');
            }}
            style={{ fontSize: 12, fontWeight: 700, color: NAWY_GREEN, cursor: 'pointer' }}
          >
            Clear
          </span>
        ) : null}
      </div>
      <FilterGroup title="Project" items={PROJECTS} selected={project} onSelect={onProjectChange} />
      <FilterGroup title="City" items={CITIES} selected={city} onSelect={onCityChange} />
    </div>
  );
}
