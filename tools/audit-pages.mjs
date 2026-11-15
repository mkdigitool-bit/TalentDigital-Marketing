import fs from 'node:fs';
import path from 'node:path';

const root = 'dist';
const pages = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.html')) pages.push(full);
  }
}
walk(root);

const rows = [];

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function one(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

for (const file of pages) {
  if (file.includes('google8272621589311562')) continue;
  const html = fs.readFileSync(file, 'utf8');
  let url = '/' + path.relative(root, file).split(path.sep).join('/');
  url = url.replace(/index\.html$/, '').replace(/\.html$/, '');

  const title = one(html, /<title>([\s\S]*?)<\/title>/);
  const desc = one(html, /<meta name="description" content="([^"]*)"/);
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const og = one(html, /<meta property="og:image" content="([^"]*)"/);
  const crumbs = /class="breadcrumbs"/.test(html);
  const ld = [...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
  const body = text(html);
  const words = body.split(/\s+/).filter(Boolean).length;
  const noindex = /name="robots"[^>]*noindex/.test(html);

  rows.push({
    url,
    title: title.length,
    desc: desc.length,
    h1s,
    words,
    crumbs,
    canonical: canonical ? 'ok' : 'MANQUANT',
    og: og ? og.replace(/^.*\//, '') : 'MANQUANT',
    ld: [...new Set(ld)].join(','),
    noindex,
  });
}

const pad = (v, n) => String(v).padEnd(n);

console.log(
  pad('URL', 38),
  pad('titre', 6),
  pad('desc', 5),
  pad('h1', 3),
  pad('mots', 6),
  pad('fil', 4),
  pad('canon', 8),
  pad('og', 22),
  'JSON-LD'
);
for (const r of rows) {
  console.log(
    pad(r.url, 38),
    pad(r.title, 6),
    pad(r.desc, 5),
    pad(r.h1s, 3),
    pad(r.words, 6),
    pad(r.crumbs ? 'oui' : 'non', 4),
    pad(r.canonical, 8),
    pad(r.og, 22),
    r.ld + (r.noindex ? ' [NOINDEX]' : '')
  );
}

console.log('\nTitres > 62 caracteres :');
for (const r of rows) if (r.title > 62) console.log(' ', r.url, r.title);

console.log('\nDescriptions hors 120-165 :');
for (const r of rows) if (r.desc < 120 || r.desc > 165) console.log(' ', r.url, r.desc);

// Chaque page doit avoir une image de partage qui existe réellement dans dist/.
const missingOg = rows.filter((r) => r.og !== 'MANQUANT' && !fs.existsSync(path.join(root, r.og)));
console.log('\nImages de partage absentes du build :');
console.log(missingOg.length ? missingOg.map((r) => `  ${r.url} → ${r.og}`).join('\n') : '  aucune');

const ogCount = new Map();
for (const r of rows) ogCount.set(r.og, (ogCount.get(r.og) || 0) + 1);
const shared = [...ogCount.entries()].filter(([, n]) => n > 1);
console.log('\nImages de partage utilisées par plusieurs pages :');
console.log(shared.length ? shared.map(([f, n]) => `  ${f} (${n} pages)`).join('\n') : '  aucune');
