// ==========================================================
//   IMPORTAR SISTEMA DE IDIOMAS
// ==========================================================
import { LanguageManager } from "./languageManager.js";

document.addEventListener("DOMContentLoaded", () => {

  // Iniciar sistema de idiomas
  LanguageManager.init();

  // ==========================================================
  //   ESTADO SIMULADO DE USUARIO
  // ==========================================================
  const userProfile = {
    name: "Maria Gracia",
    email: "maria-gracia@gmail.com"
  };

  let userReports = [
    {
      id: 1,
      title: "Rampa bloqueada en Av. Primavera",
      date: "2025-10-12",
      location: "Santiago de Surco",
      status: "Activo"
    },
    {
      id: 2,
      title: "Vereda rota cerca de UPC",
      date: "2025-11-01",
      location: "Monterrico",
      status: "Resuelto"
    }
  ];

  // ==========================================================
  //   INSIGNIAS
  // ==========================================================
  const badges = [
    { id: "b1", icon: "🌱", name: "Primer aporte", desc: "Crea tu primer reporte accesible", unlocked: true },
    { id: "b2", icon: "🗺️", name: "Explorador", desc: "Reporta en 5 distritos diferentes", unlocked: false },
    { id: "b3", icon: "⭐", name: "Colaborador constante", desc: "Envía 20 reportes verificados", unlocked: false }
  ];

  // ==========================================================
  //   NAVEGACIÓN ENTRE VISTAS
  // ==========================================================
  const views = document.querySelectorAll(".view");

  function openView(id) {
    views.forEach(v => v.classList.remove("view--active"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("view--active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  window.openView = openView;

  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("[data-view-target]");
    if (target) {
      e.preventDefault();
      openView(target.getAttribute("data-view-target"));
    }
  });

  // ==========================================================
  //   PERFIL PRINCIPAL
  // ==========================================================
  function renderProfileHeader() {
    document.getElementById("profileName").textContent = userProfile.name;
    document.getElementById("profileEmail").textContent = userProfile.email;
  }

  // ==========================================================
  //   EDITAR PERFIL
  // ==========================================================
  const editForm = document.getElementById("editProfileForm");
  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const passwordErrorEl = document.getElementById("passwordError");
  const profileSuccessMsgEl = document.getElementById("profileSuccessMsg");

  function initEditProfileForm() {
    editNameInput.value = userProfile.name;
    editEmailInput.value = userProfile.email;

    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    passwordErrorEl.textContent = "";
    profileSuccessMsgEl.textContent = "";

    validateProfileForm();
  }

  function validateProfileForm() {
    const name = editNameInput.value.trim();
    const email = editEmailInput.value.trim();

    const oldPass = oldPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    let error = "";
    let canSave = true;

    if (!name || !email.includes("@")) canSave = false;

    const wantsPasswordChange =
      oldPass.length > 0 || newPass.length > 0 || confirmPass.length > 0;

    if (wantsPasswordChange) {
      if (!oldPass || !newPass || !confirmPass) {
        canSave = false;
        error = "Completa todos los campos de contraseña.";
      } else if (newPass !== confirmPass) {
        canSave = false;
        error = "Las contraseñas no coinciden.";
      }
    }

    passwordErrorEl.textContent = error;
    saveProfileBtn.disabled = !canSave;
  }

  if (editForm) {
    [editNameInput, editEmailInput, oldPasswordInput, newPasswordInput, confirmPasswordInput]
      .forEach(input => input.addEventListener("input", validateProfileForm));

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (saveProfileBtn.disabled) return;

      userProfile.name = editNameInput.value.trim();
      profileSuccessMsgEl.textContent = "Perfil actualizado";
      renderProfileHeader();

      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";
      validateProfileForm();
    });
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-edit-profile']")) {
      initEditProfileForm();
    }
  });

  // ==========================================================
  //   MIS CONTRIBUCIONES
  // ==========================================================
  const contributionsListEl = document.getElementById("contributionsList");
  const contributionsEmptyEl = document.getElementById("contributionsEmpty");

  function renderContributions() {
    contributionsListEl.innerHTML = "";

    if (!userReports.length) {
      contributionsListEl.style.display = "none";
      contributionsEmptyEl.style.display = "block";
      return;
    }

    contributionsEmptyEl.style.display = "none";
    contributionsListEl.style.display = "flex";

    userReports.forEach(report => {
      const item = document.createElement("article");
      item.className = "contribution-item";
      item.innerHTML = `
        <div class="contribution-header">
          <span class="contribution-title">${report.title}</span>
          <span class="tag ${report.status === "Activo" ? "tag-ambar" : "tag-verde"}">${report.status}</span>
        </div>
        <div class="contribution-meta">
          <span>${report.date}</span> • <span>${report.location}</span>
        </div>
      `;
      contributionsListEl.appendChild(item);
    });
  }

  // ==========================================================
  //   INSIGNIAS
  // ==========================================================
  const achievementsGridEl = document.getElementById("achievementsGrid");

  function renderBadges() {
    achievementsGridEl.innerHTML = "";
    badges.forEach(badge => {
      const card = document.createElement("article");
      card.className = "badge-card" + (badge.unlocked ? "" : " badge-locked");
      card.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <p class="badge-desc">${badge.desc}</p>
      `;
      achievementsGridEl.appendChild(card);
    });
  }

  // ==========================================================
  //   RUTAS GUARDADAS
  // ==========================================================
  let savedRoutes = [
    { id: 1, name: "Ruta - Parque Surco → UPC" },
    { id: 2, name: "Ruta - Clínica Ricardo Palma" },
    { id: 3, name: "Ruta - Plaza San Borja" },
    { id: 4, name: "Ruta - Av. Benavides" },
    { id: 5, name: "Ruta - Real Plaza Primavera" }
  ];

  const routesListEl = document.getElementById("routesList");
  const routesEmptyEl = document.getElementById("routesEmpty");

  const shareModal = document.getElementById("shareModal");
  const shareRouteTitle = document.getElementById("shareRouteTitle");
  const shareRouteLink = document.getElementById("shareRouteLink");
  const btnCloseShare = document.getElementById("btnCloseShare");
  const btnCopyLink = document.getElementById("btnCopyLink");

  function renderSavedRoutes() {
    routesListEl.innerHTML = "";

    if (!savedRoutes.length) {
      routesEmptyEl.style.display = "block";
      routesListEl.style.display = "none";
      return;
    }

    routesEmptyEl.style.display = "none";
    routesListEl.style.display = "flex";

    savedRoutes.forEach(route => {
      const el = document.createElement("div");
      el.className = "route-item";

      el.innerHTML = `
        <div class="route-header">
          <span class="route-title">${route.name}</span>
          <div class="route-buttons">
            <button class="route-btn" data-share="${route.id}">Compartir</button>
            <button class="route-btn" data-rename="${route.id}">Renombrar</button>
            <button class="route-btn delete" data-delete="${route.id}">Eliminar</button>
          </div>
        </div>
      `;

      routesListEl.appendChild(el);
    });
  }

  document.body.addEventListener("click", (e) => {
    // Compartir
    if (e.target.hasAttribute("data-share")) {
      const id = Number(e.target.dataset.share);
      const route = savedRoutes.find(r => r.id === id);

      shareModal.classList.add("active");
      shareRouteTitle.textContent = route.name;
      shareRouteLink.value = `https://accessmap/ruta/${id}`;
    }

    // Eliminar
    if (e.target.hasAttribute("data-delete")) {
      const id = Number(e.target.dataset.delete);
      savedRoutes = savedRoutes.filter(r => r.id !== id);
      renderSavedRoutes();
    }

    // Renombrar
    if (e.target.hasAttribute("data-rename")) {
      const id = Number(e.target.dataset.rename);
      const newName = prompt("Nuevo nombre de ruta:");
      if (newName && newName.trim()) {
        savedRoutes.find(r => r.id === id).name = newName.trim();
        renderSavedRoutes();
      }
    }
  });

  btnCloseShare.addEventListener("click", () => shareModal.classList.remove("active"));

  btnCopyLink.addEventListener("click", () => {
    shareRouteLink.select();
    document.execCommand("copy");
    alert("Enlace copiado");
  });

  // ==========================================================
  //   FAVORITOS
  // ==========================================================
  let favoritePlaces = [
    { id: 1, name: "Café Inclusivo", location: "Miraflores" },
    { id: 2, name: "Parque Reducto", location: "Barranco" }
  ];

  const favoritesListEl = document.getElementById("favoritesList");
  const favoritesEmptyEl = document.getElementById("favoritesEmpty");

  function renderFavorites() {
    favoritesListEl.innerHTML = "";

    if (!favoritePlaces.length) {
      favoritesEmptyEl.style.display = "block";
      favoritesListEl.style.display = "none";
      return;
    }

    favoritesEmptyEl.style.display = "none";
    favoritesListEl.style.display = "flex";

    favoritePlaces.forEach(place => {
      const el = document.createElement("div");
      el.className = "contribution-item";
      el.innerHTML = `
        <div class="contribution-header">
          <span class="contribution-title">${place.name}</span>
          <button class="route-btn delete" data-remove-fav="${place.id}">❤️</button>
        </div>
        <div class="contribution-meta">${place.location}</div>
      `;
      favoritesListEl.appendChild(el);
    });
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-remove-fav")) {
      const id = Number(e.target.dataset.removeFav);
      favoritePlaces = favoritePlaces.filter(p => p.id !== id);
      renderFavorites();
    }
  });

  // ==========================================================
  //   ACCESIBILIDAD
  // ==========================================================
  const accessForm = document.getElementById("accessibilityForm");
  const accessOptionsEls = document.querySelectorAll(".access-option");
  const accessSuccessMsg = document.getElementById("accessSuccessMsg");

  const ACCESS_KEY = "access_preferences";

  let accessPreferences = JSON.parse(localStorage.getItem(ACCESS_KEY)) || {
    silla: false,
    andador: true,
    muletas: true,
    baston: false
  };

  function loadAccessPreferences() {
    accessOptionsEls.forEach(opt => opt.checked = accessPreferences[opt.value]);
    accessSuccessMsg.textContent = "";
  }

  function updateAccessSummary() {
    const container = document.getElementById("accessSummary");
    container.innerHTML = "";

    Object.entries(accessPreferences).forEach(([key, value]) => {
      if (value) {
        const btn = document.createElement("button");
        btn.className = "segment active";
        btn.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        container.appendChild(btn);
      }
    });

    if (!container.innerHTML.trim()) {
      container.innerHTML = `<span style="font-size:0.9rem;color:#64748b;">Sin ayudas seleccionadas</span>`;
    }
  }

  if (accessForm) {
    accessForm.addEventListener("submit", (e) => {
      e.preventDefault();

      accessOptionsEls.forEach(opt => {
        accessPreferences[opt.value] = opt.checked;
      });

      localStorage.setItem(ACCESS_KEY, JSON.stringify(accessPreferences));

      updateAccessSummary();
      accessSuccessMsg.textContent = "Preferencias actualizadas";
    });
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-accessibility']")) {
      loadAccessPreferences();
    }
  });

  // ==========================================================
  //   CONFIGURACIÓN
  // ==========================================================
  // --- Notificaciones ---
  const NOTIF_KEY = "notif_preferences";

  let notifPrefs = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {
    barriers: true,
    routes: true,
    community: false
  };

  const notifForm = document.getElementById("notificationsForm");
  const notifBarriersEl = document.getElementById("notifBarriers");
  const notifRoutesEl = document.getElementById("notifRoutes");
  const notifCommunityEl = document.getElementById("notifCommunity");
  const notifSuccessMessage = document.getElementById("notifSuccessMessage");

  function loadNotifPrefs() {
    notifBarriersEl.checked = notifPrefs.barriers;
    notifRoutesEl.checked = notifPrefs.routes;
    notifCommunityEl.checked = notifPrefs.community;
    notifSuccessMessage.textContent = "";
  }

  function sameNotif(a, b) {
    return (
      a.barriers === b.barriers &&
      a.routes === b.routes &&
      a.community === b.community
    );
  }

  if (notifForm) {
    notifForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newState = {
        barriers: notifBarriersEl.checked,
        routes: notifRoutesEl.checked,
        community: notifCommunityEl.checked
      };

      if (sameNotif(newState, notifPrefs)) {
        notifSuccessMessage.textContent = "No se realizaron cambios en la configuración.";
        return;
      }

      notifPrefs = newState;
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifPrefs));
      notifSuccessMessage.textContent = "Configuración de notificaciones actualizada.";
    });
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-notifications']")) {
      loadNotifPrefs();
    }
  });

  // ==========================================================
  //   APARIENCIA
  // ==========================================================
  const APPEAR_KEY = "appearance_settings";

  let appearance = JSON.parse(localStorage.getItem(APPEAR_KEY)) || {
    darkMode: false,
    textSize: 16
  };

  const darkModeToggle = document.getElementById("darkModeToggle");
  const textSizeSlider = document.getElementById("textSizeSlider");
  const textSizePreview = document.getElementById("textSizePreview");
  const resetTextSizeBtn = document.getElementById("resetTextSizeBtn");
  const snackbar = document.getElementById("snackbar");

  function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.remove("show"), 2500);
  }

  function applyDarkMode() {
    document.body.classList.toggle("dark", appearance.darkMode);
  }

  function applyTextSize() {
    document.documentElement.style.fontSize = appearance.textSize + "px";
    textSizePreview.textContent = appearance.textSize + "px";
  }

  function loadAppearanceSettings() {
    darkModeToggle.checked = appearance.darkMode;
    textSizeSlider.value = appearance.textSize;
    applyTextSize();
  }

  darkModeToggle?.addEventListener("change", () => {
    appearance.darkMode = darkModeToggle.checked;
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyDarkMode();
    showSnackbar(appearance.darkMode ? "Modo oscuro activado." : "Modo claro activado.");
  });

  textSizeSlider?.addEventListener("input", () => {
    appearance.textSize = Number(textSizeSlider.value);
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyTextSize();
  });

  resetTextSizeBtn?.addEventListener("click", () => {
    appearance.textSize = 16;
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyTextSize();
    showSnackbar("Tamaño restablecido.");
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-appearance']")) {
      loadAppearanceSettings();
    }
  });

  applyDarkMode();
  applyTextSize();

  // ==========================================================
  //   CONFIGURACIÓN: PRIVACIDAD
  // ==========================================================
  const PRIVACY_KEY = "privacy_settings";

  let privacySettings = JSON.parse(localStorage.getItem(PRIVACY_KEY)) || {
    saveHistory: true,
    dataSaver: false
  };

  const saveHistoryToggle = document.getElementById("saveHistoryToggle");
  const dataSaverToggle = document.getElementById("dataSaverToggle");
  const savePrivacyBtn = document.getElementById("savePrivacyBtn");
  const privacySuccessMsg = document.getElementById("privacySuccessMsg");

  function loadPrivacySettings() {
    saveHistoryToggle.checked = privacySettings.saveHistory;
    dataSaverToggle.checked = privacySettings.dataSaver;
    privacySuccessMsg.textContent = "";
  }

  savePrivacyBtn?.addEventListener("click", () => {
    privacySettings.saveHistory = saveHistoryToggle.checked;
    privacySettings.dataSaver = dataSaverToggle.checked;
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(privacySettings));
    privacySuccessMsg.textContent = "Configuración guardada.";
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-privacy']")) {
      loadPrivacySettings();
    }
  });

  // ==========================================================
  //   CERRAR SESIÓN
  // ==========================================================
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    window.location.replace("../index.html");
  });

  // ==========================================================
  //   INIT
  // ==========================================================
  renderProfileHeader();
  renderContributions();
  renderBadges();
  renderSavedRoutes();
  renderFavorites();
  updateAccessSummary();

});
