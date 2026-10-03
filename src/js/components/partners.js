/** Continuous customer strip; no scroll container or control toolbar.
 * The second group is only a visual loop and is hidden from assistive technology.
 */
export function initPartners() {
    document.querySelectorAll('[data-partners]').forEach((root) => {
        if (root.dataset.initialized) return;
        root.dataset.initialized = 'true';
        const viewport = root.querySelector('[data-partner-viewport]');
        const track = root.querySelector('[data-partner-track]');
        const group = root.querySelector('[data-partner-group]');
        const items = [...group.children];
        let visible = false;
        function measure() {
            const width = window.innerWidth;
            const count = width < 640 ? 2 : width < 1180 ? 3 : width < 1600 ? 5 : 6;
            const gap = width < 640 ? 12 : 20;
            const itemWidth = Math.max(90, (viewport.clientWidth - (count - 1) * gap) / count);
            root.style.setProperty('--logo-width', `${itemWidth}px`);
            root.style.setProperty('--logo-gap', `${gap}px`);
            root.style.setProperty('--marquee-time', `${Math.max(24, items.length * (itemWidth + gap) / 26)}s`);
            root.classList.toggle('home-partners--static', items.length <= count);
        }
        const sync = () => track.style.animationPlayState = visible && !document.hidden ? 'running' : 'paused';
        new ResizeObserver(measure).observe(viewport);
        new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(root);
        document.addEventListener('visibilitychange', sync);
        measure();
    });
}
