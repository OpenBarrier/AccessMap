document.addEventListener('DOMContentLoaded', () => {

   console.log("✅ Main script cargado y DOM listo");

   // IDs reales de tu HTML
   const btnMenu = document.getElementById('btn-menu-toggle'); 
   const sidebar = document.getElementById('sidebar'); 
   const sidebarLinks = document.querySelectorAll('.sidebar__link');

   // Activar menú solo si la página tiene botón y sidebar
   if (btnMenu && sidebar) {
      console.log("🔹 Sidebar móvil habilitado.");

      btnMenu.addEventListener('click', (e) => {
         e.stopPropagation();
         sidebar.classList.toggle('is-open');
         console.log("🍔 Menú alternado");
      });

      document.addEventListener('click', (e) => {
         if (sidebar.classList.contains('is-open') &&
             !sidebar.contains(e.target) &&
             e.target !== btnMenu) {
            sidebar.classList.remove('is-open');
         }
      });

   } else {
      // No mostrar warning porque hay páginas como community.html sin toggle
      return;
   }

   // Activar estados de los links del sidebar (opcional)
   sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
         const href = link.getAttribute('href');
         if (href === '#' || href.startsWith('#')) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('sidebar__link--active'));
            link.classList.add('sidebar__link--active');
            sidebar.classList.remove('is-open');
         }
      });
   });

});
