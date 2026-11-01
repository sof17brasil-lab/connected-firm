import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/**
 * Turns the source photographs into the sizes the site actually uses.
 * Everything is WebP; nothing is upscaled, and crops are centred on the
 * subject so no photo is ever stretched.
 *
 *   collage  800px square   small detail shots in the collages
 *   card    1200px wide     programme cards
 *   full    2400px wide     the growing picture
 */
const SRC = '_source/photos'
const OUT = 'public/images/photos'
const SIZES = { collage: 800, card: 1200 }

const FROM = {
  justice: 'albert-stoynov-kIM48Mpp9iY-unsplash.jpg',
  steps: 'ambrose-prince-RWCodDljR8s-unsplash.jpg',
  atrium: 'anthony-tyrrell-Bl-LiSJOnlY-unsplash.jpg',
  'skyline-window': 'charles-forerunner-3fPXt37X6UQ-unsplash.jpg',
  reception: 'jakob-dalbjorn-cuKJre3nyYc-unsplash.jpg',
  staircase: 'jose-martin-ramirez-carrasco-45sjAjSjArQ-unsplash.jpg',
  louvres: 'kiet-ho-n1jOqJc68_s-unsplash.jpg',
  writing: 'priscilla-du-preez-3gAiajAfjXI-unsplash.jpg',
  'long-table': 'priscilla-du-preez-W3SEyZODn8U-unsplash.jpg',
  signing: 'romain-dancre-doplSDELX7E-unsplash.jpg',
  crossing: 'ryoji-iwata-wUZjnOv7t0g-unsplash.jpg',
  concourse: 'timon-studler-ABGaVhJxwDQ-unsplash.jpg',
}

const PLAN = {
  justice: ['collage'],
  steps: ['collage', 'card'],
  atrium: ['collage'],
  'skyline-window': ['collage', 'card'],
  reception: ['collage', 'card'],
  staircase: ['collage', 'card'],
  louvres: ['collage'],
  writing: ['collage', 'card'],
  'long-table': ['collage', 'card'],
  signing: ['collage', 'card'],
  crossing: ['collage', 'card'],
  concourse: ['collage', 'card'],
}

await mkdir(OUT, { recursive: true })
const available = new Set(await readdir(SRC))
const made = []

for (const [slug, sizes] of Object.entries(PLAN)) {
  const file = FROM[slug]
  if (!available.has(file)) {
    console.warn(`missing source for ${slug}: ${file}`)
    continue
  }
  for (const size of sizes) {
    const width = SIZES[size]
    const pipeline = sharp(path.join(SRC, file)).rotate()
    const resized =
      size === 'collage'
        ? pipeline.resize(width, width, { fit: 'cover', position: 'attention' })
        : pipeline.resize({ width, withoutEnlargement: true })
    const out = path.join(OUT, `${slug}-${size}.webp`)
    const info = await resized.webp({ quality: 72 }).toFile(out)
    made.push([out, info.width, info.height, Math.round(info.size / 1024)])
  }
}

const hero = await sharp('_source/nyc.jpg')
  .resize({ width: 2400, withoutEnlargement: true })
  .webp({ quality: 70 })
  .toFile('public/images/nyc-hero.webp')
made.push(['public/images/nyc-hero.webp', hero.width, hero.height, Math.round(hero.size / 1024)])

const head = await sharp('_source/sofia-headshot.jpg')
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile('public/images/sofia-headshot.webp')
made.push(['public/images/sofia-headshot.webp', head.width, head.height, Math.round(head.size / 1024)])

// The Open Graph card stays JPEG: not every link scraper reads WebP.
const og = await sharp('_source/nyc.jpg')
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 80 })
  .toFile('public/images/og-image.jpg')
made.push(['public/images/og-image.jpg', og.width, og.height, Math.round(og.size / 1024)])

for (const [f, w, h, kb] of made) console.log(`${String(kb).padStart(5)}KB  ${String(w).padStart(4)}x${String(h).padEnd(4)}  ${f}`)
console.log(`\n${made.length} files`)
