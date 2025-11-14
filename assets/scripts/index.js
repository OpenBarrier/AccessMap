document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const navLinks = document.querySelectorAll(".sidebar-nav a");

  function openSidebar() {
    sidebar.classList.remove("closed");
    sidebar.classList.add("open");
    overlay.classList.add("active");
    overlay.removeAttribute("aria-hidden");
    btnToggle.classList.add("open");
    btnToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebar.classList.add("closed");
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    btnToggle.classList.remove("open");
    btnToggle.setAttribute("aria-expanded", "false");
  }

  btnToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) closeSidebar();
    else openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);
  navLinks.forEach((l) => l.addEventListener("click", closeSidebar));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open"))
      closeSidebar();
  });

  closeSidebar();
});
