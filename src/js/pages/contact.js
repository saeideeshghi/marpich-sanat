/* RFQ enhancement: local file validation/drop and cancelable rfq:submit event.
 * No upload/API is performed by this module. attachment is optional, max 20 MiB;
 * server validation/storage/confirmation remain the backend adapter responsibility.
 */
import "../../css/main.css";
import "../../css/pages/contact.css";
import { initSite } from "../main.js";

function initFileUpload() {
    const input = document.querySelector("[data-file-input]");
    const label = document.querySelector("[data-file-label]");
    const dropZone = document.querySelector("[data-drop-zone]");

    if (!input || !label || !dropZone) {
        return;
    }

    const maxFileSize = 20 * 1024 * 1024;

    const allowedExtensions = ["pdf", "dwg", "doc", "docx"];
    const defaultLabel = label.textContent;

    const showFile = (file) => {
        if (!file) {
            label.textContent = defaultLabel;
            return;
        }

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!extension || !allowedExtensions.includes(extension)) {
            label.textContent = "فرمت فایل مجاز نیست";
            input.value = "";

            return;
        }

        if (file.size > maxFileSize) {
            label.textContent = "حجم فایل بیشتر از ۲۰ مگابایت است";

            input.value = "";

            return;
        }

        label.textContent = file.name;
    };

    input.addEventListener("change", () => {
        showFile(input.files?.[0]);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();

            dropZone.classList.add("is-dragging");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();

            dropZone.classList.remove("is-dragging");
        });
    });

    dropZone.addEventListener("drop", (event) => {
        const file = event.dataTransfer?.files?.[0];

        if (!file) {
            return;
        }

        const transfer = new DataTransfer();

        transfer.items.add(file);

        input.files = transfer.files;

        showFile(file);
    });
}

function initContactForm() {
    const form = document.querySelector("[data-rfq-form]");

    const status = document.querySelector("[data-form-status]");

    if (!form || !status) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();

            return;
        }

        // The attachment input has a name so it participates in FormData.
        // Backend must revalidate type/size; browser checks are only UX.
        const request = new CustomEvent("rfq:submit", {
            bubbles: true,
            cancelable: true,
            detail: { form, formData: new FormData(form) },
        });
        if (!form.dispatchEvent(request)) return;

        status.textContent = "این فرم هنوز به سامانهٔ ارسال متصل نیست؛ لطفاً از راه‌های تماس با ما استفاده کنید.";

        status.classList.remove("hidden");
    });
}

initSite();
initFileUpload();
initContactForm();
