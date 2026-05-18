const MEDUSA_URL = import.meta.env.MEDUSA_PUBLIC_URL ?? 'http://localhost:9000';
const PUBLISHABLE_KEY = import.meta.env.MEDUSA_PUBLISHABLE_KEY ?? '';

async function medusaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${MEDUSA_URL.replace(/\/$/, '')}/store${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Medusa ${res.status} on ${url}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export type MedusaProduct = {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: { id: string; url: string }[];
  variants: {
    id: string;
    title: string;
    sku?: string;
    inventory_quantity?: number;
    calculated_price?: { calculated_amount: number; currency_code: string };
  }[];
};

export const medusa = {
  products: () =>
    medusaFetch<{ products: MedusaProduct[]; count: number }>(
      '/products?limit=200&fields=*variants,*variants.calculated_price,*images,+thumbnail',
    ),
  product: (handle: string) =>
    medusaFetch<{ products: MedusaProduct[] }>(
      `/products?handle=${encodeURIComponent(handle)}&fields=*variants,*variants.calculated_price,*images,+thumbnail`,
    ),
};
