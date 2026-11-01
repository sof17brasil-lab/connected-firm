import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/**
 * Turns the source photographs into the sizes the site actually uses.
 * Everything is WebP; nothing is upscaled, and crops are centred on the
 * subject so no photo is ever stretched.
 *
 *   card    1200px wide       programme cards
 *   stat     940x1200 portrait the four stat cards, forced to black and white
 *   full    2400px wide       the growing picture
 */
const SRC = '_source/photos'
const OUT = 'public/images/photos'
const SIZES = { card: 1200 }

/** The stat card frame is 58vh wide by 74vh tall, so the crop is portrait. */
const STAT = { width: 940, height: 1200 }

const FROM = {
  atrium: 'anthony-tyrrell-Bl-LiSJOnlY-unsplash.jpg',
  dinner: 'stella-de-smit-raE26Th7NwE-unsplash.jpg',
  earth: 'nasa-Q1p7bh3SHj8-unsplash.jpg',
  'long-table': 'priscilla-du-preez-W3SEyZODn8U-unsplash.jpg',
  louvres: 'kiet-ho-n1jOqJc68_s-unsplash.jpg',
  reception: 'jakob-dalbjorn-cuKJre3nyYc-unsplash.jpg',
  staircase: 'jose-martin-ramirez-carrasco-45sjAjSjArQ-unsplash.jpg',
  suit: 'hunters-race-MYbhN8KaaEc-unsplash.jpg',
}

/**
 * Only what the site actually shows. The collage set went when the orbiting
 * pieces did, so the photographs left are the four programme cards and the
 * four stat cards.
 */
const PLAN = {
  // Programme cards, in colour.
  'long-table': ['card'],
  reception: ['card'],
  earth: ['card'],
  dinner: ['card'],
  // Stat cards, black and white.
  suit: ['stat'],
  staircase: ['stat'],
  atrium: ['stat'],
  louvres: ['stat'],
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
    const pipeline = sharp(path.join(SRC, file)).rotate()
    let resized
    if (size === 'stat') {
      // Portrait crop for the card frame, and black and white whatever the
      // source, so the four stat cards read as one set.
      resized = pipeline
        .resize(STAT.width, STAT.height, { fit: 'cover', position: 'attention' })
        .greyscale()
    } else {
      resized = pipeline.resize({ width: SIZES[size], withoutEnlargement: true })
    }
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
