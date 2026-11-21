import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
test("reciter search is present and wired to live filtering", () => {
  assert.match(html, /id="reciterSearch"/);
  assert.match(app, /function filterReciters\(/);
  assert.match(app, /filterReciters/);
  assert.match(app, /name\.toLocaleLowerCase\(\)\.includes\(query\)/);
});
test("riwayah selection remains available and controls the selected audio source", () => {
  assert.match(html, /id="riwayaSelect"/);
  assert.match(app, /function chooseRead\(\)/);
  assert.match(app, /state\.selectedRead=value===""\?null:reads\[Number\(value\)\]/);
  assert.match(app, /getAudioUrl\(read,surahNo\)/);
});
test("ayah range and repetition controls are removed from UI and playback logic", () => {
  for (const id of ["startAyah", "endAyah", "repeatMode", "repeatCount", "ayahList", "timingStatus"]) {
    assert.doesNotMatch(html, new RegExp("id=[\"']"+id+"[\"']"));
  }
  for (const legacy of ["loadTiming", "timingFields", "state.repeatMode", "state.repeatCount", "state.rangeStart", "onEnded"]) {
    assert.equal(app.includes(legacy), false);
  }
  assert.match(app, /function startSelection\(\)[\s\S]*?audio["']\)\.play\(\)/);
});
test("speed, playback controls and offline library remain available", () => {
  for (const id of ["speedSelect", "playBtn", "restartBtn", "stopBtn", "seekBar", "downloadBtn", "offlineList"]) {
    assert.match(html, new RegExp("id=[\"']"+id+"[\"']"));
  }
  assert.match(app, /playbackRate=Number/);
  assert.match(app, /async function saveOffline\(\)/);
});
test("all JavaScript DOM id references exist in the page", () => {
  const referenced = [...app.matchAll(/\$\(["']([^"']+)["']\)/g)].map(x => x[1]);
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x => x[1]));
  const missing = [...new Set(referenced)].filter(id => !ids.has(id));
  assert.deepEqual(missing, []);
});
test("service worker cache is versioned and isolated from other applications", () => {
  assert.match(sw, /quran-player-shell-v5/);
  assert.match(sw, /key\.startsWith\("quran-player-shell-"\)/);
  assert.match(sw, /if\s*\(request\.method\s*!==\s*"GET"\)\s*return/);
  assert.match(sw, /request\.mode\s*===\s*"navigate"/);
});

test("playback starts the full selected surah without legacy ayah-range validation", () => {
  const start = app.match(/function startSelection\(\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(start, "startSelection must exist");
  assert.match(start[1], /audio["']\)\.currentTime=0/);
  assert.match(start[1], /audio["']\)\.play\(\)/);
  assert.doesNotMatch(start[1], /validateRange|invalidRange|startAyah|endAyah/);
  assert.equal(app.includes("invalidRange"), false);
});

test("service worker refreshes shell assets from network before cached fallback", () => {
  assert.match(sw, /quran-player-shell-v5/);
  assert.match(sw, /fetch\(request, \{ cache: "no-store" \}\)/);
  assert.match(sw, /async function fetchAndCache/);
  assert.match(sw, /Network-first for the application shell/);
  assert.match(sw, /key\.startsWith\("quran-player-shell-"\)/);
});

test("reciter search and selection share one visible combobox with a dropdown", () => {
 assert.match(html,/id="reciterSearch"[^>]*role="combobox"/);assert.match(html,/id="reciterOptions"[^>]*role="listbox"/);assert.match(html,/id="reciterSelect" class="visually-hidden"/);
 assert.match(app,/function selectReciter\(index\)/);assert.match(app,/function moveReciterOption\(delta\)/);assert.match(app,/noReciterResults/);assert.match(app,/ArrowDown/);assert.match(app,/e\.key==="Enter"/);
});
test("sticky playback bar is wired to the existing audio element",()=>{
 for(const id of ["stickyPlayer","stickySurah","stickyReciter","stickyPlayBtn","stickyRestartBtn","stickyStopBtn","stickySeekBar","stickyCurrentTime","stickyDuration"])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(app,/function setStickyPlayerVisible\(v\)/);assert.match(app,/stickyPlayBtn/);assert.match(app,/stickySeekBar/);assert.match(css,/\.sticky-player\{position:sticky/);assert.match(css,/\.topbar\{position:sticky/);
});
test("hero copy is updated in all supported languages",()=>{assert.match(html,/عِش مع القرآن/);assert.match(app,/Vivez le Coran/);assert.match(app,/Live the Quran/);});
