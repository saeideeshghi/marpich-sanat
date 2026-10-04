import "../../css/customizer.css";
import { pages } from "../../../build/pages.js";
import { BREAKPOINTS, PAGE_NAMES, TARGETS, PROPERTIES, normalizeConfig, compileCSS, defaultConfig, ruleKey, targetSelector } from "./model.js";
import { downloadSettings } from "./export.js";
import { createPatternEditor } from "./pattern-editor.js";

const $ = (id) => document.getElementById(id);
const ui = Object.fromEntries(["page", "width", "target", "scope", "breakpoint", "preview", "stage", "frame-shell", "loading", "controls", "status", "connection", "save-state", "save", "undo", "redo", "pick", "compare", "selection-label", "match-count", "parent", "similar", "locate", "rules", "rule-count", "confirm", "confirm-summary", "confirm-pages", "confirm-mode", "confirm-save", "save-error", "preview-caption", "scale"].map((id) => [id, $(id)]));
const base = import.meta.env.BASE_URL;
const cacheKey = `marpich-customizer-draft:${base}`;
const preferencesKey = `marpich-customizer-view:${base}`;
const clone = (value) => structuredClone(value);
const asText = (element, value) => { element.textContent = value; };
const labelFor = (target) => target.kind === "role" ? TARGETS.find((role) => role.key === target.key)?.label : target.label;
let saved = defaultConfig(), draft = clone(saved), revision = "", token = "", canSave = false;
let currentPage = "home", currentWidth = 1440, currentBreakpoint = "desktop", scope = "page";
let target = { kind: "role", key: "hero-title" }, selectedElement = null, similarSelector = "";
let exactTarget = null, componentSelector = "", editorMode = "style", customRange = { min: 360, max: 480 };
let extraOverlays = [];
let frameDocument = null, draftStyle = null, savedLink = null, overlay = null, hoverOverlay = null;
let frameLayoutObserver = null;
let pickEnabled = true, comparing = false, busy = false, scale = 1, ready = false;
let treeElement = null, treeNodes = [];
let history = [clone(draft)], historyIndex = 0, lastChange = { key: "", at: 0 }, lastRules = "";

const option = (value, label) => {
    const item = document.createElement("option"); item.value = value; item.textContent = label; return item;
};
for (const page of pages) ui.page.append(option(page.name, PAGE_NAMES[page.name]));
for (const item of BREAKPOINTS) ui.breakpoint.append(option(item.key, item.label));

const choices = {
    "font-weight": [["300", "نازک"], ["400", "معمولی"], ["500", "متوسط"], ["600", "نیمه ضخیم"], ["700", "ضخیم"], ["800", "خیلی ضخیم"], ["900", "سنگین"]],
    "text-align": [["right", "راست‌چین"], ["justify", "جاستیفای"], ["center", "وسط‌چین"], ["left", "چپ‌چین"], ["start", "ابتدای متن"]],
    "text-align-last": [["right", "راست‌چین"], ["auto", "خودکار"], ["center", "وسط‌چین"], ["left", "چپ‌چین"]],
    direction: [["rtl", "راست به چپ"], ["ltr", "چپ به راست"]],
    "align-items": [["flex-start", "ابتدای محور"], ["flex-end", "انتهای محور"], ["center", "وسط"], ["stretch", "کشیده"]],
    "justify-content": [["flex-start", "ابتدای محور"], ["flex-end", "انتهای محور"], ["center", "وسط"], ["space-between", "فاصله بین"], ["space-around", "فاصله اطراف"]],
    "flex-direction": [["row", "ردیف"], ["row-reverse", "ردیف برعکس"], ["column", "ستون"], ["column-reverse", "ستون برعکس"]],
    "object-fit": [["contain", "تصویر کامل"], ["cover", "پر کردن قاب"], ["fill", "کشیدن در قاب"], ["scale-down", "کوچک شدن در قاب"]],
    "object-position": [["center", "وسط"], ["center top", "بالا"], ["center bottom", "پایین"], ["right center", "راست"], ["left center", "چپ"]],
    transform: [["none", "حذف زوم و چرخش"]],
    display: [["block","بلوک"],["flex","Flex"],["grid","Grid"],["inline-flex","Flex داخل خط"],["none","مخفی"]],
    "flex-wrap": [["nowrap","یک ردیف"],["wrap","چند ردیف"],["wrap-reverse","چند ردیف معکوس"]],
    "justify-self": [["start","ابتدا"],["end","انتها"],["center","وسط"],["stretch","کشیده"]],
    "align-self": [["auto","خودکار"],["flex-start","ابتدا"],["flex-end","انتها"],["center","وسط"],["stretch","کشیده"]],
    "border-style": [["solid","ساده"],["dashed","خط‌چین"],["dotted","نقطه‌ای"],["none","حذف"]],
    "white-space": [["normal","شکستن خط طبیعی"],["nowrap","یک خط"],["pre-wrap","حفظ خطوط"]],
    overflow: [["visible","نمایش کامل"],["hidden","برش اضافات"],["auto","اسکرول در صورت نیاز"]],
    "overflow-wrap": [["normal","طبیعی"],["break-word","شکستن کلمه بلند"],["anywhere","شکستن آزاد"]],
};
const groups = [
    ["فونت و راست‌چین", true, [["font-size", "سایز متن"], ["line-height", "فاصله خطوط"], ["font-weight", "وزن فونت"], ["description-lines", "تعداد خطوط · ۰ = کامل"], ["text-align", "تراز متن"], ["text-align-last", "تراز خط آخر"], ["direction", "جهت متن", true]]],
    ["ارتفاع و عرض", true, [["min-height", "حداقل ارتفاع"], ["height", "ارتفاع ثابت"], ["max-height", "حداکثر ارتفاع"], ["max-width", "حداکثر عرض"], ["width", "عرض نسبت به والد"], ["border-radius", "گردی گوشه‌ها"]]],
    ["فاصله‌های داخلی", true, [["padding-top", "بالا"], ["padding-bottom", "پایین"], ["padding-right", "راست"], ["padding-left", "چپ"]]],
    ["فاصله‌های بیرونی", false, [["margin-top", "بالا"], ["margin-bottom", "پایین"], ["margin-right", "راست"], ["margin-left", "چپ"]]],
    ["چیدمان باکس‌ها", false, [["display","نوع چیدمان"],["gap", "فاصله بین باکس‌ها"], ["row-gap","فاصله ردیف‌ها"],["column-gap","فاصله ستون‌ها"], ["grid-template-columns", "تعداد ستون‌ها"], ["align-items", "تراز محور عرضی"], ["justify-content", "تراز محور اصلی"], ["flex-direction", "جهت چیدمان", true],["flex-wrap","شکستن ردیف"],["align-self","تراز این المان"],["justify-self","جای این المان در Grid"]]],
    ["حاشیه و کنترل متن", false, [["border-width","ضخامت حاشیه"],["border-color","رنگ حاشیه"],["border-style","نوع حاشیه"],["letter-spacing","فاصله حروف"],["word-spacing","فاصله کلمات"],["white-space","شکستن متن"],["overflow-wrap","کلمه‌های بلند"],["overflow","محتوای اضافی"]]],
    ["تصویر و رنگ", false, [["object-fit", "نمایش تصویر"], ["object-position", "جای تصویر"], ["transform", "زوم و چرخش", true], ["opacity", "وضوح · ۰ تا ۱"], ["color", "رنگ متن"], ["background-color", "رنگ پس‌زمینه", true]]],
];
const fields = new Map();
for (const [title, open, definitions] of groups) {
    const panel = document.createElement("details"); panel.className = "mps-panel"; panel.open = open;
    const summary = document.createElement("summary"); summary.textContent = title;
    const container = document.createElement("div"); container.className = "mps-panel__fields";
    panel.append(summary, container);
    for (const [name, label, wide] of definitions) {
        const spec = PROPERTIES[name], field = document.createElement("div");
        field.className = `mps-field${wide ? " mps-field--wide" : ""}`;
        const labelRow = document.createElement("div"); labelRow.className = "mps-field__label";
        const text = document.createElement("label"); text.htmlFor = `control-${name}`; text.textContent = label;
        const reset = document.createElement("button"); reset.type = "button"; reset.className = "mps-field__reset"; reset.textContent = "↺"; reset.title = "برگشت به استایل پایه"; reset.setAttribute("aria-label", `بازنشانی ${label}`);
        labelRow.append(text, reset);
        const row = document.createElement("div"); row.className = "mps-field__input";
        let input;
        if (spec.type === "choice") {
            input = document.createElement("select"); input.append(option("", "استایل پایه"));
            for (const [value, label] of choices[name]) input.append(option(value, label));
        } else {
            input = document.createElement("input"); input.type = spec.type === "number" ? "number" : "text";
            if (spec.type === "number") {
                input.inputMode = "decimal"; input.min = spec.min; input.max = spec.max;
                input.step = name === "line-height" ? "0.05" : name === "opacity" ? "0.01" : "1";
            }
            input.autocomplete = "off"; input.spellcheck = false;
            const unit = document.createElement("span"); unit.className = "mps-field__unit";
            unit.textContent = spec.unit === "px" ? "px" : spec.unit === "%" ? "%" : ""; row.append(unit);
        }
        input.id = `control-${name}`; input.dataset.property = name;
        row.prepend(input); field.append(labelRow, row);
        for (const value of spec.extra || []) {
            const extra = document.createElement("button"); extra.type = "button"; extra.className = "mps-field__extra";
            extra.textContent = value === "auto" ? "اندازه طبیعی (auto)" : "بدون محدودیت (none)";
            extra.addEventListener("click", () => changeProperty(name, value)); field.append(extra);
        }
        reset.addEventListener("click", () => changeProperty(name, undefined));
        input.addEventListener(spec.type === "choice" ? "change" : "input", () => {
            let value = input.value.trim().replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)).replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));
            if (!value) value = undefined;
            else if (spec.type === "number" && !spec.extra?.includes(value)) value = Number(value);
            changeProperty(name, value, true);
        });
        input.addEventListener("blur", () => refreshFields());
        fields.set(name, { field, input, reset }); container.append(field);
    }
    ui.controls.append(panel);
}

function activeRule() {
    return { page: target.kind === "element" || scope === "page" ? currentPage : "*", breakpoint: currentBreakpoint, ...(currentBreakpoint === "range" ? { range: clone(customRange) } : {}), target: clone(target), properties: {} };
}
function activeProperties() { return draft.rules.find((rule) => ruleKey(rule) === ruleKey(activeRule()))?.properties || {}; }
function matchingElements() {
    if (!frameDocument) return [];
    const selector = targetSelector(target);
    return selector ? [...frameDocument.querySelectorAll(selector)] : [frameDocument.body];
}
function message(text, error = false) { asText(ui.status, text); ui.status.dataset.error = String(error); }
function isDirty() { return JSON.stringify(saved) !== JSON.stringify(draft); }

function remember() {
    try {
        localStorage.setItem(preferencesKey, JSON.stringify({ page: currentPage, width: currentWidth }));
        if (isDirty()) localStorage.setItem(cacheKey, JSON.stringify({ baseline: JSON.stringify(saved), config: draft }));
        else localStorage.removeItem(cacheKey);
    } catch { /* Export and real file writeback remain available without storage. */ }
}

function commit(next, changeKey = "") {
    if (busy || !ready) return;
    next = normalizeConfig(next);
    if (JSON.stringify(next) === JSON.stringify(draft)) return;
    const now = Date.now();
    history = history.slice(0, historyIndex + 1);
    if (changeKey && lastChange.key === changeKey && now - lastChange.at < 700 && historyIndex > 0) history[historyIndex] = clone(next);
    else { history.push(clone(next)); historyIndex++; }
    if (history.length > 80) { history.shift(); historyIndex--; }
    lastChange = { key: changeKey, at: now }; draft = next; comparing = false;
    applyDraft(); refreshState(); patternEditor.render(); remember();
}

function changeProperty(name, value, fromInput = false) {
    if (busy || !ready) return;
    const next = clone(draft), rule = activeRule(), key = ruleKey(rule);
    let existing = next.rules.find((item) => ruleKey(item) === key);
    if (!existing) { existing = rule; next.rules.push(existing); }
    if (value === undefined) delete existing.properties[name]; else existing.properties[name] = value;
    if (target.kind === "component" && value !== undefined && $("unify-repeats").checked) {
        const elements = new Set(matchingElements());
        for (const item of next.rules) if (item.target.kind === "element" && item.page === currentPage && item.breakpoint === currentBreakpoint && JSON.stringify(item.range) === JSON.stringify(rule.range)) {
            if (elements.has(frameDocument?.querySelector(item.target.selector))) delete item.properties[name];
        }
    }
    try {
        commit(next, `${key}:${name}`);
        message("پیش‌نمایش به‌روز شد؛ برای ثبت روی قالب، تأیید و ثبت را بزن.");
        if (!fromInput) refreshFields(); else refreshFieldMarkers();
    } catch (error) { message(error.message, true); }
}

function refreshTargets() {
    ui.target.replaceChildren();
    if (target.kind !== "role") ui.target.append(option("__picked", `انتخاب‌شده · ${target.label.slice(0, 45)}`));
    const grouped = new Map();
    for (const role of TARGETS) {
        if (role.pages && !role.pages.includes(currentPage)) continue;
        if (!grouped.has(role.group)) {
            const group = document.createElement("optgroup"); group.label = role.group; grouped.set(role.group, group); ui.target.append(group);
        }
        grouped.get(role.group).append(option(role.key, role.label));
    }
    ui.target.value = target.kind !== "role" ? "__picked" : target.key;
    const restricted = target.kind === "element" || TARGETS.find((role) => role.key === target.key)?.pages;
    if (restricted) scope = "page";
    ui.scope.disabled = Boolean(restricted); ui.scope.value = scope;
    ui.breakpoint.value = currentBreakpoint;
    $("custom-range").hidden = currentBreakpoint !== "range";
    $("range-min").value = customRange.min; $("range-max").value = customRange.max;
    $("selection-mode").hidden = !exactTarget;
    $("repeat-mode").value = target.kind === "component" ? "component" : "exact";
    $("repeat-mode").querySelector('[value="component"]').disabled = !componentSelector;
    $("unify-label").hidden = target.kind !== "component";
}

function colorHex(value) {
    if (value.startsWith("#") || value === "transparent") return value;
    const values = value.match(/[\d.]+/g)?.map(Number);
    if (!values || values[3] === 0) return "transparent";
    return `#${values.slice(0, 3).map((number) => Math.round(number).toString(16).padStart(2, "0")).join("")}`;
}
function computedValue(name, element) {
    if (!element) return "";
    const computed = element.ownerDocument.defaultView.getComputedStyle(element), raw = computed.getPropertyValue(name).trim(), spec = PROPERTIES[name];
    if (name === "description-lines") return Number.parseInt(computed.webkitLineClamp, 10) || 0;
    if (name === "grid-template-columns") return computed.display === "grid" && raw !== "none" ? raw.split(" ").length : "";
    if (spec.type === "color") return colorHex(raw);
    if (spec.type !== "number") return raw;
    if (spec.extra?.includes(raw)) return raw;
    if (name === "line-height") return Math.round((parseFloat(raw) / parseFloat(computed.fontSize)) * 100) / 100 || "";
    if (name === "width") return Math.round((element.getBoundingClientRect().width / (element.parentElement?.getBoundingClientRect().width || 1)) * 1000) / 10;
    const number = parseFloat(raw); return Number.isFinite(number) ? Math.round(number * 100) / 100 : "";
}

function refreshFieldMarkers() {
    const properties = activeProperties();
    for (const [name, { field, reset }] of fields) { field.dataset.edited = String(name in properties); reset.disabled = !(name in properties); }
}
function refreshFields() {
    const elements = matchingElements(), first = elements[0], properties = activeProperties();
    for (const [name, { input }] of fields) {
        const value = name in properties ? properties[name] : computedValue(name, first);
        if (input.tagName === "SELECT") input.value = [...input.options].some((item) => item.value === String(value)) ? String(value) : "";
        else {
            const special = PROPERTIES[name].type === "number" && typeof value === "string";
            input.value = special ? "" : String(value ?? "");
            input.placeholder = special ? value === "auto" ? "طبیعی" : "بدون محدودیت" : "";
        }
    }
    refreshFieldMarkers();
    asText(ui["selection-label"], labelFor(target));
    const overrides = first && Object.entries(properties).some(([name, value]) => {
        if (["description-lines", "grid-template-columns", "width"].includes(name)) return false;
        const actual = computedValue(name, first);
        return typeof value === "number" ? typeof actual === "number" && Math.abs(value - actual) > 0.1 : actual !== value;
    });
    asText(ui["match-count"], elements.length ? `${elements.length.toLocaleString("fa")} مورد در این صفحه · مقادیر از اولین مورد خوانده می‌شوند.${overrides ? " برای بعضی مقادیر، تنظیمی اختصاصی‌تر یا اندازه دیگری در پیش‌نمایش فعال است." : ""}` : "این بخش در این صفحه وجود ندارد؛ صفحه دیگری را انتخاب کن.");
    ui.parent.disabled = !selectedElement?.parentElement || selectedElement.parentElement === frameDocument?.body;
    ui.similar.hidden = !similarSelector || target.kind !== "element" || target.selector === similarSelector;
    refreshSelectionTree();
    watchFrameLayout(first);
    positionOverlays();
}

function watchFrameLayout(element) {
    if (!frameLayoutObserver || !frameDocument) return;
    frameLayoutObserver.disconnect();
    const nodes = new Set([frameDocument.documentElement, frameDocument.body]);
    let node = element;
    for (let count = 0; node && count < 6; count++, node = node.parentElement) nodes.add(node);
    for (const item of nodes) frameLayoutObserver.observe(item);
}

function describeElement(element) {
    const names = { h1: "عنوان اصلی", h2: "عنوان بخش", h3: "عنوان باکس", h4: "عنوان", p: "متن", blockquote: "دیدگاه", article: "باکس", section: "بخش", div: "قاب", figure: "قاب تصویر", img: "تصویر", svg: "تصویر برداری", button: "دکمه", a: "لینک", i: "آیکون", span: "متن / آیکون", bdi: "قسمت متن", strong: "متن ضخیم", table: "جدول", td: "سلول", th: "عنوان جدول", li: "آیتم", ul: "فهرست", input: "فیلد", form: "فرم" };
    const text = element.getAttribute("aria-label") || element.getAttribute("alt") || element.getAttribute("placeholder") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 32);
    return `${names[element.localName] || "المان"}${text ? ` · ${text}` : ""}`;
}
function refreshSelectionTree() {
    const tree = $("selection-tree"), ancestors = $("ancestors"), children = $("children");
    const element = selectedElement || (target.kind === "role" ? matchingElements()[0] : null);
    tree.hidden = !element || element === frameDocument?.body;
    if (tree.hidden) { treeElement = null; treeNodes = []; ancestors.replaceChildren(); children.replaceChildren(); return; }
    const chain = []; let node = element;
    while (node && node !== frameDocument.body && chain.length < 5) { chain.unshift(node); node = node.parentElement; }
    const descendants = [...element.children].filter((item) => !["script", "style"].includes(item.localName)).slice(0, 12);
    const nodes = [...chain, ...descendants];
    // A numeric field blurs on pointerdown. Keep existing path buttons alive
    // through that refresh so their subsequent click still reaches the handler.
    if (treeElement === element && nodes.length === treeNodes.length && nodes.every((item, index) => item === treeNodes[index])) return;
    treeElement = element; treeNodes = nodes;
    ancestors.replaceChildren(); children.replaceChildren();
    const add = (container, item, active = false) => {
        const button = document.createElement("button"); button.className = "mps-selection-node"; button.type = "button";
        button.textContent = describeElement(item); button.title = button.textContent; button.dataset.active = String(active);
        button.addEventListener("click", () => selectElement(item)); container.append(button);
    };
    for (const item of chain) add(ancestors, item, item === element);
    for (const item of descendants) add(children, item);
    if (!children.children.length) asText(children, "این المان بخش داخلی دیگری ندارد.");
}

function changedRules() {
    const before = new Map(saved.rules.map((rule) => [ruleKey(rule), rule])), after = new Map(draft.rules.map((rule) => [ruleKey(rule), rule]));
    return [...new Set([...before.keys(), ...after.keys()])].filter((key) => JSON.stringify(before.get(key)) !== JSON.stringify(after.get(key))).map((key) => after.get(key) || before.get(key));
}
function changedPatterns() { return ["header","footer"].filter(key => JSON.stringify(saved.patterns?.[key]) !== JSON.stringify(draft.patterns?.[key])); }
function refreshState() {
    const dirty = isDirty();
    asText(ui["save-state"], dirty ? `${(changedRules().length + changedPatterns().length).toLocaleString("fa")} تغییر تأییدنشده` : "نسخه ثبت‌شده");
    ui["save-state"].dataset.dirty = String(dirty);
    ui.save.disabled = !ready || !dirty || busy;
    ui.save.textContent = canSave ? "تأیید و ثبت در قالب" : "تأیید و دریافت فایل‌ها";
    ui.undo.disabled = historyIndex <= 0 || busy; ui.redo.disabled = historyIndex >= history.length - 1 || busy;
    ui.compare.setAttribute("aria-pressed", String(comparing));
    asText(ui["rule-count"], `(${draft.rules.length.toLocaleString("fa")})`);
    const serialized = JSON.stringify(draft);
    if (serialized !== lastRules) {
        lastRules = serialized; ui.rules.replaceChildren();
        for (const rule of draft.rules) {
            const button = document.createElement("button"); button.className = "mps-rule"; button.textContent = labelFor(rule.target);
            const sub = document.createElement("small"); sub.textContent = `${rule.page === "*" ? "همه صفحه‌ها" : PAGE_NAMES[rule.page]} · ${rule.range ? `${rule.range.min}–${rule.range.max}px` : BREAKPOINTS.find((item) => item.key === rule.breakpoint).label}`;
            button.append(sub); button.addEventListener("click", () => navigateToRule(rule)); ui.rules.append(button);
        }
    }
}

function applyDraft() {
    if (!frameDocument || !draftStyle) return;
    draftStyle.textContent = compileCSS(draft);
    draftStyle.disabled = comparing; if (savedLink) savedLink.disabled = !comparing;
    ui.compare.setAttribute("aria-pressed", String(comparing));
    previewPatterns();
    requestAnimationFrame(positionOverlays);
}
function previewPatterns(paused = patternEditor?.paused || false) {
    if (!frameDocument?.body.dataset.siteReady) return;
    const patterns = (comparing ? saved : draft).patterns;
    if (patterns) frameDocument.defaultView.dispatchEvent(new frameDocument.defaultView.CustomEvent("site:pattern-preview", { detail: { ...clone(patterns), paused } }));
}

const semanticClasses = (element) => [...(element.classList || [])].filter((name) => /^[A-Za-z_][\w-]*$/.test(name) && name.includes("-")
    && !/^(?:fa-|fa$|bg-|text-|font-|border-|rounded-|items-|justify-|object-|overflow-|flex-|grid-|col-|row-|gap-|p[xytbrl]?-|m[xytbrl]?-|w-|h-|min-|max-|z-|space-|leading-|tracking-|self-|order-|shrink-|grow-)/.test(name))
    .sort((a, b) => Number(a.startsWith("site-")) - Number(b.startsWith("site-")));

function elementSelector(element) {
    const segments = []; let node = element;
    while (node && node !== frameDocument.body) {
        if (/^[A-Za-z_][\w-]*$/.test(node.id) && frameDocument.querySelectorAll(`#${node.id}`).length === 1) { segments.unshift(`#${node.id}`); break; }
        const classes = semanticClasses(node);
        const unique = classes.find((name) => frameDocument.querySelectorAll(`.${name}`).length === 1);
        if (unique) { segments.unshift(`.${unique}`); break; }
        let segment = node.localName;
        if (classes[0]) segment += `.${classes[0]}`;
        const siblings = [...(node.parentElement?.children || [])].filter((item) => item.localName === node.localName);
        if (siblings.length > 1) segment += `:nth-of-type(${siblings.indexOf(node) + 1})`;
        segments.unshift(segment); node = node.parentElement;
    }
    return segments.join(" > ");
}

function selectElement(element, scroll = false) {
    if (!frameDocument || !element || element.ownerDocument !== frameDocument || !element.isConnected || element === frameDocument.body || element === frameDocument.documentElement) return;
    selectedElement = element;
    const label = describeElement(element);
    target = { kind: "element", selector: elementSelector(element), label };
    exactTarget = clone(target); componentSelector = repeatedSelector(element);
    box(hoverOverlay, null);
    setEditorMode("style");
    const similarClass = semanticClasses(element)[0];
    similarSelector = similarClass && frameDocument.querySelectorAll(`.${similarClass}`).length > 1 ? `.${similarClass}` : "";
    scope = "page"; refreshTargets(); refreshFields();
    if (scroll) element.scrollIntoView({ block: "center", behavior: "instant" });
    const textElement = element.matches("h1,h2,h3,h4,p,span,bdi,strong,blockquote,a,li,i,button,label,td,th");
    const control = fields.get(textElement ? "font-size" : element.localName === "img" ? "height" : "min-height");
    control.field.closest("details").open = true;
    control.field.scrollIntoView({ block: "nearest", behavior: "instant" });
    control.input.focus({ preventScroll: true }); control.input.select();
    message("این المان انتخاب شد. تنظیماتش فقط روی همین صفحه اعمال می‌شود.");
}
function repeatedSelector(element) {
    let anchor = element.closest(".site-card, .project-details__meta-item, .product-details__quick-spec-item, .details-table tr, .catalog-faq__item"), baseSelector = "";
    if (anchor?.matches("tr")) {
        const tableClass = semanticClasses(anchor.closest("table"))[0];
        if (tableClass) baseSelector = `.${tableClass} > ${anchor.parentElement.localName} > tr`;
    }
    if (!anchor) {
        // Shared navigation, footer lists and other repeated semantic elements
        // are editable even when they are not site-card components.
        for (let node = element; node && node !== frameDocument.body; node = node.parentElement) {
            const shared = semanticClasses(node).find(name => frameDocument.querySelectorAll(`.${name}`).length > 1);
            if (shared) { anchor = node; baseSelector = `.${shared}`; break; }
        }
    }
    if (!anchor) return "";
    if (!baseSelector) {
        const className = semanticClasses(anchor).find(name => frameDocument.querySelectorAll(`.${name}`).length > 1);
        if (!className) return "";
        baseSelector = `.${className}`;
    }
    const segments = []; let node = element;
    while (node !== anchor) {
        let part = node.localName; const semantic = semanticClasses(node)[0];
        if (semantic) part += `.${semantic}`;
        const siblings = [...node.parentElement.children].filter(child => child.localName === node.localName);
        if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
        segments.unshift(part); node = node.parentElement;
    }
    const selector = `${baseSelector}${segments.length ? ` > ${segments.join(" > ")}` : ""}`;
    return frameDocument.querySelectorAll(selector).length > 1 ? selector : "";
}

function box(overlayElement, element, color) {
    if (!overlayElement) return;
    if (!element || !pickEnabled || comparing || !element.isConnected) { overlayElement.hidden = true; return; }
    const rect = element.getBoundingClientRect();
    overlayElement.hidden = !rect.width || !rect.height;
    Object.assign(overlayElement.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderColor: color });
    const label = overlayElement.querySelector(".mps-picker-label");
    if (label) { label.textContent = describeElement(element); label.style.top = rect.top < 26 ? "0" : "-24px"; label.style.background = color; }
}
function positionOverlays() {
    const elements = editorMode === "style" ? matchingElements().slice(0,80) : [];
    box(overlay, elements[0], "#f47d3e");
    if (!frameDocument) return;
    for(let i=1;i<elements.length;i++)if(!extraOverlays[i-1]){const item=overlay.cloneNode(true);item.querySelector('.mps-picker-label').remove();frameDocument.body.append(item);extraOverlays[i-1]=item;}
    extraOverlays.forEach((item,index)=>box(item,elements[index+1],"#ed9b6880"));
}
function resizePreview() {
    const width = ui.stage.clientWidth - (window.innerWidth <= 760 ? 24 : 48);
    scale = Math.min(1, Math.max(0.15, width / currentWidth));
    const height = Math.max(320, ui.stage.clientHeight - 28);
    ui.preview.style.width = `${currentWidth}px`; ui.preview.style.height = `${Math.round(height / scale)}px`;
    ui.preview.style.transform = `scale(${scale})`;
    ui["frame-shell"].style.width = `${currentWidth * scale}px`; ui["frame-shell"].style.height = `${height}px`;
    asText(ui.scale, `نمایش ${Math.round(scale * 100).toLocaleString("fa")}٪ · عرض واقعی ${currentWidth.toLocaleString("fa")}px`);
    asText(ui["preview-caption"], `${PAGE_NAMES[currentPage]} · ${currentWidth.toLocaleString("fa")} پیکسل`);
}
function setWidth(width, breakpoint) {
    currentWidth = Math.min(2400, Math.max(280, Math.round(width)));
    ui.width.value = currentWidth;
    const size = breakpoint || (currentWidth >= 1180 ? "desktop" : currentWidth >= 640 ? "tablet" : currentBreakpoint === "compact" && currentWidth <= 450 ? "compact" : "mobile");
    if (!["all","range"].includes(currentBreakpoint)) currentBreakpoint = size;
    ui.breakpoint.value = currentBreakpoint;
    for (const button of document.querySelectorAll("[data-device]")) button.setAttribute("aria-pressed", String(button.dataset.device === size));
    resizePreview(); remember();
    // ResizeObserver-driven page layouts and fonts need one frame to settle.
    requestAnimationFrame(() => requestAnimationFrame(() => { refreshFields(); positionOverlays(); }));
}
function navigateToPage(page, keepTarget = false) {
    if (!PAGE_NAMES[page]) return;
    currentPage = page; ui.page.value = page; frameDocument = null; selectedElement = null; similarSelector = ""; exactTarget = null; componentSelector = "";
    if (!keepTarget || (target.kind === "role" && TARGETS.find((item) => item.key === target.key)?.pages?.every((name) => name !== page))) target = { kind: "role", key: "hero-title" };
    refreshTargets(); refreshFields(); ui.loading.hidden = false;
    ui.preview.src = `${base}${pages.find((item) => item.name === page).file}`;
    resizePreview(); remember();
}
function navigateToRule(rule) {
    target = clone(rule.target); scope = rule.page === "*" ? "global" : "page";
    currentBreakpoint = rule.breakpoint;
    if (rule.range) customRange = clone(rule.range);
    const widths = { desktop: 1440, tablet: 820, mobile: 390, compact: 320 };
    if (widths[rule.breakpoint]) setWidth(widths[rule.breakpoint], rule.breakpoint);
    if (rule.page !== "*" && rule.page !== currentPage) navigateToPage(rule.page, true);
    else { refreshTargets(); refreshFields(); locate(); }
}
function locate() { matchingElements()[0]?.scrollIntoView({ block: "center", behavior: "instant" }); positionOverlays(); }

ui.preview.addEventListener("load", async () => {
    try {
        const document = ui.preview.contentDocument;
        if (!PAGE_NAMES[document?.body?.dataset.page]) return;
        frameLayoutObserver?.disconnect();
        frameDocument = document;
        extraOverlays = [];
        if (currentPage !== document.body.dataset.page) { currentPage = document.body.dataset.page; ui.page.value = currentPage; target = { kind: "role", key: "hero-title" }; selectedElement = null; similarSelector = ""; }
        savedLink = document.getElementById("mps-template-overrides");
        draftStyle = document.createElement("style"); draftStyle.id = "mps-customizer-draft"; document.head.append(draftStyle);
        const selectionStyle = document.createElement("style"); selectionStyle.textContent = ".mps-picker-box{position:fixed;z-index:2147483647;pointer-events:none;border:2px solid;box-sizing:border-box;border-radius:3px;background:transparent;transition:none!important;}.mps-picker-label{position:absolute;right:-2px;max-width:260px;padding:2px 6px;border-radius:3px;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:12px/1.6 Peyda,Tahoma,sans-serif;}";
        document.head.append(selectionStyle);
        overlay = document.createElement("div"); hoverOverlay = document.createElement("div");
        overlay.dataset.pickerKind = "selection"; hoverOverlay.dataset.pickerKind = "hover";
        for (const element of [overlay, hoverOverlay]) { element.className = "mps-picker-box"; element.setAttribute("aria-hidden", "true"); element.hidden = true; document.body.append(element); }
        for (const element of [overlay, hoverOverlay]) { const label = document.createElement("span"); label.className = "mps-picker-label"; element.append(label); }
        hoverOverlay.style.borderStyle = "dashed"; hoverOverlay.style.borderWidth = "1px";
        document.addEventListener("click", (event) => {
            if (!pickEnabled || comparing) return;
            event.preventDefault(); event.stopImmediatePropagation();
            // Keep the literal clicked element: bdi/span/icon inside a title or
            // button can be styled independently. The path buttons select parents.
            let element = event.target;
            if (element.closest("svg")) element = element.closest("svg");
            selectElement(element);
        }, true);
        document.addEventListener("pointerdown", (event) => { if (pickEnabled && !comparing) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
        document.addEventListener("pointermove", (event) => { if (pickEnabled) box(hoverOverlay, event.target.closest("svg") || event.target, "#27a1c1"); }, { passive: true });
        document.addEventListener("pointerleave", () => { hoverOverlay.hidden = true; });
        document.addEventListener("scroll", positionOverlays, { passive: true, capture: true });
        document.addEventListener("keydown", keyboard);
        document.addEventListener("submit", (event) => event.preventDefault(), true);
        applyDraft(); refreshTargets(); resizePreview();
        // Vite may finish its injected page styles after the iframe load event.
        // Wait for real page initialization before reading sizes or hiding loading.
        if (document.body.dataset.siteReady !== "true") await new Promise((resolve, reject) => {
            const finish = () => { clearTimeout(timer); resolve(); };
            const timer = setTimeout(() => { document.removeEventListener("site:ready", finish); reject(new Error("page not ready")); }, 15000);
            document.addEventListener("site:ready", finish, { once: true });
        });
        await document.fonts.ready;
        await new Promise((resolve) => document.defaultView.requestAnimationFrame(() => document.defaultView.requestAnimationFrame(resolve)));
        if (frameDocument !== document) return;
        frameLayoutObserver = new document.defaultView.ResizeObserver(positionOverlays);
        previewPatterns(); patternEditor.render();
        refreshFields(); ui.loading.hidden = true;
    } catch { ui.loading.hidden = true; message("پیش‌نمایش باید از همان سرور پروژه باز شود.", true); }
});

ui.page.addEventListener("change", () => navigateToPage(ui.page.value));
ui.preview.addEventListener("pointerleave", () => box(hoverOverlay, null));
ui.target.addEventListener("change", () => { if (ui.target.value === "__picked") return; target = { kind: "role", key: ui.target.value }; selectedElement = null; similarSelector = ""; exactTarget = null; componentSelector = ""; refreshTargets(); refreshFields(); locate(); });
ui.scope.addEventListener("change", () => { scope = ui.scope.value; refreshFields(); });
ui.breakpoint.addEventListener("change", () => {
    currentBreakpoint = ui.breakpoint.value;
    const widths = { desktop: 1440, tablet: 820, mobile: 390, compact: 320 };
    if (widths[currentBreakpoint]) setWidth(widths[currentBreakpoint], currentBreakpoint);
    else if(currentBreakpoint === "range")setWidth(Math.min(customRange.max, Math.max(customRange.min,currentWidth)),"range");
    else refreshFields();
    refreshTargets();
});
ui.width.addEventListener("change", () => { const number = Number(ui.width.value); if (Number.isFinite(number)) setWidth(number); });
for (const button of document.querySelectorAll("[data-width]")) button.addEventListener("click", () => { currentBreakpoint = button.dataset.device; setWidth(Number(button.dataset.width), button.dataset.device); });
ui.pick.addEventListener("click", () => { pickEnabled = !pickEnabled; ui.pick.setAttribute("aria-pressed", String(pickEnabled)); ui.pick.textContent = `انتخاب با کلیک: ${pickEnabled ? "روشن" : "خاموش"}`; box(hoverOverlay, null); positionOverlays(); });
ui.compare.addEventListener("click", () => { comparing = !comparing; applyDraft(); refreshFields(); message(comparing ? "نسخه ثبت‌شده نمایش داده می‌شود. دوباره بزن تا به پیش‌نویس برگردی." : "پیش‌نویس نمایش داده می‌شود."); });
ui.parent.addEventListener("click", () => selectElement(selectedElement?.parentElement, true));
ui.similar.addEventListener("click", () => { target = { kind: "component", selector: componentSelector || similarSelector, label: `موارد مشابه · ${target.label}` }; refreshTargets(); refreshFields(); message("تنظیمات روی موارد مشابه در محدوده انتخاب‌شده اعمال می‌شود."); });
$("repeat-mode").addEventListener("change", () => { target = $("repeat-mode").value === "component" ? { kind:"component", selector:componentSelector, label:`باکس‌های تکراری · ${exactTarget.label}` } : clone(exactTarget); refreshTargets(); refreshFields(); });
for(const id of ["range-min","range-max"])$(id).addEventListener("change",()=>{const min=Number($("range-min").value),max=Number($("range-max").value);if(!Number.isInteger(min)||!Number.isInteger(max)||min<280||max>2400||min>max){message("بازهٔ عرض معتبر نیست.",true);return;}customRange={min,max};setWidth(Math.min(max,Math.max(min,currentWidth)),"range");refreshFields();});
ui.locate.addEventListener("click", locate);
$("reset-target").addEventListener("click", () => { const key = ruleKey(activeRule()); commit({ ...draft, rules: draft.rules.filter((rule) => ruleKey(rule) !== key) }); refreshFields(); message("تنظیمات این محدوده حذف شد؛ تغییر هنوز ثبت نشده است."); });
$("discard").addEventListener("click", () => { commit(clone(saved)); refreshFields(); message("پیش‌نویس به آخرین نسخه ثبت‌شده برگشت."); });
$("defaults").addEventListener("click", () => { commit({ ...defaultConfig(), patterns: clone(draft.patterns) }); refreshFields(); message("اندازه‌های پیشنهادی باکس‌ها و راست‌چین اعمال شد. قبل از ثبت می‌توانی ویرایش کنی یا برگشت بزنی."); });
function moveHistory(offset) {
    if (busy || !history[historyIndex + offset]) return;
    historyIndex += offset; draft = clone(history[historyIndex]); lastChange = { key: "", at: 0 }; comparing = false;
    applyDraft(); refreshFields(); refreshState(); patternEditor.render(); remember();
}
ui.undo.addEventListener("click", () => moveHistory(-1)); ui.redo.addEventListener("click", () => moveHistory(1));
function keyboard(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.target.closest("input, textarea, select")) { event.preventDefault(); moveHistory(event.shiftKey ? 1 : -1); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); if (isDirty()) showConfirmation(); }
}
document.addEventListener("keydown", keyboard);
new ResizeObserver(resizePreview).observe(ui.stage);

$("import").addEventListener("change", async (event) => {
    const file = event.target.files[0]; if (!file) return;
    try { if (file.size > 2097152) throw new Error("فایل بیش از حد بزرگ است."); const imported=JSON.parse(await file.text()); imported.patterns ||= clone(draft.patterns); commit(normalizeConfig(imported)); refreshFields(); patternEditor.render(); message("تنظیمات وارد شد؛ پیش‌نمایش را بررسی و سپس ثبت کن."); }
    catch (error) { message(error.message, true); }
    event.target.value = "";
});
$("export").addEventListener("click", () => { downloadSettings(draft); message("بستهٔ استایل و پترن دریافت شد؛ پوشه src آن را در پروژه Merge و Replace کن، سپس محلی اجرا یا منتشر کن."); });

function showConfirmation() {
    if (busy || !isDirty()) return;
    const changes = changedRules();
    asText(ui["confirm-summary"], `${(changes.length + changedPatterns().length).toLocaleString("fa")} تنظیم تغییر کرده. تغییرات بر اساس اندازه و محدوده‌ای که انتخاب کردی اعمال می‌شوند.`);
    ui["confirm-pages"].replaceChildren();
    for (const page of new Set(changes.map((rule) => rule.page))) {
        const item = document.createElement("li"); item.textContent = page === "*" ? "تنظیمات مشترک همه صفحه‌ها" : PAGE_NAMES[page]; ui["confirm-pages"].append(item);
    }
    for(const kind of changedPatterns()){const item=document.createElement('li');item.textContent=`پترن مشترک ${kind === 'header'?'هدر':'فوتر'} · همهٔ صفحه‌ها` ;ui['confirm-pages'].append(item);}
    asText(ui["confirm-mode"], canSave ? "با تأیید، تنظیمات در فایل‌های قالب ثبت می‌شوند؛ با باز کردن دوباره صفحه هم باقی می‌مانند. برای سایت آنلاین، نسخه جدید را منتشر کن." : "در نسخه آنلاین، فایل‌های پروژه قابل نوشتن نیستند. تأیید یک ZIP شامل CSS و JSON می‌دهد؛ آن‌ها را در پروژه جایگزین کن و نسخه جدید را منتشر کن.");
    ui["confirm-save"].textContent = canSave ? "تأیید و ثبت" : "تأیید و دریافت ZIP"; ui["save-error"].hidden = true;
    if (!ui.confirm.open) ui.confirm.showModal();
}
ui.save.addEventListener("click", showConfirmation);
$("cancel-save").addEventListener("click", () => { if (!busy) ui.confirm.close(); });
ui.confirm.addEventListener("cancel", (event) => { if (busy) event.preventDefault(); });
ui["confirm-save"].addEventListener("click", async () => {
    if (busy) return;
    if (!canSave) { downloadSettings(draft); ui.confirm.close(); message("بسته تأییدشده دریافت شد. برای ثبت روی قالب، فایل‌های src بسته را در پروژه جایگزین و منتشر کن."); return; }
    busy = true; ui.controls.disabled = true; $("pattern-editor").inert = true; ui["confirm-save"].disabled = true; refreshState();
    try {
        const response = await fetch(`${base}__customizer/settings`, { method: "POST", headers: { "Content-Type": "application/json", "X-Marpich-Customizer": token }, body: JSON.stringify({ revision, config: draft }), signal: AbortSignal.timeout(10000) });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || "ثبت انجام نشد.");
        saved = normalizeConfig(result.config); draft = clone(saved); revision = result.revision;
        ui.confirm.close(); remember(); message("ثبت شد. استایل‌ها در فایل‌های قالب ذخیره شدند و روی همه صفحه‌ها اعمال می‌شوند. برای سایت آنلاین، بیلد و انتشار را انجام بده.");
    } catch (error) { ui["save-error"].hidden = false; asText(ui["save-error"], error.message || "ثبت انجام نشد؛ پیش‌نویس باقی مانده است."); }
    finally { busy = false; ui.controls.disabled = false; $("pattern-editor").inert = false; ui["confirm-save"].disabled = false; refreshState(); refreshFields(); }
});

async function initialize() {
    try {
        const response = await fetch(`${base}__customizer/settings`, { signal: AbortSignal.timeout(3000), cache: "no-store" });
        if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error("static");
        const result = await response.json(); saved = normalizeConfig(result.config); revision = result.revision; token = result.token; canSave = result.canSave === true;
    } catch {
        try { const response = await fetch(`${base}assets/customizer/settings.json`, { cache: "no-store" }); if (!response.ok) throw new Error(); saved = normalizeConfig(await response.json()); }
        catch { message("تنظیمات قالب خوانده نشد. با npm run dev از داخل پروژه باز کن.", true); }
    }
    draft = clone(saved);
    try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cached?.baseline === JSON.stringify(saved)) { draft = normalizeConfig(cached.config); message("پیش‌نویس قبلی بازیابی شد؛ هنوز روی فایل‌های قالب ثبت نشده است."); }
        const view = JSON.parse(localStorage.getItem(preferencesKey) || "null");
        if (PAGE_NAMES[view?.page]) currentPage = view.page;
        if (Number.isFinite(view?.width)) currentWidth = view.width;
    } catch { /* Ignore incompatible/stale local drafts. */ }
    history = [clone(saved)]; historyIndex = 0;
    if (isDirty()) { history.push(clone(draft)); historyIndex = 1; }
    ready = true;
    ui.connection.dataset.mode = canSave ? "local" : "static";
    asText(ui.connection, canSave ? "نسخه محلی · ذخیره مستقیم روی قالب فعال است" : "نسخه آنلاین · ثبت با دریافت فایل و جایگزینی در پروژه");
    refreshState(); patternEditor.render(); setWidth(currentWidth); navigateToPage(currentPage);
}
function setEditorMode(mode) {
    editorMode=mode;$("style-editor").hidden=mode!=="style";$("pattern-editor").hidden=mode!=="pattern";
    $("style-tab").setAttribute("aria-pressed",String(mode==="style"));$("pattern-tab").setAttribute("aria-pressed",String(mode==="pattern"));positionOverlays();
}
const patternEditor = createPatternEditor({container:$("pattern-editor"),getConfig:()=>draft,commit,preview:previewPatterns,setWidth,getWidth:()=>currentWidth,message,locate:kind=>{const root=frameDocument?.querySelector(`[data-site-pattern="${kind}"]`);if(root)root.parentElement.scrollIntoView({block:"start",behavior:"instant"});else message("این صفحه پترن هدر ندارد؛ یکی از صفحه‌های داخلی را انتخاب کن.");}});
$("style-tab").addEventListener("click",()=>setEditorMode("style"));
$("pattern-tab").addEventListener("click",()=>{setEditorMode("pattern");patternEditor.open();});
initialize();
