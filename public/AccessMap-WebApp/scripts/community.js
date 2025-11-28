// ====================================================================
//  COMMUNITY.JS  –  Lógica de la página Comunidad (Ranking + Grupos)
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------------
    // 1) TABS: Ranking / Grupos
    // ------------------------------------------------------------
    const tabs = document.querySelectorAll(".tab-item");
    const tabSections = document.querySelectorAll(".tab-section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const selected = tab.dataset.tab; // "ranking" | "grupos"

            tabs.forEach((t) => t.classList.remove("tab-item--active"));
            tab.classList.add("tab-item--active");

            tabSections.forEach((section) => {
                section.classList.toggle(
                    "active",
                    section.id === selected + "-view"
                );
            });
        });
    });

    // ------------------------------------------------------------
    // 2) PANEL PERFIL COLABORADOR (slide desde la derecha)
    // ------------------------------------------------------------
    const profilePanel = document.getElementById("user-profile-panel");
    const profileCloseBtn = document.getElementById("btn-profile-close");
    const profileTriggers = document.querySelectorAll(".js-open-user-profile");

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

    function openProfile(data) {
        if (!profilePanel) return;

        avatarInitials.textContent = data.initials || "";
        profileName.textContent = data.name || "";
        profileHandle.textContent = data.handle || "";
        profilePoints.textContent = data.points || "0";
        profileBio.textContent = data.bio || "";
        profileMemberSince.innerHTML =
            '<span class="profile-dot"></span> ' +
            (data.memberSince || "");
        profileValidatedCount.textContent = data.validated || "0";
        profileSolvedCount.textContent = data.solved || "0";
        profileLastActivity.textContent = data.lastActivity || "";
        profileLastActivityTime.textContent = data.lastActivityTime || "";

        profilePanel.classList.add("active");
        profilePanel.setAttribute("aria-hidden", "false");
    }

    function closeProfile() {
        if (!profilePanel) return;
        profilePanel.classList.remove("active");
        profilePanel.setAttribute("aria-hidden", "true");
    }

    profileTriggers.forEach((el) => {
        el.addEventListener("click", () => {
            const d = el.dataset;
            openProfile({
                initials: d.initials,
                name: d.name,
                handle: d.handle,
                points: d.points,
                bio: d.bio,
                memberSince: d.memberSince,
                validated: d.validated,
                solved: d.solved,
                lastActivity: d.lastActivity,
                lastActivityTime: d.lastActivityTime,
            });
        });
    });

    if (profileCloseBtn) {
        profileCloseBtn.addEventListener("click", closeProfile);
    }

    // Cierra tocando fuera en móviles (opcional, si usas overlay)
    profilePanel?.addEventListener("click", (e) => {
        if (e.target === profilePanel) {
            closeProfile();
        }
    });

    // ============================================================
    // 3) BÚSQUEDAS – helpers de highlight & estado vacío
    // ============================================================

    // Guarda el texto original en data-original-text para no perderlo
    function ensureOriginalText(el) {
        if (!el) return;
        if (!el.dataset.originalText) {
            el.dataset.originalText = el.textContent;
        }
    }

    function resetHighlight(el) {
        if (!el) return;
        const original = el.dataset.originalText || el.textContent;
        el.innerHTML = original;
    }

    function applyHighlight(el, term) {
        if (!el) return;
        const original = el.dataset.originalText || el.textContent;
        if (!term) {
            el.innerHTML = original;
            return;
        }
        const regex = new RegExp(`(${term})`, "gi");
        el.innerHTML = original.replace(
            regex,
            '<span class="highlight">$1</span>'
        );
    }

    // ------------------------------------------------------------
    // 3.1) BÚSQUEDA COLABORADORES (Ranking)
    // ------------------------------------------------------------
    const collabSearchInput = document.querySelector(
        "#ranking-view .search-section .search-box input"
    );

    const rankingItems = document.querySelectorAll(
        ".top-ranking-list .ranking-item"
    );
    const collaboratorItems = document.querySelectorAll(
        ".full-collaborator-list .collaborator-item"
    );

    const allCollabItems = [...rankingItems, ...collaboratorItems];

    // Preparar textos originales para highlight
    allCollabItems.forEach((item) => {
        ensureOriginalText(item.querySelector(".name"));
        ensureOriginalText(item.querySelector(".handle"));
    });

    const collabListContainer = document.querySelector(
        ".full-collaborator-list .collaborator-list"
    );
    let collabEmptyCard = null;

    collabSearchInput?.addEventListener("input", () => {
        const term = collabSearchInput.value.trim().toLowerCase();
        let matches = 0;

        allCollabItems.forEach((item) => {
            const nameEl = item.querySelector(".name");
            const handleEl = item.querySelector(".handle");
            if (!nameEl || !handleEl) return;

            const name = (nameEl.dataset.originalText || nameEl.textContent)
                .toLowerCase();
            const handle = (handleEl.dataset.originalText || handleEl.textContent)
                .toLowerCase();

            const isMatch =
                term === "" ||
                name.includes(term) ||
                handle.includes(term);

            if (isMatch) {
                item.style.display = "flex";
                item.classList.add("fade-in");
                item.classList.remove("fade-out");
                applyHighlight(nameEl, term);
                applyHighlight(handleEl, term);
                matches++;
            } else {
                item.classList.remove("fade-in");
                item.classList.add("fade-out");
                // pequeña espera por animación
                setTimeout(() => {
                    item.style.display = "none";
                    resetHighlight(nameEl);
                    resetHighlight(handleEl);
                }, 180);
            }
        });

        // Empty state
        if (matches === 0) {
            if (!collabEmptyCard && collabListContainer) {
                collabEmptyCard = document.createElement("div");
                collabEmptyCard.className = "empty-result-card";
                collabEmptyCard.textContent =
                    "No se encontraron colaboradores.";
                collabListContainer.appendChild(collabEmptyCard);
            }
        } else if (collabEmptyCard) {
            collabEmptyCard.remove();
            collabEmptyCard = null;
        }
    });

    // ------------------------------------------------------------
    // 3.2) BÚSQUEDA GRUPOS
    // ------------------------------------------------------------
    const groupSearchInput = document.querySelector(
        "#grupos-view .search-section .search-box input"
    );
    const groupItems = document.querySelectorAll("#grupos-view .group-item");
    const firstGroupList = document.querySelector("#grupos-view .group-list");
    let groupEmptyCard = null;

    // Guardar textos originales para highlight
    groupItems.forEach((item) => {
        ensureOriginalText(item.querySelector(".group-name"));
        ensureOriginalText(item.querySelector(".group-description"));
    });

    groupSearchInput?.addEventListener("input", () => {
        const term = groupSearchInput.value.trim().toLowerCase();
        let matches = 0;

        groupItems.forEach((item) => {
            const nameEl = item.querySelector(".group-name");
            const descEl = item.querySelector(".group-description");
            if (!nameEl || !descEl) return;

            const name = (nameEl.dataset.originalText || nameEl.textContent)
                .toLowerCase();
            const desc = (descEl.dataset.originalText || descEl.textContent)
                .toLowerCase();

            const isMatch =
                term === "" ||
                name.includes(term) ||
                desc.includes(term);

            if (isMatch) {
                item.style.display = "flex";
                item.classList.add("fade-in");
                item.classList.remove("fade-out");
                applyHighlight(nameEl, term);
                applyHighlight(descEl, term);
                matches++;
            } else {
                item.classList.remove("fade-in");
                item.classList.add("fade-out");
                setTimeout(() => {
                    item.style.display = "none";
                    resetHighlight(nameEl);
                    resetHighlight(descEl);
                }, 180);
            }
        });

        if (matches === 0) {
            if (!groupEmptyCard && firstGroupList) {
                groupEmptyCard = document.createElement("div");
                groupEmptyCard.className = "empty-result-card";
                groupEmptyCard.textContent = "No se encontraron grupos.";
                firstGroupList.appendChild(groupEmptyCard);
            }
        } else if (groupEmptyCard) {
            groupEmptyCard.remove();
            groupEmptyCard = null;
        }
    });

    // ============================================================
    // 4) MODAL CREAR GRUPO (wizard 2 pasos)
    // ============================================================
    const groupModal = document.getElementById("group-modal");
    const openGroupBtn = document.getElementById("btn-open-group-modal");
    const closeGroupBtn = document.getElementById("btn-group-close");
    const cancelGroupBtn = document.getElementById("btn-group-cancel");
    const groupOverlay = groupModal?.querySelector(".group-modal-overlay");

    const step1 = document.getElementById("group-step-1");
    const step2 = document.getElementById("group-step-2");
    const stepLabel = document.getElementById("group-modal-step-label");

    const btnNext = document.getElementById("btn-group-next");
    const btnFinish = document.getElementById("btn-group-finish");
    const btnBack = document.getElementById("btn-group-back");

    const iconOptionsCreate = groupModal
        ? groupModal.querySelectorAll(".group-icon-option")
        : [];

    const inputGroupName = document.getElementById("group-name-input");
    const inputGroupDesc = document.getElementById("group-description-input");

    const previewIcon = document.getElementById("preview-group-icon");
    const previewName = document.getElementById("preview-group-name");
    const previewDesc = document.getElementById("preview-group-description");

    const previewIcon2 = document.getElementById("preview-group-icon-step2");
    const previewName2 = document.getElementById("preview-group-name-step2");
    const previewDesc2 = document.getElementById("preview-group-description-step2");

    function openGroupModal() {
        if (!groupModal) return;
        groupModal.setAttribute("aria-hidden", "false");

        // Estado inicial
        step1?.classList.add("group-step--active");
        step2?.classList.remove("group-step--active");
        if (stepLabel) stepLabel.textContent = "Paso 1: Información del grupo";
        if (btnBack) btnBack.style.display = "none";
        if (btnNext) btnNext.style.display = "inline-flex";
        if (btnFinish) btnFinish.style.display = "none";
    }

    function closeGroupModal() {
        pendingInvites = [];
        if (inviteList) inviteList.innerHTML = "";
        if (!groupModal) return;
        groupModal.setAttribute("aria-hidden", "true");
    }

    openGroupBtn?.addEventListener("click", openGroupModal);
    closeGroupBtn?.addEventListener("click", closeGroupModal);
    cancelGroupBtn?.addEventListener("click", closeGroupModal);
    groupOverlay?.addEventListener("click", closeGroupModal);

    // Selección icono
    iconOptionsCreate.forEach((btn) => {
        btn.addEventListener("click", () => {
            iconOptionsCreate.forEach((b) => b.classList.remove("is-selected"));
            btn.classList.add("is-selected");

            const emoji = btn.dataset.icon || btn.textContent.trim();
            if (previewIcon) previewIcon.textContent = emoji;
            if (previewIcon2) previewIcon2.textContent = emoji;
        });
    });

    // Preview nombre / descripción
    inputGroupName?.addEventListener("input", () => {
        const value = inputGroupName.value.trim() || "Nombre del grupo";
        if (previewName) previewName.textContent = value;
        if (previewName2) previewName2.textContent = value;
    });

    inputGroupDesc?.addEventListener("input", () => {
        const fallback =
            "Aquí aparecerá la descripción corta del grupo que estás creando.";
        const value = inputGroupDesc.value.trim() || fallback;
        if (previewDesc) previewDesc.textContent = value;
        if (previewDesc2) previewDesc2.textContent = value;
    });

    // Pasar de Paso 1 → Paso 2
    btnNext?.addEventListener("click", () => {
        const name = inputGroupName?.value.trim();
        const desc = inputGroupDesc?.value.trim();
        if (!name || !desc) {
            alert("Completa el nombre y la descripción del grupo.");
            return;
        }

        step1?.classList.remove("group-step--active");
        step2?.classList.add("group-step--active");
        if (stepLabel) stepLabel.textContent = "Paso 2: Invitar miembros";
        if (btnBack) btnBack.style.display = "inline-flex";
        if (btnNext) btnNext.style.display = "none";
        if (btnFinish) btnFinish.style.display = "inline-flex";
    });

    // Volver Paso 2 → Paso 1
    btnBack?.addEventListener("click", () => {
        step2?.classList.remove("group-step--active");
        step1?.classList.add("group-step--active");
        if (stepLabel) stepLabel.textContent = "Paso 1: Información del grupo";
        if (btnBack) btnBack.style.display = "none";
        if (btnNext) btnNext.style.display = "inline-flex";
        if (btnFinish) btnFinish.style.display = "none";
    });

    // Finalizar – crea una nueva card en "Mis Grupos"
    btnFinish?.addEventListener("click", () => {
        if (!inputGroupName || !inputGroupDesc) return;

        const name = inputGroupName.value.trim();
        const desc = inputGroupDesc.value.trim();
        if (!name || !desc) {
            alert("Completa el nombre y la descripción del grupo.");
            return;
        }

        let selectedIcon = "🧱";
        iconOptionsCreate.forEach((btn) => {
            if (btn.classList.contains("is-selected")) {
                selectedIcon = btn.dataset.icon || selectedIcon;
            }
        });

        const misGruposList = document.querySelector(
            "#grupos-view .group-list"
        );
        

        if (misGruposList) {
        const card = document.createElement("div");
        card.className = "group-item js-open-group-info";
        card.dataset.groupName = name;
        card.dataset.groupDescription = desc;
        const totalMembers = 1 + pendingInvites.length; // tú + invitados
/*DUDISSSS NO SE SI VA ESOOO */
        card.dataset.groupInvites = JSON.stringify(pendingInvites);
        card.dataset.groupMembers = totalMembers.toString();
        card.dataset.groupReports = "0";
        card.dataset.role = "admin";  // 👈 tú eres admin del grupo que creas
        card.dataset.groupIcon = selectedIcon;
        card.dataset.owner = "Tú";    // 👈 mostrará “Creado por: Tú”

            card.innerHTML = `
                <div class="group-icon icon-bg--lima-norte">${selectedIcon}</div>
                <div class="group-details">
                    <div class="group-header-row">
                        <div class="group-name">${name}</div>
                        <div class="group-tag tag-active">Admin</div>
                    </div>
                    <div class="group-description">${desc}</div>
                    <div class="group-stats">
                        <span>👥 1 miembro</span>
                        <span>📝 0 reportes</span>
                    </div>
                </div>
            `;

            // actualizar data-original para búsquedas
            ensureOriginalText(card.querySelector(".group-name"));
            ensureOriginalText(card.querySelector(".group-description"));

            misGruposList.prepend(card);
            const stats = card.querySelector(".group-stats");
            if (stats) {
                stats.innerHTML = `
                    <span>👥 ${totalMembers} miembros</span>
                    <span>📝 0 reportes</span>
                `;
            }

            attachGroupInfoTrigger(card);
        }

        // Reset rápido (no full)
        inputGroupName.value = "";
        inputGroupDesc.value = "";
        if (previewName) previewName.textContent = "Nombre del grupo";
        if (previewDesc)
            previewDesc.textContent =
                "Aquí aparecerá la descripción corta del grupo que estás creando.";
        if (previewName2) previewName2.textContent = "Nombre del grupo";
        if (previewDesc2)
            previewDesc2.textContent =
                "Aquí aparecerá la descripción corta del grupo que estás creando.";

        closeGroupModal();
        alert("Grupo creado (prototipo).");
    });
    // ============================================================
    // 4.1) INVITAR MIEMBROS (Paso 2 del modal Crear Grupo)
    // ============================================================
    const inviteInput = document.getElementById("group-invite-input");
    const inviteBtn = document.querySelector(".group-invite-send");
    const inviteList = document.getElementById("group-invite-list");
    let pendingInvites = []; // Lista temporal de invitados


    function addInviteFromInput() {
        if (!inviteInput || !inviteList) return;

        const rawValue = inviteInput.value.trim();
        if (!rawValue) return;

        // normalizamos a @usuario
        let value = rawValue;
        if (!value.startsWith("@")) {
            value = "@" + value;
        }

        // evitar duplicados simples
        const exists = Array.from(inviteList.children).some((li) => {
            return li.dataset.userHandle === value;
        });
        if (exists) {
            inviteInput.value = "";
            return;
        }

        // crear item de invitación
        // guardar en array
        pendingInvites.push({
            handle: value,
            name: value.replace("@", ""), // Usamos el handle como nombre simplificado
            role: "Miembro invitado"
        });

        // crear item en UI
        const li = document.createElement("li");
        li.className = "group-invite-item";
        li.dataset.userHandle = value;

        li.innerHTML = `
            <span class="group-invite-name">${value}</span>
            <button type="button" class="group-invite-remove" aria-label="Quitar invitación">
                ✕
            </button>
        `;

        // botón para eliminar invitación
        li.querySelector(".group-invite-remove").addEventListener("click", () => {
            li.remove();
        });

        inviteList.appendChild(li);
        inviteInput.value = "";
    }

    // Click en la flecha
    inviteBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        addInviteFromInput();
    });

    // Enter dentro del input
    inviteInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addInviteFromInput();
        }
    });

    // ============================================================
    // 5) MODAL INFO GRUPO + EDITAR + ABANDONAR
    // ============================================================
    const infoModal = document.getElementById("group-info-modal");
    const infoOverlay = document.getElementById("group-info-overlay");
    const infoCloseBtn = document.getElementById("btn-group-info-close");
    const infoDismissBtn = document.getElementById("btn-group-info-dismiss");
    const btnLeaveGroup = document.getElementById("btn-leave-group");
    const rolePill = document.getElementById("info-group-role");
    const adminEditSection = document.getElementById("admin-edit-section");

    const infoName = document.getElementById("info-group-name");
    const infoDesc = document.getElementById("info-group-description");
    const infoMembers = document.getElementById("info-group-members");
    const infoReports = document.getElementById("info-group-reports");
    const infoStatMembers = document.getElementById("info-stat-members");
    const infoStatReports = document.getElementById("info-stat-reports");
    const infoIcon = document.getElementById("info-group-icon");
    const infoOwner = document.getElementById("info-group-owner"); // 👈 nuevo
    // Tabs internos (Información / Miembros)
    const infoTabs = document.querySelectorAll(".group-info-tab");
    const infoViewSections = document.querySelectorAll(
        ".group-info-body .group-info-section:not(.group-info-section--members)"
    );
    const membersSection = document.getElementById("group-info-members-section");
    const membersList = document.getElementById("group-members-list");
    const membersEmpty = document.getElementById("group-members-empty");

    let currentGroupCard = null;
    let currentIsAdmin = false;

    function openGroupInfo(card) {
        if (!infoModal) return;
        currentGroupCard = card;

        const d = card.dataset;
        const name = d.groupName || "Nombre del grupo";
        const desc = d.groupDescription || "Descripción del grupo.";
        const members = d.groupMembers || "0";
        const reports = d.groupReports || "0";
        const role = (d.role || "member").toLowerCase();
        const icon = d.groupIcon || card.querySelector(".group-icon")?.textContent || "🧱";

        currentIsAdmin = role === "admin";

        if (infoName) infoName.textContent = name;
        if (infoDesc) infoDesc.textContent = desc;
        if (infoMembers) infoMembers.textContent = `👥 ${members} miembros`;
        if (infoReports) infoReports.textContent = `📝 ${reports} reportes`;
        if (infoStatMembers) infoStatMembers.textContent = members;
        if (infoStatReports) infoStatReports.textContent = reports;
        if (infoIcon) infoIcon.textContent = icon;

        if (rolePill) {
        rolePill.textContent = currentIsAdmin ? "Admin" : "Miembro";
        rolePill.style.display = "inline-flex";
        }

        if (adminEditSection) {
        adminEditSection.style.display = currentIsAdmin ? "block" : "none";
        }
        if (infoOwner) {
        infoOwner.textContent = d.owner || "—";
        }

        // ====== 🔹 Construir lista de miembros (demo) ======
        if (membersList && membersEmpty) {
            membersList.innerHTML = "";

            const totalMembers = parseInt(members, 10) || 0;
            const logicalMembers = [];

            // Propietario siempre admin
            if (d.owner && d.owner !== "Tú") {
                logicalMembers.push({
                    name: d.owner,
                    role: "Admin",
                });
            }

            // (según rol de admin en el grupo)
            logicalMembers.push({
                name: "Tú",
                role: currentIsAdmin ? "Admin" : "Miembro",
            });

            if (logicalMembers.length === 0 || totalMembers === 0) {
                // empty state
                membersList.style.display = "none";
                membersEmpty.style.display = "block";
            } else {
                membersList.style.display = "flex";
                membersEmpty.style.display = "none";

                // Añadir invitados desde dataset
                let invitedList = [];
                try {
                    invitedList = JSON.parse(d.groupInvites || "[]");
                } catch { invitedList = []; }

                invitedList.forEach(inv => {
                    logicalMembers.push({
                        name: inv.name || inv.handle.replace("@", ""),
                        role: "Miembro invitado"
                    });
                });

                logicalMembers.forEach((m) => {
                const li = document.createElement("li");
                li.className = "group-member-item";
                const initial = m.name.trim().charAt(0).toUpperCase() || "U";

                li.innerHTML = `
                    <div class="group-member-avatar">${initial}</div>
                    <div class="group-member-info">
                        <span class="group-member-name">${m.name}</span>
                        <span class="group-member-role">${m.role}</span>
                    </div>
                    ${currentIsAdmin && m.name !== "Tú"
                        ? `<button class="member-remove-btn" data-member="${m.name}">✕</button>`
                        : ""
                    }
                `;

                membersList.appendChild(li);
            });


                // Si en el dataset hay más miembros que los que mostramos,
                // ponemos un "X miembros más"
                if (totalMembers > logicalMembers.length) {
                    const liMore = document.createElement("li");
                    liMore.className = "group-member-extra";
                    liMore.textContent = `+ ${
                        totalMembers - logicalMembers.length
                    } miembros más`;
                    membersList.appendChild(liMore);
                }
            }
        }

        // Siempre arrancamos en la vista "Información"
        infoTabs.forEach((btn) => {
            btn.classList.toggle(
                "group-info-tab--active",
                btn.dataset.view === "info"
            );
        });
        infoViewSections.forEach((sec) => (sec.style.display = "block"));
        if (membersSection) membersSection.style.display = "none";

        infoModal.setAttribute("aria-hidden", "false");
    }

    function closeGroupInfo() {
        if (!infoModal) return;
        infoModal.setAttribute("aria-hidden", "true");
        currentGroupCard = null;
        currentIsAdmin = false;
    }

    // Tabs internos del modal (Información / Miembros)
    infoTabs.forEach((btn) => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view;
            if (!view) return;
            if (view === "activity") return; // aún no implementamos actividad

            infoTabs.forEach((b) => {
                b.classList.toggle("group-info-tab--active", b === btn);
            });

            if (view === "info") {
                infoViewSections.forEach((sec) => (sec.style.display = "block"));
                if (membersSection) membersSection.style.display = "none";
            } else if (view === "members") {
                infoViewSections.forEach((sec) => (sec.style.display = "none"));
                if (membersSection) membersSection.style.display = "block";
            }
        });
        });

        // Eliminar miembros (solo admin)
        membersList?.addEventListener("click", (e) => {
            const btn = e.target.closest(".member-remove-btn");
            if (!btn) return;

            const name = btn.dataset.member;
            if (!name) return;

            const ok = confirm(`¿Eliminar a "${name}" del grupo?`);
            if (!ok) return;

            // Obtener dataset del grupo actual
            const d = currentGroupCard.dataset;

            // Convertir lista de invitados JSON
            let invitedList = [];
            try {
                invitedList = JSON.parse(d.groupInvites || "[]");
            } catch {}

            // Filtrar
            invitedList = invitedList.filter(
                (m) => m.name !== name && m.handle !== "@" + name
            );

            // Guardar de nuevo
            d.groupInvites = JSON.stringify(invitedList);

            // Recalcular miembros totales
            const totalMembers = 1 + invitedList.length; // Tú + invitados
            d.groupMembers = totalMembers.toString();

            // Actualizar card visual
            const stats = currentGroupCard.querySelector(".group-stats");
            if (stats) {
                stats.innerHTML = `
                    <span>👥 ${totalMembers} miembros</span>
                    <span>📝 ${d.groupReports || 0} reportes</span>
                `;
            }

            openGroupInfo(currentGroupCard);
            }
    );


    function attachGroupInfoTrigger(card) {
        card.addEventListener("click", () => openGroupInfo(card));
    }

    // attach para los que ya vienen en el HTML
    document.querySelectorAll(".js-open-group-info").forEach(attachGroupInfoTrigger);

    infoOverlay?.addEventListener("click", closeGroupInfo);
    infoCloseBtn?.addEventListener("click", closeGroupInfo);
    infoDismissBtn?.addEventListener("click", closeGroupInfo);
        // ============================================================
    // 5.1) UNIRSE A GRUPO RECOMENDADO
    // ============================================================
    const joinGroupButtons = document.querySelectorAll(".join-group-button");

    joinGroupButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // por si algún día el padre también tiene click

            // Si ya se unió antes, no hacer nada
            if (btn.disabled) return;

            const d = btn.dataset;
            const parentCard = btn.closest(".group-item");
            const iconEl = parentCard?.querySelector(".group-icon");
            const iconEmoji = iconEl
                ? iconEl.textContent.trim()
                : "🧱";

            const name = d.groupName || "Nombre del grupo";
            const desc =
                d.groupDescription ||
                "Grupo local enfocado en hacer la ciudad más inclusiva.";
            const members = d.groupMembers || "0";
            const reports = d.groupReports || "0";
            const owner = d.owner || "—";

            // Lista de "Mis Grupos" (es la primera .group-list dentro de #grupos-view)
            const misGruposList = document.querySelector("#grupos-view .group-list");
            if (!misGruposList) return;

            // Crear nueva card como miembro
            const card = document.createElement("div");
            card.className = "group-item js-open-group-info";
            card.dataset.groupName = name;
            card.dataset.groupDescription = desc;
            card.dataset.groupMembers = members;
            card.dataset.groupReports = reports;
            card.dataset.role = "member";
            card.dataset.groupIcon = iconEmoji;
            card.dataset.owner = owner;

            card.innerHTML = `
                <div class="group-icon icon-bg--transporte">${iconEmoji}</div>
                <div class="group-details">
                    <div class="group-name">${name}</div>
                    <div class="group-description">${desc}</div>
                    <div class="group-stats">
                        <span>👥 ${members} miembros</span>
                        <span>📝 ${reports} reportes</span>
                    </div>
                </div>
            `;

            // Para que la búsqueda funcione con highlight
            ensureOriginalText(card.querySelector(".group-name"));
            ensureOriginalText(card.querySelector(".group-description"));

            // Agregar card a "Mis Grupos"
            misGruposList.appendChild(card);

            // Hacer que la nueva card abra el modal de info
            attachGroupInfoTrigger(card);
            openGroupInfo(card);

            // Feedback en el botón
            btn.disabled = true;
            btn.textContent = "Te has unido";
        });
    });

    // Abandonar grupo
    btnLeaveGroup?.addEventListener("click", () => {
        if (!currentGroupCard) {
            closeGroupInfo();
            return;
        }

        const name = currentGroupCard.dataset.groupName || "este grupo";
        const ok = window.confirm(`¿Seguro que deseas abandonar "${name}"?`);
        if (!ok) return;

        currentGroupCard.remove();
        closeGroupInfo();
    });

    // ============================================================
    // 6) MODAL EDITAR GRUPO (desde info si eres admin)
    // ============================================================
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

    function openEditModal(card) {
            console.log({
                headerGroupName,
                editInputName,
                editInputDesc,
                editPreviewIcon,
                editPreviewName,
                editPreviewDesc
            });
        if (!editModal) {
        console.log("ERROR: editModal es null");
        return;
            }
        currentGroupCard = card;

        const d = card.dataset;
        const name = d.groupName || "Nombre del grupo";
        const desc = d.groupDescription || "Descripción del grupo.";
        const icon =
            d.groupIcon ||
            card.querySelector(".group-icon")?.textContent ||
            "🧱";

        if (headerGroupName) headerGroupName.textContent = name;
        if (editInputName) editInputName.value = name;
        if (editInputDesc) editInputDesc.value = desc;
        if (editPreviewName) editPreviewName.textContent = name;
        if (editPreviewDesc) editPreviewDesc.textContent = desc;
        if (editPreviewIcon) editPreviewIcon.textContent = icon;

        editIconButtons.forEach((btn) => {
            btn.classList.toggle("is-selected", btn.dataset.icon === icon);
        });

        editModal.setAttribute("aria-hidden", "false");
    }

    function closeEditModal() {
        if (!editModal) return;
        editModal.setAttribute("aria-hidden", "true");
    }

    [editOverlay, editCloseBtn, editCancelBtn].forEach((el) => {
        el?.addEventListener("click", closeEditModal);
    });

    // Click en iconos dentro de editar
    editIconButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            editIconButtons.forEach((b) => b.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            const emoji = btn.dataset.icon || btn.textContent.trim();
            if (editPreviewIcon) editPreviewIcon.textContent = emoji;
        });
    });

    // Actualiza preview nombre/desc en modal editar
    editInputName?.addEventListener("input", () => {
        const value = editInputName.value.trim() || "Nombre del grupo";
        if (editPreviewName) editPreviewName.textContent = value;
        if (headerGroupName) headerGroupName.textContent = value;
    });

    editInputDesc?.addEventListener("input", () => {
        const value =
            editInputDesc.value.trim() ||
            "Grupo local enfocado en hacer la ciudad más inclusiva.";
        if (editPreviewDesc) editPreviewDesc.textContent = value;
    });

    // Guardar cambios de edición
    editContinueBtn?.addEventListener("click", () => {
        if (!currentGroupCard || !editInputName || !editInputDesc) {
            closeEditModal();
            return;
        }

        const newName = editInputName.value.trim() || "Nombre del grupo";
        const newDesc =
            editInputDesc.value.trim() ||
            "Grupo local enfocado en hacer la ciudad más inclusiva.";

        let selectedIcon = "🧱";
        editIconButtons.forEach((btn) => {
            if (btn.classList.contains("is-selected")) {
                selectedIcon = btn.dataset.icon || selectedIcon;
            }
        });

        currentGroupCard.dataset.groupName = newName;
        currentGroupCard.dataset.groupDescription = newDesc;
        currentGroupCard.dataset.groupIcon = selectedIcon;

        const cardNameEl = currentGroupCard.querySelector(".group-name");
        const cardDescEl = currentGroupCard.querySelector(".group-description");
        const cardIconEl = currentGroupCard.querySelector(".group-icon");

        if (cardNameEl) {
            cardNameEl.textContent = newName;
            ensureOriginalText(cardNameEl);
        }
        if (cardDescEl) {
            cardDescEl.textContent = newDesc;
            ensureOriginalText(cardDescEl);
        }
        if (cardIconEl) {
            cardIconEl.textContent = selectedIcon;
        }

        closeEditModal();
    });
    // Botón "Editar información del grupo" desde el modal info
    document
    .getElementById("btn-edit-group-from-info")
    ?.addEventListener("click", () => {
        console.log("CLICK DETECTADO → ADMIN =", currentIsAdmin);

        if (!currentGroupCard || !currentIsAdmin) {
            console.log("Bloqueado por rol o falta de card");
            return;
        }

        console.log("Abriendo modal editar...");
        closeGroupInfo();
        openEditModal(currentGroupCard);
    });

});
