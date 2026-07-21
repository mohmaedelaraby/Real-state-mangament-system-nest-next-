export interface ApartmentFormValues {
  name: string;
  unitNumber: string;
  project: string;
  city: string;
  description: string;
  address: string;
  area: number;
  price: number;
  beds: number;
  baths: number;
}

export interface ApartmentFormProps {
  onDone?: () => void;
}
