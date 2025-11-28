
/* ==========================================================
   ACCESIBILIDAD — SISTEMA NUEVO (tarjetas seleccionables)
   ========================================================== */

const ACC_KEY = "accessibilityOptions";

// Nombres bonitos
const nombresAcc = {
    silla: "Silla de ruedas",
    andador: "Andador",
    coche: "Coche de bebé",
    muletas: "Muletas",
    baston: "Bastón",
    ninguna: "Ninguna"
};

// ===============================
// 1) MOSTRAR TAGS EN EL PERFIL
// ===============================
function renderAccessSummary() {
    const accessSummary = document.getElementById("accessSummary");
    if (!accessSummary) return;

    const saved = JSON.parse(localStorage.getItem(ACC_KEY)) || [];

    accessSummary.innerHTML = "";

    if (saved.length === 0) {
        accessSummary.innerHTML = `<p class='texto-gris'>Sin preferencias registradas</p>`;
        return;
    }

    saved.forEach(val => {
        const tag = document.createElement("button");
        tag.className = "segment active";
        tag.textContent = nombresAcc[val] || val;
        accessSummary.appendChild(tag);
    });
}

renderAccessSummary();


// =========================================
// 2) PRELLENAR TARJETAS AL ABRIR “EDITAR”
// =========================================
function preloadAccessibilityCards() {
    const saved = JSON.parse(localStorage.getItem(ACC_KEY)) || [];
    const cards = document.querySelectorAll(".option-btn-profile");

    cards.forEach(card => {
        const val = card.dataset.value;
        card.classList.toggle("selected", saved.includes(val));
    });
}

document.querySelectorAll('[data-view-target="view-accessibility"]').forEach(btn =>
    btn.addEventListener("click", preloadAccessibilityCards)
);


// =========================================
// 3) INTERACCIÓN DE TARJETAS
// =========================================
let selectedProfileOptions = new Set();

function updateSetFromDOM() {
    selectedProfileOptions.clear();
    document.querySelectorAll(".option-btn-profile.selected").forEach(card => {
        selectedProfileOptions.add(card.dataset.value);
    });
}

document.querySelectorAll(".option-btn-profile").forEach(card => {
    card.addEventListener("click", () => {
        const val = card.dataset.value;

        // Si selecciona "ninguna"
        if (val === "ninguna") {
            document.querySelectorAll(".option-btn-profile").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            updateSetFromDOM();
            return;
        }

        // Si estaba seleccionada "ninguna", quitarla
        const noneCard = document.querySelector('.option-btn-profile[data-value="ninguna"]');
        noneCard.classList.remove("selected");

        // Alternar tarjeta
        card.classList.toggle("selected");

        updateSetFromDOM();
    });
});


// =========================================
// 4) GUARDAR CAMBIOS DESDE EL PERFIL
// =========================================
const accessibilityForm = document.getElementById("accessibilityForm");

if (accessibilityForm) {
    accessibilityForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const finalArray = Array.from(selectedProfileOptions);
        localStorage.setItem(ACC_KEY, JSON.stringify(finalArray));

        renderAccessSummary();

        // Regresar al perfil
        document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
        document.getElementById("view-profile").classList.add("view--active");
    });
}

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
//  ABRIR VISTA SEGÚN PARÁMETRO
// ===============================
const params = new URLSearchParams(window.location.search);
const viewParam = params.get("view");

if (viewParam === "achievements") {
    openViewFromOutside("view-achievements");
}

// ===============================
//  FUNCIÓN PARA ABRIR VISTAS
// ===============================
function openViewFromOutside(viewId) {
    // Oculta todas las vistas
    document.querySelectorAll(".view").forEach(v =>
        v.classList.remove("view--active")
    );

    // Muestra la vista solicitada
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add("view--active");
    }
}
  /* ==========================================================
     PERFIL PRINCIPAL → nombre, email
     ========================================================== */

  const userProfile = {
    name: "Maria Gracia",
    email: "maria-gracia@gmail.com"
  };

  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");

  function renderProfileHeader() {
    if (profileNameEl) profileNameEl.textContent = userProfile.name;
    if (profileEmailEl) profileEmailEl.textContent = userProfile.email;
  }

  renderProfileHeader();
  /* ==========================================================
     NAVEGACIÓN ENTRE VISTAS (openView)
     ========================================================== */

  const views = document.querySelectorAll(".view");

  function openView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
  document.getElementById(viewId).classList.add("view--active");

    if (target) {
      target.classList.add("view--active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  window.openView = openView;

  document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-view-target]");
    if (!t) return;
    e.preventDefault();

    const viewId = t.getAttribute("data-view-target");
    openView(viewId);
  });
  /* ==========================================================
     AVATAR
     ========================================================== */

  const AVATAR_KEY = "profile_avatar";
  const avatarImg = document.querySelector(".profile-avatar");
  const avatarInput = document.getElementById("avatarInput");

  const storedAvatar = localStorage.getItem(AVATAR_KEY);
  if (storedAvatar && avatarImg) {
    avatarImg.src = storedAvatar;
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".avatar-edit-btn")) {
      avatarInput?.click();
    }
  });

  avatarInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      avatarImg.src = dataUrl;
      localStorage.setItem(AVATAR_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  });
  /* ==========================================================
     EDITAR PERFIL
     ========================================================== */

  const editForm = document.getElementById("editProfileForm");
  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordErrorEl = document.getElementById("passwordError");
  const profileSuccessMsgEl = document.getElementById("profileSuccessMsg");
  const saveProfileBtn = document.getElementById("saveProfileBtn");

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
    const oldPass = oldPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    let canSave = !!name;
    let errorMsg = "";

    const wantsPasswordChange =
      oldPass || newPass || confirmPass;

    if (wantsPasswordChange) {
      if (!oldPass || !newPass || !confirmPass) {
        canSave = false;
        errorMsg = "Completa todos los campos de contraseña";
      } else if (newPass !== confirmPass) {
        canSave = false;
        errorMsg = "Las contraseñas no coinciden";
      }
    }

    passwordErrorEl.textContent = errorMsg;
    saveProfileBtn.disabled = !canSave;
  }

  if (editForm) {
    [editNameInput, oldPasswordInput, newPasswordInput, confirmPasswordInput]
      .forEach(input => input.addEventListener("input", validateProfileForm));

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      userProfile.name = editNameInput.value.trim();
      renderProfileHeader();
      profileSuccessMsgEl.textContent = "Perfil actualizado";
      validateProfileForm();
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest("[data-view-target='view-edit-profile']")) {
        initEditProfileForm();
      }
    });
  }
   /* ==========================================================
     PARTE 6 — MIS CONTRIBUCIONES
     ========================================================== */

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

  const contributionsListEl = document.getElementById("contributionsList");
  const contributionsEmptyEl = document.getElementById("contributionsEmpty");

  function renderContributions() {
    if (!contributionsListEl || !contributionsEmptyEl) return;

    contributionsListEl.innerHTML = "";

    if (userReports.length === 0) {
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
          <span class="tag ${report.status === "Activo" ? "tag-ambar" : "tag-verde"}">
            ${report.status}
          </span>
        </div>
        <div class="contribution-meta">
          <span>${report.date}</span> • <span>${report.location}</span>
        </div>
      `;
      contributionsListEl.appendChild(item);
    });
  }

  renderContributions();
  /* ==========================================================
     PARTE 7 — LOGROS E INSIGNIAS
     ========================================================== */

  const badges = [
    {
      id: "b1",
      icon: "🌱",
      name: "Primer aporte",
      desc: "Crea tu primer reporte accesible",
      unlocked: true
    },
    {
      id: "b2",
      icon: "🗺️",
      name: "Explorador",
      desc: "Reporta en 5 distritos diferentes",
      unlocked: false
    },
    {
      id: "b3",
      icon: "⭐",
      name: "Colaborador constante",
      desc: "Envía 20 reportes verificados",
      unlocked: false
    }
  ];

  const achievementsGridEl = document.getElementById("achievementsGrid");

  function renderBadges() {
    if (!achievementsGridEl) return;

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

  renderBadges();
  /* ==========================================================
     PARTE 8 — RUTAS GUARDADAS
     ========================================================== */

  let savedRoutes = [
    { id: 1, name: "Ruta - Parque Surco → UPC" },
    { id: 2, name: "Ruta - Clínica Ricardo Palma" },
    { id: 3, name: "Ruta - Plaza San Borja" }
  ];

  const routesListEl = document.getElementById("routesList");
  const routesEmptyEl = document.getElementById("routesEmpty");
  const shareModal = document.getElementById("shareModal");
  const shareRouteTitle = document.getElementById("shareRouteTitle");
  const shareRouteLink = document.getElementById("shareRouteLink");
  const btnCloseShare = document.getElementById("btnCloseShare");
  const btnCopyLink = document.getElementById("btnCopyLink");

  function renderSavedRoutes() {
    if (!routesListEl || !routesEmptyEl) return;

    routesListEl.innerHTML = "";

    if (savedRoutes.length === 0) {
      routesListEl.style.display = "none";
      routesEmptyEl.style.display = "block";
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

  renderSavedRoutes();

  // Eventos
  document.body.addEventListener("click", (e) => {
    const shareBtn = e.target.closest("[data-share]");
    const deleteBtn = e.target.closest("[data-delete]");
    const renameBtn = e.target.closest("[data-rename]");

    if (shareBtn) {
      const id = Number(shareBtn.dataset.share);
      const route = savedRoutes.find(r => r.id === id);
      if (!route) return;

      shareModal.classList.add("active");
      shareRouteTitle.textContent = route.name;
      shareRouteLink.value = "https://accessmap.com/ruta/" + id;
    }

    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.delete);
      savedRoutes = savedRoutes.filter(r => r.id !== id);
      renderSavedRoutes();
    }

    if (renameBtn) {
      const id = Number(renameBtn.dataset.rename);
      const route = savedRoutes.find(r => r.id === id);
      if (!route) return;

      const newName = prompt("Nuevo nombre:", route.name);
      if (newName) {
        route.name = newName.trim();
        renderSavedRoutes();
      }
    }
  });

  btnCloseShare?.addEventListener("click", () => {
    shareModal.classList.remove("active");
  });

  btnCopyLink?.addEventListener("click", () => {
    shareRouteLink.select();
    document.execCommand("copy");
    alert("¡Link copiado!");
  });
 
  /* ==========================================================
     PARTE 9 — FAVORITOS
     ========================================================== */

  let favoritePlaces = [
    { id: 1, name: "Café Inclusivo", location: "Miraflores" },
    { id: 2, name: "Parque Reducto", location: "Barranco" }
  ];

  const favoritesListEl = document.getElementById("favoritesList");
  const favoritesEmptyEl = document.getElementById("favoritesEmpty");

  function renderFavorites() {
    if (!favoritesListEl || !favoritesEmptyEl) return;

    favoritesListEl.innerHTML = "";

    if (favoritePlaces.length === 0) {
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
          <button class="route-btn delete" data-remove-fav="${place.id}">
            ❤️
          </button>
        </div>
        <div class="contribution-meta">${place.location}</div>
      `;

      favoritesListEl.appendChild(el);
    });
  }

  renderFavorites();

  document.body.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-fav]");
    if (!removeBtn) return;

    const id = Number(removeBtn.dataset.removeFav);
    favoritePlaces = favoritePlaces.filter(p => p.id !== id);

    renderFavorites();
  });
  /* ==========================================================
     PARTE 10 — CONFIGURACIÓN: NOTIFICACIONES
     ========================================================== */

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

  function readNotifForm() {
    return {
      barriers: notifBarriersEl.checked,
      routes: notifRoutesEl.checked,
      community: notifCommunityEl.checked
    };
  }

  if (notifForm) {
    notifForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPrefs = readNotifForm();

      notifPrefs = newPrefs;
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifPrefs));

      notifSuccessMessage.textContent = "Configuración actualizada.";
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest("[data-view-target='view-settings-notifications']")) {
        loadNotifPrefs();
      }
    });
  }
  /* ==========================================================
     PARTE 11 — CONFIGURACIÓN: APARIENCIA
     ========================================================== */

  const APPEAR_KEY = "appearance_settings";

  let appearance = JSON.parse(localStorage.getItem(APPEAR_KEY)) || {
      darkMode: false,
      textSize: 1
  };

  const darkModeToggle = document.getElementById("darkModeToggle");
  const textSizeSlider = document.getElementById("textSizeSlider");
  const textSizePreview = document.getElementById("textSizePreview");
  const resetTextSizeBtn = document.getElementById("resetTextSizeBtn");
  const snackbar = document.getElementById("snackbar");

  function showSnackbar(msg) {
    snackbar.textContent = msg;
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.remove("show"), 2000);
  }

  function applyDarkMode() {
    document.body.classList.toggle("dark", appearance.darkMode);
  }

  function applyTextScale() {
    document.documentElement.style.setProperty("--text-scale", appearance.textSize);
    textSizePreview.textContent = Math.round(appearance.textSize * 100) + "%";
  }

  if (darkModeToggle) {
    darkModeToggle.checked = appearance.darkMode;

    darkModeToggle.addEventListener("change", () => {
      appearance.darkMode = darkModeToggle.checked;
      localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
      applyDarkMode();
      showSnackbar(
        appearance.darkMode ? "Modo oscuro activado" : "Modo claro activado"
      );
    });
  }

  if (textSizeSlider) {
    textSizeSlider.value = appearance.textSize;

    textSizeSlider.addEventListener("input", () => {
      appearance.textSize = Number(textSizeSlider.value);
      localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
      applyTextScale();
    });
  }

  resetTextSizeBtn?.addEventListener("click", () => {
    appearance.textSize = 1;
    textSizeSlider.value = 1;
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyTextScale();
  });

  applyDarkMode();
  applyTextScale();
  /* ==========================================================
     PARTE 12 — CONFIGURACIÓN: IDIOMA
     ========================================================== */

  const LANG_KEY = "selected_language";
  let currentLang = localStorage.getItem(LANG_KEY) || "es";

  const translations = {
    es: {
      profile: "Perfil",
      editProfileBtn: "Editar perfil",
      achievements: "Mis logros e insignias",
      savedRoutes: "Rutas guardadas",
      favorites: "Lugares favoritos",
      accessibility: "Perfil de accesibilidad",
      settings: "Configuración"
    },
    en: {
      profile: "Profile",
      editProfileBtn: "Edit profile",
      achievements: "Achievements",
      savedRoutes: "Saved routes",
      favorites: "Favorite places",
      accessibility: "Accessibility profile",
      settings: "Settings"
    }
  };

  function applyLanguage() {
    const t = translations[currentLang];
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      if (t[key]) el.textContent = t[key];
    });
  }

  const languageSelect = document.getElementById("languageSelect");
  const saveLanguageBtn = document.getElementById("saveLanguageBtn");
  const langSuccessMsg = document.getElementById("langSuccessMsg");

  if (languageSelect) languageSelect.value = currentLang;

  saveLanguageBtn?.addEventListener("click", () => {
    const selected = languageSelect.value;

    if (selected === currentLang) {
      langSuccessMsg.textContent = "No se realizaron cambios.";
      return;
    }

    currentLang = selected;
    localStorage.setItem(LANG_KEY, currentLang);
    langSuccessMsg.textContent = "Idioma actualizado.";
    applyLanguage();
  });

  applyLanguage();
  /* ==========================================================
     PARTE 13 — CONFIGURACIÓN: PRIVACIDAD
     ========================================================== */

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
    const newSettings = {
      saveHistory: saveHistoryToggle.checked,
      dataSaver: dataSaverToggle.checked
    };

    privacySettings = newSettings;
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(privacySettings));
    privacySuccessMsg.textContent = "Configuración actualizada.";
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-privacy']")) {
      loadPrivacySettings();
    }
  });
  /* ==========================================================
     PARTE 14 — CERRAR SESIÓN
     ========================================================== */

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

});
