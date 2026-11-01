/**
 * Where each photograph is used.
 *
 * All of them are Unsplash stock. None shows White & Case's branding, its
 * offices, or anyone who could be taken for its staff — the people in them
 * are unidentified stock subjects in generic settings, which is what keeps
 * the site's "no logos, no offices, no people" rule intact.
 */
const base = import.meta.env.BASE_URL

const photo = (slug: string, size: 'card' | 'stat') =>
  `${base}images/photos/${slug}-${size}.webp`

/** One photograph per programme, in the order the programmes are listed. */
export const PROGRAM_PHOTOS: Record<string, { src: string; alt: string }> = {
  'First 90 Days': {
    src: photo('long-table', 'card'),
    alt: 'A long table of people eating and talking together.',
  },
  'Momentum Circles': {
    src: photo('reception', 'card'),
    alt: 'A crowded room at an evening reception.',
  },
  'Global Table': {
    src: photo('earth', 'card'),
    alt: 'The earth at night from orbit, city lights spread across it.',
  },
  'Client Roundtables': {
    src: photo('dinner', 'card'),
    alt: 'A long table laid for dinner, plates of food down the middle.',
  },
}

/**
 * One photograph per stat card, keyed by the figure it sits behind. All four
 * are black and white, and the card lays a navy scrim over them so the
 * outline chart and the figure stay readable.
 */
export const STAT_PHOTOS: Record<string, { src: string; alt: string }> = {
  '$4.04M': {
    src: photo('suit', 'stat'),
    alt: 'A man in a suit fastening his jacket button.',
  },
  '30-38%': {
    src: photo('staircase', 'stat'),
    alt: 'A blurred crowd moving down a wide stone staircase.',
  },
  '61%': {
    src: photo('atrium', 'stat'),
    alt: 'A man standing alone on his phone outside a glass office building.',
  },
  '18% vs 61%': {
    src: photo('louvres', 'stat'),
    alt: 'A man standing beside an empty bench in front of a ribbed wall.',
  },
}

export const HERO_PHOTO = `${base}images/nyc-hero.webp`
export const HEADSHOT = `${base}images/sofia-headshot.webp`

export const PHOTO_CREDIT = 'Photographs: Unsplash.'
