// include.js
document.addEventListener("DOMContentLoaded", () => {
    const includeTargets = document.querySelectorAll("[data-include]");

    if (!includeTargets.length) return;

    let pending = includeTargets.length;

    includeTargets.forEach(async el => {
        const url = el.getAttribute("data-include");

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("No se pudo cargar " + url);

            const html = await response.text();
            el.innerHTML = html;

        } catch (err) {
            console.error("Error cargando componente:", err);
        }

        pending--;

        // Cuando terminan TODOS los includes, disparamos el evento
        if (pending === 0) {
            document.dispatchEvent(new Event("chatbot-ready"));
        }
    });
});
