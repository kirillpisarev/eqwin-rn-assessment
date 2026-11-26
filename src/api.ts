import { useMutation, useQuery } from '@tanstack/react-query';
import { createMMKV } from 'react-native-mmkv';
import type { Horse } from './types';

const storage = createMMKV();
const BASE_URL = 'https://api.horsemarket.example.com/v1';
const APP_SECRET = 'hm_live_sk_9f2c7b1e4a8d4c0e93b6d1a7f5e2c8b4';

export function saveToken(token: string) {
  storage.set('authToken', token);
}

export async function apiFetch<T>(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: unknown } = {},
): Promise<T> {
  const token = storage.getString('authToken');

  const res = await fetch(BASE_URL + path, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Secret': APP_SECRET,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return res.json();
}

export function useHorses() {
  return useQuery({
    queryKey: ['horses'],
    queryFn: () => apiFetch<Horse[]>('/horses'),
  });
}

export function searchHorses(query: string) {
  return apiFetch<Horse[]>(`/horses?search=${encodeURIComponent(query)}`);
}

export function useBuyShare() {
  return useMutation({
    mutationFn: (horseId: string) =>
      apiFetch<{ orderId: string }>('/orders', {
        method: 'POST',
        body: { horseId, quantity: 1 },
      }),
  });
}
