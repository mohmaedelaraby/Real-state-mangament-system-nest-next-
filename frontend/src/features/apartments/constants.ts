export const PROJECTS = ['Marassi', 'Palm Hills', 'Mivida', 'ZED East', 'Hyde Park', 'O West'];

export const CITIES = ['North Coast', 'New Cairo', '6th of October', 'Sheikh Zayed', 'New Capital'];

export const AREA_OPTIONS = [50, 60, 75, 90, 100, 120, 150, 180, 200, 250, 300];

export function formatPrice(value: number): string {
  return `EGP ${value.toLocaleString('en-US')}`;
}
