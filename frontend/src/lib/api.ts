import type { Car, CompareData, Dealer } from './types';

/**
 * Server-side API access. `API_URL` is read at runtime (server env injected
 * by docker compose — never baked into the image).
 */
export function apiUrl(): string {
  const url = process.env.API_URL || 'http://127.0.0.1:3001';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${apiUrl()}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

export function fetchCars(query = ''): Promise<Car[]> {
  return getJson<Car[]>(`/api/cars${query}`);
}

export function fetchCar(slug: string): Promise<Car> {
  return getJson<Car>(`/api/cars/${slug}`);
}

export function fetchDealers(): Promise<Dealer[]> {
  return getJson<Dealer[]>(`/api/dealers`);
}

export function fetchCompare(ids: string[]): Promise<CompareData> {
  return getJson<CompareData>(`/api/compare?ids=${ids.join(',')}`);
}
