import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { htmlPartials } from "./build/html-partials.js";
import { pages } from "./build/pages.js";
import { preparePublicAssets } from "./build/public-assets.js";
import { publicAssetBase } from "./build/public-asset-base.js";

const root = import.meta.dirname;

export default defineConfig(({ mode }) => {
    const base = mode === "pages" ? "/marpich-sanat/" : "/";
    return {
        // Backend/local builds stay at /. Pages has a repository path prefix.
        base,
        publicDir: preparePublicAssets(root),
        plugins: [htmlPartials(root), tailwindcss(), publicAssetBase(base)],
        build: {
            // Razor integration must resolve hashed JS/CSS from the manifest,
            // including CSS belonging to imported shared chunks (see docs).
            manifest: true,
            rollupOptions: {
                input: Object.fromEntries(pages.map(({ name, file }) => [name, resolve(root, file)])),
            },
        },
    };
});
