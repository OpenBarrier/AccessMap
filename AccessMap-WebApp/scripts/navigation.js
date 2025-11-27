/*PARTE DE MANUEL, ANTES DE ELIMINAR O CAMBIAR PREGUNTAME*/

// assets/scripts/navigation.js
console.log("✅ Navigation script cargado");

/* Referencias del DOM */
const routeCardsContainer = document.getElementById('route-cards-container');
const btnStartRoute = document.getElementById('btn-start-route');
const routeInfoPanel = document.getElementById('route-info');
const notificationWarning = document.getElementById('notification-warning');
const obstacleAlert = document.getElementById('obstacle-alert');
const btnRecalculate = document.getElementById('btn-recalculate');
const routeErrorMsg = document.getElementById('route-error-msg');
const routeModal = document.getElementById('route-modal');
const btnPlanificar = document.getElementById('btn-open-route-planner');
const backdrop = document.getElementById('route-modal-backdrop');
const btnCloseRouteModal = document.getElementById('route-modal-close');

//NUEVA PARTE MIERCOLES-26

const routeInfoStatus = document.querySelector('.route-info__status'); // <--- NUEVA REFERENCIA

// Pasos de navegación para la Demo (T-22b)
const pasosSimulados = [
    "🏁 Iniciando ruta hacia el destino...",
    "⬆️ Sigue recto por Av. Arequipa (200m)",
    "⚠️ Ten cuidado: Cruce peatonal adelante",
    "➡️ Gira a la derecha en Jr. Risso",
    "✅ Has llegado a tu destino"
];

// Datos simulados de rutas (Mock Data)

//NUEVA PARTE MIERCOLES-26

// Datos simulados de rutas (Mock Data)
const rutasMock = [
    { id: 1, nombre: "Ruta A (Iluminada)", tiempo: "15 min", seguridad: "Alta" },
    { id: 2, nombre: "Ruta B (Corta)", tiempo: "12 min", seguridad: "Media" }
];

// --- Lógica UI: Cerrar modal de ruta ---
if (btnCloseRouteModal) {
    btnCloseRouteModal.addEventListener('click', () => {
        routeModal.classList.add('route-modal--hidden');
        backdrop.classList.add('route-modal--hidden');
    });
}

// --- Lógica 1: Generar Rutas (HU Generación de Rutas) ---
if (btnPlanificar) {
    btnPlanificar.addEventListener('click', () => {
        // 1. Mostrar modal de planificación
        routeModal.classList.remove('route-modal--hidden');
        backdrop.classList.remove('route-modal--hidden');

        // 2. Limpiar estado previo
        routeCardsContainer.innerHTML = "";
        routeErrorMsg.classList.add('route-info--hidden');

        // 3. Simular hora del sistema para el Escenario 1
        // const horaActual = new Date().getHours(); 
        const esDeNoche = true; // Forzamos "noche" para que veas la etiqueta verde recomendada

        // 4. Simular Escenario 2: Error por falta de datos (ej. a las 3 AM)
        // CAMBIA A 'true' SI QUIERES PROBAR EL MENSAJE DE ERROR
        const errorDatos = false;

        if (errorDatos) {
            routeErrorMsg.classList.remove('route-info--hidden');
            routeErrorMsg.textContent = "Rutas generadas sin datos de seguridad por horario. ¿Ver estándar?";
        }

        // 5. Crear tarjetas de ruta dinámicamente
        rutasMock.forEach(ruta => {
            // Si es de noche y es la Ruta A, la marcamos como recomendada (lógica de negocio)
            const esRecomendada = esDeNoche && ruta.id === 1;
            const tag = esRecomendada ? '<span class="tag tag-verde" style="margin-left:5px">Segura noche</span>' : '';

            const card = document.createElement('div');
            card.className = 'route-card';
            // Template string para crear el HTML de la tarjeta
            card.innerHTML = `
                <div class="route-card__header">
                    <span>${ruta.nombre} ${tag}</span>
                    <span>${ruta.tiempo}</span>
                </div>
                <div class="route-card__meta">Seguridad: ${ruta.seguridad}</div>
            `;

            // Efecto visual de selección
            card.addEventListener('click', () => {
                document.querySelectorAll('.route-card').forEach(c => c.classList.remove('route-card--selected'));
                card.classList.add('route-card--selected');
            });

            routeCardsContainer.appendChild(card);
        });
    });
}

// --- Lógica 2: Iniciar Navegación y Alertas (HU Navegación) ---
//CAMBIOS MIERCOLES - 26

if (btnStartRoute) {
    btnStartRoute.addEventListener('click', () => {
        // 1. Cerrar modal de planificación
        routeModal.classList.add('route-modal--hidden');
        backdrop.classList.add('route-modal--hidden');

        // 2. Mostrar Header verde (Simula la navegación activa)
        if (routeInfoPanel) routeInfoPanel.classList.remove('route-info--hidden');

        // 3. INICIO SIMULACIÓN DE PASOS (T-22b) - NUEVO
        let pasoIndex = 0;

        // Función que cambia el texto cada 4 segundos
        const intervaloNavegacion = setInterval(() => {
            if (pasoIndex < pasosSimulados.length) {
                // Actualizamos el HTML del tag verde
                if (routeInfoStatus) {
                    routeInfoStatus.innerHTML = `<span class="tag tag-verde">${pasosSimulados[pasoIndex]}</span>`;
                }
                pasoIndex++;
            } else {
                clearInterval(intervaloNavegacion); // Detener al terminar
                // Opcional: Volver al estado original
                setTimeout(() => {
                    if (routeInfoStatus) {
                        routeInfoStatus.innerHTML = `<span class="tag tag-verde">Ruta finalizada</span>`;
                    }
                }, 2000);
            }
        }, 4000); // Cambia cada 4000ms (4 segundos)

        // 4. Simular Escenario 2: Alerta de Notificaciones Desactivadas
        const notifActivas = false; // Simulación: están desactivadas
        if (!notifActivas && notificationWarning) {
            notificationWarning.classList.remove('route-info--hidden');
        }

        // 5. Simular Escenario 1: Alerta de Obstáculo Crítico (aparece a los 3 segundos)
        setTimeout(() => {
            if (obstacleAlert) obstacleAlert.classList.remove('route-info--hidden');
        }, 3000);
    });
}

//CAMBIOS MIERCOLES-26

// Botón Recalcular (Acción del banner rojo)
if (btnRecalculate) {
    btnRecalculate.addEventListener('click', () => {
        alert("Recalculando ruta segura...");
        obstacleAlert.classList.add('route-info--hidden');
    });
}

/*PARTE DE MANUEL, ANTES DE ELIMINAR O CAMBIAR PREGUNTAME*/