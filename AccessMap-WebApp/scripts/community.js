/* ===========================================
   TABS: Ranking / Grupos
=========================================== */
const tabs = document.querySelectorAll(".tab-item");
const tabSections = document.querySelectorAll(".tab-section");

tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();

        tabs.forEach((t) => t.classList.remove("tab-item--active"));
        tab.classList.add("tab-item--active");

        const selected = tab.dataset.tab; // "ranking" o "grupos"
        const view = document.getElementById(selected + "-view");

        tabSections.forEach((section) => section.classList.remove("active"));
        if (view) view.classList.add("active");
    });
});

/* ===========================================
   PERFIL + CREAR GRUPO + INFO GRUPO + EDITAR
=========================================== */
document.addEventListener("DOMContentLoaded", () => {
    /* ============ PANEL PERFIL COLABORADOR ============ */
    const profilePanel = document.getElementById("user-profile-panel");
    const closeButton = document.getElementById("btn-profile-close");
    const openItems = document.querySelectorAll(".js-open-user-profile");

    const avatarInitials = document.getElementById("profile-avatar-initials");
    const profileName = document.getElementById("profile-name");
    const profileHandle = document.getElementById("profile-handle");
    const profilePoints = document.getElementById("profile-points");
    const profileBio = document.getElementById("profile-bio");
    const profileMemberSince = document.getElementById("profile-member-since");
    const profileValidatedCount = document.getElementById("profile-validated-count");
    const profileSolvedCount = document.getElementById("profile-solved-count");
    const profileLastActivity = document.getElementById("profile-last-activity");
    const profileLastActivityTime = document.getElementById("profile-last-activity-time");

    if (profilePanel && openItems.length > 0) {
        openItems.forEach((item) => {
            item.addEventListener("click", () => {
                const data = item.dataset;

                avatarInitials.textContent = data.initials || "";
                profileName.textContent = data.name || "";
                profileHandle.textContent = data.handle || "";
                profilePoints.textContent = data.points || "";
                profileBio.textContent = data.bio || "";
                profileMemberSince.innerHTML =
                    '<span class="profile-dot"></span> ' + (data.memberSince || "");
                profileValidatedCount.textContent = data.validated || "0";
                profileSolvedCount.textContent = data.solved || "0";
                profileLastActivity.textContent = data.lastActivity || "";
                profileLastActivityTime.textContent = data.lastActivityTime || "";

                profilePanel.classList.add("active");
                profilePanel.setAttribute("aria-hidden", "false");
            });
        });

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                profilePanel.classList.remove("active");
                profilePanel.setAttribute("aria-hidden", "true");
            });
        }

        profilePanel.addEventListener("click", (event) => {
            if (event.target === profilePanel) {
                profilePanel.classList.remove("active");
                profilePanel.setAttribute("aria-hidden", "true");
            }
        });
    }

    /* ================== CREAR NUEVO GRUPO ================== */
    const groupModal = document.getElementById("group-modal");
    const btnOpenGroup = document.getElementById("btn-open-group-modal");
    const btnCloseGroup = document.getElementById("btn-profile-close-group");
    const btnCancelGroup = document.getElementById("btn-group-cancel");
    const btnNext = document.getElementById("btn-group-next");
    const btnFinish = document.getElementById("btn-group-finish");
    const btnBack = document.getElementById("btn-group-back");
    const groupOverlay = groupModal
        ? groupModal.querySelector(".group-modal-overlay")
        : null;

    const step1 = document.getElementById("group-step-1");
    const step2 = document.getElementById("group-step-2");
    const stepLabel = document.getElementById("group-modal-step-label");

    // Inputs y preview (Paso 1)
    const createIconButtons = groupModal
        ? groupModal.querySelectorAll(".group-icon-option")
        : [];
    const previewIcon = document.getElementById("preview-group-icon");
    const previewName = document.getElementById("preview-group-name");
    const previewDesc = document.getElementById("preview-group-description");
    const inputName = document.getElementById("group-name-input");
    const inputDesc = document.getElementById("group-description-input");

    // Preview (Paso 2)
    const previewIcon2 = document.getElementById("preview-group-icon-step2");
    const previewName2 = document.getElementById("preview-group-name-step2");
    const previewDesc2 = document.getElementById("preview-group-description-step2");

    function openGroupModal() {
        if (!groupModal) return;

        groupModal.classList.add("is-visible");
        groupModal.setAttribute("aria-hidden", "false");

        if (step1 && step2) {
            step1.classList.add("group-step--active");
            step2.classList.remove("group-step--active");
        }
        if (stepLabel) stepLabel.textContent = "Paso 1: Información del grupo";
        if (btnBack) btnBack.style.display = "none";
        if (btnNext) btnNext.style.display = "inline-flex";
        if (btnFinish) btnFinish.style.display = "none";
    }

    function closeGroupModal() {
        if (!groupModal) return;
        groupModal.classList.remove("is-visible");
        groupModal.setAttribute("aria-hidden", "true");
    }

    if (btnOpenGroup && groupModal) {
        btnOpenGroup.addEventListener("click", openGroupModal);
    }
    if (btnCloseGroup) btnCloseGroup.addEventListener("click", closeGroupModal);
    if (btnCancelGroup) btnCancelGroup.addEventListener("click", closeGroupModal);
    if (groupOverlay) groupOverlay.addEventListener("click", closeGroupModal);

    // Cambiar icono seleccionado (CREAR)
    if (createIconButtons.length > 0 && previewIcon) {
        createIconButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                createIconButtons.forEach((b) => b.classList.remove("is-selected"));
                btn.classList.add("is-selected");

                const icon = btn.dataset.icon || btn.textContent.trim();
                previewIcon.textContent = icon;
                if (previewIcon2) previewIcon2.textContent = icon;
            });
        });
    }

    // Preview nombre
    if (inputName && previewName) {
        inputName.addEventListener("input", () => {
            const value = inputName.value.trim();
            previewName.textContent = value || "Nombre del grupo";
            if (previewName2) previewName2.textContent = value || "Nombre del grupo";
        });
    }

    // Preview descripción
    if (inputDesc && previewDesc) {
        inputDesc.addEventListener("input", () => {
            const value = inputDesc.value.trim();
            const fallback =
                "Aquí aparecerá la descripción corta del grupo que estás creando.";
            previewDesc.textContent = value || fallback;
            if (previewDesc2) previewDesc2.textContent = value || fallback;
        });
    }

    // Paso 1 -> Paso 2
    if (btnNext && step1 && step2) {
        btnNext.addEventListener("click", () => {
            const nameValue = inputName ? inputName.value.trim() : "";
            const descValue = inputDesc ? inputDesc.value.trim() : "";

            if (!nameValue || !descValue) {
                alert("Completa el nombre y la descripción del grupo antes de continuar.");
                return;
            }

            step1.classList.remove("group-step--active");
            step2.classList.add("group-step--active");

            if (stepLabel) stepLabel.textContent = "Paso 2: Invitar miembros";
            if (btnBack) btnBack.style.display = "inline-flex";
            if (btnNext) btnNext.style.display = "none";
            if (btnFinish) btnFinish.style.display = "inline-flex";
        });
    }

    // Paso 2 -> Paso 1
    if (btnBack && step1 && step2) {
        btnBack.addEventListener("click", () => {
            step2.classList.remove("group-step--active");
            step1.classList.add("group-step--active");

            if (stepLabel) stepLabel.textContent = "Paso 1: Información del grupo";
            btnBack.style.display = "none";
            if (btnNext) btnNext.style.display = "inline-flex";
            if (btnFinish) btnFinish.style.display = "none";
        });
    }

    /* ================== EDITAR INFORMACIÓN DEL GRUPO ================== */
    const editModal = document.getElementById("edit-group-modal");
    const editOverlay = document.getElementById("edit-group-overlay");
    const editCloseBtn = document.getElementById("btn-edit-group-close");
    const editCancelBtn = document.getElementById("btn-edit-group-cancel");
    const editContinueBtn = document.getElementById("btn-edit-group-continue");

    const headerGroupName = document.getElementById("edit-group-header-name");
    const editInputName = document.getElementById("edit-group-name-input");
    const editInputDesc = document.getElementById("edit-group-description-input");
    const editPreviewIcon = document.getElementById("edit-preview-group-icon");
    const editPreviewName = document.getElementById("edit-preview-group-name");
    const editPreviewDesc = document.getElementById("edit-preview-group-description");

    const editIconButtons = editModal
        ? editModal.querySelectorAll(".group-icon-option")
        : [];

    let currentGroupCard = null;

    function openEditModal(fromElement) {
        if (!editModal) return;

        currentGroupCard = fromElement;

        const data = fromElement.dataset || {};
        const name = data.groupName || "Nombre del grupo";
        const description =
            data.groupDescription ||
            "Aquí va la descripción del grupo.";
        const icon = data.groupIcon || "🏢";

        if (headerGroupName) headerGroupName.textContent = name;
        if (editInputName) editInputName.value = name;
        if (editInputDesc) editInputDesc.value = description;
        if (editPreviewName) editPreviewName.textContent = name;
        if (editPreviewDesc) editPreviewDesc.textContent = description;
        if (editPreviewIcon) editPreviewIcon.textContent = icon;

        editIconButtons.forEach((btn) => {
            btn.classList.toggle("is-selected", btn.dataset.icon === icon);
        });

        editModal.classList.add("is-visible");
        editModal.setAttribute("aria-hidden", "false");
    }

    function closeEditModal() {
        if (!editModal) return;
        editModal.classList.remove("is-visible");
        editModal.setAttribute("aria-hidden", "true");
    }

    [editOverlay, editCloseBtn, editCancelBtn].forEach((el) => {
        if (el) el.addEventListener("click", closeEditModal);
    });

    if (editContinueBtn) {
        editContinueBtn.addEventListener("click", () => {
            if (currentGroupCard && editInputName && editInputDesc) {
                const newName = editInputName.value.trim() || "Nombre del grupo";
                const newDesc =
                    editInputDesc.value.trim() ||
                    "Aquí va la descripción del grupo.";

                let selectedIcon = "🏢";
                editIconButtons.forEach((btn) => {
                    if (btn.classList.contains("is-selected")) {
                        selectedIcon = btn.dataset.icon || selectedIcon;
                    }
                });

                currentGroupCard.dataset.groupName = newName;
                currentGroupCard.dataset.groupDescription = newDesc;
                currentGroupCard.dataset.groupIcon = selectedIcon;

                const cardTitle = currentGroupCard.querySelector(".group-name");
                const cardDesc = currentGroupCard.querySelector(".group-description");
                const cardIcon = currentGroupCard.querySelector(".group-icon");

                if (cardTitle) cardTitle.textContent = newName;
                if (cardDesc) cardDesc.textContent = newDesc;
                if (cardIcon) cardIcon.textContent = selectedIcon;
            }

            closeEditModal();
        });
    }

    editIconButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            editIconButtons.forEach((b) => b.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            const emoji = btn.dataset.icon;
            if (editPreviewIcon) editPreviewIcon.textContent = emoji;
        });
    });

    if (editInputName) {
        editInputName.addEventListener("input", () => {
            const value = editInputName.value.trim();
            const fallback = "Nombre del grupo";
            if (editPreviewName) editPreviewName.textContent = value || fallback;
            if (headerGroupName) headerGroupName.textContent = value || fallback;
        });
    }

    if (editInputDesc) {
        editInputDesc.addEventListener("input", () => {
            const value = editInputDesc.value.trim();
            const fallback =
                "Aquí va la descripción del grupo.";
            if (editPreviewDesc) editPreviewDesc.textContent = value || fallback;
        });
    }

    /* ====== CREAR Y AÑADIR NUEVO GRUPO (AL ACABAR WIZARD) ====== */
    if (btnFinish) {
        btnFinish.addEventListener("click", () => {
            if (!inputName || !inputDesc) return;

            const nameValue = inputName.value.trim();
            const descValue = inputDesc.value.trim();

            if (!nameValue || !descValue) {
                alert("Completa el nombre y la descripción del grupo.");
                return;
            }

            // Icono elegido
            let selectedIcon = "🏢";
            createIconButtons.forEach((btn) => {
                if (btn.classList.contains("is-selected")) {
                    selectedIcon = btn.dataset.icon || btn.textContent.trim();
                }
            });

            const groupsContainer = document.querySelector("#grupos-view .group-list");
            if (groupsContainer) {
                const card = document.createElement("div");
                // Nuevo grupo → tú eres Admin
                card.className = "group-item js-open-group-info";
                card.dataset.groupName = nameValue;
                card.dataset.groupDescription = descValue;
                card.dataset.groupIcon = selectedIcon;
                card.dataset.groupMembers = "1";
                card.dataset.groupReports = "0";
                card.dataset.role = "admin";

                card.innerHTML = `
                    <div class="group-icon">${selectedIcon}</div>
                    <div class="group-details">
                        <div class="group-header-row">
                            <div class="group-name">${nameValue}</div>
                            <div class="group-tag tag-active">Admin</div>
                        </div>
                        <div class="group-description">${descValue}</div>
                        <div class="group-stats">
                            <span>👥 1 miembro</span>
                            <span>📝 0 reportes</span>
                        </div>
                    </div>
                `;

                groupsContainer.appendChild(card);

                // Que también abra el modal de info
                card.addEventListener("click", () => openGroupInfo(card));
            }

            // feedback
            alert("Grupo creado (prototipo).");

            // Reset formulario
            inputName.value = "";
            inputDesc.value = "";
            previewName.textContent = "Nombre del grupo";
            previewDesc.textContent =
                "Aquí aparecerá la descripción corta del grupo que estás creando.";
            previewIcon.textContent = "🧱";
            if (previewName2) previewName2.textContent = "Nombre del grupo";
            if (previewDesc2) previewDesc2.textContent =
                "Aquí aparecerá la descripción corta del grupo que estás creando.";
            if (previewIcon2) previewIcon2.textContent = "🧱";
            createIconButtons.forEach((b) => b.classList.remove("is-selected"));
            if (createIconButtons[0]) createIconButtons[0].classList.add("is-selected");

            closeGroupModal();
        });
    }

    /* ===========================================
       MODAL INFO GRUPO + ABANDONAR
    ============================================ */
    const infoModal = document.getElementById("group-info-modal");
    const infoOverlay = document.getElementById("group-info-overlay");
    const infoCloseBtn = document.getElementById("btn-group-info-close");
    const infoDismissBtn = document.getElementById("btn-group-info-dismiss");
    const btnLeaveGroup = document.getElementById("btn-leave-group");
    const btnEditFromInfo = document.getElementById("btn-edit-group-from-info");
    const rolePill = document.getElementById("info-group-role");
    const adminEditSection = document.getElementById("admin-edit-section");

    const infoTriggers = document.querySelectorAll(".js-open-group-info");

    const infoName = document.getElementById("info-group-name");
    const infoDesc = document.getElementById("info-group-description");
    const infoMembers = document.getElementById("info-group-members");
    const infoReports = document.getElementById("info-group-reports");
    const infoStatMembers = document.getElementById("info-stat-members");
    const infoStatReports = document.getElementById("info-stat-reports");

    let currentJoinedCard = null;
    let currentGroupIsAdmin = false;

    function openGroupInfo(card) {
        if (!infoModal) return;

        currentJoinedCard = card;
        const data = card.dataset || {};
        const name = data.groupName || "Nombre del grupo";
        const description =
            data.groupDescription ||
            "Descripción del grupo.";
        const members = data.groupMembers || "0";
        const reports = data.groupReports || "0";
        const role = (data.role || "member").toLowerCase();

        currentGroupIsAdmin = role === "admin";

        if (infoName) infoName.textContent = name;
        if (infoDesc) infoDesc.textContent = description;
        if (infoMembers) infoMembers.textContent = `👥 ${members} miembros`;
        if (infoReports) infoReports.textContent = `📝 ${reports} reportes`;
        if (infoStatMembers) infoStatMembers.textContent = members;
        if (infoStatReports) infoStatReports.textContent = reports;

        // Mostrar/ocultar UI de administrador
        if (rolePill) {
            rolePill.style.display = currentGroupIsAdmin ? "inline-flex" : "none";
        }
        if (adminEditSection) {
            adminEditSection.style.display = currentGroupIsAdmin ? "block" : "none";
        }

        infoModal.classList.add("is-visible");
        infoModal.setAttribute("aria-hidden", "false");
    }

    function closeGroupInfo() {
        if (!infoModal) return;
        infoModal.classList.remove("is-visible");
        infoModal.setAttribute("aria-hidden", "true");
        currentJoinedCard = null;
        currentGroupIsAdmin = false;
    }

    // Tarjetas que abren info (miembro + admin + creados)
    infoTriggers.forEach((card) => {
        card.addEventListener("click", () => openGroupInfo(card));
    });

    [infoOverlay, infoCloseBtn, infoDismissBtn].forEach((el) => {
        if (el) el.addEventListener("click", closeGroupInfo);
    });

    // Abandonar grupo (cualquier rol)
    if (btnLeaveGroup) {
        btnLeaveGroup.addEventListener("click", () => {
            if (!currentJoinedCard) {
                closeGroupInfo();
                return;
            }

            const name = currentJoinedCard.dataset.groupName || "este grupo";

            const confirmar = window.confirm(
                `¿Seguro que deseas abandonar "${name}"?`
            );

            if (!confirmar) return;

            currentJoinedCard.remove();
            closeGroupInfo();
        });
    }

    // Desde el modal (si eres Admin) abrir editor
    if (btnEditFromInfo) {
        btnEditFromInfo.addEventListener("click", () => {
            if (!currentJoinedCard || !currentGroupIsAdmin) return;
            closeGroupInfo();
            openEditModal(currentJoinedCard);
        });
    }
});

/* ====== AUX: colores de icono (si luego quieres usarlo en CSS) ====== */
function getIconColorClass(emoji) {
    switch (emoji) {
        case "🏢":
            return "icon-bg--san-isidro";
        case "🧱":
            return "icon-bg--lima-norte";
        case "♿":
            return "icon-bg--transporte";
        case "🚌":
            return "icon-bg--transporte";
        default:
            return "icon-bg--lima-norte";
    }
}

