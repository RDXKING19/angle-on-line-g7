import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOICE_ID, MODEL_ID, STYLE_SETTINGS } from '../src/config/audio.config.js';
import { getAllNarration } from '../src/utils/narration.js';
import { audioMap as existingMap } from '../src/utils/audioMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_FILE = path.join(ROOT, 'src', 'utils', 'audioMap.js');
const FORCE = process.argv.includes('--force');

const phrases = getAllNarration();

function readEnvKey() {
  if (process.env.VITE_ELEVENLABS_API_KEY) return process.env.VITE_ELEVENLABS_API_KEY;
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return '';
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*VITE_ELEVENLABS_API_KEY\s*=\s*(.+?)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return '';
}

const API_KEY = readEnvKey();
if (!API_KEY) {
  console.log('ℹ Notice: VITE_ELEVENLABS_API_KEY not found in .env.local.');
  console.log('Skipping offline audio generation. The application will run silently or generate on-the-fly when key is present.');
  process.exit(0);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const slugify = t =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48);

async function synthesize(text, style, attempt = 1) {
  const cfg = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg', 'xi-api-key': API_KEY },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarity_boost,
          style: cfg.style,
          use_speaker_boost: cfg.use_speaker_boost
        }
      })
    }
  );
  if (res.status === 401) throw new Error('401 Unauthorized — check VITE_ELEVENLABS_API_KEY');
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(2000 * attempt);
    return synthesize(text, style, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Voice: Alice (${VOICE_ID}) · Model: ${MODEL_ID}`);
  console.log(`${phrases.length} phrases to process${FORCE ? ' (--force)' : ''}\n`);

  const newMap = { ...existingMap };
  let made = 0, skipped = 0, failed = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const file = `audio_${slugify(text)}_${i}.mp3`;
    const urlPath = `/assets/audio/${file}`;
    const abs = path.join(OUT_DIR, file);

    const prev = existingMap[text];
    if (!FORCE && prev && fs.existsSync(path.join(ROOT, 'public', prev))) {
      newMap[text] = prev;
      skipped++;
      continue;
    }
    try {
      const buf = await synthesize(text, style);
      fs.writeFileSync(abs, buf);
      newMap[text] = urlPath;
      made++;
      console.log(`✔ [${i + 1}/${phrases.length}] (${style}) ${file}`);
    } catch (err) {
      failed++;
      console.error(`✖ [${i + 1}/${phrases.length}] ${file}: ${err.message}`);
      if (/401/.test(err.message)) break;
    }
    await sleep(500);
  }

  const exportContent = `// Auto-generated audio map: text -> static asset URL\nexport const audioMap = ${JSON.stringify(newMap, null, 2)};\n`;
  fs.writeFileSync(MAP_FILE, exportContent, 'utf8');
  console.log(`\nComplete: ${made} created, ${skipped} skipped, ${failed} failed.`);
  console.log(`Updated: ${MAP_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
