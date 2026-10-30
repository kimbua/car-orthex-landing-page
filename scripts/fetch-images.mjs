// Downloads real BMW press photos (Wikimedia Commons, official BMW press images)
// for all seeded models + the real BMW roundel logo.
// Usage: node scripts/fetch-images.mjs
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'frontend', 'public', 'images', 'cars');
const logoDir = join(root, 'frontend', 'public', 'logo');
mkdirSync(outDir, { recursive: true });
mkdirSync(logoDir, { recursive: true });

const API = 'https://commons.wikimedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params, retries = 4) {
  const url = new URL(API);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.status === 429) {
        await sleep(2500 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`API ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1500 * (i + 1));
    }
  }
  throw new Error('api exhausted');
}

async function searchTitles(query, limit = 10) {
  const data = await api({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: '6',
    srlimit: String(limit),
    format: 'json',
  });
  return (data.query?.search || []).map((r) => r.title);
}

async function download(title, dest, width = 1600, retries = 4) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}?width=${width}`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(60000) });
      if (res.status === 429) {
        await sleep(3000 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`download ${res.status} for ${title}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 15000) throw new Error(`too small (${buf.length}B)`);
      writeFileSync(dest, buf);
      return buf.length;
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(2000 * (i + 1));
    }
  }
  throw new Error('download exhausted');
}

// pick N distinct files for a query; returns number downloaded
async function pickDistinct(query, dests, width) {
  const titles = await searchTitles(query, 14);
  const used = new Set();
  let done = 0;
  for (const t of titles) {
    if (done >= dests.length) break;
    if (used.has(t)) continue;
    try {
      const size = await download(t, dests[done], width);
      console.log(`  ✓ ${size} bytes <- ${t}`);
      used.add(t);
      done++;
      await sleep(700);
    } catch (e) {
      console.log(`  ✗ skip ${t}: ${e.message}`);
      await sleep(700);
    }
  }
  return done;
}

const MODELS = [
  { slug: 'bmw-3-series-330i', ext: 'BMW 330i G20', int: 'BMW 330i interior G20' },
  { slug: 'bmw-5-series-530i', ext: 'BMW 530i G60', int: 'BMW 5 series G60 interior' },
  { slug: 'bmw-7-series-735i', ext: 'BMW 735i', int: 'BMW 7 series G70 interior' },
  { slug: 'bmw-x1-sdrive20i', ext: 'BMW X1 U11', int: 'BMW X1 interior' },
  { slug: 'bmw-x3-xdrive30i', ext: 'BMW X3 G45', int: 'BMW X3 interior' },
  { slug: 'bmw-x5-xdrive40i', ext: 'BMW X5 G05', int: 'BMW X5 interior' },
  { slug: 'bmw-x7-xdrive40i', ext: 'BMW X7 G07', int: 'BMW X7 interior' },
  { slug: 'bmw-i4-edrive40', ext: 'BMW i4 eDrive40', int: 'BMW i4 interior' },
  { slug: 'bmw-i5-edrive40', ext: 'BMW i5 G60', int: 'BMW i5 interior' },
  { slug: 'bmw-i7-xdrive60', ext: 'BMW i7 G70', int: 'BMW i7 interior' },
  { slug: 'bmw-ix-xdrive40', ext: 'BMW iX', int: 'BMW iX interior' },
  { slug: 'bmw-m2', ext: 'BMW M2 G87', int: 'BMW M2 interior' },
  { slug: 'bmw-m3-competition', ext: 'BMW M3 G80', int: 'BMW M3 interior' },
  { slug: 'bmw-m4-competition', ext: 'BMW M4 G82', int: 'BMW M4 interior' },
];

(async () => {
  console.log('== BMW logo ==');
  const logo = join(logoDir, 'bmw-roundel.svg');
  if (!existsSync(logo)) {
    const titles = await searchTitles('BMW logo svg', 10);
    for (const t of titles) {
      if (!t.toLowerCase().includes('.svg')) continue;
      try {
        const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(t)}`;
        const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 1000) continue;
        writeFileSync(logo, buf);
        console.log(`  ✓ logo <- ${t} (${buf.length}B)`);
        break;
      } catch {
        /* try next */
      }
      await sleep(600);
    }
    if (!existsSync(logo)) console.log('  ✗ logo download failed');
  } else {
    console.log('  = logo exists');
  }

  const mSvg = join(logoDir, 'm-tricolor.svg');
  if (!existsSync(mSvg)) {
    writeFileSync(
      mSvg,
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="10" viewBox="0 0 120 10"><rect width="40" height="10" fill="#0066B1"/><rect x="40" width="40" height="10" fill="#003E7E"/><rect x="80" width="40" height="10" fill="#E01F26"/></svg>`,
    );
    console.log('  ✓ m-tricolor.svg generated');
  }

  for (const m of MODELS) {
    const base = join(outDir, m.slug);
    console.log(`== ${m.slug} ==`);
    const jobs = [];
    if (!existsSync(`${base}-hero.jpg`)) jobs.push(['hero', `${base}-hero.jpg`, 1920]);
    if (!existsSync(`${base}-ext-1.jpg`)) jobs.push(['ext1', `${base}-ext-1.jpg`, 1600]);
    if (!existsSync(`${base}-ext-2.jpg`)) jobs.push(['ext2', `${base}-ext-2.jpg`, 1600]);
    if (jobs.length) {
      const n = await pickDistinct(m.ext, jobs.map((j) => j[1]), 1920);
      console.log(`  exterior downloaded ${n}/${jobs.length}`);
    } else {
      console.log('  = exterior exists');
    }
    const intJobs = [];
    if (!existsSync(`${base}-int-1.jpg`)) intJobs.push(`${base}-int-1.jpg`);
    if (!existsSync(`${base}-int-2.jpg`)) intJobs.push(`${base}-int-2.jpg`);
    if (intJobs.length) {
      const n = await pickDistinct(m.int, intJobs, 1600);
      console.log(`  interior downloaded ${n}/${intJobs.length}`);
    } else {
      console.log('  = interior exists');
    }
    await sleep(500);
  }
  console.log('DONE');
})();
