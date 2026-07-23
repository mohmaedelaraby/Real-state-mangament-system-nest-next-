import {
  Apartment,
  ApartmentQueryParams,
  ApiResponse,
  CreateApartmentPayload,
  CreateApartmentResponse,
  PaginatedApartments,
} from '../interfaces';


const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'
    : process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

/** Parses a response, throwing with the backend's `message` (see AllExceptionsFilter's error shape) on a non-2xx status instead of returning the error body as if it were success data. */
async function parseResponse<T>(res: Response): Promise<T> {
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

/** Called server-side from `app/apartments/page.tsx` on every request (searchParams make the route dynamic — see README's SSR architecture section). */
export async function fetchApartments(
  params: ApartmentQueryParams = {},
): Promise<PaginatedApartments> {

  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.project) query.set('project', params.project);
  if (params.city) query.set('city', params.city);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 9));

  const res = await fetch(`${API_BASE_URL}/apartments?${query.toString()}`, { cache: 'no-store' });
  const body = await parseResponse<ApiResponse<PaginatedApartments>>(res);
  return body.data;
}

/** Called server-side from `app/apartments/[id]/page.tsx`. Returns `null` (not a throw) on 404 so the page can call Next's `notFound()` and render `not-found.tsx`. */
export async function fetchApartmentById(id: string): Promise<Apartment | null> {
  const res = await fetch(`${API_BASE_URL}/apartments/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  const body = await parseResponse<ApiResponse<Apartment>>(res);
  return body.data;
}

/** Resolves with `{ status: 'success', message, data }` on success; throws (with the backend's message) on any error. */
export async function createApartment(payload: CreateApartmentPayload): Promise<CreateApartmentResponse> {
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
  return parseResponse<CreateApartmentResponse>(res);
}
