// Browser release gate for the #contact section on daleyorganics.com.
//   node scripts/gates/contact-gate.mjs form [versionId] [origin]   submit one TEST lead through the real form
//   node scripts/gates/contact-gate.mjs call [versionId] [origin]   inline call button opens the Daley call app
// versionId → sent as Cloudflare-Workers-Version-Overrides on every request (staged release, 0% version).
// Exit 1 when the phase's assertion fails. Console errors are printed and counted, never hidden.
import { createRequire } from "node:module";

const require = createRequire(process.env.PLAYWRIGHT_FROM ?? "/home/mikes/spreadsheetx/package.json");
const { chromium } = require("playwright");

const [phase = "form", version = "", origin = "https://daleyorganics.com"] = process.argv.slice(2);
const WORKER = "daley-organics";

const browser = await chromium.launch({
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
});
let failed = false;

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  if (phase === "form" && viewport.width !== 1280) continue; // one real submission per run is enough
  const context = await browser.newContext({ viewport });
  if (version) await context.setExtraHTTPHeaders({ "Cloudflare-Workers-Version-Overrides": `${WORKER}="${version}"` });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await page.goto(`${origin}/#contact`, { waitUntil: "load" });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  const tag = `${viewport.width}px`;

  if (phase === "form") {
    await page.waitForSelector("#contact-name", { timeout: 20000 });
    await page.fill("#contact-name", "TEST Claude browser gate");
    await page.fill("#contact-phone", "541-000-0000");
    await page.fill("#contact-email", "contact@leverageai.network");
    await page.fill("#contact-date", "2026-10-21");
    await page.fill("#contact-message", `TEST from contact-gate.mjs ${new Date().toISOString()} — ignore.`);
    const started = Date.now();
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/contact"), { timeout: 30000 }),
      page.click("#contact form button[type=submit]"),
    ]);
    const body = await response.json().catch(() => ({}));
    const alert = await page.locator("#contact [role=alert]").first().innerText({ timeout: 10000 }).catch(() => "(no alert)");
    console.log(`[${tag}] POST /api/contact ${response.status()} ${JSON.stringify(body)} in ${Date.now() - started} ms`);
    console.log(`[${tag}] visitor sees: ${alert.replace(/\s+/g, " ").trim()}`);
    if (!response.ok() || !body.ok) failed = true;
  }

  if (phase === "call") {
    const button = page.locator("[data-call-now]").first();
    await button.waitFor({ timeout: 20000 });
    await page.waitForFunction(() => document.getElementById("c2c-btn"), null, { timeout: 20000 }).catch(() => undefined);
    const floatingHidden = await page.evaluate(() => {
      const root = document.getElementById("c2c-widget-root");
      return !root || getComputedStyle(root).display === "none";
    });
    console.log(`[${tag}] inline call button visible: ${await button.isVisible()} · floating widget button hidden: ${floatingHidden}`);
    await button.click();
    const frame = page.locator("iframe[src*='/call']").first();
    const src = await frame.getAttribute("src", { timeout: 15000 }).catch(() => null);
    const frameVisible = src ? await frame.isVisible() : false;
    // The call page is a React app: wait until it has rendered real text, not just an empty frame.
    const frameText = src
      ? await page.frameLocator("iframe[src*='/call']").locator("button").first().waitFor({ timeout: 20000 })
          .then(() => page.frameLocator("iframe[src*='/call']").locator("body").innerText())
          .catch(() => "")
      : "";
    console.log(`[${tag}] call iframe: ${src ?? "(none)"} visible: ${frameVisible}`);
    console.log(`[${tag}] call page says: ${frameText.replace(/\s+/g, " ").trim().slice(0, 160) || "(nothing rendered)"}`);
    if (!/daley/i.test(frameText)) failed = true;
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${tag}] horizontal overflow: ${overflow}`);
    await page.screenshot({ path: `${process.env.SHOTS ?? "."}/contact-call-${viewport.width}.png` });
    if (!floatingHidden || !src || !frameVisible || !src.includes("daley")) failed = true;
  }

  console.log(`[${tag}] console errors: ${consoleErrors.length}${consoleErrors.length ? "\n  " + consoleErrors.slice(0, 8).join("\n  ") : ""}`);
  await context.close();
}

await browser.close();
console.log(failed ? "GATE FAIL" : "GATE PASS");
process.exit(failed ? 1 : 0);
