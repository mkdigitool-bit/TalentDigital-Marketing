import fs from 'node:fs';
import path from 'node:path';

const root = 'dist';
const pages = [];
const assets = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.html')) pages.push(full);
    else assets.add('/' + path.relative(root, full).split(path.sep).join('/'));
  }
}
walk(root);

const urlSet = new Set(['/']);
for (const file of pages) {
  let url = '/' + path.relative(root, file).split(path.sep).join('/');
  url = url.replace(/index\.html$/, '').replace(/\.html$/, '');
  urlSet.add(url);
}

const bad = new Map();
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const re = /href="(\/[^"#?]*)/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (url === '/' || urlSet.has(url) || assets.has(url)) continue;
    if (fs.existsSync(path.join(root, url.replace(/^\//, '')))) continue;
    const set = bad.get(url) || new Set();
    set.add('/' + path.relative(root, file).split(path.sep).join('/'));
    bad.set(url, set);
  }
}

if (!bad.size) {
  console.log(`No dead internal links. Pages: ${pages.length}, URLs: ${urlSet.size}`);
} else {
  for (const [url, refs] of bad) console.log('DEAD', url, '->', [...refs].slice(0, 4).join(', '));
}
