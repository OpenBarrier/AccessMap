=== GUÍA TÉCNICA DEL PROYECTO ACCESSMAP ===
(Lectura obligatoria para todo el equipo)

1. REGLA DE ORO:
   - NO USEN VARIABLES CSS (var--). El profesor no las usa.
   - Usen los códigos de color HEXADECIMALES que están abajo.
   - Usen medidas REM para márgenes y paddings (ej. margin: 1rem).

2. COLORES DE LA MARCA (Copiar y Pegar):
   -------------------------------------
   #024260  -> Azul Oscuro (Títulos, Botones principales, Menú)
   #00b592  -> Verde Azulado (Iconos, Detalles bonitos)
   #05af43  -> Verde Pálido (SECUNDARIO/ÉXITO: Botones secundarios, Mensajes "Enviado", Tag "Accesible")   
   #f8fafc  -> Gris Claro (Fondo de la página)
   #334155  -> Gris Oscuro (Texto principal / Párrafos)

3. COLORES DE ESTADO (Solo para Etiquetas/Iconos de Accesibilidad):
   -------------------------------------
   #05af43  -> Verde (ACCESIBLE): Usar en etiquetas "Ruta Segura" o "Lugar Accesible".
   #e69000  -> Ámbar (PRECAUCIÓN): Usar en etiquetas "Accesibilidad Media" o "Con Ayuda".
   #e03737  -> Rojo (NO ACCESIBLE): Usar para barreras, "Rampa Rota", "Escaleras".

4. TIPOGRAFÍA:
   -------------------------------------
   Familia: 'Baloo 2', sans-serif;
   (Ya está importada en styles/main.css, no necesitan importarla de nuevo).

5. RESPONSIVIDAD (Reglas de Layout):
   -------------------------------------
   - Escritorio: Sidebar fijo a la izquierda.
   - Celular: Sidebar oculto, aparece con botón hamburguesa.
   - Contenedores: Usen "display: flex" y "flex-wrap: wrap" para que las tarjetas bajen automáticamente en celular.

6. DICCIONARIO DE IDs (Para conectar JS con HTML):
   -------------------------------------
   Chicos, para que el código de Frank y Manuel funcione con el diseño de Aida y María,
   pongan estos IDs EXACTOS en el HTML:

   --- LOGIN --- // aunque esta parte lo hace max :p
   Input Correo:      id="login-email"
   Input Password:    id="login-pass"
   Botón Ingresar:    id="btn-login-submit"

   --- REGISTRO --- // aunque esta parte lo hace milene :p
   Input Nombre:      id="reg-name"
   Input Correo:      id="reg-email"
   Input Pass:        id="reg-pass"
   Checkbox Términos: id="reg-terms"
   Botón Registrar:   id="btn-register-submit"

   --- AIDA Y MAFER: cuando terminen su parte html y css actualicen con la lista de ids que utilicen, mientras frank y manuel pueden avanzar con un html "sucio" con tal que coincidan las ids no habrá problema, eso sí frank y manuel no tienen para la parte SOLO de reporte y mapa no tienen que tocar el css. 

   Usen IDs en inglés

   --- MAPA ---
   Contenedor Mapa:   id="map-container"
   Input Búsqueda:    id="search-input"
   Contenedor del mapa:	map-container
   Input búsqueda:	search-input
   Panel búsqueda:	panel-search
   Panel rutas:	panel-route
   Resultado de rutas → destino: 	route-destination
   Contenedor rutas:	routes-container
   Botón cierre búsqueda:	btn-close-search
   Botón filtros (opcional): 	btn-filters
   Botón hora actual: 	btn-time-now
   Botón programar hora:	btn-time-schedule
   Botón compartir ruta:	btn-share-route
   Botón guardar ruta:	btn-save-route
   Botón iniciar navegación:	btn-start-navigation

   --- REPORTE ---
   Input Descripción: id="report-description"
   Input Foto:        id="report-photo"
   Botón Enviar:      id="btn-report-submit"

--- REPORTE: Cámara ---
Pantalla Cámara:                 id="screen-camera"
Botón Tomar Foto:                id="btn-take-photo"

         --- REPORTE: Preview de Foto ---
         Pantalla Preview:                id="screen-preview"
         Imagen Preview (foto):           id="report-photo"
         Botón Repetir Foto:              id="btn-retake"
         Botón Continuar Preview:         id="btn-continue-info"

         --- REPORTE: Información del Reporte ---
         Pantalla Info:                   id="screen-info"
         Botón Info Cancelar:             id="btn-info-cancel"
         Botón Info Continuar:            id="btn-info-continue"

         --- REPORTE: Formulario ---
         Pantalla Formulario:             id="screen-form"
         Foto Preview en Formulario:      id="report-photo-preview"
         Input Descripción:               id="report-description"
         Input Categoría:                 id="report-category"
         Input Ubicación:                 id="report-location"
         Botón Enviar Reporte:            id="btn-report-submit"

         --- REPORTE: Popups ---
         Popup Procesando:                id="popup-processing"
         Popup Éxito:                     id="popup-success"
         Foto en popup éxito:             id="success-photo"


         
   --- NAVEGACIÓN ---
   Botón Menú (Mobile): id="btn-menu-toggle"
   Sidebar:             id="sidebar-nav" 

5. REGLA DE ETIQUETAS (TAGS):
   -------------------------------------
   Si quieren poner una etiqueta de color (ej. "Rampa Dañada"), usen estas clases en el HTML:
   - class="tag tag-verde"   (Para cosas buenas)
   - class="tag tag-ambar"   (Para precauciones)
   - class="tag tag-rojo"    (Para peligros)


6. COPIAR Y PEGAR EN CADA SECCIÓN DEL TAB BAR ORIGINAL (MODIFICAR SOLO EL NOMBRE DE SU SECCION DEL TAB BAR/SIDE BAR EN CADA HOME, PERFIL, COMUNIDAD, REPORTE, MAPA VERSION HTML)
    <!-- BOTÓN HAMBURGUESA (solo móvil) -->
    <button class="btn-menu-toggle" id="btn-menu-toggle">☰</button>

    <!-- SIDEBAR -->
    <aside id="sidebar" class="sidebar">
        <div class="sidebar-brand">AccessMap</div>

        <nav class="sidebar-nav">
            <a href="home.html" class="nav-link">Inicio</a>
            <a href="map.html" class="nav-link">Mapa</a>
            <a href="report.html" class="nav-link">Reportar</a>
            <a href="community.html" class="nav-link">Comunidad</a>
            <a href="profile.html" class="nav-link">Perfil</a>
            <a href="../index.html" class="nav-link" style="margin-top: auto; color: #e03737;">
            Cerrar Sesión
        </nav>
    </aside>

    <!-- OVERLAY -->
    <div id="overlay" class="overlay"></div>

    <!-- CONTENIDO PRINCIPAL → CAMBIA EN CADA PÁGINA -->
    <main class="main-content">
        <!-- AQUÍ VA EL CONTENIDO DE LA PÁGINA --> lo editan segun su task etc 
    </main>

    <!-- NAV INFERIOR (MOBILE) -->
    <nav class="bottom-nav">
        <a href="home.html" class="bottom-link">🏠<span>Inicio</span></a>
        <a href="map.html" class="bottom-link">🗺️<span>Mapa</span></a>
        <a href="report.html" class="main-action">＋</a>
        <a href="community.html" class="bottom-link">👥<span>Comunidad</span></a>
        <a href="profile.html" class="bottom-link">👤<span>Perfil</span></a>
    </nav>


✔ SOLO pueden cambiar:
El contenido dentro de <main class="main-content"> ... </main>
El título de la página dentro de su <header>
❌ No deben tocar:
.btn-menu-toggle
<aside class="sidebar"> ...
<div id="overlay">
<nav class="bottom-nav">
Estos son componentes globales del layout.