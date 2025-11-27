// scripts/report.js
console.log("✅ Report script cargado correctamente");

/*
   HOLA MANUEL (T-25):
   Aquí va la lógica del formulario de reporte.
   
   Tus tareas aquí:
   1. Escuchar el evento 'submit' del formulario (ID: "form-reporte").
   2. Simular la carga de la foto (puedes usar un timeout de 2 segundos).
   3. Validar que la descripción no esté vacía.
   4. Mostrar el Modal de Éxito (T-26 de María F.) al terminar.
*/


// Tu código aquí...

/*PARTE DE MANUEL, SI VAS A CAMBIAR ALGO PREGUNTAME*/
// assets/scripts/report.js
console.log("✅ Report script cargado");

/* Referencias a elementos del DOM */
const formReporte = document.getElementById('form-reporte');
const btnCamara = document.getElementById('btn-foto');
const fotoStatus = document.getElementById('foto-status');
const modalReporte = document.getElementById('report-modal');
const btnOpenReport = document.getElementById('btn-open-report');
const btnCloseReport = document.getElementById('report-modal-close');
const modalBackdrop = document.getElementById('route-modal-backdrop'); // Reutilizamos el backdrop

// --- Lógica UI: Abrir/Cerrar Modal ---
function toggleReportModal(show) {
   if (show) {
      modalReporte.classList.remove('route-modal--hidden');
      modalBackdrop.classList.remove('route-modal--hidden');
   } else {
      modalReporte.classList.add('route-modal--hidden');
      // Solo ocultamos el backdrop si el otro modal también está cerrado
      const routeModal = document.getElementById('route-modal');
      if (routeModal.classList.contains('route-modal--hidden')) {
         modalBackdrop.classList.add('route-modal--hidden');
      }
   }
}

if (btnOpenReport) {
   btnOpenReport.addEventListener('click', () => toggleReportModal(true));
}
if (btnCloseReport) {
   btnCloseReport.addEventListener('click', () => toggleReportModal(false));
}

// --- Lógica: Simulación de Cámara ---
let fotoAdjunta = false;
if (btnCamara) {
   btnCamara.addEventListener('click', () => {
      fotoStatus.textContent = "Cargando foto...";
      // Simula un retardo de 1.5s como si estuviera procesando la imagen
      setTimeout(() => {
         fotoAdjunta = true;
         fotoStatus.textContent = "✅ Foto adjunta: IMG_2024.jpg";
         fotoStatus.style.color = "#05af43";
      }, 1500);
   });
}

// --- Lógica: Envío del Formulario (HU Reportes) ---
if (formReporte) {
   formReporte.addEventListener('submit', (e) => {
      e.preventDefault();

      // Escenario 2 HU: Error por GPS desactivado (Simulación)
      // CAMBIA ESTO A 'false' SI QUIERES PROBAR EL MENSAJE DE ERROR
      const gpsActivo = true;

      if (!gpsActivo) {
         alert("⚠️ Error: Se requiere tu ubicación precisa. Por favor, activa el GPS para enviar el reporte.");
         return;
      }

      const tipo = document.getElementById('report-type').value;
      const comentario = document.getElementById('report-comment').value;

      // Validación de campos vacíos
      if (tipo === "" || comentario === "") {
         alert("Por favor completa todos los campos.");
         return;
      }

      // Escenario 1 HU: Envío exitoso
      alert("¡Gracias! Reporte en procesamiento. Marcado como 'Pendiente de Verificación IA'.");

      // Resetear formulario y cerrar modal
      formReporte.reset();
      fotoAdjunta = false;
      fotoStatus.textContent = "Sin foto adjunta";
      fotoStatus.style.color = "#64748b";
      toggleReportModal(false);
   });
}
/*PARTE DE MANUEL, SI VAS A CAMBIAR ALGO PREGUNTAME*/