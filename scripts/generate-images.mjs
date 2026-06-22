// ---------------------------------------------------------------------------
// Gemini image generation for the site.
//
// Generates on-brand placeholder imagery with Google Gemini and writes the
// files into /public/generated. Run it locally (never on Vercel at request
// time) and commit the output — static images keep the site fast and free to
// serve.
//
// Setup:
//   1. Get an API key: https://aistudio.google.com/apikey
//   2. Put it in .env.local  ->  GEMINI_API_KEY=your_key_here
//   3. npm run gen:images           (all images)
//      npm run gen:images -- --only hero --force   (one image, overwrite)
//
// Model: defaults to "gemini-2.5-flash-image" (aka "Nano Banana") — the most
// accessible Gemini image model. Set IMAGE_MODEL=imagen-4.0-generate-001 in
// .env.local for higher-end photoreal stills with true aspect-ratio control
// (Imagen may require a billed project). Model names evolve — check
// https://ai.google.dev/gemini-api/docs/image-generation for the current list.
// ---------------------------------------------------------------------------

import { GoogleGenAI } from "@google/genai";
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/generated");

// Tiny .env.local loader (no dotenv dependency).
function loadEnv() {
  const file = resolve(ROOT, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL = process.env.IMAGE_MODEL || "gemini-2.5-flash-image";

if (!API_KEY) {
  console.error(
    "\n✗ Missing GEMINI_API_KEY.\n  Add it to .env.local:  GEMINI_API_KEY=your_key\n  Get a key at https://aistudio.google.com/apikey\n",
  );
  process.exit(1);
}

// A shared style so every image feels like one photo shoot.
const STYLE =
  "photorealistic, cinematic wide-angle, natural daylight, crisp high detail, " +
  "professional infrastructure photography in India, no text, no watermark, no logos";

// name -> { prompt, aspectRatio }. `name` becomes public/generated/<name>.png
const IMAGES = [
  {
    name: "hero",
    aspectRatio: "16:9",
    prompt: `Aerial drone view of a modern water treatment and supply plant with circular clarifier tanks and an elevated water tower, surrounded by green farmland, blue sky. ${STYLE}`,
  },
  {
    name: "about",
    aspectRatio: "4:3",
    prompt: `Engineers in safety helmets and hi-vis vests reviewing drawings at a large water-pipeline construction site, big concrete pipes, excavator in the background, golden hour. ${STYLE}`,
  },
  {
    name: "project-water-supply",
    aspectRatio: "16:9",
    prompt: `A reinforced concrete overhead water reservoir and pumping station against a clear sky, freshly built, clean industrial finish. ${STYLE}`,
  },
  {
    name: "project-sewerage",
    aspectRatio: "16:9",
    prompt: `Underground sewerage network construction, large diameter pipes being laid in a trench along an urban road, workers and machinery. ${STYLE}`,
  },
  {
    name: "project-stormwater",
    aspectRatio: "16:9",
    prompt: `A newly built reinforced concrete stormwater drainage channel running alongside a city road during monsoon season, water flowing. ${STYLE}`,
  },
  {
    name: "project-irrigation",
    aspectRatio: "16:9",
    prompt: `A concrete-lined irrigation canal carrying water across green agricultural fields, control gate structure, wide rural landscape. ${STYLE}`,
  },
  {
    name: "project-treatment",
    aspectRatio: "16:9",
    prompt: `A sewage treatment plant with aeration tanks full of bubbling water, walkways and railings, industrial setting at dusk. ${STYLE}`,
  },
  {
    name: "project-rural-grid",
    aspectRatio: "16:9",
    prompt: `A rural Indian village with new blue household water-tap connections and freshly laid pipeline along a lane, palm trees, daytime. ${STYLE}`,
  },
];

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

const ai = new GoogleGenAI({ apiKey: API_KEY });
const isImagen = MODEL.startsWith("imagen");

async function generateOne({ prompt, aspectRatio }) {
  if (isImagen) {
    const res = await ai.models.generateImages({
      model: MODEL,
      prompt,
      config: { numberOfImages: 1, aspectRatio },
    });
    const img = res.generatedImages?.[0]?.image;
    if (!img?.imageBytes) throw new Error("No image returned (Imagen).");
    return { data: img.imageBytes, mime: img.mimeType || "image/png" };
  }

  // Gemini "Nano Banana" — image comes back as an inlineData part.
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: `${prompt} Composition/orientation: ${aspectRatio}.`,
  });
  const parts = res.candidates?.[0]?.content?.parts ?? [];
  const part = parts.find((p) => p.inlineData?.data);
  if (!part) {
    const text = parts.find((p) => p.text)?.text;
    throw new Error(`No image returned (Gemini).${text ? " Model said: " + text : ""}`);
  }
  return { data: part.inlineData.data, mime: part.inlineData.mimeType || "image/png" };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const queue = only ? IMAGES.filter((i) => i.name === only) : IMAGES;
  if (queue.length === 0) {
    console.error(`No image named "${only}". Options: ${IMAGES.map((i) => i.name).join(", ")}`);
    process.exit(1);
  }

  console.log(`\nModel: ${MODEL}\nOutput: public/generated/\n`);
  for (const item of queue) {
    const ext = "png";
    const file = resolve(OUT_DIR, `${item.name}.${ext}`);
    if (existsSync(file) && !force) {
      console.log(`• ${item.name} — exists, skipping (use --force to overwrite)`);
      continue;
    }
    process.stdout.write(`• ${item.name} … `);
    try {
      const { data } = await generateOne(item);
      writeFileSync(file, Buffer.from(data, "base64"));
      console.log("done");
    } catch (err) {
      console.log("FAILED");
      console.error(`  ${err.message}`);
    }
  }
  console.log("\n✓ Finished. Images are in public/generated/\n");
}

main();
