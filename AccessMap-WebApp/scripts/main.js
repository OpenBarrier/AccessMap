// assets/scripts/main.js

// Esperamos a que todo el HTML esté listo antes de ejecutar nada
document.addEventListener('DOMContentLoaded', () => {

   console.log("✅ Main script cargado y DOM listo");

   const btnMenu = document.getElementById('btn-menu-toggle');
   const sidebar = document.getElementById('sidebar-nav');
   const sidebarLinks = document.querySelectorAll('.sidebar__link');

   // Verificación de seguridad
   if (btnMenu && sidebar) {
      console.log("🔹 Elementos del menú encontrados. Activando listeners...");

      // 1. Abrir/Cerrar Sidebar
      btnMenu.addEventListener('click', (e) => {
         e.stopPropagation();
         sidebar.classList.toggle('is-open');
         console.log("🍔 Menú alternado");
      });

      // 2. Cerrar al hacer clic fuera
      document.addEventListener('click', (e) => {
         if (sidebar.classList.contains('is-open') &&
            !sidebar.contains(e.target) &&
            e.target !== btnMenu) {
            sidebar.classList.remove('is-open');
         }
      });
   } else {
      console.warn("⚠️ Advertencia: No se encontró el botón o el sidebar en este HTML.");
   }

   // 3. Navegación SPA (Links activos)
   sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
         const href = link.getAttribute('href');
         if (href === '#' || href.startsWith('#')) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('sidebar__link--active'));
            link.classList.add('sidebar__link--active');

            // Cerrar menú en móvil al seleccionar
            if (sidebar && sidebar.classList.contains('is-open')) {
               sidebar.classList.remove('is-open');
            }
         }
      });
   });

});