import "../../css/main.css";
import "../../css/pages/about.css";
import "../../css/layout-checks.css";
import { initSite } from "../main.js";

initSite();

// Measure the document offset, not the scrolled viewport offset, to avoid resizing
// the photograph while scrolling. Recalculate after font loading and viewport changes.
const teamImage = document.querySelector(".about-team-media__image");
const hero = document.querySelector(".about-hero-shell");
if (teamImage && hero) {
    const fitTeamImage = () => {
        const top = teamImage.getBoundingClientRect().top + window.scrollY;
        const available = document.documentElement.clientHeight - top - 20;
        // Very short landscape screens must scroll rather than make the photo illegible.
        teamImage.style.setProperty("--about-image-space", `${Math.max(160, available)}px`);
    };
    new ResizeObserver(fitTeamImage).observe(hero);
    window.addEventListener("resize", fitTeamImage, { passive: true });
    document.fonts.ready.then(fitTeamImage);
    fitTeamImage();
}
