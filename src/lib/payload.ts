const PAYLOAD_URL = import.meta.env.PAYLOAD_PUBLIC_URL ?? 'http://localhost:3000';

type PayloadList<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
};

async function payloadFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${PAYLOAD_URL.replace(/\/$/, '')}/api${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Payload ${res.status} on ${url}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: unknown;
  seo?: { title?: string; description?: string };
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: unknown;
  publishedAt?: string;
};

export const payload = {
  pages: () => payloadFetch<PayloadList<Page>>('/pages?limit=200&depth=2'),
  page: (slug: string) =>
    payloadFetch<PayloadList<Page>>(`/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`),
  posts: () => payloadFetch<PayloadList<Post>>('/posts?limit=200&depth=2&sort=-publishedAt'),
  post: (slug: string) =>
    payloadFetch<PayloadList<Post>>(`/posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`),
};
