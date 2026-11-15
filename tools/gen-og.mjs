/**
 * Génère les images de partage social (1200×630) à partir des polices du site.
 *
 * Les glyphes sont convertis en tracés SVG : le rendu ne dépend donc d'aucune
 * police installée sur la machine, et le lettrage reste exactement celui du site.
 *
 * Dépendance de build uniquement (les PNG produits sont versionnés) :
 *   npm install --no-save fontkit
 *
 *   node tools/gen-og.mjs          # toutes les images
 *   node tools/gen-og.mjs audit    # une seule (sans le préfixe og-)
 */
import fs from 'node:fs';
import path from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const PAD = 76;

const COLORS = {
  bg: '#0E0E10',
  grid: 'rgba(255,255,255,0.045)',
  text: '#F4F4EF',
  muted: '#909099',
  lime: '#A3E635',
};

const fonts = {
  black: fontkit.create(fs.readFileSync('public/fonts/archivo-900-latin.woff2')),
  bold: fontkit.create(fs.readFileSync('public/fonts/archivo-800-latin.woff2')),
  mono: fontkit.create(fs.readFileSync('public/fonts/jetbrains-mono-400-latin.woff2')),
};

/** Convertit une chaîne en tracés SVG, baseline à `y`. */
function textPath(font, text, { x, y, size, tracking = 0 }) {
  const scale = size / font.unitsPerEm;
  const run = font.layout(text);
  let penX = 0;
  const parts = [];

  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    if (glyph.path && glyph.path.commands.length) {
      const p = glyph.path
        .scale(scale, -scale)
        .translate(x + (penX + pos.xOffset) * scale, y - pos.yOffset * scale);
      parts.push(p.toSVG());
    }
    penX += pos.xAdvance + tracking / scale;
  });

  return { d: parts.join(' '), width: penX * scale };
}

function measure(font, text, size, tracking = 0) {
  const scale = size / font.unitsPerEm;
  const run = font.layout(text);
  let w = 0;
  run.positions.forEach((p) => {
    w += p.xAdvance + tracking / scale;
  });
  return w * scale;
}

function wrap(font, text, size, maxWidth, tracking = 0) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(font, candidate, size, tracking) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Taille de titre la plus grande qui tient en `maxLines` lignes. */
function fitTitle(text, maxWidth, maxLines) {
  for (let size = 84; size >= 44; size -= 2) {
    const lines = wrap(fonts.black, text, size, maxWidth, -size * 0.02);
    const height = (lines.length - 1) * size * 1.06 + size * 0.686;
    if (lines.length <= maxLines && height <= 246) return { size, lines };
  }
  return { size: 44, lines: wrap(fonts.black, text, 44, maxWidth) };
}

function card({ label, title, sub }) {
  const maxWidth = W - PAD * 2;
  const { size, lines } = fitTitle(title, maxWidth, 3);
  const widest = Math.max(...lines.map((l) => measure(fonts.black, l, size, -size * 0.02)));
  if (widest > maxWidth + 1) throw new Error(`Titre trop large sur « ${title} » : ${Math.round(widest)} px`);
  if (lines.length > 3) throw new Error(`Titre trop long sur « ${title} » : ${lines.length} lignes`);
  const lineHeight = size * 1.06;
  const tracking = -size * 0.02;
  const capHeight = size * 0.686;

  // Grille fixe : barre + sur-titre en haut, sous-titre et pied de page en bas.
  // Seul le bloc titre se centre dans la zone libre, ce qui garde le même
  // rythme d'une image à l'autre quel que soit le nombre de lignes.
  const eyebrowY = 168;
  const zoneTop = 214;
  const zoneBottom = 470;
  const titleHeight = (lines.length - 1) * lineHeight + capHeight;
  const firstBaseline = zoneTop + (zoneBottom - zoneTop - titleHeight) / 2 + capHeight;

  const titleSvg = lines
    .map((line, i) => {
      const d = textPath(fonts.black, line, {
        x: PAD,
        y: firstBaseline + i * lineHeight,
        size,
        tracking,
      }).d;
      return `<path d="${d}" fill="${COLORS.text}"/>`;
    })
    .join('');

  const eyebrow = textPath(fonts.mono, label.toUpperCase(), {
    x: PAD,
    y: eyebrowY,
    size: 21,
    tracking: 3.2,
  }).d;

  const subPath = sub
    ? textPath(fonts.mono, sub, { x: PAD, y: 528, size: 24, tracking: 0.2 }).d
    : '';

  const url = textPath(fonts.mono, 'talentdigital.net', {
    x: PAD,
    y: H - 46,
    size: 22,
    tracking: 0.2,
  }).d;

  const mark = textPath(fonts.bold, 'TalentDigital', {
    x: W - PAD - measure(fonts.bold, 'TalentDigital', 30, -0.6),
    y: H - 44,
    size: 30,
    tracking: -0.6,
  }).d;

  const grid = [];
  for (let x = 0; x <= W; x += 40) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
  for (let y = 0; y <= H; y += 40) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${COLORS.bg}"/>
  <g stroke="${COLORS.grid}" stroke-width="1">${grid.join('')}</g>
  <rect x="0" y="0" width="${W}" height="6" fill="${COLORS.lime}"/>
  <rect x="${PAD}" y="${eyebrowY - 42}" width="54" height="5" fill="${COLORS.lime}"/>
  <path d="${eyebrow}" fill="${COLORS.lime}"/>
  ${titleSvg}
  ${subPath ? `<path d="${subPath}" fill="${COLORS.muted}"/>` : ''}
  <line x1="${PAD}" y1="${H - 92}" x2="${W - PAD}" y2="${H - 92}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <path d="${url}" fill="${COLORS.muted}"/>
  <path d="${mark}" fill="${COLORS.text}"/>
</svg>`,
    size,
    lineCount: lines.length,
  };
}

const cards = {
  default: {
    label: 'Conseil marketing & solutions digitales',
    title: 'Le conseil marketing qui va jusqu’à l’exécution',
    sub: 'Stratégie · Marketing · Transformation digitale',
  },
  'consulting-marketing': {
    label: 'Consulting marketing',
    title: 'Décider avant de dépenser',
    sub: 'Positionnement · Priorisation · Plan d’action',
  },
  'marketing-digital': {
    label: 'Marketing digital',
    title: 'Un canal à la fois, avec un seuil d’arrêt',
    sub: 'SEO · Publicité · Contenu · Email · Automatisation',
  },
  'solutions-digitales': {
    label: 'Solutions digitales',
    title: 'Le site, le tunnel et le SaaS qui suivent la décision',
    sub: 'Design · Développement · Tracking',
  },
  methode: {
    label: 'La méthode',
    title: 'Quatre étapes, aucune zone d’ombre',
    sub: 'Diagnostiquer · Décider · Déployer · Mesurer',
  },
  audit: {
    label: 'Audit marketing',
    title: 'Un audit sert à décider, pas à décorer',
    sub: 'Six axes · Six livrables · Quatre étapes',
  },
  'audit-tunnel': {
    label: 'Auto-diagnostic',
    title: 'Auditez votre tunnel en quinze minutes',
    sub: 'Score immédiat · Aucun email avant le résultat',
  },
  'a-propos': {
    label: 'À propos',
    title: 'Un cabinet qui dit aussi ce qu’il ne fait pas',
    sub: 'Statut · Refus · Périmètre',
  },
  'site-web': {
    label: 'Site web',
    title: 'Le site vient après la décision',
    sub: 'Structure · Contenu · Conversion',
  },
  'landing-page': {
    label: 'Landing page',
    title: 'Une promesse, un appel à l’action, rien d’autre',
    sub: 'Message · Preuve · Mesure',
  },
  tunnel: {
    label: 'Tunnel de vente',
    title: 'Un tunnel se mesure, il ne se devine pas',
    sub: 'Étapes · Frictions · Indicateurs',
  },
  saas: {
    label: 'SaaS sur mesure',
    title: 'Un outil qui remplace un tableur',
    sub: 'Cadrage · Développement · Transfert',
  },
  contact: {
    label: 'Contact',
    title: 'Discutons de votre projet',
    sub: 'Réponse sous 24 h ouvrées',
  },
  blog: {
    label: 'Ressources',
    title: 'Ce que nous constatons sur le terrain',
    sub: 'Conseil · Acquisition · Conversion',
  },
  'blog-audit-marketing-ce-quil-doit-contenir': {
    label: 'Ressources · Conseil',
    title: 'Audit marketing : ce qu’il doit contenir',
    sub: '9 min de lecture',
  },
  'blog-seo-ou-publicite-comment-choisir': {
    label: 'Ressources · Acquisition',
    title: 'SEO ou publicité : comment choisir',
    sub: '8 min de lecture',
  },
  'blog-refaire-son-site-probleme-de-conversion': {
    label: 'Ressources · Conversion',
    title: 'Refaire son site ne règle pas la conversion',
    sub: '7 min de lecture',
  },
  'mentions-legales': {
    label: 'Mentions légales',
    title: 'Statut, sous-traitants, cookies',
    sub: 'Information légale',
  },
};

const only = process.argv[2];
const outDir = 'public';
let count = 0;

for (const [name, data] of Object.entries(cards)) {
  if (only && name !== only) continue;
  const file = path.join(outDir, `og-${name}.png`);
  const card_ = card(data);
  const png = await sharp(Buffer.from(card_.svg)).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(file, png);

  const { data: raw, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let lime = 0;
  let light = 0;
  for (let i = 0; i < raw.length; i += info.channels) {
    const [r, g, b] = [raw[i], raw[i + 1], raw[i + 2]];
    if (g > 180 && r > 130 && b < 120) lime++;
    if (r > 200 && g > 200 && b > 195) light++;
  }
  const n = raw.length / info.channels;
  console.log(
    `${file.padEnd(34)} ${info.width}x${info.height}  titre ${card_.size}px/${card_.lineCount}l  lime ${(lime / n * 100).toFixed(2)}%  texte clair ${(light / n * 100).toFixed(2)}%`
  );
  count++;
}

console.log(`\n${count} image(s) générée(s) dans public/`);
