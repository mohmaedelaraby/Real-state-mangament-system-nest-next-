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

/** Envelope every backend response is wrapped in (see backend's ResponseInterceptor). */
export interface ApiResponse<T> {
  status: 'success';
  message: string;
  data: T;
}

export type CreateApartmentResponse = ApiResponse<Apartment>;
