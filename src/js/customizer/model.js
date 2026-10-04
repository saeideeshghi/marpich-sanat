// Shared by the editor and the Vite writeback endpoint. No browser/Node APIs here.
import { normalizePatterns } from "./pattern-model.js";
export const BREAKPOINTS = [
    { key: "all", label: "همه اندازه‌ها", query: "" },
    { key: "desktop", label: "دسکتاپ · ۱۱۸۰ به بالا", query: "(min-width: 1180px)" },
    { key: "tablet", label: "تبلت · ۶۴۰ تا ۱۱۷۹", query: "(min-width: 640px) and (max-width: 1179px)" },
    { key: "mobile", label: "موبایل · تا ۶۳۹", query: "(max-width: 639px)" },
    { key: "compact", label: "موبایل کوچک · تا ۴۵۰", query: "(max-width: 450px)" },
    { key: "range", label: "بازهٔ دلخواه", query: "" },
];

export const PAGE_NAMES = {
    home: "صفحه اصلی", products: "محصولات", "product-details": "جزئیات محصول",
    contact: "تماس با ما", "project-details": "جزئیات پروژه", about: "درباره ما",
    projects: "پروژه‌ها", "industry-textile": "صنعت نساجی", expertise: "حوزه تخصصی",
    "air-handling": "هواساز", industries: "صنایع", articles: "مقالات",
};

export const TARGETS = [
    { key: "page", label: "کل صفحه", selector: "", group: "چیدمان" },
    { key: "hero", label: "هیرو · ارتفاع", selector: ".site-hero", group: "هیرو" },
    { key: "hero-content", label: "هیرو · فاصله متن از بالا", selector: ".site-hero__content", group: "هیرو" },
    { key: "hero-eyebrow", label: "هیرو · عنوان کوچک / مسیر صفحه", selector: ".site-hero__eyebrow", group: "هیرو" },
    { key: "hero-title", label: "هیرو · عنوان اصلی", selector: ".site-hero__title", group: "هیرو" },
    { key: "hero-description", label: "هیرو · توضیحات", selector: ".site-hero__description", group: "هیرو" },
    { key: "section", label: "بخش‌های محتوا · فاصله و ارتفاع", selector: "main section", group: "محتوا" },
    { key: "section-title", label: "عنوان بخش‌ها", selector: "main h2:not(.site-card__title):not(.project-details__testimonial-title)", group: "محتوا" },
    { key: "body-text", label: "متن‌ها و توضیحات کامل", selector: ":is(main p, main li, .site-prose):not(.site-card__description):not(.site-hero__description):not(.site-hero__eyebrow):not(.site-card__tag):not(.project-details__testimonial-kicker-copy)", group: "محتوا" },
    { key: "card", label: "همه باکس‌ها · ارتفاع و فاصله", selector: ".site-card", group: "باکس‌ها" },
    { key: "card-title", label: "عنوان باکس‌ها", selector: ".site-card__title", group: "باکس‌ها" },
    { key: "card-description", label: "توضیحات باکس‌ها", selector: ".site-card__description", group: "باکس‌ها" },
    { key: "card-cta", label: "CTA باکس‌ها", selector: ".site-card__cta", group: "باکس‌ها" },
    { key: "card-tag", label: "تگ‌های باکس‌ها", selector: ".site-card__tag", group: "باکس‌ها" },
    { key: "search", label: "فرم جست‌وجو", selector: ":is(.product-search, .articles-search)", group: "فرم‌ها" },
    { key: "filter-chips", label: "فیلترهای انتخاب‌شده", selector: ".product-search__bottom", group: "فرم‌ها" },
    { key: "fields", label: "فیلدهای فرم", selector: ":is(input:not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea)", group: "فرم‌ها" },
    { key: "project-meta", label: "اطلاعات پروژه · باکس‌ها", selector: ".project-details__meta-item", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-meta-grid", label: "اطلاعات پروژه · ستون‌ها و فاصله", selector: ".project-details__meta-grid", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-meta-label", label: "اطلاعات پروژه · عنوان", selector: ".project-details__meta-item > span", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-meta-value", label: "اطلاعات پروژه · مقدار", selector: ".project-details__meta-item > strong", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-stat", label: "دستاوردهای پروژه · باکس", selector: ".project-details__stat", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-stats-grid", label: "دستاوردهای پروژه · ستون‌ها و فاصله", selector: ".project-details__stats-grid", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-stat-icon", label: "دستاوردهای پروژه · آیکون", selector: ".project-details__stat-icon", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-testimonial", label: "دیدگاه کارفرما · متن کامل", selector: ".project-details__testimonial-body", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-summary", label: "تصویر و اطلاعات پروژه", selector: ".project-details__summary", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "product-summary", label: "باکس اصلی محصول", selector: ".product-details__summary", pages: ["product-details"], group: "جزئیات محصول" },
    { key: "product-summary-title", label: "عنوان اصلی محصول", selector: "#product-title", pages: ["product-details"], group: "جزئیات محصول" },
    { key: "product-summary-description", label: "توضیح اصلی محصول", selector: ".product-details__summary .site-card__description", pages: ["product-details"], group: "جزئیات محصول" },
    { key: "project-product-title", label: "محصولات پروژه · عنوان", selector: ".project-details__product-card .site-card__title", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-product-description", label: "محصولات پروژه · توضیح", selector: ".project-details__product-card .site-card__description", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-stat-title", label: "دستاوردها · عنوان", selector: ".project-details__stat .site-card__title", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "project-stat-description", label: "دستاوردها · توضیح", selector: ".project-details__stat .site-card__description", pages: ["project-details"], group: "جزئیات پروژه" },
    { key: "technical-card", label: "قاب جدول فنی", selector: ".details-card", group: "جدول فنی" },
    { key: "technical-cell", label: "سلول‌های جدول", selector: ".details-table td", group: "جدول فنی" },
    { key: "technical-heading", label: "عنوان ستون‌های جدول", selector: ".details-table th", group: "جدول فنی" },
    { key: "technical-image", label: "تصویر فنی", selector: ".details-visual img", group: "جدول فنی" },
    { key: "about-image", label: "تصویر اصلی درباره ما", selector: ".about-team-media__image", pages: ["about"], group: "درباره ما" },
    { key: "expertise-image", label: "تصاویر حوزه تخصصی", selector: ".expertise-page__media-image", pages: ["expertise"], group: "حوزه تخصصی" },
    { key: "footer", label: "فوتر · ارتفاع و فاصله", selector: ".site-footer", group: "فوتر" },
    { key: "footer-pattern", label: "پترن فوتر · وضوح و اندازه", selector: ".site-footer .site-pattern-graphic", group: "فوتر" },
    { key: "footer-title", label: "عنوان‌های فوتر", selector: ".site-footer h3", group: "فوتر" },
    { key: "footer-text", label: "متن‌ها و لینک‌های فوتر", selector: ".site-footer :is(p, li, a):not(.site-footer__back-top)", group: "فوتر" },
];

const number = (min, max, unit = "px", extra = []) => ({ type: "number", min, max, unit, extra });
const choice = (...values) => ({ type: "choice", values });
export const PROPERTIES = {
    "font-size": number(6, 160), "line-height": number(0.8, 4, ""),
    "font-weight": choice("300", "400", "500", "600", "700", "800", "900"),
    "text-align": choice("right", "justify", "center", "left", "start"),
    "text-align-last": choice("auto", "right", "center", "left"),
    direction: choice("rtl", "ltr"),
    "min-height": number(0, 2400), height: number(0, 2400, "px", ["auto"]),
    "max-height": number(0, 2400, "px", ["none"]),
    width: number(1, 100, "%", ["auto"]), "max-width": number(0, 2400, "px", ["none"]),
    "padding-top": number(0, 400), "padding-right": number(0, 400),
    "padding-bottom": number(0, 400), "padding-left": number(0, 400),
    "margin-top": number(-500, 500), "margin-bottom": number(-500, 500),
    "margin-right": number(-500, 500, "px", ["auto"]), "margin-left": number(-500, 500, "px", ["auto"]),
    gap: number(0, 240), "border-radius": number(0, 200),
    "grid-template-columns": number(1, 12, "columns"),
    display: choice("block", "flex", "grid", "inline-flex", "none"),
    "row-gap": number(0, 240), "column-gap": number(0, 240),
    "flex-wrap": choice("nowrap", "wrap", "wrap-reverse"),
    "justify-self": choice("start", "end", "center", "stretch"),
    "align-self": choice("auto", "flex-start", "flex-end", "center", "stretch"),
    "border-width": number(0, 20), "border-color": { type: "color" },
    "border-style": choice("none", "solid", "dashed", "dotted"),
    "letter-spacing": number(-10, 30), "word-spacing": number(-10, 60),
    "white-space": choice("normal", "nowrap", "pre-wrap"),
    "overflow": choice("visible", "hidden", "auto"), "overflow-wrap": choice("normal", "break-word", "anywhere"),
    "align-items": choice("flex-start", "flex-end", "center", "stretch"),
    "justify-content": choice("flex-start", "flex-end", "center", "space-between", "space-around"),
    "flex-direction": choice("row", "row-reverse", "column", "column-reverse"),
    "object-fit": choice("contain", "cover", "fill", "scale-down"),
    "object-position": choice("center", "center top", "center bottom", "right center", "left center"),
    transform: choice("none"), opacity: number(0, 1, ""),
    color: { type: "color" }, "background-color": { type: "color" },
    // Virtual control: the compiler emits all declarations required for a clamp.
    "description-lines": number(0, 10, "lines"),
};

export function emptyConfig() { return { version: 1, rules: [] }; }

export function defaultConfig() {
    const rules = [];
    const add = (key, properties, breakpoint = "all", page = "*") => rules.push({ page, breakpoint, target: { kind: "role", key }, properties });
    for (const key of ["hero-eyebrow", "hero-title", "section-title", "card-title", "card-cta", "card-tag", "footer-title"])
        add(key, { "text-align": "right", direction: "rtl" });
    for (const key of ["body-text", "hero-description", "card-description"])
        add(key, { "text-align": "justify", "text-align-last": "right", direction: "rtl", ...(key === "card-description" ? { "description-lines": 2 } : {}) });
    for (const breakpoint of ["desktop", "tablet", "mobile"]) {
        add("card-title", { "font-size": breakpoint === "mobile" ? 20 : 17 }, breakpoint);
        add("card-description", { "font-size": breakpoint === "mobile" ? 18 : 14 }, breakpoint);
    }
    add("card-cta", { "font-size": 12 }, "desktop");
    add("card-tag", { "font-size": 10 }, "mobile");
    add("card-title", { "font-size": 16 }, "compact", "expertise");
    add("card-description", { "font-size": 14 }, "compact", "expertise");
    add("project-stat", { "text-align": "right", "align-items": "flex-start", direction: "rtl" }, "all", "project-details");
    for (const [page, key, size] of [["product-details", "product-summary-title", 17], ["product-details", "product-summary-description", 14], ["project-details", "project-product-title", 16], ["project-details", "project-product-description", 14], ["project-details", "project-stat-title", 14], ["project-details", "project-stat-description", 14]]) add(key, { "font-size": size }, "mobile", page);
    add("product-summary-description", { "description-lines": 0 }, "all", "product-details");
    add("project-stat-description", { "description-lines": 0, "text-align": "right", "text-align-last": "right" }, "all", "project-details");
    return normalizeConfig({ version: 1, rules });
}

// Element selectors are generated by the picker: identifiers and structural
// children only. No arbitrary CSS, URLs, imports, attribute payloads or escapes.
export function validElementSelector(selector) {
    if (typeof selector !== "string" || !selector || selector.length > 2000) return false;
    const parts = selector.split(" > ");
    if (parts.length > 32) return false;
    return parts.every((part) => /^(?:[a-z][a-z0-9-]*)?(?:#[A-Za-z_][\w-]*|(?:\.[A-Za-z_][\w-]*){0,3})(?::nth-of-type\([1-9]\d{0,4}\))?$/.test(part) && part.length > 0);
}

export function normalizeConfig(input) {
    if (!input || input.version !== 1 || !Array.isArray(input.rules) || input.rules.length > 1000)
        throw new Error("فایل تنظیمات معتبر نیست.");
    const seen = new Set();
    const rules = input.rules.map((source) => {
        if (!source || !["*", ...Object.keys(PAGE_NAMES)].includes(source.page)) throw new Error("صفحه نامعتبر است.");
        if (!BREAKPOINTS.some((item) => item.key === source.breakpoint)) throw new Error("اندازه نامعتبر است.");
        const target = source.target;
        let cleanTarget;
        if (target?.kind === "role") {
            const role = TARGETS.find((item) => item.key === target.key);
            if (!role || (role.pages && !role.pages.includes(source.page))) throw new Error("بخش نامعتبر است.");
            cleanTarget = { kind: "role", key: role.key };
        } else if (["element", "component"].includes(target?.kind) && (source.page !== "*" || target.kind === "component") && validElementSelector(target.selector) && (target.kind !== "component" || !target.selector.includes("#"))) {
            cleanTarget = { kind: target.kind, selector: target.selector, label: String(target.label || "بخش انتخاب‌شده").slice(0, 120) };
        } else throw new Error("انتخاب بخش معتبر نیست.");
        if (!source.properties || Array.isArray(source.properties) || typeof source.properties !== "object")
            throw new Error("مقادیر استایل معتبر نیستند.");
        const properties = {};
        for (const [name, value] of Object.entries(source.properties)) {
            const spec = PROPERTIES[name];
            if (!Object.hasOwn(PROPERTIES, name)) throw new Error(`تنظیم ناشناخته: ${name}`);
            if (spec.type === "number") {
                if (spec.extra?.includes(value)) properties[name] = value;
                else {
                    if (typeof value !== "number" || !Number.isFinite(value) || value < spec.min || value > spec.max)
                        throw new Error(`مقدار نامعتبر: ${name}`);
                    if (["columns", "lines"].includes(spec.unit) && !Number.isInteger(value)) throw new Error("تعداد باید عدد صحیح باشد.");
                    properties[name] = Math.round(value * 100) / 100;
                }
            } else if (spec.type === "choice") {
                if (!spec.values.includes(value)) throw new Error(`مقدار نامعتبر: ${name}`);
                properties[name] = value;
            } else {
                if (typeof value !== "string" || !/^(?:#[0-9a-fA-F]{6}|transparent)$/.test(value)) throw new Error("رنگ نامعتبر است.");
                properties[name] = value.toLowerCase();
            }
        }
        const rule = { page: source.page, breakpoint: source.breakpoint, target: cleanTarget, properties };
        if (rule.breakpoint === "range") {
            const range = source.range;
            if (!range || !Number.isInteger(range.min) || !Number.isInteger(range.max) || range.min < 280 || range.max > 2400 || range.min > range.max) throw new Error("بازهٔ عرض معتبر نیست.");
            rule.range = { min: range.min, max: range.max };
        }
        const key = ruleKey(rule);
        if (seen.has(key)) throw new Error("تنظیم تکراری برای یک بخش وجود دارد.");
        seen.add(key);
        return rule;
    }).filter((rule) => Object.keys(rule.properties).length);
    return { version: 1, rules, ...(input.patterns ? { patterns: normalizePatterns(input.patterns) } : {}) };
}

export function ruleKey(rule) {
    return [rule.page, rule.breakpoint, rule.range ? `${rule.range.min}-${rule.range.max}` : "", rule.target.kind, rule.target.key || rule.target.selector].join("|");
}

export function targetSelector(target) {
    return target.kind === "role" ? TARGETS.find((item) => item.key === target.key)?.selector : target.selector;
}

export function propertyCSS(name, value) {
    if (name === "grid-template-columns") return `repeat(${value}, minmax(0, 1fr))`;
    const spec = PROPERTIES[name];
    return typeof value === "number" ? `${value}${spec.unit}` : value;
}

export function compileCSS(input) {
    const config = normalizeConfig(input);
    const priority = (rule) => (rule.target.kind === "element" ? 400 : rule.target.kind === "component" ? rule.page === "*" ? 200 : 300 : rule.page === "*" ? 0 : 100)
        + (rule.target.kind === "role" ? TARGETS.findIndex((item) => item.key === rule.target.key) : 0);
    const ordered = [...config.rules].sort((a, b) => priority(a) - priority(b)
        || BREAKPOINTS.findIndex((item) => item.key === a.breakpoint) - BREAKPOINTS.findIndex((item) => item.key === b.breakpoint));
    let css = "/* Marpich template styles. Generated by tools/customizer.html.\n * Edit with the customizer or src/data/customizer/settings.json. */\n";
    for (const rule of ordered) {
        const body = rule.page === "*" ? "body[data-page]" : `body[data-page="${rule.page}"]`;
        const child = targetSelector(rule.target);
        const selector = `${body}${child ? ` ${child}` : ""}${"description-lines" in rule.properties ? ":not([hidden])" : ""}`;
        const declarations = Object.entries(rule.properties).filter(([name]) => name !== "description-lines")
            .map(([name, value]) => `    ${name}: ${propertyCSS(name, value)} !important;`);
        const role = rule.target.kind === "role" ? rule.target.key : "";
        // Home's inner canvas consumes the same variable as the hero root.
        if ((role === "hero" || /^#hero-[\w-]+$/.test(child)) && typeof rule.properties["min-height"] === "number") {
            declarations.push(`    --hero-height: ${rule.properties["min-height"]}px !important;`, "    height: auto !important;");
        }
        if (role === "card-description" && ("font-size" in rule.properties || "line-height" in rule.properties))
            declarations.push("    max-height: none !important;");
        const lines = rule.properties["description-lines"];
        if (lines !== undefined) {
            declarations.push(`    display: ${lines ? "-webkit-box" : "block"} !important;`, "    -webkit-box-orient: vertical !important;",
                `    -webkit-line-clamp: ${lines || "unset"} !important;`, `    line-clamp: ${lines || "none"} !important;`,
                "    max-height: none !important;", "    height: auto !important;", "    min-height: 0 !important;",
                `    overflow: ${lines ? "hidden" : "visible"} !important;`);
        }
        if (rule.properties["text-align"] === "justify" && !("text-align-last" in rule.properties))
            declarations.push("    text-align-last: right !important;", "    text-justify: inter-word !important;");
        let block = `${selector} {\n${declarations.join("\n")}\n}\n`;
        const query = rule.range ? `(min-width: ${rule.range.min}px) and (max-width: ${rule.range.max}px)` : BREAKPOINTS.find((item) => item.key === rule.breakpoint).query;
        if (query) block = `@media ${query} {\n${block}}\n`;
        css += block;
    }
    return css;
}
