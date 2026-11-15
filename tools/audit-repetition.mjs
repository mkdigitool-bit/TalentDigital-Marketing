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

function urlOf(file) {
  let url = '/' + path.relative(root, file).split(path.sep).join('/');
  return url.replace(/index\.html$/, '').replace(/\.html$/, '');
}

function visibleText(html) {
  const body = html.split('<body')[1] || '';
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .split('\n')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

const byPage = new Map();
const occurrences = new Map();

for (const file of pages) {
  if (file.includes('google8272621589311562')) continue;
  const url = urlOf(file);
  const html = fs.readFileSync(file, 'utf8');
  const blocks = visibleText(html);
  byPage.set(url, new Set(blocks));

  for (const block of new Set(blocks)) {
    if (block.length < 60) continue;
    if (!occurrences.has(block)) occurrences.set(block, new Set());
    occurrences.get(block).add(url);
  }

  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  );
  if (h2s.length !== new Set(h2s).size) {
    const dup = h2s.filter((h, i) => h2s.indexOf(h) !== i);
    console.log('H2 dupliques dans', url, '->', [...new Set(dup)]);
  }
}

const repeated = [...occurrences.entries()]
  .filter(([, urls]) => urls.size > 1)
  .sort((a, b) => b[1].size - a[1].size);

// Texte légal : il doit être identique partout, ce n'est pas une répétition
// éditoriale. On l'isole pour que le reste du rapport soit exploitable.
const LEGAL = [/Nous utilisons un outil de mesure d’audience/, /Nous utilisons un outil de mesure d'audience/];
const isLegal = (block) => LEGAL.some((re) => re.test(block));

const content = repeated.filter(([block]) => !isLegal(block));
const legal = repeated.filter(([block]) => isLegal(block));

console.log(`\nBlocs de texte identiques sur plusieurs pages : ${content.length}\n`);
for (const [block, urls] of content.slice(0, 40)) {
  console.log(`${urls.size} pages : ${[...urls].join(' , ')}`);
  console.log(`   "${block.slice(0, 130)}${block.length > 130 ? '…' : ''}"\n`);
}
if (!content.length) console.log('  aucun\n');

if (legal.length) {
  console.log(`Texte légal identique par obligation (${legal[0][1].size} pages) : bandeau de consentement.`);
}

// Intra-page repetition
console.log('Repetitions internes (meme page) :');
let found = 0;
for (const file of pages) {
  if (file.includes('google8272621589311562')) continue;
  const url = urlOf(file);
  const blocks = visibleText(fs.readFileSync(file, 'utf8'));
  const seen = new Map();
  for (const b of blocks) {
    if (b.length < 50) continue;
    seen.set(b, (seen.get(b) || 0) + 1);
  }
  for (const [b, n] of seen) {
    if (n > 1) {
      found++;
      console.log(` ${url} ×${n} : "${b.slice(0, 110)}"`);
    }
  }
}
if (!found) console.log('  aucune');
