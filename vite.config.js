import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { htmlPartials } from "./build/html-partials.js";
import { pages } from "./build/pages.js";

const root = import.meta.dirname;

export default defineConfig({
    plugins: [htmlPartials(root), tailwindcss()],
    build: {
        // Razor integration must resolve hashed JS/CSS from the manifest,
        // including CSS belonging to imported shared chunks (see docs).
        manifest: true,
        rollupOptions: {
            input: Object.fromEntries(pages.map(({ name, file }) => [name, resolve(root, file)])),
        },
    },
});
