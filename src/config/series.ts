/**
 * Single source of truth for the private-session series.
 *
 * `perSession` x `sessionCount` drives every real price on the site — the
 * detail pages and the purchase modal both read from here. `marketingPrice`
 * is the deliberately rounded "Under $399" figure shown on the offerings
 * cards, and is maintained by hand.
 */
export type Series = {
  slug: string;
  name: string;
  sessionCount: number;
  perSession: number;
  marketingPrice: string;
};

export const PER_SESSION_RATE = 85;

export const SERIES: Record<'body' | 'mind' | 'soul', Series> = {
  body: { slug: 'the-body', name: 'The Body', sessionCount: 4, perSession: PER_SESSION_RATE, marketingPrice: 'Under $399' },
  mind: { slug: 'the-mind', name: 'The Mind', sessionCount: 3, perSession: PER_SESSION_RATE, marketingPrice: 'Under $299' },
  soul: { slug: 'the-soul', name: 'The Soul', sessionCount: 4, perSession: PER_SESSION_RATE, marketingPrice: 'Under $399' },
};

export const priceLabel = (s: Series) => `$${s.sessionCount * s.perSession}`;
export const perSessionLabel = (s: Series) => `$${s.perSession}`;
