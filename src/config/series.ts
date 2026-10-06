/**
 * Single source of truth for the private-session program.
 *
 * The Body / The Mind / The Soul are no longer separately purchasable series.
 * They are three equal focal points explored across one four-session program.
 * Every price, duration and promotional figure shown anywhere on the site is
 * derived from the constants below — nothing is typed in by hand — so changing
 * the rate, the session count or the promotion updates the whole site at once.
 */

export type FocalPointKey = 'body' | 'mind' | 'soul';

export type FocalPoint = {
  key: FocalPointKey;
  slug: string;
  path: string;
  name: string;
  /** Short label used on the embedded cards. */
  lens: string;
  description: string;
  highlights: string[];
};

export const PROGRAM = {
  name: 'Phase 0',
  path: '/offerings/personal/program',
  sessionCount: 4,
  sessionMinutes: 35,
  /** Full rate per session, before any promotion. */
  perSessionRegular: 85,
  /** Launch promotion, applied at checkout with the code below. */
  promoPercent: 50,
  promoCode: 'LAUNCH50',
  promoEnds: 'December 31, 2026',
  /** Additional saving for paying the whole program upfront. */
  payInFullTotal: 159,
};

// ── Derived figures — never hardcode a price anywhere else ──────────────────

/** 4 x $85 = $340 */
export const regularTotal = PROGRAM.sessionCount * PROGRAM.perSessionRegular;

/** $85 less 50% = $42.50 */
export const promoPerSession =
  PROGRAM.perSessionRegular * (1 - PROGRAM.promoPercent / 100);

/** 4 x $42.50 = $170, paid one session at a time */
export const promoTotal = PROGRAM.sessionCount * promoPerSession;

/** Saving against the promo total when paying in full upfront. */
export const payInFullSaving = promoTotal - PROGRAM.payInFullTotal;

/** 4 x 35 minutes = 140 */
export const totalMinutes = PROGRAM.sessionCount * PROGRAM.sessionMinutes;

/** Formats to "$340" or "$42.50" — drops the cents when they are zero. */
export const money = (n: number) =>
  `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;

/** "2 hours 20 minutes" — falls back cleanly if the numbers ever change. */
export const totalDurationLabel = () => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} minutes`;
  const h = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return minutes ? `${h} ${minutes} minutes` : h;
};

// ── The three focal points ─────────────────────────────────────────────────

export const FOCAL_POINTS: Record<FocalPointKey, FocalPoint> = {
  body: {
    key: 'body',
    slug: 'the-body',
    path: '/offerings/personal/the-body',
    name: 'The Body',
    lens: 'Physical self',
    description:
      'For those whose relationship with their physical self is where the deepest work lives. We move through foundational somatic awareness, embodied strength, structural balance, and nervous system regulation building from the inside out.',
    highlights: [
      'Interoceptive awareness and somatic grounding',
      'Embodied strength and proprioceptive stability',
      'Parasympathetic nervous system regulation',
    ],
  },
  mind: {
    key: 'mind',
    slug: 'the-mind',
    path: '/offerings/personal/the-mind',
    name: 'The Mind',
    lens: 'Emotional and mental experience',
    description:
      'For those whose relationship with their emotional and mental experience is where the deepest work lives. We apply the full yoga therapy framework through the lens of somatic-emotional and somatic-cognitive awareness.',
    highlights: [
      'Somatic-emotional awareness and regulation',
      'Metacognitive observation of thought patterns',
      'Embodied mental and emotional yoga therapy practice',
    ],
  },
  soul: {
    key: 'soul',
    slug: 'the-soul',
    path: '/offerings/personal/the-soul',
    name: 'The Soul',
    lens: 'Energetic identity',
    description:
      'For those whose relationship with their energetic identity, inner dualities, and spiritual self is where the deepest work lives. We explore how the energies you carry shape how you inhabit your body and move through the world.',
    highlights: [
      'Integration of inner dualities and energetic identity',
      'Somatic exploration of feminine, masculine, and Two Spirit energies',
      'Embodied soul work grounded in yoga therapy principles',
    ],
  },
};

export const FOCAL_POINT_LIST: FocalPoint[] = [
  FOCAL_POINTS.body,
  FOCAL_POINTS.mind,
  FOCAL_POINTS.soul,
];

// ── The four-session arc ───────────────────────────────────────────────────

/**
 * Every session works the same three strands — movement, probing questions,
 * concepts to implement. What changes session to session is depth, not kind.
 */
export const SESSION_ARC = [
  {
    number: 1,
    title: 'Exposure',
    summary:
      'You arrive with no prior requirement. The first session introduces the movements, the questions, and the concepts, and establishes a baseline of what you notice in your body, your thinking, and your sense of self.',
  },
  {
    number: 2,
    title: 'Recognition',
    summary:
      'The same movements return, and you begin to feel them differently. The questions from the first session have had time to work, and patterns you could not name last time start to become recognisable.',
  },
  {
    number: 3,
    title: 'Integration',
    summary:
      'Repetition becomes capability. The movements settle into muscle memory, and the concepts stop being ideas you were given and become conclusions you reached yourself.',
  },
  {
    number: 4,
    title: 'Application',
    summary:
      'The final session consolidates the arc and turns it outward: what you now know how to do, how to keep doing it without guidance, and where it goes next.',
  },
];

export const PROGRAM_STRANDS = [
  {
    title: 'Movement',
    body: 'Therapeutic movement repeated across all four sessions, so the body learns through practice rather than instruction. Repetition is what converts a sequence you were shown into something you own.',
  },
  {
    title: 'Probing questions',
    body: 'Questions designed to be sat with between sessions rather than answered on the spot. The insight that matters is the one you arrive at yourself, which is why the questions precede the concepts.',
  },
  {
    title: 'Concepts to implement',
    body: 'Frameworks you take out of the session and put to work in ordinary life, then bring back. Each session builds on what the last one surfaced.',
  },
];

export const PROGRAM_OUTCOMES = [
  'Full awareness of the concepts, where previously there may have been none',
  'Active muscle memory for the movements, built through deliberate repetition',
  'Conclusions you reached yourself, from questions you had time to sit with',
  'The capacity to carry all three forward without guidance',
];

export const NEXT_STEPS = [
  {
    title: 'Group programs',
    body: 'Seasonal cohort work alongside others moving through the same arc.',
  },
  {
    title: 'Focused 1:1 sessions',
    body: 'Deeper individual work on whichever focal point asked the most of you.',
  },
  {
    title: 'The practitioner path',
    body: 'For those who find the work points toward practising yoga therapy themselves.',
  },
];
