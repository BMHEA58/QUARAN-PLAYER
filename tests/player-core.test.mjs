import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");

test("MP3Quran timing adapter accepts the documented raw array and converts milliseconds", () => {
  const match = app.match(/function timingFields\(row,zeroBased=false\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, "timingFields must exist");
  const timingFields = new Function("row", "zeroBased", match[1]);
  assert.deepEqual(
    timingFields({ ayah: 0, start_time: 2500, end_time: 6000 }, true),
    { ayah: 1, start: 2.5, end: 6 }
  );
});

test("timing adapter preserves already-normalized seconds", () => {
  const match = app.match(/function timingFields\(row,zeroBased=false\)\s*\{([\s\S]*?)\n\}/);
  const timingFields = new Function("row", "zeroBased", match[1]);
  assert.deepEqual(
    timingFields({ ayah: 4, start: 3.25, end: 8.5 }, false),
    { ayah: 4, start: 3.25, end: 8.5 }
  );
});

test("timing endpoint response supports a raw array", () => {
  assert.match(app, /Array\.isArray\(data\)\s*\?\s*data\s*:/);
  assert.match(app, /loadTiming\(read,surahNo\)/);
});

test("all JavaScript DOM id references exist in the page", () => {
  const referenced = [...app.matchAll(/\$\(["']([^"']+)["']\)/g)].map(x => x[1]);
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x => x[1]));
  const missing = [...new Set(referenced)].filter(id => !ids.has(id));
  assert.deepEqual(missing, []);
});

test("service worker does not delete caches owned by other applications", () => {
  assert.match(sw, /key\.startsWith\("quran-player-shell-"\)/);
  assert.match(sw, /if\s*\(request\.method\s*!==\s*"GET"\)\s*return/);
  assert.match(sw, /request\.mode\s*===\s*"navigate"/);
});
