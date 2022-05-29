initializeTooltips();
initializeToast();

function initializeTooltips(baseElement) {
    const target = baseElement || document;
    const tooltipTriggerList = target.querySelectorAll('[data-bs-toggle="tooltip"]')
    const _ =[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

function initializeToast() {
    const toastElement = document.getElementById("toast");
    const toastHeader = document.getElementById("toast-header");
    const toastBody = document.getElementById("toast-message");

    const toast = new bootstrap.Toast(toastElement, { delay: 10000 });

    htmx.on("showMessage", (e) => {
        toastHeader.innerText = "🟢 Success";
        toastBody.innerText = e.detail.value;
        toast.show();
    });

    htmx.on("showError", (e) => {
        toastHeader.innerText = "🔴 Error";
        toastHeader.classList.add("text-danger");
        toastBody.innerText = e.detail.value;
        toast.show();
    });
}
