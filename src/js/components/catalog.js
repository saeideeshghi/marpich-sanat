/* Catalog UI only: grid/list, filter chips and cancelable integration events.
 * catalog:search detail is a flat map of named form fields; its listener must
 * call preventDefault() synchronously to suppress the disconnected fallback.
 * Changing a select/chip does not request results. Pagination is not implemented.
 */

function closeCatalogDropdowns(except = null) {
    document.querySelectorAll("[data-catalog-dropdown].is-open").forEach((dropdown) => {
        if (dropdown === except) return;
        dropdown.classList.remove("is-open");
        dropdown.querySelector("[data-catalog-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
    });
}

function enhanceCatalogSelect(select, index) {
    if (select.dataset.customized === "true") return;
    select.dataset.customized = "true";
    select.classList.add("product-search__select--native");

    const dropdown = document.createElement("div");
    dropdown.className = `product-search__dropdown product-search__dropdown--${index + 1}`;
    dropdown.dataset.catalogDropdown = "";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "product-search__dropdown-toggle";
    toggle.dataset.catalogDropdownToggle = "";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-haspopup", "listbox");

    const label = document.createElement("span");
    label.className = "product-search__dropdown-label";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-chevron-down";
    icon.setAttribute("aria-hidden", "true");
    toggle.append(label, icon);

    const panel = document.createElement("div");
    panel.className = "product-search__dropdown-panel";
    panel.setAttribute("role", "listbox");

    [...select.options].forEach((option) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "product-search__dropdown-option";
        item.dataset.value = option.value;
        item.setAttribute("role", "option");
        item.textContent = option.textContent.trim();
        item.addEventListener("click", () => {
            select.value = option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            closeCatalogDropdowns();
        });
        panel.append(item);
    });

    const sync = () => {
        const selected = select.selectedOptions[0] || select.options[0];
        label.textContent = selected?.textContent.trim() || "انتخاب کنید";
        panel.querySelectorAll("[data-value]").forEach((item) => {
            const active = item.dataset.value === select.value;
            item.classList.toggle("is-selected", active);
            item.setAttribute("aria-selected", String(active));
        });
    };

    toggle.addEventListener("click", () => {
        const open = !dropdown.classList.contains("is-open");
        closeCatalogDropdowns(dropdown);
        dropdown.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
    });

    select.addEventListener("change", sync);
    select.insertAdjacentElement("afterend", dropdown);
    dropdown.append(toggle, panel);
    sync();
}

let catalogDropdownGlobalEventsBound = false;
function bindCatalogDropdownGlobalEvents() {
    if (catalogDropdownGlobalEventsBound) return;
    catalogDropdownGlobalEventsBound = true;
    document.addEventListener("click", (event) => {
        if (!event.target.closest("[data-catalog-dropdown]")) closeCatalogDropdowns();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeCatalogDropdowns();
    });
}

export function initCatalogs(scope = document) {
    bindCatalogDropdownGlobalEvents();
    scope
        .querySelectorAll(
            "[data-products-page], [data-air-handling-page], [data-industries-page], [data-page='projects']",
        )
        .forEach((page) => {
            if (page.dataset.catalogInitialized) return;
            page.dataset.catalogInitialized = "true";
            const grid = page.querySelector("[data-product-grid], [data-industry-grid], [data-projects-grid]");
            const buttons = [...page.querySelectorAll("[data-view], [data-project-view]")];
            buttons.forEach((button) =>
                button.addEventListener("click", () => {
                    const view = button.dataset.view || button.dataset.projectView;
                    if (!grid || !["list", "grid"].includes(view)) return;
                    grid.classList.toggle("is-list", view === "list");
                    // The products page uses its established class for list layout.
                    if (page.matches("[data-products-page]")) {
                        grid.classList.toggle("products-grid--list", view === "list");
                    }
                    buttons.forEach((other) => {
                        const active = (other.dataset.view || other.dataset.projectView) === view;
                        other.classList.toggle("is-active", active);
                        other.setAttribute("aria-pressed", String(active));
                    });
                }),
            );
            page.querySelectorAll("[data-product-search]").forEach((form) => {
                [...form.querySelectorAll("select.product-search__select")].forEach((select, index) =>
                    enhanceCatalogSelect(select, index),
                );
                const chips = form.querySelector("[data-active-filters]");
                const status = form.querySelector("[data-search-status]");
                const announce = (message) => {
                    if (status) {
                        status.hidden = false;
                        status.textContent = message;
                    }
                };
                form.addEventListener("submit", (event) => {
                    event.preventDefault();
                    // Frontend contract for the future CMS. No pretend search results.
                    const request = new CustomEvent("catalog:search", {
                        bubbles: true,
                        cancelable: true,
                        detail: Object.fromEntries(new FormData(form)),
                    });
                    if (form.dispatchEvent(request))
                        announce(
                            "جستجوی آنلاین پس از اتصال به سامانه فعال می‌شود؛ می‌توانید دسته‌بندی‌ها را مرور کنید.",
                        );
                });
                form.querySelector("[data-search-advanced]")?.addEventListener("click", () => {
                    const request = new CustomEvent("catalog:advanced", { bubbles: true, cancelable: true });
                    if (form.dispatchEvent(request))
                        announce("فیلترهای موجود در همین بخش قابل انتخاب‌اند؛ گزینه‌های تکمیلی هنوز فعال نیستند.");
                });
                form.querySelectorAll("select").forEach((select) =>
                    select.addEventListener("change", () => {
                        if (!chips) return;
                        [...chips.children]
                            .filter((chip) => chip.dataset.filterName === select.name)
                            .forEach((chip) => chip.remove());
                        if (!select.value) return;
                        const label = select.selectedOptions[0].textContent.trim();
                        // Replace matching initial display chips instead of duplicating them.
                        [...chips.children]
                            .filter((chip) => chip.querySelector("span")?.textContent.trim() === label)
                            .forEach((chip) => chip.remove());
                        const chip = document.createElement("span");
                        chip.className = "filter-chip";
                        chip.dataset.filterChip = "";
                        chip.dataset.filterName = select.name;
                        const text = document.createElement("span");
                        text.textContent = label;
                        const remove = document.createElement("button");
                        remove.type = "button";
                        remove.dataset.removeFilter = "";
                        remove.textContent = "×";
                        remove.setAttribute("aria-label", `حذف فیلتر ${label}`);
                        chip.append(text, remove);
                        chips.append(chip);
                    }),
                );
                chips?.addEventListener("click", (event) => {
                    const chip = event.target.closest("[data-remove-filter]")?.closest("[data-filter-chip]");
                    if (!chip) return;
                    const select = [...form.querySelectorAll("select")].find((s) => s.name === chip.dataset.filterName);
                    if (select) select.value = "";
                    chip.remove();
                });
                form.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
                    form.reset();
                    chips?.replaceChildren();
                    form.querySelectorAll("select").forEach((select) =>
                        select.dispatchEvent(new Event("change", { bubbles: true })),
                    );
                    if (status) status.hidden = true;
                });
            });
        });
}
