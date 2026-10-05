// Edits actual shared SVG settings. The preview remains the real current page.
const fields = [
    [
        "جای پترن و وضوح",
        "profile",
        [
            ["width", "عرض (%)", 1, 500],
            ["height", "ارتفاع مبنا (px)", 1, 2400],
            ["x", "فاصله چپ (%)", -200, 200],
            ["y", "فاصله بالا (%)", -200, 200],
            ["rotation", "چرخش", -180, 180],
            ["scaleY", "کشش عمودی (%)", 1, 400],
            ["opacity", "وضوح (%)", 0, 100],
            ["flipX", "برعکس افقی", "boolean"],
            ["fillHost", "پوشاندن تمام ارتفاع", "boolean"],
            ["fadeLeft", "محو لبه چپ", 0, 100],
            ["fadeStart", "شروع محوشدن", 0, 100],
            ["fadeEnd", "پایان محوشدن", 0, 100],
            ["motion", "مقدار موج (%)", 0, 400],
            ["light", "مقدار نور (%)", 0, 300],
            ["motionSpeed", "سرعت این اندازه", 0, 10],
        ],
    ],
    [
        "انیمیشن این اندازه",
        "animation",
        [
            ["mode", "حالت", ["none", "wave", "light", "combined"]],
            ["speed", "سرعت", 0, 10],
            ["amplitude", "دامنه موج", 0, 100],
            ["period", "دوره موج (ثانیه)", 0.05, 600],
            ["cycles", "تعداد موج", 0.1, 10],
            ["phaseStep", "فاصله فاز مسیرها", 0, 10],
            ["direction", "جهت موج", [1, -1]],
            ["lightPeriod", "دوره نور", 0.05, 600],
            ["lightPause", "مکث نور", 0, 120],
            ["lightWidth", "عرض نور", 1, 2000],
            ["lightIntensity", "شدت نور", 0, 300],
            ["lightColor", "رنگ نور", "color"],
            ["coreColor", "رنگ مرکز نور", "color"],
            ["lightDirection", "جهت نور", [1, -1]],
            ["easing", "حرکت", ["linear", "smooth"]],
            ["glow", "درخشش", 0, 30],
            ["pulse", "ضربان (%)", 0, 100],
            ["pulsePeriod", "دوره ضربان", 0.05, 600],
            ["entrance", "ورود", ["none", "fade", "reveal"]],
            ["entranceDuration", "زمان ورود", 0.05, 600],
            ["entranceDelay", "تأخیر ورود", 0, 60],
            ["fps", "فریم در ثانیه", 1, 60],
            ["respectReducedMotion", "رعایت کاهش حرکت دستگاه", "boolean"],
        ],
    ],
    [
        "مسیر انتخاب‌شده",
        "line",
        [
            ["visible", "نمایش مسیر", "boolean"],
            ["opacity", "وضوح مسیر (%)", 0, 100],
            ["thickness", "ضخامت", 0, 40],
            ["x", "جابجایی افقی", -2000, 2000],
            ["y", "جابجایی عمودی", -2000, 2000],
            ["rotation", "چرخش مسیر", -180, 180],
            ["scaleX", "کشش افقی (%)", 1, 400],
            ["scaleY", "کشش عمودی (%)", 1, 400],
            ["gradientAngle", "چرخش گرادینت", -180, 180],
            ["gradientScale", "اندازه گرادینت (%)", 1, 400],
            ["gradientShift", "جابجایی گرادینت", -200, 200],
            ["wave", "موج مسیر (%)", 0, 300],
            ["speed", "سرعت مسیر", 0, 10],
            ["phase", "فاز", -10, 10],
            ["delay", "تأخیر", 0, 60],
            ["light", "نور مسیر (%)", 0, 300],
        ],
    ],
];
const labels = {
    none: "خاموش",
    wave: "موج",
    light: "نور",
    combined: "موج و نور",
    linear: "یکنواخت",
    smooth: "نرم",
    fade: "محو",
    reveal: "نمایان‌شدن",
    1: "جلو",
    "-1": "عقب",
};
export function createPatternEditor({ container, getConfig, commit, preview, setWidth, getWidth, locate, message }) {
    let kind = "footer",
        profile = "mobile",
        lineIndex = 0,
        paused = false,
        signature = "";
    const controls = [];
    container.innerHTML =
        '<p class="mps-help">پترن‌ها روی همهٔ صفحه‌ها مشترک‌اند؛ هندسه، مسیرها و انیمیشن هر اندازه مستقل است.</p><div class="mps-scope-row"><label>پترن<select id="pattern-kind"><option value="footer">فوتر</option><option value="header">هدر</option></select></label><label>اندازه<select id="pattern-profile"><option value="desktop">دسکتاپ</option><option value="tablet">تبلت</option><option value="mobile">موبایل</option></select></label></div><div class="mps-selection-actions" style="margin-top:12px"><button id="pattern-locate" class="mps-link">رفتن به پترن</button><button id="pattern-pause" class="mps-link">مکث انیمیشن</button></div><label class="mps-help">مسیر SVG<select id="pattern-line"></select></label><div id="pattern-fields"></div><div id="pattern-stops"></div><label class="mps-help">وارد کردن JSON پترن<input id="pattern-import" type="file" accept=".json"></label>';
    const $ = (id) => container.querySelector("#" + id),
        config = () => getConfig().patterns?.[kind],
        p = () => config()?.profiles[profile];
    const object = (type) =>
        type === "profile"
            ? p()
            : type === "animation"
              ? { ...config().animation, ...p().animation }
              : config().artworks[p().artwork].lines[lineIndex];
    const change = (type, key, value) => {
        try {
            const next = structuredClone(getConfig()),
                pattern = next.patterns[kind],
                part = pattern.profiles[profile];
            const dest =
                type === "profile"
                    ? part
                    : type === "animation"
                      ? (part.animation ||= {})
                      : pattern.artworks[part.artwork].lines[lineIndex];
            dest[key] = value;
            commit(next, `pattern:${kind}:${profile}:${type}:${lineIndex}:${key}`);
            preview(paused);
            render();
        } catch (error) {
            message(error.message, true);
        }
    };
    for (const [title, type, definitions] of fields) {
        const panel = document.createElement("details");
        panel.className = "mps-panel";
        panel.open = type === "profile";
        const summary = document.createElement("summary");
        summary.textContent = title;
        const grid = document.createElement("div");
        grid.className = "mps-panel__fields";
        panel.append(summary, grid);
        $("pattern-fields").append(panel);
        for (const [key, label, spec, minmax] of definitions) {
            const field = document.createElement("label");
            field.className = "mps-field";
            const text = document.createElement("span");
            text.className = "mps-field__label";
            text.textContent = label;
            field.append(text);
            let input;
            if (Array.isArray(spec)) {
                input = document.createElement("select");
                for (const value of spec) {
                    const o = document.createElement("option");
                    o.value = value;
                    o.textContent = labels[value] || value;
                    input.append(o);
                }
            } else {
                input = document.createElement("input");
                input.type = spec === "boolean" ? "checkbox" : spec === "color" ? "color" : "number";
                if (input.type === "number") {
                    input.min = spec;
                    input.max = minmax;
                    input.step =
                        Number.isInteger(spec) &&
                        ![
                            "speed",
                            "motionSpeed",
                            "thickness",
                            "phase",
                            "gradientAngle",
                            "rotation",
                            "x",
                            "y",
                            "opacity",
                        ].includes(key)
                            ? "1"
                            : "0.1";
                }
            }
            input.id = `pattern-${type}-${key}`;
            field.append(input);
            grid.append(field);
            controls.push({ type, key, input });
            input.addEventListener(input.type === "number" ? "input" : "change", () => {
                if (input.type === "number" && !input.value) return;
                change(
                    type,
                    key,
                    input.type === "checkbox"
                        ? input.checked
                        : input.type === "number" || ["direction", "lightDirection"].includes(key)
                          ? Number(input.value)
                          : input.value,
                );
            });
        }
    }
    const chooseProfile = () => {
        profile = $("pattern-profile").value;
        lineIndex = 0;
        signature = "";
        setWidth(profile === "desktop" ? 1440 : profile === "tablet" ? 820 : 390, profile);
        render();
        locate(kind);
    };
    $("pattern-kind").addEventListener("change", () => {
        kind = $("pattern-kind").value;
        lineIndex = 0;
        signature = "";
        render();
        locate(kind);
    });
    $("pattern-profile").addEventListener("change", chooseProfile);
    $("pattern-line").addEventListener("change", () => {
        lineIndex = Number($("pattern-line").value);
        signature = "";
        render();
    });
    $("pattern-locate").addEventListener("click", () => locate(kind));
    $("pattern-pause").addEventListener("click", () => {
        paused = !paused;
        $("pattern-pause").textContent = paused ? "پخش انیمیشن" : "مکث انیمیشن";
        preview(paused);
    });
    $("pattern-import").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            if (file.size > 1500000) throw Error("فایل بیش از حد بزرگ است.");
            const next = structuredClone(getConfig());
            next.patterns[kind] = JSON.parse(await file.text());
            commit(next);
            signature = "";
            render();
            preview(paused);
        } catch (error) {
            message(error.message, true);
        }
        event.target.value = "";
    });
    function render() {
        if (!config()) return;
        $("pattern-kind").value = kind;
        $("pattern-profile").value = profile;
        const lines = config().artworks[p().artwork].lines;
        if (lineIndex >= lines.length) lineIndex = 0;
        if ($("pattern-line").options.length !== lines.length) {
            $("pattern-line").replaceChildren();
            lines.forEach((line, index) => {
                const o = document.createElement("option");
                o.value = index;
                o.textContent = line.name || `مسیر ${index + 1}`;
                $("pattern-line").append(o);
            });
        }
        $("pattern-line").value = lineIndex;
        for (const { type, key, input } of controls) {
            if (input === document.activeElement) continue;
            const value =
                object(type)?.[key] ?? (key === "fillHost" ? kind === "footer" && profile === "mobile" : false);
            if (input.type === "checkbox") input.checked = Boolean(value);
            else input.value = value;
        }
        const line = object("line"),
            nextSignature = `${kind}:${profile}:${lineIndex}:${line.stops.length}`;
        if (signature !== nextSignature) {
            signature = nextSignature;
            $("pattern-stops").replaceChildren();
            const title = document.createElement("p");
            title.className = "mps-help";
            title.textContent = "رنگ‌های گرادینت این مسیر";
            $("pattern-stops").append(title);
            line.stops.forEach((stop, index) => {
                const row = document.createElement("div");
                row.className = "mps-pattern-stop";
                for (const [key, type, min, max, step] of [
                    ["color", "color"],
                    ["offset", "number", 0, 100, 1],
                    ["opacity", "number", 0, 1, 0.01],
                ]) {
                    const input = document.createElement("input");
                    input.type = type;
                    input.value = stop[key];
                    input.title = key === "color" ? "رنگ" : key === "offset" ? "جای رنگ (%)" : "وضوح رنگ";
                    if (type === "number") {
                        input.min = min;
                        input.max = max;
                        input.step = step;
                    }
                    input.dataset.stop = index;
                    input.dataset.key = key;
                    input.addEventListener(type === "color" ? "change" : "input", () => {
                        try {
                            if (!input.value) return;
                            const next = structuredClone(getConfig()),
                                pat = next.patterns[kind],
                                stops = pat.artworks[pat.profiles[profile].artwork].lines[lineIndex].stops;
                            stops[index][key] = type === "color" ? input.value : Number(input.value);
                            commit(next, `stop:${kind}:${profile}:${lineIndex}:${index}:${key}`);
                            preview(paused);
                        } catch (error) {
                            message(error.message, true);
                        }
                    });
                    row.append(input);
                }
                $("pattern-stops").append(row);
            });
        } else
            for (const input of $("pattern-stops").querySelectorAll("input"))
                if (input !== document.activeElement)
                    input.value = line.stops[Number(input.dataset.stop)][input.dataset.key];
    }
    return {
        render,
        open() {
            const width = getWidth();
            profile =
                width >= 1180
                    ? "desktop"
                    : width >= (kind === "header" ? 640 : config().breakpoint)
                      ? "tablet"
                      : "mobile";
            signature = "";
            render();
            locate(kind);
        },
        get paused() {
            return paused;
        },
    };
}
