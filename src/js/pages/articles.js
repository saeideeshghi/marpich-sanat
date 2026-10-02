import "../../css/main.css";
import "../../css/pages/articles.css";
import "../../css/layout-checks.css";
import "../../css/components/catalog.css";
import { initSite } from "../main.js";

initSite();

function initArticlesPage() {
    const page = document.querySelector("[data-articles-page]");
    if (!page) return;

    const form = page.querySelector("[data-articles-search]");
    const query = page.querySelector("[data-articles-query]");
    const cards = [...page.querySelectorAll("[data-article-card]")];
    const filters = [...page.querySelectorAll("[data-article-filter]")];
    const empty = page.querySelector("[data-articles-empty]");
    const status = page.querySelector("[data-articles-search-status]");
    const grid = page.querySelector("[data-article-grid]");
    const viewButtons = [...page.querySelectorAll("[data-article-view]")];
    const loadMore = page.querySelector("[data-articles-load-more]");
    const loadStatus = page.querySelector("[data-articles-load-status]");
    const allArticles = page.querySelector("[data-articles-more-filters]");
    let category = "all";

    const normalize = (value) => String(value || "").trim().toLocaleLowerCase("fa");

    // The handoff ships all current article cards in HTML. Never leave stale hidden
    // attributes from a previous filter/render state on initial load.
    cards.forEach((card) => card.removeAttribute("hidden"));

    const applyFilters = () => {
        const needle = normalize(query?.value);
        let visible = 0;

        cards.forEach((card) => {
            const categories = (card.dataset.category || "").split(/\s+/);
            const categoryMatch = category === "all" || categories.includes(category);
            const text = normalize(`${card.dataset.search || ""} ${card.textContent}`);
            const queryMatch = !needle || text.includes(needle);
            const show = categoryMatch && queryMatch;
            card.hidden = !show;
            if (show) visible += 1;
        });

        if (empty) empty.hidden = visible !== 0;
        if (status) status.textContent = `${visible} مقاله نمایش داده می‌شود.`;
    };

    filters.forEach((button) => {
        button.addEventListener("click", () => {
            category = button.dataset.articleFilter || "all";
            filters.forEach((other) => other.classList.toggle("is-active", other === button));
            applyFilters();
        });
    });

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        applyFilters();
    });

    query?.addEventListener("input", () => {
        if (!query.value.trim()) applyFilters();
    });

    allArticles?.addEventListener("click", () => {
        category = "all";
        if (query) query.value = "";
        filters.forEach((button) =>
            button.classList.toggle("is-active", button.dataset.articleFilter === "all"),
        );
        applyFilters();
    });

    viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const view = button.dataset.articleView;
            grid?.classList.toggle("is-list", view === "list");
            viewButtons.forEach((other) => {
                const active = other === button;
                other.classList.toggle("is-active", active);
                other.setAttribute("aria-pressed", String(active));
            });
        });
    });

    page.querySelectorAll(".article-card__media img").forEach((image) => {
        const fallback = () => {
            image.hidden = true;
            image.closest(".article-card__media")?.classList.add("is-image-fallback");
        };
        image.addEventListener("error", fallback, { once: true });
        if (image.complete && image.naturalWidth === 0) fallback();
    });

    applyFilters();

    loadMore?.addEventListener("click", () => {
        if (loadStatus) {
            loadStatus.hidden = false;
            loadStatus.textContent = "ادامه فهرست پس از اتصال مقالات به CMS از همین نقطه بارگذاری می‌شود.";
        }
    });
}

initArticlesPage();

// Keep the dark header and pattern behind all wrapped heading text, including
// narrow screens and the final loaded font. Measuring both rects cancels scroll.
const articleHero = document.querySelector(".articles-hero");
const articleHeading = articleHero?.querySelector(".articles-hero__heading");
if (articleHero && articleHeading) {
    const fitArticleBackdrop = () => {
        const bottom = articleHeading.getBoundingClientRect().bottom - articleHero.getBoundingClientRect().top;
        articleHero.style.setProperty("--articles-heading-bottom", `${Math.ceil(bottom + 32)}px`);
    };
    new ResizeObserver(fitArticleBackdrop).observe(articleHeading);
    document.fonts.ready.then(fitArticleBackdrop);
    fitArticleBackdrop();
}
