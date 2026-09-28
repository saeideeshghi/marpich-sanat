/* Shared navigation below 1180px. Locks background with inert, traps focus,
 * closes on navigation/Escape/desktop resize and restores the prior inert state.
 * Keep the menu directly under body so its own ancestors are never made inert.
 */
const DESKTOP_QUERY = "(min-width: 1180px)";

export function initMobileMenu() {
    const menu = document.querySelector("[data-mobile-menu]");
    const trigger = document.querySelector("[data-menu-open]");
    if (!menu || !trigger || menu.dataset.initialized) return;
    menu.dataset.initialized = "true";

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const background = new Map();
    let previousFocus;
    let isOpen = false;

    const focusable = () =>
        [
            ...menu.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
            ),
        ].filter((element) => element.getClientRects().length > 0);

    function closeMenu({ restoreFocus = true } = {}) {
        if (!isOpen) return;
        isOpen = false;
        menu.classList.add("hidden");
        menu.setAttribute("aria-hidden", "true");
        trigger.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");
        background.forEach((wasInert, element) => {
            element.inert = wasInert;
        });
        background.clear();
        if (restoreFocus) previousFocus?.focus({ preventScroll: true });
    }

    function openMenu() {
        if (isOpen || desktop.matches) return;
        isOpen = true;
        previousFocus = document.activeElement;
        menu.classList.remove("hidden");
        menu.setAttribute("aria-hidden", "false");
        trigger.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("menu-open");
        document.body.classList.add("menu-open");
        for (const element of document.body.children) {
            if (element === menu || ["SCRIPT", "STYLE", "LINK"].includes(element.tagName)) continue;
            background.set(element, element.inert);
            element.inert = true;
        }
        (menu.querySelector("button[data-menu-close]") || menu).focus();
    }

    trigger.addEventListener("click", openMenu);
    menu.addEventListener("click", (event) => {
        if (event.target.closest("[data-auth-open]")) closeMenu();
        else if (event.target.closest("[data-menu-close], a[href]")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (!isOpen) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
        } else if (event.key === "Tab") {
            const items = focusable();
            const first = items[0];
            const last = items.at(-1);
            if (!first) {
                event.preventDefault();
                menu.focus();
                return;
            }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === menu)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === menu)) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    desktop.addEventListener("change", (event) => {
        if (event.matches) closeMenu({ restoreFocus: false });
    });
    // Restore the closed state when a browser restores a page from its back/forward cache.
    window.addEventListener("pagehide", () => closeMenu({ restoreFocus: false }));
}
