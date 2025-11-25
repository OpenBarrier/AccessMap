// Selección de elementos
const tabs = document.querySelectorAll(".tab-item");
const tabSections = document.querySelectorAll(".tab-section"); // Cambié a tab-section

// Evento para cambiar entre pestañas
tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();

        // Quitar clase activa a todas las tabs
        tabs.forEach(t => t.classList.remove("tab-item--active"));

        // Agregar clase activa a la tab clickeada
        tab.classList.add("tab-item--active");

        // Ocultar todas las vistas
        tabSections.forEach(section => section.classList.remove("active"));

        // Mostrar la vista correspondiente
        const selected = tab.dataset.tab; // "ranking" o "grupos"
        const view = document.getElementById(selected + "-view");
        if(view) {
            view.classList.add("active");
        }
    });
});

