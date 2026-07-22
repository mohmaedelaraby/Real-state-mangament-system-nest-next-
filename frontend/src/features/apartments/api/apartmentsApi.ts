import {
  Apartment,
  ApartmentQueryParams,
  CreateApartmentPayload,
  PaginatedApartments,
} from '../interfaces';


const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'
    : process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';



export async function fetchApartments(
  params: ApartmentQueryParams = {},
): Promise<PaginatedApartments> {

  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.project) query.set('project', params.project);
  if (params.city) query.set('city', params.city);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 9));

  const res = await fetch(`${API_BASE_URL}/apartments?${query.toString()}`);
  return res.json();
}

export async function fetchApartmentById(id: string): Promise<Apartment | null> {
  const res = await fetch(`${API_BASE_URL}/apartments/${id}`);
  if (res.status === 404) return null;
  return res.json();
}

export async function createApartment(payload: CreateApartmentPayload): Promise<Apartment> {
  const formData = new FormData();
  formData.set('name', payload.name);
  formData.set('unitNumber', payload.unitNumber);
  formData.set('project', payload.project);
  formData.set('city', payload.city);
  formData.set('description', payload.description);
  formData.set('address', payload.address);
  formData.set('area', String(payload.area));
  formData.set('price', String(payload.price));
  formData.set('beds', String(payload.beds));
  formData.set('baths', String(payload.baths));
  payload.images.forEach((file) => formData.append('images', file));

  const res = await fetch(`${API_BASE_URL}/apartments`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}
