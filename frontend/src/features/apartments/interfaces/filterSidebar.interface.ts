export interface FilterSidebarProps {
  project: string;
  city: string;
  onProjectChange: (project: string) => void;
  onCityChange: (city: string) => void;
}

export interface FilterGroupProps {
  title: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}
