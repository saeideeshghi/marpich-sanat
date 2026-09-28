/*
 * Shared decorative site pattern.
 *
 * Rendering and animation intentionally mirror the approved Pattern Studio export:
 * - the authored desktop/mobile profiles switch at the exported breakpoint (463px)
 * - path geometry, gradients, wave motion, moving light and opacity are untouched
 * - no tablet interpolation, footer dimming, SVG stretching or forced minimum stroke
 *
 * Only the Pattern Studio demo background/text are omitted here. The site host owns
 * its background/content; this module supplies the decorative SVG layer only.
 */
import patternSettings from "../../data/patterns/site-pattern.json";

const SVG_NS = "http://www.w3.org/2000/svg";

const cloneConfig = () => JSON.parse(JSON.stringify(patternSettings));

function mountPattern(root, initialConfig) {
    const uid = `mps-pattern-${Math.random().toString(36).slice(2, 10)}`;
    const create = (tag, attrs = {}, parent) => {
        const element = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
        parent?.append(element);
        return element;
    };

    const config = initialConfig;
    let time = 0;
    let visible = true;
    let frame = 0;
    let last = 0;
    let painted = 0;
    let profile;
    let nodes = [];

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    root.replaceChildren();

    // The exported demo uses a fixed authored scene height (430px desktop / 404px mobile).
    // Keeping that stage inside the full site layer means percentage Y positions stay
    // identical to the approved preview even when the real header/footer is taller.
    const stage = document.createElement("div");
    stage.className = "site-pattern-stage";
    root.append(stage);

    const pattern = document.createElement("div");
    pattern.className = "site-pattern-graphic";
    pattern.setAttribute("aria-hidden", "true");
    stage.append(pattern);

    const svg = create(
        "svg",
        {
            xmlns: SVG_NS,
            viewBox: "0 0 1008 494",
            width: 1008,
            height: 494,
            "aria-hidden": "true",
        },
        pattern,
    );

    const defs = create("defs", {}, svg);
    const maskGradient = create(
        "linearGradient",
        { id: `${uid}-mask-gradient`, x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        defs,
    );
    const mask = create(
        "mask",
        {
            id: `${uid}-mask`,
            maskUnits: "userSpaceOnUse",
            x: -2000,
            y: -2000,
            width: 5000,
            height: 5000,
        },
        defs,
    );
    create(
        "rect",
        {
            x: -2000,
            y: -2000,
            width: 5000,
            height: 5000,
            fill: `url(#${uid}-mask-gradient)`,
        },
        mask,
    );

    // Match the exported player: the fade gradient spans the 1008-unit pattern viewport,
    // independent from the deliberately oversized mask bounds.
    maskGradient.setAttribute("gradientUnits", "userSpaceOnUse");
    maskGradient.setAttribute("x1", 0);
    maskGradient.setAttribute("x2", 1008);

    const filter = create(
        "filter",
        {
            id: `${uid}-glow`,
            x: "-60%",
            y: "-60%",
            width: "220%",
            height: "220%",
            "color-interpolation-filters": "sRGB",
        },
        defs,
    );
    const blur = create("feGaussianBlur", { stdDeviation: 0 }, filter);
    const filtered = create("g", { mask: `url(#${uid}-mask)` }, svg);
    const normal = create("g", {}, filtered);
    const glowGroup = create("g", { filter: `url(#${uid}-glow)` }, filtered);

    const setStyles = (element, values) => Object.assign(element.style, values);
    const setGradientStops = (gradient, stops) => {
        gradient.replaceChildren();
        [...stops]
            .sort((a, b) => a.offset - b.offset)
            .forEach((stop) =>
                create(
                    "stop",
                    {
                        offset: `${Math.max(0, Math.min(100, stop.offset))}%`,
                        "stop-color": stop.color,
                        "stop-opacity": stop.opacity,
                    },
                    gradient,
                ),
            );
    };

    const prefersReducedMotion = () => config.animation.respectReducedMotion && reducedMotion.matches;

    function build() {
        nodes.forEach((node) => {
            node.gradient.remove();
            node.light.remove();
        });
        normal.replaceChildren();
        glowGroup.replaceChildren();

        nodes = config.lines.map((line, index) => {
            const gradient = create(
                "linearGradient",
                { id: `${uid}-gradient-${index}`, gradientUnits: "userSpaceOnUse" },
                defs,
            );
            setGradientStops(gradient, line.stops);

            const angle = (line.gradientAngle * Math.PI) / 180;
            const base = line.gradientBase;
            const centerX = (base.x1 + base.x2) / 2;
            const centerY = (base.y1 + base.y2) / 2;
            const deltaX = ((base.x1 - base.x2) / 2) * (line.gradientScale / 100);
            const deltaY = ((base.y1 - base.y2) / 2) * (line.gradientScale / 100);
            const shift = (line.gradientShift / 100) * 1016;
            const rotatedX = deltaX * Math.cos(angle) - deltaY * Math.sin(angle);
            const rotatedY = deltaX * Math.sin(angle) + deltaY * Math.cos(angle);

            Object.entries({
                x1: centerX + rotatedX + shift,
                y1: centerY + rotatedY,
                x2: centerX - rotatedX + shift,
                y2: centerY - rotatedY,
            }).forEach(([key, value]) => gradient.setAttribute(key, value));

            const light = create(
                "linearGradient",
                { id: `${uid}-light-${index}`, gradientUnits: "userSpaceOnUse", y1: 0, y2: 0 },
                defs,
            );
            setGradientStops(light, [
                { offset: 0, color: config.animation.lightColor, opacity: 0 },
                { offset: 34, color: config.animation.lightColor, opacity: 0.3 },
                { offset: 50, color: config.animation.coreColor, opacity: 1 },
                { offset: 67, color: config.animation.lightColor, opacity: 0.65 },
                { offset: 100, color: config.animation.lightColor, opacity: 0 },
            ]);

            const group = create("g", {}, normal);
            const glowWrapper = create("g", {}, glowGroup);
            const transform = `translate(${line.x} ${line.y}) translate(504 247) rotate(${line.rotation}) scale(${line.scaleX / 100} ${line.scaleY / 100}) translate(-504 -247)`;

            [group, glowWrapper].forEach((item) => {
                item.setAttribute("transform", transform);
                item.style.display = line.visible ? "" : "none";
                item.setAttribute("opacity", line.opacity / 100);
            });

            // Keep the source exactly as exported. In particular, do not impose a
            // minimum stroke or non-scaling stroke: both visibly change this artwork.
            const attrs = {
                d: line.d,
                fill: `url(#${uid}-gradient-${index})`,
                stroke: `url(#${uid}-gradient-${index})`,
                "stroke-width": line.thickness,
                "stroke-linejoin": "round",
            };

            const basePath = create("path", attrs, group);
            const brightPath = create(
                "path",
                {
                    ...attrs,
                    fill: `url(#${uid}-light-${index})`,
                    stroke: `url(#${uid}-light-${index})`,
                },
                group,
            );
            const glowPath = create(
                "path",
                {
                    ...attrs,
                    fill: `url(#${uid}-light-${index})`,
                    stroke: `url(#${uid}-light-${index})`,
                },
                glowWrapper,
            );

            let coordinateIndex = 0;
            const tokens = (line.d.match(/[MLCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map((token) =>
                /^[MLCZ]$/.test(token)
                    ? token
                    : { value: Number(token), x: coordinateIndex++ % 2 === 0 },
            );

            return {
                basePath,
                brightPath,
                glowPath,
                gradient,
                light,
                group,
                glowWrapper,
                tokens,
                line,
                index,
            };
        });

        layout();
        paint();
    }

    function layout() {
        // Approved export has a hard profile switch at 463px. No interpolation.
        profile = config.profiles[root.clientWidth <= config.breakpoint ? "mobile" : "desktop"];
        const p = profile;

        setStyles(stage, {
            height: `${p.height}px`,
        });

        setStyles(pattern, {
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.width}%`,
            transform: `rotate(${p.rotation}deg) scale(${p.flipX ? -1 : 1}, ${p.scaleY / 100})`,
            transformOrigin: "center",
            opacity: p.opacity / 100,
        });

        setGradientStops(maskGradient, [
            { offset: 0, color: "#ffffff", opacity: p.fadeLeft > 0 ? 0 : 1 },
            { offset: p.fadeLeft, color: "#ffffff", opacity: 1 },
            { offset: Math.max(p.fadeLeft, p.fadeStart), color: "#ffffff", opacity: 1 },
            {
                offset: Math.max(p.fadeStart, p.fadeEnd),
                color: "#ffffff",
                opacity: p.fadeEnd >= 100 && p.fadeStart === 100 ? 1 : 0,
            },
        ]);

        blur.setAttribute("stdDeviation", config.animation.glow);
    }

    const eased = (value) =>
        config.animation.easing === "smooth" ? value * value * (3 - 2 * value) : value;

    function paint() {
        if (!profile) return;

        const animation = config.animation;
        const p = profile;
        const calm = prefersReducedMotion();
        const wave = !calm && (animation.mode === "wave" || animation.mode === "combined");
        const lightActive = !calm && (animation.mode === "light" || animation.mode === "combined");
        const pulse =
            !calm && animation.pulse > 0
                ? 1 -
                  (animation.pulse / 100) *
                      (0.5 + 0.5 * Math.cos((time * 2 * Math.PI) / animation.pulsePeriod))
                : 1;
        const reveal =
            calm || animation.entrance === "none"
                ? 1
                : Math.max(
                      0,
                      Math.min(
                          1,
                          (time - animation.entranceDelay) / animation.entranceDuration,
                      ),
                  );

        pattern.style.opacity =
            (p.opacity / 100) * pulse * (animation.entrance === "fade" ? eased(reveal) : 1);
        pattern.style.clipPath =
            animation.entrance === "reveal" && !calm
                ? `inset(0 ${100 - eased(reveal) * 100}% 0 0)`
                : "none";

        nodes.forEach((node) => {
            const line = node.line;
            let d = line.d;

            if (wave && line.wave > 0) {
                let x = 0;
                const localTime = Math.max(0, time - line.delay) * line.speed;
                d = node.tokens
                    .map((token) => {
                        if (typeof token === "string") return token;
                        if (token.x) {
                            x = token.value;
                            return x;
                        }

                        const u = Math.max(0, Math.min(1, x / 1008));
                        const basePhase =
                            u * Math.PI * 2 * animation.cycles +
                            node.index * animation.phaseStep +
                            (line.phase * Math.PI) / 180;
                        const phase =
                            basePhase -
                            (localTime * 2 * Math.PI * animation.direction) / animation.period;
                        const delta =
                            animation.amplitude *
                            (line.wave / 100) *
                            (p.motion / 100) *
                            Math.sin(Math.PI * u) *
                            0.5 *
                            (Math.sin(phase) - Math.sin(basePhase));
                        return (token.value + delta).toFixed(3);
                    })
                    .join(" ");
            }

            [node.basePath, node.brightPath, node.glowPath].forEach((path) =>
                path.setAttribute("d", d),
            );

            const total = animation.lightPeriod + animation.lightPause;
            const localTime = Math.max(0, time - line.delay) * line.speed;
            const progress = (localTime % total) / animation.lightPeriod;
            const active = lightActive && line.light > 0 && progress <= 1 && time >= line.delay;
            const center =
                -animation.lightWidth +
                (animation.lightDirection === 1
                    ? eased(Math.min(1, progress))
                    : 1 - eased(Math.min(1, progress))) *
                    (1008 + 2 * animation.lightWidth);

            node.light.setAttribute("x1", center - animation.lightWidth / 2);
            node.light.setAttribute("x2", center + animation.lightWidth / 2);

            const intensity =
                (animation.lightIntensity / 100) *
                (line.light / 100) *
                (p.light / 100);
            node.brightPath.setAttribute("opacity", active ? intensity : 0);
            node.glowPath.setAttribute("opacity", active ? intensity * 0.7 : 0);
            node.glowWrapper.style.display = line.visible && animation.glow > 0 ? "" : "none";
            node.group.setAttribute("opacity", line.opacity / 100);
            node.glowWrapper.setAttribute("opacity", line.opacity / 100);
        });
    }

    function isAnimating() {
        return (
            !document.hidden &&
            visible &&
            !prefersReducedMotion() &&
            (config.animation.mode !== "static" ||
                config.animation.pulse > 0 ||
                (config.animation.entrance !== "none" &&
                    time < config.animation.entranceDelay + config.animation.entranceDuration))
        );
    }

    function tick(now) {
        frame = 0;
        if (!isAnimating()) return;
        if (last) {
            time +=
                Math.min((now - last) / 1000, 0.1) *
                config.animation.speed *
                profile.motionSpeed;
        }
        last = now;
        if (now - painted >= 1000 / config.animation.fps) {
            paint();
            painted = now;
        }
        frame = requestAnimationFrame(tick);
    }

    function sync() {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        paint();
        if (isAnimating()) frame = requestAnimationFrame(tick);
    }

    const resizeObserver = new ResizeObserver(() => {
        layout();
        paint();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        sync();
    });
    intersectionObserver.observe(root);

    const syncVisibility = () => sync();
    document.addEventListener("visibilitychange", syncVisibility);
    if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", syncVisibility);
    } else {
        reducedMotion.addListener?.(syncVisibility);
    }

    build();
    sync();

    return {
        destroy() {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            document.removeEventListener("visibilitychange", syncVisibility);
            if (typeof reducedMotion.removeEventListener === "function") {
                reducedMotion.removeEventListener("change", syncVisibility);
            } else {
                reducedMotion.removeListener?.(syncVisibility);
            }
            root.replaceChildren();
        },
    };
}

function createPatternLayer(kind) {
    const root = document.createElement("div");
    root.className = `site-pattern-layer site-pattern-layer--${kind}`;
    root.dataset.sitePattern = kind;
    root.setAttribute("aria-hidden", "true");
    return root;
}

export function initSitePatterns() {
    const page = document.body.dataset.page;

    // Home has its own image-led hero and intentionally does not use the shared
    // header pattern. Every internal page mounts the approved pattern once.
    if (page !== "home") {
        const header = document.querySelector(".site-header");
        const headerHost = header?.parentElement;
        if (headerHost && !headerHost.querySelector(":scope > [data-site-pattern='header']")) {
            headerHost.classList.add("site-pattern-host");
            const layer = createPatternLayer("header");
            headerHost.prepend(layer);
            mountPattern(layer, cloneConfig());
        }
    }

    const footer = document.querySelector(".site-footer");
    if (footer && !footer.querySelector(":scope > [data-site-pattern='footer']")) {
        footer.classList.add("site-pattern-host");
        const layer = createPatternLayer("footer");
        footer.prepend(layer);
        mountPattern(layer, cloneConfig());
    }
}
