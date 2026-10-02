import { initMobileMenu } from "./components/menu.js";
import { initAuth } from "./components/auth.js";
import { initPendingForms } from "./components/pending-forms.js";
import { initAccordions } from "./components/accordion.js";
import { initTestimonials } from "./components/testimonials.js";
import { initCatalogs } from "./components/catalog.js";
import { initConsultationForms } from "./components/consultation.js";
import { initSitePatterns } from "./components/site-pattern.js";

// Shared behavior only. Never import a page module here.
export function initSite() {
    // Mount decoration independently before interactive enhancements initialize.
    initSitePatterns();
    initMobileMenu();
    initAuth();
    initPendingForms();
    initAccordions();
    initTestimonials();
    initCatalogs();
    initConsultationForms();
}
