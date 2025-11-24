// ===== Menú lateral (btn-menu-toggle / sidebar-nav) =====
(function () {
  var btnMenu = document.getElementById('btn-menu-toggle');
  var sidebar = document.getElementById('sidebar-nav');
  var overlay = document.getElementById('overlay');

  if (!btnMenu || !sidebar || !overlay) return;

  function openMenu() {
    sidebar.classList.remove('closed');
    overlay.classList.add('visible');
    btnMenu.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    sidebar.classList.add('closed');
    overlay.classList.remove('visible');
    btnMenu.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function toggleMenu() {
    if (sidebar.classList.contains('closed')) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  btnMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) {
      // En escritorio el sidebar queda siempre abierto
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      sidebar.classList.remove('closed');
      btnMenu.setAttribute('aria-expanded', 'false');
    } else {
      // En móvil vuelve a modo cerrado
      sidebar.classList.add('closed');
    }
  });
})();

// ===== Anillo de progreso (data-progress en .progress-ring) =====
(function () {
  var rings = document.querySelectorAll('.progress-ring');

  rings.forEach(function (ring) {
    var value = parseInt(ring.getAttribute('data-progress'), 10);
    if (isNaN(value)) return;

    if (value < 0) value = 0;
    if (value > 100) value = 100;

    var degrees = value * 3.6;
    ring.style.backgroundImage =
      'conic-gradient(#05af43 0 ' +
      degrees +
      'deg, #e2e8f0 ' +
      degrees +
      'deg 360deg)';
  });
})();

