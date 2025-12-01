// ============================================================
// REPORT.JS – Flujo de Reportar Barrera (una sola página)
// ============================================================
(function() {
console.log("✅ report.js cargado (flujo reportes)");

/* ------------------------------------------------------------
   REFERENCIAS GENERALES
------------------------------------------------------------ */
const views = {
  camera: document.getElementById("view-camera"),
  preview: document.getElementById("view-preview"),
  sheet: document.getElementById("view-sheet"),
  form: document.getElementById("view-form"),
  drafts: document.getElementById("view-drafts"),
};

const headerTitle = document.getElementById("report-header-title");
const backBtn = document.getElementById("btn-header-back");

const bannerOffline = document.getElementById("state-banner-offline");
const snackbar = document.getElementById("snackbar");

const overlayProcessing = document.getElementById("overlay-processing");
const overlaySuccess = document.getElementById("overlay-success");

const previewImage = document.getElementById("preview-image");
const formImage = document.getElementById("form-image");
const successImage = document.getElementById("success-image");

const btnCapture = document.getElementById("btn-capture");
const btnPreviewRetake = document.getElementById("btn-preview-retake");
const btnPreviewContinue = document.getElementById("btn-preview-continue");
const btnSheetCancel = document.getElementById("btn-sheet-cancel");
const btnSheetContinue = document.getElementById("btn-sheet-continue");
const btnSendReport = document.getElementById("btn-send-report");

const btnOpenDrafts = document.getElementById("btn-open-drafts");
const btnDraftsBack = document.getElementById("btn-drafts-back");
const draftsList = document.getElementById("drafts-list");

const commentInput = document.getElementById("report-comment");
const locationSelect = document.getElementById("report-location");

const DRAFTS_KEY = "accessmap_report_drafts";
const PLACEHOLDER_IMAGE = "../images/report-placeholder.jpg"; // cámbialo por tu imagen real si quieres

let currentView = "camera";


/* ------------------------------------------------------------
   UTIL: CAMBIO DE VISTAS
------------------------------------------------------------ */
function setView(viewName) {
  currentView = viewName;
  Object.entries(views).forEach(([name, el]) => {
    if (name === viewName) {
      el.classList.add("report-view--active");
    } else {
      el.classList.remove("report-view--active");
    }
  });

  // Título del header según vista
  const titles = {
    camera: "Capturar barrera",
    preview: "Imagen capturada",
    sheet: "Reportar barrera",
    form: "Creación de reporte",
    drafts: "Borradores pendientes",
  };
  headerTitle.textContent = titles[viewName] || "Reporte";
}

/* ------------------------------------------------------------
   UTIL: SNACKBAR
------------------------------------------------------------ */
function showSnackbar(message) {
  if (!snackbar) return;
  snackbar.textContent = message;
  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), 2600);
}

/* ------------------------------------------------------------
   UTIL: LOCALSTORAGE BORRADORES
------------------------------------------------------------ */
function loadDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error leyendo borradores", err);
    return [];
  }
}

function saveDrafts(drafts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  updateDraftsAccessButton();
}

function addDraft(draft) {
  const drafts = loadDrafts();
  drafts.push(draft);
  saveDrafts(drafts);
}

/* ------------------------------------------------------------
   UTIL: RENDERIZAR BORRADORES
------------------------------------------------------------ */
function renderDrafts() {
  const drafts = loadDrafts();
  draftsList.innerHTML = "";

  if (!drafts.length) {
    draftsList.innerHTML = "<p>No tienes borradores pendientes.</p>";
    return;
  }

  drafts.forEach((draft) => {
    const card = document.createElement("div");
    card.className = "draft-card";
    card.dataset.id = draft.id;

    const main = document.createElement("div");
    main.className = "draft-main";

    const titleRow = document.createElement("div");
    titleRow.className = "draft-title-row";

    const idSpan = document.createElement("span");
    idSpan.className = "draft-id";
    idSpan.textContent = `nº ${draft.id}`;

    const statusSpan = document.createElement("span");
    statusSpan.className = "draft-status";
    statusSpan.textContent = draft.status;

    if (draft.status === "Pendiente") {
      statusSpan.classList.add("draft-status--pending");
    } else if (draft.status === "Enviando") {
      statusSpan.classList.add("draft-status--sending");
    } else if (draft.status === "Error") {
      statusSpan.classList.add("draft-status--error");
    }

    titleRow.appendChild(idSpan);
    titleRow.appendChild(statusSpan);

    const place = document.createElement("p");
    place.className = "draft-place";
    place.textContent = draft.comment || "(Sin comentario)";

    const date = document.createElement("p");
    date.className = "draft-date";
    date.textContent = draft.date || "";

    main.appendChild(titleRow);
    main.appendChild(place);
    main.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "draft-actions";

    const sendBtn = document.createElement("button");
    sendBtn.className = "btn-azul btn-sm";
    sendBtn.textContent = "Enviar ahora";
    sendBtn.addEventListener("click", () => resendDraft(draft.id));

    actions.appendChild(sendBtn);

    card.appendChild(main);
    card.appendChild(actions);

    draftsList.appendChild(card);
  });
}

function updateDraftsAccessButton() {
  const drafts = loadDrafts();
  if (drafts.length > 0) {
    btnOpenDrafts.classList.remove("hidden");
  } else {
    btnOpenDrafts.classList.add("hidden");
  }
}

/* ------------------------------------------------------------
   RESEND DRAFT – intentar enviar un borrador
------------------------------------------------------------ */
function resendDraft(draftId) {
  if (!navigator.onLine) {
    showSnackbar("Sin conexión. Inténtalo de nuevo cuando tengas internet.");
    return;
  }

  let drafts = loadDrafts();
  const draft = drafts.find((d) => d.id === draftId);
  if (!draft) return;

  draft.status = "Enviando";
  saveDrafts(drafts);
  renderDrafts();

  setTimeout(() => {
    // 20% de probabilidad de error
    const success = Math.random() > 0.2;

    drafts = loadDrafts();
    const index = drafts.findIndex((d) => d.id === draftId);
    if (index === -1) return;

    if (success) {
      drafts.splice(index, 1);
      showSnackbar("Borrador enviado correctamente.");
    } else {
      drafts[index].status = "Error";
      showSnackbar("No se pudo enviar el borrador. Vuelve a intentarlo.");
    }

    saveDrafts(drafts);
    renderDrafts();
  }, 1500);
}

/* ------------------------------------------------------------
   ESTADO ONLINE / OFFLINE
------------------------------------------------------------ */
function updateOnlineState() {
  if (navigator.onLine) {
    bannerOffline.classList.add("hidden");
  } else {
    bannerOffline.classList.remove("hidden");
  }
}

window.addEventListener("online", updateOnlineState);
window.addEventListener("offline", updateOnlineState);

/* ------------------------------------------------------------
   1) CÁMARA – CAPTURAR
------------------------------------------------------------ */
btnCapture?.addEventListener("click", () => {
    btnCapture.classList.add("camera-shutter--pulse");
    setTimeout(() => btnCapture.classList.remove("camera-shutter--pulse"), 400);

    // simulación de foto
    previewImage.src = PLACEHOLDER_IMAGE;
    formImage.src = PLACEHOLDER_IMAGE;
    successImage.src = PLACEHOLDER_IMAGE;

    setView("preview");

    // ACTIVAR OVERLAY VISUAL
    const ov = document.getElementById("preview-overlay");
    ov.style.opacity = 1;
    setTimeout(() => ov.style.opacity = 0, 1500);
});

/* SUBIR FOTO DESDE GALERÍA */
const uploadInput = document.getElementById("upload-photo");
const btnUploadPhoto = document.getElementById("btn-upload-photo");

btnUploadPhoto?.addEventListener("click", () => {
  uploadInput.click();
});

uploadInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    previewImage.src = ev.target.result;
    formImage.src = ev.target.result;
    successImage.src = ev.target.result;

    setView("preview");

    const ov = document.getElementById("preview-overlay");
    ov.style.opacity = 1;
    setTimeout(() => ov.style.opacity = 0, 1500);
};

  reader.readAsDataURL(file);
});

/* ------------------------------------------------------------
   2) PREVIEW – TOMAR OTRA / CONTINUAR
------------------------------------------------------------ */
btnPreviewRetake?.addEventListener("click", () => {
  setView("camera");
});

btnPreviewContinue?.addEventListener("click", () => {
  setView("sheet");
});

/* ------------------------------------------------------------
   3) SHEET – CANCELAR / CONTINUAR
------------------------------------------------------------ */
btnSheetCancel?.addEventListener("click", () => {
  setView("camera");
});

btnSheetContinue?.addEventListener("click", () => {
  setView("form");
});

/* ------------------------------------------------------------
   4) FORMULARIO – ENVIAR REPORTE
------------------------------------------------------------ */
btnSendReport?.addEventListener("click", () => {
  const comment = commentInput.value.trim();
  const locationValue = locationSelect.value;

  if (!comment || !locationValue) {
    showSnackbar("Completa todos los campos antes de enviar.");
    return;
  }

  // Si no hay conexión → guardar como borrador
  if (!navigator.onLine) {
    const draft = {
      id: Date.now().toString().slice(-6),
      comment: comment.slice(0, 60) + (comment.length > 60 ? "…" : ""),
      date: new Date().toLocaleDateString(),
      status: "Pendiente",
    };

    addDraft(draft);
    renderDrafts();
    showSnackbar("Sin conexión. Tu reporte se guardó como borrador.");
    bannerOffline.classList.remove("hidden");
    return;
  }

  // ONLINE → simular envío
  overlayProcessing.classList.remove("hidden");

  setTimeout(() => {
    overlayProcessing.classList.add("hidden");
    overlaySuccess.classList.remove("hidden");
    showSnackbar("Reporte enviado correctamente.");

    // limpiar formulario
    commentInput.value = "";
    locationSelect.value = "actual";

    // ocultar banner offline si estuviera
    bannerOffline.classList.add("hidden");

    // ocultar banner de éxito luego de unos segundos
    setTimeout(() => {
      overlaySuccess.classList.add("hidden");
      setView("camera");
    }, 3500);
  }, 1800);
});

/* ------------------------------------------------------------
   5) BORRADORES – ENTRAR / SALIR
------------------------------------------------------------ */
btnOpenDrafts?.addEventListener("click", () => {
  renderDrafts();
  setView("drafts");
});

btnDraftsBack?.addEventListener("click", () => {
  setView("form");
});

/* ------------------------------------------------------------
   BOTÓN DE VOLVER DEL HEADER
------------------------------------------------------------ */
backBtn?.addEventListener("click", () => {
  if (currentView === "camera") {
    // volver al mapa o a home
    window.location.href = "map.html";
  } else if (currentView === "preview") {
    setView("camera");
  } else if (currentView === "sheet") {
    setView("preview");
  } else if (currentView === "form") {
    setView("sheet");
  } else if (currentView === "drafts") {
    setView("form");
  }
});

/* ------------------------------------------------------------
   INICIALIZACIÓN
------------------------------------------------------------ */
function initReportModule() {
  updateOnlineState();
  updateDraftsAccessButton();
  setView("camera");

  // Si no tienes imagen de placeholder, evita errores
  if (!PLACEHOLDER_IMAGE) {
    console.warn("Configura PLACEHOLDER_IMAGE en report.js");
  }
}

document.addEventListener("DOMContentLoaded", initReportModule);

})();