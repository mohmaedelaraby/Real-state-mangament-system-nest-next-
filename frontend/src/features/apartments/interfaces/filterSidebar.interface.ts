export interface FilterGroupProps {
  title: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}
