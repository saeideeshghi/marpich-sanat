import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { htmlPartials } from "./build/html-partials.js";
import { pages } from "./build/pages.js";

const root = import.meta.dirname;

export default defineConfig({
    // Relative base keeps assets working on:
    // username.github.io/repository-name/
    base: "./",

    plugins: [
        htmlPartials(root),
        tailwindcss(),
    ],

    build: {
        manifest: true,

        rollupOptions: {
            input: Object.fromEntries(
                pages.map(({ name, file }) => [
                    name,
                    resolve(root, file),
                ])
            ),
        },
    },
});
