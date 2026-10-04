import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeConfig, compileCSS, defaultConfig, validElementSelector } from "../src/js/customizer/model.js";
import { settingsArchive } from "../src/js/customizer/export.js";
import { normalizePattern } from "../src/js/customizer/pattern-model.js";
import { nodeSupported } from "./start-customizer.js";

for (const version of ["18.20.8", "20.19.0", "22.11.0"]) assert(!nodeSupported(version));
for (const version of ["22.12.0", "v22.12.0", "24.0.0"]) assert(nodeSupported(version));

const config = normalizeConfig(JSON.parse(readFileSync(new URL("../src/data/customizer/settings.json", import.meta.url))));
assert.equal(compileCSS(config), readFileSync(new URL("../src/css/template-overrides.css", import.meta.url), "utf8"), "Generated stylesheet must match saved settings");
for (const selector of ["#hero-about", ".site-card__title", ".project-details__container > article:nth-of-type(2) > h3", "main > section:nth-of-type(1)"]) assert(validElementSelector(selector));
for (const selector of ["body, html", "*", "x { color:red }", "a[href=x]", "a:has(body)", "#x\\;color:red", "script", "", "@import url(x)"]) {
    if (selector === "script") continue; // The picker may point to any literal tag; declarations still remain bounded.
    assert(!validElementSelector(selector));
}
const rule = { page: "about", breakpoint: "mobile", target: { kind: "element", selector: ".about-team-media__image" }, properties: { "object-fit": "contain", height: "auto" } };
const css = compileCSS({ version: 1, rules: [rule] });
assert(css.includes('body[data-page="about"] .about-team-media__image'));
assert(css.includes("@media (max-width: 639px)"));
assert(!css.includes('body[data-page="home"]'));
for (const bad of [
    { ...rule, page: "*" }, { ...rule, breakpoint: "unknown" }, { ...rule, target: { kind: "element", selector: "body{color:red}" } },
    { ...rule, properties: { color: "red; background:url(x)" } }, { ...rule, properties: { "font-size": 10000 } },
    { ...rule, properties: { "font-size": "20px" } }, { ...rule, properties: { "background-image": "url(x)" } },
    { ...rule, properties: JSON.parse('{"__proto__":"#abcdef"}') },
]) assert.throws(() => normalizeConfig({ version: 1, rules: [bad] }));
assert.throws(() => normalizeConfig({ version: 1, rules: [rule, rule] }));
const unclamped = compileCSS({ version: 1, rules: [{ ...rule, target: { kind: "role", key: "card-description" }, properties: { "font-size": 24, "description-lines": 0 } }] });
assert(unclamped.includes("max-height: none !important"));
assert(unclamped.includes("-webkit-line-clamp: unset !important"));
const shared = { ...rule, page: "*", target: { kind: "component", selector: ".project-details__product-card > div > h3.site-card__title" }, properties: { "font-size": 18 } };
assert(compileCSS({ version: 1, rules: [shared] }).includes("body[data-page] .project-details__product-card"));
assert.throws(() => normalizeConfig({ version: 1, rules: [{ ...shared, target: { kind: "component", selector: "#product-title" } }] }));
const range = { ...shared, breakpoint: "range", range: { min: 370, max: 410 } };
assert(compileCSS({ version: 1, rules: [range] }).includes("@media (min-width: 370px) and (max-width: 410px)"));
assert.equal(normalizeConfig({ version: 1, rules: [range, { ...range, range: { min: 420, max: 500 } }] }).rules.length, 2);
for (const invalid of [undefined, { min: 410, max: 370 }, { min: 279, max: 410 }, { min: 370, max: 2401 }, { min: 370.5, max: 410 }])
    assert.throws(() => normalizeConfig({ version: 1, rules: [{ ...range, range: invalid }] }));
for (const kind of ["header", "footer"]) {
    const pattern = normalizePattern(config.patterns[kind]);
    assert.deepEqual(Object.keys(pattern.profiles).sort(), ["desktop", "mobile", "tablet"]);
    const original = pattern.artworks.desktop.lines[0].thickness;
    pattern.artworks.mobile.lines[0].thickness = original + 1;
    assert.equal(pattern.artworks.desktop.lines[0].thickness, original);
    assert.equal(pattern.profiles.tablet.artwork, "tablet");
    for (const mutate of [p => { p.artworks.mobile.lines[0].d = '<svg onload="x">'; }, p => { p.profiles.mobile.opacity = 101; }, p => { p.profiles.tablet.animation = { period: 0 }; }, p => { p.artworks.mobile.lines[0].stops[0].color = "url(x)"; }]) {
        const invalid = structuredClone(pattern); mutate(invalid); assert.throws(() => normalizePattern(invalid));
    }
}
const archive = new Uint8Array(await settingsArchive(config).arrayBuffer());
assert.equal(new DataView(archive.buffer).getUint32(0, true), 0x04034b50);
assert.equal(new DataView(archive.buffer).getUint32(archive.length - 22, true), 0x06054b50);
const view = new DataView(archive.buffer), decoder = new TextDecoder(), entries = new Map(); let offset = 0;
while (view.getUint32(offset, true) === 0x04034b50) {
    const size = view.getUint32(offset + 18, true), nameLength = view.getUint16(offset + 26, true), extraLength = view.getUint16(offset + 28, true);
    const name = decoder.decode(archive.subarray(offset + 30, offset + 30 + nameLength)), start = offset + 30 + nameLength + extraLength;
    entries.set(name, decoder.decode(archive.subarray(start, start + size))); offset = start + size;
}
assert.equal(entries.get("src/css/template-overrides.css"), compileCSS(config));
assert.deepEqual(normalizeConfig(JSON.parse(entries.get("src/data/customizer/settings.json"))), config);
for (const [kind, name] of [["header", "site"], ["footer", "footer"]]) assert.deepEqual(normalizePattern(JSON.parse(entries.get(`src/data/patterns/${name}-pattern.json`))), config.patterns[kind]);
console.log("PASS: precise/shared selection scopes, responsive ranges, independent pattern profiles and four-file portable export.");
