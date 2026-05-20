const MEDUSA_URL = import.meta.env.MEDUSA_PUBLIC_URL ?? 'http://localhost:9000';
const PUBLISHABLE_KEY = import.meta.env.MEDUSA_PUBLISHABLE_KEY ?? (typeof process !== 'undefined' ? process.env.MEDUSA_PUBLISHABLE_KEY : '') ?? '';

console.log('[Medusa Client] Configured URL:', MEDUSA_URL);
console.log('[Medusa Client] Loaded Publishable Key (first 10 chars):', PUBLISHABLE_KEY ? PUBLISHABLE_KEY.substring(0, 10) + '...' : 'MISSING');

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

async function getDefaultRegionId(): Promise<string | null> {
  try {
    const data = await medusaFetch<{ regions: { id: string }[] }>('/regions');
    if (data.regions && data.regions.length > 0) {
      return data.regions[0].id;
    }
  } catch (err) {
    console.warn('[Medusa Client] Failed to fetch regions:', err);
  }
  return null;
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
  products: async () => {
    const regionId = await getDefaultRegionId();
    const query = `/products?limit=200&fields=*variants,*variants.calculated_price,*images,+thumbnail` + (regionId ? `&region_id=${regionId}` : '');
    return medusaFetch<{ products: MedusaProduct[]; count: number }>(query);
  },
  product: async (handle: string) => {
    const regionId = await getDefaultRegionId();
    const query = `/products?handle=${encodeURIComponent(handle)}&fields=*variants,*variants.calculated_price,*images,+thumbnail` + (regionId ? `&region_id=${regionId}` : '');
    return medusaFetch<{ products: MedusaProduct[] }>(query);
  },
};
