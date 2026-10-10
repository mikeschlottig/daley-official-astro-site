const sharp = require(process.cwd() + "/node_modules/sharp");
// Builds favicons from the shamrock in public/favicon.jpg (the product label).
// Usage: node scripts/make-favicons.cjs   → public/favicon.png (48), public/favicon-32.png, public/apple-touch-icon.png (180)
(async () => {
  const region = { left: 300, top: 150, width: 420, height: 340 };
  const { data, info } = await sharp("public/favicon.jpg").extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const green = g > 110 && g > r * 1.35 && g > b * 1.35;   // shamrock green; yellow/red/white text fail this
    if (!green) data[i + 3] = 0;
  }
  const isolated = await sharp(data, { raw: info }).png().trim().toBuffer();
  const meta = await sharp(isolated).metadata();
  const side = Math.round(Math.max(meta.width, meta.height) * 1.12);
  await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: isolated, gravity: "center" }]).png().toBuffer()
    .then(async (master) => {
      await sharp(master).resize(48, 48).png({ compressionLevel: 9 }).toFile("public/favicon.png");
      await sharp(master).resize(32, 32).png({ compressionLevel: 9 }).toFile("public/favicon-32.png");
      await sharp(master).resize(180, 180).flatten({ background: "#ffffff" }).png({ compressionLevel: 9 }).toFile("public/apple-touch-icon.png");
      console.log("favicons written from shamrock", meta.width, "x", meta.height);
    });
})().catch((e) => { console.error(e); process.exit(1); });
