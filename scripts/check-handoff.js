// Regression checks for the integration bugs corrected in this handoff.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderComponent, validateContentUrl } from "../build/components.js";
const root = resolve(import.meta.dirname, "..");
for (const url of ["javascript:alert(1)", "data:text/html,x", "java\nscript:x", "//external.test/x", "\\evil.test/x"])
    assert.throws(() => validateContentUrl(url));
for (const url of ["#", "/products/fan", "product-details.html", "https://example.com/file", "mailto:a@example.com"])
    assert.equal(validateContentUrl(url), url);
assert.throws(() => validateContentUrl("mailto:a@example.com", true));
const data = JSON.parse(readFileSync(resolve(root, "src/data/pages/products.json")));
const search = renderComponent("search-panel", { ...data.search, id: "second-search" }, root);
assert(search.includes('id="second-search"'), "Search must use its supplied unique ID");
assert.throws(() => renderComponent("product-cards", [{ ...data.products[0], href: "javascript:alert(1)" }], root));
const faq = JSON.parse(readFileSync(resolve(root, "src/data/pages/industry-textile.json"))).faq;
const output = renderComponent("faq", {...faq, href: "/faq", linkText: "FAQ destination"}, root);
assert(output.includes('href="/faq"') && output.includes("FAQ destination"), "FAQ must use its data link");
console.log("PASS: URL scheme validation, search instance ID and data-driven FAQ destination.");
