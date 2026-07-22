import {
  Apartment,
  ApartmentQueryParams,
  CreateApartmentPayload,
  PaginatedApartments,
} from '../interfaces';

// Server-side (SSR) calls run inside the Next.js server process, which in Docker is a
// separate container from the backend, so it must reach it via the internal service
// name rather than the browser-facing URL. Client-side calls run in the user's browser
// and need the public URL instead.
const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'
    : process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      // response body wasn't JSON, keep the default message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchApartments(
  params: ApartmentQueryParams = {},
): Promise<PaginatedApartments> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.project) query.set('project', params.project);
  if (params.city) query.set('city', params.city);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 12));

  const res = await fetch(`${API_BASE_URL}/apartments?${query.toString()}`);
  return handleResponse<PaginatedApartments>(res);
}

export async function fetchApartmentById(id: string): Promise<Apartment> {
  const res = await fetch(`${API_BASE_URL}/apartments/${id}`);
  return handleResponse<Apartment>(res);
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
  return handleResponse<Apartment>(res);
}
