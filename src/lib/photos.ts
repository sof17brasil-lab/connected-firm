/**
 * Where each photograph is used.
 *
 * All of them are Unsplash stock. None shows White & Case's branding, its
 * offices, or anyone who could be taken for its staff — the people in them
 * are unidentified stock subjects in generic settings, which is what keeps
 * the site's "no logos, no offices, no people" rule intact.
 */
const base = import.meta.env.BASE_URL

const photo = (slug: string, size: 'collage' | 'card') =>
  `${base}images/photos/${slug}-${size}.webp`

/** Small square detail shots, for the drifting collage pieces. */
export const COLLAGE_PHOTOS = [
  photo('louvres', 'collage'),
  photo('writing', 'collage'),
  photo('atrium', 'collage'),
  photo('crossing', 'collage'),
  photo('signing', 'collage'),
  photo('staircase', 'collage'),
  photo('justice', 'collage'),
  photo('concourse', 'collage'),
  photo('long-table', 'collage'),
  photo('skyline-window', 'collage'),
  photo('reception', 'collage'),
  photo('steps', 'collage'),
]

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
    src: photo('concourse', 'card'),
    alt: 'People crossing a busy concourse, seen from above.',
  },
  'Client Roundtables': {
    src: photo('signing', 'card'),
    alt: 'Two people signing a document across a desk.',
  },
}

export const HERO_PHOTO = `${base}images/nyc-hero.webp`
export const HEADSHOT = `${base}images/sofia-headshot.webp`

export const PHOTO_CREDIT = 'Photographs: Unsplash.'
