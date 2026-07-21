export interface Apartment {
  id: string;
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
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApartments {
  data: Apartment[];
  total: number;
  page: number;
  limit: number;
}

export interface ApartmentQueryParams {
  search?: string;
  project?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface CreateApartmentPayload {
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
  images: File[];
}
