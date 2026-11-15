import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const files = process.argv.slice(2);
for (const f of files) {
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
  let lminX = 1e9, lmaxX = -1, lminY = 1e9, lmaxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * ch;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const light = r > 150 && g > 150 && b > 140;
      const lime = g > 180 && r > 130 && r < 200 && b < 120;
      if (light) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      if (lime) {
        if (x < lminX) lminX = x; if (x > lmaxX) lmaxX = x;
        if (y < lminY) lminY = y; if (y > lmaxY) lmaxY = y;
      }
    }
  }
  const name = path.basename(f);
  console.log(
    `${name.padEnd(34)} texte x[${minX}-${maxX}] y[${minY}-${maxY}]   lime bbox x[${lminX}-${lmaxX}] y[${lminY}-${lmaxY}]`
  );
}
