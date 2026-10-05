// The approved stylesheet is a separate link, so the editor can replace it with
// a draft without leaking old approved declarations into its preview.
export function initTemplateStyles() {
    if (import.meta.hot) {
        import.meta.hot.on("marpich:template-saved", async ({ revision }) => {
            const link = document.getElementById("mps-template-overrides");
            if (!link) return;
            const url = new URL(link.href);
            url.searchParams.set("v", revision);
            link.href = url.href;
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}assets/customizer/settings.json`, {
                    cache: "no-store",
                });
                const config = await response.json();
                if (config.patterns)
                    window.dispatchEvent(new CustomEvent("site:pattern-preview", { detail: config.patterns }));
            } catch {
                /* A later page load uses the saved source artwork. */
            }
        });
    }
}
