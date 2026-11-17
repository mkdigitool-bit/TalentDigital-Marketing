// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';

// Date du dernier commit touchant un fichier source, pour renseigner <lastmod>
// sans mentir à Google (sinon toutes les pages seraient "modifiées" à chaque build).
const gitDateCache = new Map();

function lastCommitDate(file) {
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let date = null;
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    date = out || null;
  } catch {
    date = null;
  }
  gitDateCache.set(file, date);
  return date;
}

function maxDate(dates) {
  const valid = dates.filter(Boolean).sort();
  return valid.length ? valid[valid.length - 1] : null;
}

const sharedSources = ['src/layouts/BaseLayout.astro', 'src/components/Header.astro', 'src/components/Footer.astro'];

function sourceFileFor(url) {
  const path = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  return path ? `src/pages/${path}.astro` : 'src/pages/index.astro';
}

// https://astro.build/config
export default defineConfig({
  site: 'https://talentdigital.net',
  integrations: [
    sitemap({
      serialize(item) {
        const date = maxDate([lastCommitDate(sourceFileFor(item.url)), ...sharedSources.map(lastCommitDate)]);
        if (date) item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
        return item;
      },
    }),
  ],
});
