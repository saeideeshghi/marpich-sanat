import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { preparePublicAssets } from "../build/public-assets.js";

const root = resolve(import.meta.dirname, "..");
const publicRoot = preparePublicAssets(root);
const references = new Set();

function scan(directory) {
    for (const item of readdirSync(directory, { withFileTypes: true })) {
        if (["node_modules", "dist", ".git", ".cache", "public", "assets", "fonts", "docs", "tools"].includes(item.name)) continue;
        const path = resolve(directory, item.name);
        if (item.isDirectory()) scan(path);
        // Component images also live in src/data/pages/*.json; scanning only
        // templates silently misses product cards, testimonials and CTA artwork.
        else if (/\.(html|css|js|json)$/.test(item.name)) {
            for (const match of readFileSync(path, "utf8").matchAll(
                /\/(?:assets|fonts)\/[^\s"'`<>;)|]+\.(?:svg|png|webp|jpe?g|gif|avif|ico|ttf|woff2?|otf|pdf|dwg|docx?)/g,
            )) {
                references.add(match[0]);
            }
        }
    }
}
scan(root);
if (process.argv.includes("--manifest")) {
    mkdirSync(resolve(root, "docs"), { recursive: true });
    writeFileSync(resolve(root, "docs/assets-manifest.json"), JSON.stringify([...references].sort(), null, 2) + "\n");
}
const missing = [...references].sort().filter((url) => !existsSync(resolve(publicRoot, url.slice(1))));
for (const url of missing) console.log(`MISSING ${relative(root, resolve(root, "public", url.slice(1)))}`);
console.log(`${references.size - missing.length}/${references.size} referenced assets are present.`);
if (missing.length) {
    console.log("Add your original assets to public/assets (legacy root/assets is also supported) and fonts to public/fonts, then run again.");
    process.exitCode = 1;
}
