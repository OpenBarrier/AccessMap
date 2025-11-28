document.addEventListener("DOMContentLoaded", () => {
  // =========================
  //  ESTADO SIMULADO DE USUARIO
  // =========================
  const userProfile = {
    name: "Maria Gracia",
    email: "maria-gracia@gmail.com"
  };

  // Reportes del usuario (para Mis contribuciones)
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

  // =========================
  //  NAVEGACIÓN ENTRE VISTAS
  // =========================
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
    const t = e.target.closest("[data-view-target]");
    if (!t) return;
    e.preventDefault();
    const viewId = t.getAttribute("data-view-target");
    openView(viewId);
  });

  // =========================
  //  PERFIL PRINCIPAL
  // =========================
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");

  function renderProfileHeader() {
    if (profileNameEl) profileNameEl.textContent = userProfile.name;
    if (profileEmailEl) profileEmailEl.textContent = userProfile.email;
  }

  // =========================
  //  AVATAR + CÁMARA
  // =========================
  const AVATAR_KEY = "profile_avatar";
  const avatarImg = document.querySelector(".profile-avatar");
  const avatarInput = document.getElementById("avatarInput");

  const storedAvatar = localStorage.getItem(AVATAR_KEY);
  if (storedAvatar && avatarImg) {
    avatarImg.src = storedAvatar;
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".avatar-edit-btn")) {
      avatarInput && avatarInput.click();
    }
  });

  avatarInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      if (avatarImg && dataUrl) {
        avatarImg.src = dataUrl;
        localStorage.setItem(AVATAR_KEY, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  });

  // =========================
  //  EDITAR PERFIL
  // =========================
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
    if (!editForm) return;
    editNameInput.value = userProfile.name;
    editEmailInput.value = userProfile.email; // Solo visual, no editable

    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
    passwordErrorEl.textContent = "";
    profileSuccessMsgEl.textContent = "";

    validateProfileForm();
  }

  function validateProfileForm() {
    if (!editForm) return;

    const name = editNameInput.value.trim();
    const oldPass = oldPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    let canSave = !!name;
    let errorMsg = "";

    const wantsPasswordChange =
      oldPass.length > 0 || newPass.length > 0 || confirmPass.length > 0;

    if (wantsPasswordChange) {
      if (!oldPass || !newPass || !confirmPass) {
        canSave = false;
        errorMsg = "Completa todos los campos de contraseña.";
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
      if (saveProfileBtn.disabled) return;

      const newName = editNameInput.value.trim();
      userProfile.name = newName;

      renderProfileHeader();
      profileSuccessMsgEl.textContent = "Perfil actualizado";

      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";
      validateProfileForm();
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest("[data-view-target='view-edit-profile']")) {
        initEditProfileForm();
      }
    });
  }

  // =========================
  //  MIS CONTRIBUCIONES
  // =========================
  const contributionsListEl = document.getElementById("contributionsList");
  const contributionsEmptyEl = document.getElementById("contributionsEmpty");

  function renderContributions() {
    if (!contributionsListEl || !contributionsEmptyEl) return;
    contributionsListEl.innerHTML = "";

    if (!userReports || userReports.length === 0) {
      contributionsListEl.style.display = "none";
      contributionsEmptyEl.style.display = "block";
    } else {
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
            <span>${report.date}</span> •
            <span>${report.location}</span>
          </div>
        `;
        contributionsListEl.appendChild(item);
      });
    }
  }

  // =========================
  //  LOGROS E INSIGNIAS
  // =========================
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

  // =========================
  //  RUTAS GUARDADAS
  // =========================
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

  document.body.addEventListener("click", (e) => {
    const shareBtn = e.target.closest("[data-share]");
    const deleteBtn = e.target.closest("[data-delete]");
    const renameBtn = e.target.closest("[data-rename]");

    if (shareBtn) {
      const id = Number(shareBtn.getAttribute("data-share"));
      const route = savedRoutes.find(r => r.id === id);
      if (!route) return;

      shareModal.classList.add("active");
      shareRouteTitle.textContent = route.name;
      shareRouteLink.value = "https://accessmap/ruta/" + id;
    }

    if (deleteBtn) {
      const id = Number(deleteBtn.getAttribute("data-delete"));
      savedRoutes = savedRoutes.filter(r => r.id !== id);
      renderSavedRoutes();
    }

    if (renameBtn) {
      const id = Number(renameBtn.getAttribute("data-rename"));
      const route = savedRoutes.find(r => r.id === id);
      if (!route) return;
      const newName = prompt("Nuevo nombre de ruta:", route.name);
      if (newName && newName.trim()) {
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
    alert("Enlace copiado al portapapeles");
  });

  // =========================
  //  FAVORITOS
  // =========================
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
      favoritesListEl.style.display = "none";
      favoritesEmptyEl.style.display = "block";
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

  document.body.addEventListener("click", (e) => {
    const removeFavBtn = e.target.closest("[data-remove-fav]");
    if (removeFavBtn) {
      const id = Number(removeFavBtn.getAttribute("data-remove-fav"));
      favoritePlaces = favoritePlaces.filter(p => p.id !== id);
      renderFavorites();
    }
  });

  // =========================
  //  PERFIL DE ACCESIBILIDAD
  // =========================
  const ACCESS_KEY = "access_preferences";
  const accessForm = document.getElementById("accessibilityForm");
  const accessOptionsEls = document.querySelectorAll(".access-option");
  const accessSuccessMsg = document.getElementById("accessSuccessMsg");

  let accessPreferences = JSON.parse(localStorage.getItem(ACCESS_KEY)) || {
    silla: false,
    andador: true,
    muletas: true,
    baston: false
  };

  function loadAccessPreferences() {
    accessOptionsEls.forEach(opt => {
      opt.checked = !!accessPreferences[opt.value];
    });
    accessSuccessMsg.textContent = "";
  }

  function updateAccessSummary() {
    const container = document.getElementById("accessSummary");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(accessPreferences).forEach(([key, value]) => {
      if (value) {
        const btn = document.createElement("button");
        btn.className = "segment active";
        const labels = {
          silla: "Silla de ruedas",
          andador: "Andador",
          muletas: "Muletas",
          baston: "Bastón"
        };
        btn.textContent = labels[key] || key;
        container.appendChild(btn);
      }
    });

    if (container.innerHTML.trim() === "") {
      container.innerHTML = `
        <span style="font-size:0.9rem; color:#64748b;">
          Sin ayudas seleccionadas
        </span>`;
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

  // =========================
  //  CONFIGURACIÓN – NOTIFICACIONES
  // =========================
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

  function getCurrentNotifState() {
    return {
      barriers: notifBarriersEl.checked,
      routes: notifRoutesEl.checked,
      community: notifCommunityEl.checked
    };
  }

  function samePrefs(a, b) {
    return a.barriers === b.barriers &&
           a.routes === b.routes &&
           a.community === b.community;
  }

  if (notifForm) {
    notifForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newState = getCurrentNotifState();

      if (samePrefs(newState, notifPrefs)) {
        notifSuccessMessage.textContent = "No se realizaron cambios en la configuración.";
        return;
      }

      if (!newState.barriers && !newState.routes && !newState.community) {
        notifPrefs = newState;
        localStorage.setItem(NOTIF_KEY, JSON.stringify(notifPrefs));
        notifSuccessMessage.textContent = "Has desactivado todas las notificaciones.";
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

  // =========================
  //  CONFIGURACIÓN – APARIENCIA
  // =========================
  const APPEAR_KEY = "appearance_settings";

  let appearance = JSON.parse(localStorage.getItem(APPEAR_KEY)) || {
    darkMode: false,
    textSize: 1 // escala 1 = 100%
  };

  const darkModeToggle = document.getElementById("darkModeToggle");
  const textSizeSlider = document.getElementById("textSizeSlider");
  const textSizePreview = document.getElementById("textSizePreview");
  const resetTextSizeBtn = document.getElementById("resetTextSizeBtn");
  const snackbar = document.getElementById("snackbar");

  function showSnackbar(message) {
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.remove("show"), 2500);
  }

  function applyDarkMode() {
    if (appearance.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  function applyTextScale() {
    document.documentElement.style.setProperty("--text-scale", appearance.textSize);
    if (textSizePreview) {
      textSizePreview.textContent = Math.round(appearance.textSize * 100) + "%";
    }
  }

  function loadAppearanceSettings() {
    if (darkModeToggle) darkModeToggle.checked = appearance.darkMode;
    if (textSizeSlider) textSizeSlider.value = appearance.textSize;
    applyTextScale();
  }

  darkModeToggle?.addEventListener("change", () => {
    appearance.darkMode = darkModeToggle.checked;
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyDarkMode();
    showSnackbar(
      appearance.darkMode ? "Modo oscuro activado." : "Modo claro activado."
    );
  });

  textSizeSlider?.addEventListener("input", () => {
    appearance.textSize = Number(textSizeSlider.value);
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyTextScale();
  });

  resetTextSizeBtn?.addEventListener("click", () => {
    appearance.textSize = 1;
    localStorage.setItem(APPEAR_KEY, JSON.stringify(appearance));
    applyTextScale();
    showSnackbar("Tamaño de texto restablecido.");
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-appearance']")) {
      loadAppearanceSettings();
    }
  });

  applyDarkMode();
  applyTextScale();

  // =========================
  //  IDIOMA (i18n básico)
  // =========================
  const LANG_KEY = "selected_language";
  let currentLang = localStorage.getItem(LANG_KEY) || "es";

  const translations = {
    es: {
      profile: "Perfil",
      editProfileBtn: "Editar perfil",
      activeMember: "Miembro activo",
      contributions: "Contribuciones",
      ratings: "Valoraciones",
      places: "Lugares",
      myActivity: "Mi actividad",
      achievements: "Mis logros e insignias",
      myContributions: "Mis contribuciones",
      savedRoutes: "Rutas guardadas",
      favorites: "Lugares favoritos",
      savedItems: "Mis guardados",
      accessibility: "Perfil de accesibilidad",
      settings: "Configuración"
    },
    en: {
      profile: "Profile",
      editProfileBtn: "Edit profile",
      activeMember: "Active member",
      contributions: "Contributions",
      ratings: "Ratings",
      places: "Places",
      myActivity: "My activity",
      achievements: "Achievements & badges",
      myContributions: "My contributions",
      savedRoutes: "Saved routes",
      favorites: "Favorite places",
      savedItems: "My saved items",
      accessibility: "Accessibility profile",
      settings: "Settings"
    },
    ru: {
      profile: "Профиль",
      editProfileBtn: "Редактировать профиль",
      activeMember: "Активный участник",
      contributions: "Вклады",
      ratings: "Оценки",
      places: "Места",
      myActivity: "Моя активность",
      achievements: "Достижения и значки",
      myContributions: "Мои отчёты",
      savedRoutes: "Сохранённые маршруты",
      favorites: "Избранные места",
      savedItems: "Сохранённое",
      accessibility: "Профиль доступности",
      settings: "Настройки"
    }
  };

  function applyLanguage() {
    const t = translations[currentLang] || translations.es;
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.getAttribute("data-lang");
      if (t[key]) {
        el.textContent = t[key];
      }
    });
  }

  const languageSelect = document.getElementById("languageSelect");
  const saveLanguageBtn = document.getElementById("saveLanguageBtn");
  const langSuccessMsg = document.getElementById("langSuccessMsg");

  function loadLanguageSettings() {
    if (languageSelect) languageSelect.value = currentLang;
    if (langSuccessMsg) langSuccessMsg.textContent = "";
  }

  saveLanguageBtn?.addEventListener("click", () => {
    const newLang = languageSelect.value;
    if (newLang === currentLang) {
      langSuccessMsg.textContent = "No se realizaron cambios.";
      return;
    }

    currentLang = newLang;
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
    langSuccessMsg.textContent = "Idioma actualizado exitosamente.";
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-language']")) {
      loadLanguageSettings();
    }
  });

  applyLanguage();

  // =========================
  //  CONFIGURACIÓN – PRIVACIDAD Y DATOS
  // =========================
  const PRIVACY_KEY = "privacy_settings";

  let privacySettings = JSON.parse(localStorage.getItem(PRIVACY_KEY)) || {
    saveHistory: true,
    dataSaver: false
  };

  const saveHistoryToggle = document.getElementById("saveHistoryToggle");
  const dataSaverToggle = document.getElementById("dataSaverToggle");
  const savePrivacyBtn = document.getElementById("savePrivacyBtn");
  const privacySuccessMsg = document.getElementById("privacySuccessMsg");
  const privacySnackbar = document.getElementById("privacySnackbar");

  function showPrivacySnackbar(msg) {
    if (!privacySnackbar) return;
    privacySnackbar.textContent = msg;
    privacySnackbar.classList.add("show");
    setTimeout(() => privacySnackbar.classList.remove("show"), 2500);
  }

  function loadPrivacySettings() {
    if (!saveHistoryToggle || !dataSaverToggle) return;
    saveHistoryToggle.checked = privacySettings.saveHistory;
    dataSaverToggle.checked = privacySettings.dataSaver;
    if (privacySuccessMsg) privacySuccessMsg.textContent = "";
  }

  savePrivacyBtn?.addEventListener("click", () => {
    const newSettings = {
      saveHistory: saveHistoryToggle.checked,
      dataSaver: dataSaverToggle.checked
    };

    if (
      newSettings.saveHistory === privacySettings.saveHistory &&
      newSettings.dataSaver === privacySettings.dataSaver
    ) {
      privacySuccessMsg.textContent = "No se realizaron cambios en la configuración.";
      return;
    }

    if (!privacySettings.dataSaver && newSettings.dataSaver) {
      showPrivacySnackbar("Modo de ahorro de datos activado.");
    } else if (privacySettings.dataSaver && !newSettings.dataSaver) {
      showPrivacySnackbar("Modo de ahorro de datos desactivado.");
    }

    privacySettings = newSettings;
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(privacySettings));
    privacySuccessMsg.textContent = "Configuración de privacidad actualizada.";
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-settings-privacy']")) {
      loadPrivacySettings();
    }
  });

  function simulateDataUsage() {
    if (privacySettings.dataSaver) return;
    if (Math.random() < 0.05) {
      showPrivacySnackbar("Consumo alto detectado. ¿Deseas activar el modo ahorro?");
    }
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("[data-view-target='view-profile']")) {
      simulateDataUsage();
    }
  });

  // =========================
  //  CERRAR SESIÓN (MOBILE)
  // =========================
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    window.location.replace("../index.html");
  });

  // =========================
  //  INIT
  // =========================
  renderProfileHeader();
  renderContributions();
  renderBadges();
  renderSavedRoutes();
  renderFavorites();
  updateAccessSummary();
});
