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

export type HeroBlockType = {
  blockType: 'hero';
  badge?: string;
  title: string;
  titleColored?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  showPot?: boolean;
  potTitle?: string;
  potSubtitle?: string;
  potBottomLeft?: string;
  potBottomRight?: string;
};

export type PageHeaderBlockType = {
  blockType: 'pageHeader';
  badge?: string;
  title: string;
  description?: string;
};

export type ValueItem = {
  id?: string;
  emoji?: string;
  title: string;
  description: string;
};

export type ValuesBlockType = {
  blockType: 'values';
  title: string;
  subtitle?: string;
  items: ValueItem[];
};

export type StoryBlockType = {
  blockType: 'story';
  title: string;
  paragraphs: { text: string; id?: string }[];
  emojis?: string;
  image?: any;
};

export type EngagementItem = {
  id?: string;
  emoji?: string;
  title: string;
  description: string;
};

export type EngagementsBlockType = {
  blockType: 'engagements';
  badge?: string;
  title: string;
  subtitle?: string;
  items: EngagementItem[];
};

export type QuoteBlockType = {
  blockType: 'quote';
  quote: string;
  author?: string;
};

export type FeaturedProductsBlockType = {
  blockType: 'featuredProducts';
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

export type LatestPostsBlockType = {
  blockType: 'latestPosts';
  title: string;
  subtitle?: string;
};

export type LayoutBlock =
  | HeroBlockType
  | PageHeaderBlockType
  | ValuesBlockType
  | StoryBlockType
  | EngagementsBlockType
  | QuoteBlockType
  | FeaturedProductsBlockType
  | LatestPostsBlockType;

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: any;
  layout?: LayoutBlock[];
  seo?: { title?: string; description?: string };
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover?: any;
  content: any;
  publishedAt?: string;
};

export type ProductMetadata = {
  id: string;
  medusaProductHandle: string;
  origin: string;
  tasteProfile: string;
  harvestPeriod?: string;
  honeyColor?: string;
  intensity?: number;
  benefits?: string;
  craftStory?: any;
  recipes?: any;
};

export const payload = {
  pages: () => payloadFetch<PayloadList<Page>>('/pages?limit=200&depth=2'),
  page: (slug: string) =>
    payloadFetch<PayloadList<Page>>(`/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`),
  posts: () => payloadFetch<PayloadList<Post>>('/posts?limit=200&depth=2&sort=-publishedAt'),
  post: (slug: string) =>
    payloadFetch<PayloadList<Post>>(`/posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`),
  productsMetadata: () => payloadFetch<PayloadList<ProductMetadata>>('/products-metadata?limit=200&depth=2'),
  productMetadata: (handle: string) =>
    payloadFetch<PayloadList<ProductMetadata>>(`/products-metadata?where[medusaProductHandle][equals]=${encodeURIComponent(handle)}&depth=2`),
};
