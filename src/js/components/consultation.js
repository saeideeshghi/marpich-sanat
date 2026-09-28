// The established design has separate desktop and mobile forms. Synchronize
// matching fields so a resize never drops a partially entered request.
export function initConsultationForms(scope = document) {
    scope.querySelectorAll("[data-consultation]").forEach((section) => {
        if (section.dataset.formSyncInitialized) return;
        section.dataset.formSyncInitialized = "true";
        for (const form of section.querySelectorAll("form")) {
            for (const eventName of ["input", "change"]) {
                form.addEventListener(eventName, (event) => {
                    const input = event.target;
                    if (!input.name) return;
                    section.querySelectorAll("form").forEach((other) => {
                        if (other === form) return;
                        const target = [...other.elements].find((field) => field.name === input.name);
                        if (target) target.value = input.value;
                    });
                });
            }
        }
    });
}
