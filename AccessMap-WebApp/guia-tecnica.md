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

   --- REPORTE ---
   Input Descripción: id="report-description"
   Input Foto:        id="report-photo"
   Botón Enviar:      id="btn-report-submit"
   
   --- NAVEGACIÓN ---
   Botón Menú (Mobile): id="btn-menu-toggle"
   Sidebar:             id="sidebar-nav" 

5. REGLA DE ETIQUETAS (TAGS):
   -------------------------------------
   Si quieren poner una etiqueta de color (ej. "Rampa Dañada"), usen estas clases en el HTML:
   - class="tag tag-verde"   (Para cosas buenas)
   - class="tag tag-ambar"   (Para precauciones)
   - class="tag tag-rojo"    (Para peligros)