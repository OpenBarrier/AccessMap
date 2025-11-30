// scripts/chatbotIntents.js
// =========================================================
//   CEREBRO DEL CHATBOT ACCESMAP — ULTRA FLEXIBLE PRO
// =========================================================
const PAGE_CONTEXT = {
    "home.html": {
        greeting: "¡Hola! 👋 ¿Necesitas ayuda con tu inicio o tus estadísticas?",
        suggestions: ["¿Qué es AccessMap?", "¿Cómo gano XP?", "¿Cómo subo de nivel?"]
    },
    "map.html": {
        greeting: "Estás en el mapa 🗺️. ¿Quieres saber cómo navegar o buscar lugares accesibles?",
        suggestions: ["¿Cómo uso el mapa?", "¿Cómo buscar un lugar?", "Ver rutas accesibles"]
    },
    "report.html": {
        greeting: "¿Quieres ayuda para reportar una barrera o un lugar accesible? ✏️",
        suggestions: ["¿Cómo reporto una barrera?", "¿Qué información debo poner?", "Tipos de reporte"]
    },
    "community.html": {
        greeting: "Bienvenida a la comunidad 👥. ¿Quieres saber cómo funciona?",
        suggestions: ["¿Cómo funciona la comunidad?", "Roles", "Puntos"]
    },
    "profile.html": {
        greeting: "Este es tu perfil 👤. ¿Qué deseas hacer?",
        suggestions: ["Editar perfil", "Ver contribuciones", "Cambiar contraseña"]
    }
};

window.ACCESSMAP_INTENTS = [

/* =========================================================
   1) SALUDO / AYUDA GENERAL
========================================================= */
{
  name: "saludo",
  context: null,
  followUpContext: "ayuda_general",
  patterns: [
    { regex: /\b(hola|holi|holita|hey|buenas|buenos días|buenas tardes|buenas noches|qué tal|que tal|que onda|hola bot|hola asistente)\b/i, weight: 1.0 },
    { regex: /(ayuda porfa|ayuda pls|necesito ayuda)/i, weight: 0.9 }
  ],
  responses: [
  "¡Hola! 👋 Soy tu asistente de AccessMap. ¿En qué parte de la app necesitas ayuda? (Mapa, Reportar, Rutas, Comunidad o Perfil).",
  "¡Hola! 😊 ¿Sobre qué te gustaría saber más hoy? Puedo ayudarte con el mapa, reportes, rutas, comunidad o tu perfil."
]

},

{
  name: "ayuda_general",
  context: "ayuda_general",
  followUpContext: "ayuda_general",
  patterns: [
    { regex: /(ayuda|no entiendo|no sé usar|no se usar|como funciona|cómo funciona|explicame|qué hago aquí|que hago aqui)/i, weight: 0.9 },
    { regex: /(qué opciones tengo|que opciones tengo|no se que hacer)/i, weight: 0.8 }
  ],
  responses: [
  "Puedo ayudarte con varias secciones de AccessMap:\n• Navegar el mapa 🗺️\n• Reportar barreras ⚠️\n• Ver y crear rutas accesibles 🧭\n• Explorar la comunidad 👥\n• Ajustar tu perfil y configuración 👤\nDime cuál te interesa y lo vemos juntos.",
  
  "Estoy aquí para apoyarte en lo que necesites 😊. Puedo explicarte el mapa, los reportes, las rutas accesibles, la comunidad y todo lo relacionado con tu perfil. ¡Dime qué necesitas!"
]

},

/* =========================================================
   2) MAPA
========================================================= */

{
  name: "mapa_busqueda",
  context: "mapa",
  followUpContext: "mapa",
  patterns: [
    // variaciones ultra flexibles
    { regex: /(buscar|buscador|barra de búsqueda|barra de busqueda)/i, weight: 1.0 },
    { regex: /(cómo busco|como busco|cómo encuentro|como encuentro)/i, weight: 1.0 },
    { regex: /(ver lugares|buscar lugar|buscar sitio|encontrar sitio)/i, weight: 0.85 },
    { regex: /(quiero ver.*mapa|quiero buscar.*mapa)/i, weight: 0.8 },
    // FAQ exacta
    { regex: /¿?c(ó|o)mo busco un lugar en el mapa\??/i, weight: 1.2 }
  ],
  responses: [
  "Puedes buscar lugares usando la barra de búsqueda del mapa 🔍. Solo escribe el nombre o dirección y selecciona el resultado.",
  "Para encontrar un sitio, usa la barra superior del mapa. Escribe lo que buscas y elige el resultado que coincida."
]

},

{
  name: "mapa_filtros_accesibles",
  context: "mapa",
  followUpContext: "mapa",
  patterns: [
    { regex: /(filtro.*accesible|solo accesibles|lugares accesibles|100% accesible|100 por ciento accesible)/i, weight: 1.0 },
    { regex: /(ver.*accesible|mostrar.*accesibles)/i, weight: 0.9 },
    // FAQ exacta
    { regex: /¿?c(ó|o)mo veo solo lugares accesibles\??/i, weight: 1.2 }
  ],
 responses: [
  "Activa el <b>filtro de accesibilidad</b> para ver solo los lugares marcados como accesibles ♿. Al desactivarlo, verás todo ordenado según su nivel de accesibilidad.",
  "En el mapa tienes un filtro para mostrar solo los lugares accesibles. Cuando lo apagues, volverás a ver todos los puntos."
]

},

{
  name: "mapa_filtros_barrera_tiempo",
  context: "mapa",
  followUpContext: "mapa",
  patterns: [
    { regex: /(filtro.*barrera|tipo de barrera|ver solo rampas|ver solo veredas)/i, weight: 1.0 },
    { regex: /(últimas 24 horas|ultimas 24 horas|últimos 7 días|ultimos 7 dias|por tiempo)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?para qué sirven los filtros de tiempo\??/i, weight: 1.2 }
  ],
  responses: [
  "Puedes filtrar los reportes por <b>tipo de barrera</b> y por <b>tiempo</b> (últimas 24h o última semana). Así te enfocas en lo más reciente ⚠️.",
  "El mapa permite filtrar por tipo de barrera y rango de tiempo, ideal para ver solo lo que te interesa en cada momento."
]

},

{
  name: "mapa_zona_critica",
  context: "mapa",
  followUpContext: "mapa",
  patterns: [
    { regex: /(zona crítica|zona critica|zonas críticas|zonas criticas|área crítica|area critica)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?qué significa la zona crítica\??/i, weight: 1.2 }
  ],
 responses: [
  "La <b>zona crítica</b> marca áreas donde se concentran muchas barreras recientes ⚠️. Te ayuda a evitar zonas peligrosas.",
  "Es una capa que resalta sectores con múltiples reportes. Útil para identificar zonas con dificultades frecuentes."
]

},
{
  name: "mapa_general",
  context: "mapa",
  followUpContext: "mapa",
  patterns: [
    { regex: /(qué hay en el mapa|que hay en el mapa)/i, weight: 1.2 },
    { regex: /(qué puedo hacer en el mapa|que puedo hacer en el mapa)/i, weight: 1.2 },
    { regex: /(para qué sirve el mapa|para que sirve el mapa)/i, weight: 1.1 },
    { regex: /(mapa opciones|mapa funciones|mapa herramientas)/i, weight: 1.0 }
  ],
 responses: [
  "En el mapa puedes:\n• Buscar lugares 🔍\n• Filtrar por accesibilidad ♿\n• Ver barreras y tipos de obstáculos\n• Revisar zonas críticas ⚠️\n• Crear rutas accesibles 🧭",
  "El mapa te permite explorar zonas, aplicar filtros, revisar reportes y generar rutas accesibles fácilmente."
]

},

/* =========================================================
se viene la parte 2: miedo, terror panico
========================================================= */
/* =========================================================
   3) REPORTES
========================================================= */

{
  name: "reportar_barrera",
  context: "reportes",
  followUpContext: "reportes",
  patterns: [
    { regex: /(reportar|reporte|denunciar|denuncia|avisar barrera|subir barrera|nuevo reporte)/i, weight: 1.0 },
    { regex: /(botón rojo|boton rojo|alerta roja|triángulo rojo|triangulo rojo)/i, weight: 0.95 },
    // FAQ exacta
    { regex: /¿?c(ó|o)mo reporto una barrera\??/i, weight: 1.2 }
  ],
responses: [
  "Para reportar una barrera:\n1️⃣ Presiona el botón rojo desde Mapa o desde el menú principal <b>Reportar</b> (+).\n2️⃣ Usa tu ubicación o elige una en el mapa 📍.\n3️⃣ Describe el problema.\n4️⃣ (Opcional) Sube una foto 📸.",
  
  "Puedes reportar una barrera desde el botón rojo o desde el menú principal <b>Reportar</b> (+). Selecciona la ubicación, escribe lo que ocurrió y agrega una foto si deseas."
]

},

{
  name: "reportar_foto",
  context: "reportes",
  followUpContext: "reportes",
  patterns: [
    { regex: /(foto obligatoria|necesito foto|tengo que subir foto|subir foto|tomar foto)/i, weight: 1.0 },
    { regex: /(no tengo foto|sin foto|no puedo sacar foto|no puedo tomar foto)/i, weight: 0.95 },
    // FAQ exacta
    { regex: /¿?necesito foto para reportar\??/i, weight: 1.2 }
  ],
responses: [
  "No necesitas foto obligatoriamente 😊, pero ayuda a validar más rápido tu reporte. Puedes tomarla o subirla desde tu galería.",
  "La foto es opcional, aunque siempre es útil para que la comunidad y el sistema verifiquen mejor la barrera."
]

},

{
  name: "reportar_geolocalizacion",
  context: "reportes",
  followUpContext: "reportes",
  patterns: [
    { regex: /(geolocalización|geolocalizacion|usar ubicación|usar ubicacion|mi ubicación actual|mi ubicacion actual|detectar ubicación)/i, weight: 1.0 },
    { regex: /(mover el punto|cambiar ubicación|cambiar posicion|cambiar la ubicación en el mapa)/i, weight: 0.9 },
    // FAQ exacta
    { regex: /¿?puedo usar geolocalización automática\??/i, weight: 1.2 }
  ],
 responses: [
  "Puedes usar tu <b>geolocalización automática</b> para detectar dónde estás, o mover el marcador manualmente en el mapa 📍.",
  "El sistema puede ubicarte automáticamente o dejarte ajustar la posición arrastrando el punto."
]

},

{
  name: "reportar_ia_validacion",
  context: "reportes",
  followUpContext: "reportes",
  patterns: [
    { regex: /(ia|inteligencia artificial|clasifica|clasificación|clasificacion|tipo de barrera)/i, weight: 1.0 },
    { regex: /(datos falsos|reporte falso|validación comunitaria|validacion comunitaria|verificar reporte)/i, weight: 0.95 },
    // FAQ exacta
    { regex: /¿?qué pasa si la ia clasifica mal\??/i, weight: 1.2 }
  ],
  responses: [
  "La IA detecta el tipo de barrera según tu comentario y foto 🤖. Luego la comunidad valida la información para evitar reportes incorrectos.",
  "La IA clasifica la barrera automáticamente, y después otros usuarios pueden validar para asegurar la precisión."
]

},
{
  name: "reportes_general",
  context: "reportes",
  followUpContext: "reportes",
  patterns: [
    { regex: /(qué hay en reportes|que hay en reportes)/i, weight: 1.2 },
    { regex: /(qué puedo hacer en reportes|que puedo hacer en reportes)/i, weight: 1.2 },
    { regex: /(para qué sirve reportar|para que sirve reportar)/i, weight: 1.1 },
    { regex: /(reportes opciones|reportes funciones)/i, weight: 1.0 }
  ],
responses: [
  "En Reportes puedes:\n• Registrar barreras ⚠️\n• Subir fotos\n• Usar geolocalización\n• Ver cómo la IA clasifica tu reporte 🤖",
  "La sección de reportes te permite informar barreras, adjuntar fotos, usar tu ubicación y ayudar a otros usuarios."
]

},

/* =========================================================
   4) RUTAS
========================================================= */

{
  name: "rutas_trazar",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(ruta accesible|trazar ruta|planificar ruta|cómo llegar|como llegar|camino accesible)/i, weight: 1.0 },
    { regex: /(quiero una ruta|ruta para llegar|me indica el camino)/i, weight: 0.85 },
    // FAQ exacta
    { regex: /¿?c(ó|o)mo trazo una ruta accesible\??/i, weight: 1.2 }
  ],
  responses: [
  "Para trazar una ruta accesible, abre el mapa y toca <b>Planificar ruta</b> 🧭. El sistema considera tu perfil de movilidad y barreras reportadas.",
  "Puedes generar una ruta accesible desde el mapa. AccessMap calcula el camino más seguro según tu movilidad."
]

},

{
  name: "rutas_guardar_limite",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(no puedo guardar más de 5 rutas|no puedo guardar mas de 5 rutas)/i, weight: 1.3 },

    { regex: /(guardar ruta|rutas guardadas|favoritos|favoritas)/i, weight: 1.0 },
    { regex: /(cuántas puedo guardar|cuantas puedo guardar|límite de rutas|limite de rutas)/i, weight: 0.95 },
    // FAQ exacta
    { regex: /¿?cómo guardo una ruta\??/i, weight: 1.2 }
  ],
  responses: [
  "Al terminar un recorrido puedes elegir <b>guardar la ruta</b> ⭐. Las cuentas Free pueden guardar hasta <b>5</b>. Premium: ilimitadas.",
  "Puedes guardar tus rutas favoritas al finalizar el viaje. Free: máximo 5 rutas. Premium: sin límite."
]

},

{
  name: "rutas_offline_premium",
  context: "rutas",
  followUpContext: "premium",
  patterns: [

    { regex: /(sin conexión|sin conexion)/i, weight: 1.3 },
    { regex: /(usar.*sin conexión|usar.*sin conexion)/i, weight: 1.2 },

    { regex: /(modo offline|sin internet|usar sin datos|usar sin conexión|usar sin conexion)/i, weight: 1.0 },
    { regex: /(premium.*offline|offline.*premium)/i, weight: 0.95 },
    // FAQ exacta
    { regex: /¿?puedo usar la app sin internet\??/i, weight: 1.2 }
  ],
  responses: [
  "El <b>modo offline</b> está disponible en cuentas Premium. Permite usar el mapa y tus rutas sin conexión 📡.",
  "Para usar AccessMap sin internet necesitas una cuenta Premium, con la que puedes precargar zonas y rutas."
]

},

{
  name: "rutas_puntuar_comentar",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(puntuar ruta|calificar ruta|dar estrellas|opinar de la ruta|comentar ruta)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?puedo puntuar una ruta al finalizar\??/i, weight: 1.2 }
  ],
  responses: [
  "Al finalizar tu ruta puedes puntuarla ⭐ y dejar un comentario para ayudar a otros usuarios.",
  "Sí, puedes calificar la ruta cuando terminas tu recorrido y dejar tus impresiones."
]

},

{
  name: "rutas_definicion",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(qué es una ruta accesible|que es una ruta accesible)/i, weight: 1.4 },
    { regex: /(definición ruta accesible|que significa ruta accesible)/i, weight: 1.2 }
  ],
  responses: [
    "Una <b>ruta accesible</b> es un camino optimizado para personas con movilidad reducida. Evita pendientes fuertes, escaleras, veredas dañadas y zonas críticas reportadas, usando siempre los tramos más seguros disponibles.",
    "Una <b>ruta accesible</b> es un recorrido que prioriza la seguridad: evita barreras, considera tu perfil de movilidad y usa reportes recientes de accesibilidad para guiarte."
  ]
},

{
  name: "rutas_adaptacion",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(adapta la ruta|ruta.*perfil de movilidad|perfil de movilidad.*ruta)/i, weight: 1.3 }
  ],
  responses: [
  "Sí 😊. AccessMap adapta las rutas según tu <b>perfil de movilidad</b>, evitando obstáculos y priorizando caminos seguros.",
  "Claro. Tu perfil de movilidad ayuda a generar rutas accesibles y personalizadas."
]

},

{
  name: "rutas_general",
  context: "rutas",
  followUpContext: "rutas",
  patterns: [
    { regex: /(qué hay en rutas|que hay en rutas)/i, weight: 1.2 },
    { regex: /(qué puedo hacer en rutas|que puedo hacer en rutas)/i, weight: 1.2 },
    { regex: /(para qué sirven las rutas|para que sirven las rutas)/i, weight: 1.1 }
  ],
  responses: [
  "En Rutas puedes:\n• Crear rutas accesibles 🧭\n• Guardar tus favoritas\n• Ver rutas adaptadas a tu movilidad\n• Calificar rutas ⭐",
  "Las rutas accesibles te ayudan a desplazarte evitando barreras y puedes guardarlas o calificarlas."
]

},

/* =========================================================
   5) PREMIUM VS FREE
========================================================= */

{
  name: "premium_vs_free",
  context: "premium",
  followUpContext: "premium",
  patterns: [
    { regex: /(premium|cuenta premium|suscripción|suscripcion|plan de pago|plan pago)/i, weight: 1.0 },
    { regex: /(diferencia entre free y premium|gratis vs premium)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?qué gano con una cuenta premium\??/i, weight: 1.2 }
  ],
  responses: [
  "Free incluye las funciones principales. Premium te da <b>rutas ilimitadas</b> y <b>modo offline</b> 🌟.",
  "El plan Premium añade guardar rutas sin límite y usar AccessMap sin conexión 📡."
]

},

/* =========================================================
   6) COMUNIDAD
========================================================= */

{
  name: "comunidad_general",
  context: "comunidad",
  followUpContext: "comunidad",
  patterns: [
    { regex: /(comunidad|colaboradores|ranking|puntos|insignias)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?qué puedo hacer en comunidad\??/i, weight: 1.2 }
  ],
responses: [
  "En Comunidad puedes ver colaboradores, tus insignias y la actividad de otros usuarios 👥.",
  "Aquí puedes ver aportes, insignias, rankings y toda la actividad de la comunidad."
]

},

{
  name: "comunidad_grupos",
  context: "comunidad",
  followUpContext: "comunidad",
  patterns: [
    { regex: /(grupo|grupos|crear grupo|mi grupo|unirme a un grupo|invitar a un grupo)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?cómo creo un grupo\??/i, weight: 1.2 }
  ],
 responses: [
  "Puedes crear un grupo, asignarle nombre y descripción, e invitar personas usando su <b>@usuario</b> 🙌.",
  "Desde Comunidad puedes formar grupos y sumar personas mediante @usuario o su ID."
]

},

{
  name: "puntos_insignias",
  context: "comunidad",
  followUpContext: "comunidad",
  patterns: [
    { regex: /(puntos|insignias|niveles|subir de nivel|recompensas)/i, weight: 1.0 },
    // FAQ exacta
    { regex: /¿?qué son los puntos e insignias\??/i, weight: 1.2 }
  ],
  responses: [
  "Ganas puntos al reportar o validar información ⭐. Con eso desbloqueas insignias según tu nivel de colaboración.",
  "Los puntos muestran tu aporte a la comunidad. Más puntos → mejores insignias ✨."
]

},
{
  name: "comunidad_info",
  context: "comunidad",
  followUpContext: "comunidad",
  patterns: [
    { regex: /(qué hay en comunidad|que hay en comunidad)/i, weight: 1.2 },
    { regex: /(qué puedo hacer en comunidad|que puedo hacer en comunidad)/i, weight: 1.2 },
    { regex: /(para qué sirve comunidad|para que sirve comunidad)/i, weight: 1.1 }
  ],
  responses: [
  "En Comunidad puedes:\n• Ver tus contribuciones\n• Crear o unirte a grupos\n• Ver rankings\n• Ganar insignias\n• Comparar actividad 👥",
  "Aquí encuentras grupos, rankings, tus logros y la actividad de otros colaboradores."
]

},

/* =========================================================
   7) PERFIL Y CONFIGURACIÓN
========================================================= */

{
  name: "perfil_general",
  context: "perfil",
  followUpContext: "perfil",
  patterns: [
    { regex: /(mi perfil|perfil de usuario|datos personales|editar perfil|ver perfil)/i, weight: 1.0 },
    { regex: /^¿?dónde edito mi información\??$/i, weight: 2.5 },

    // FAQ exacta
    { regex: /¿?dónde edito mi información\??/i, weight: 1.2 }
  ],
  responses: [
  "En tu Perfil puedes ver tus datos, contribuciones, rutas guardadas y accesos a configuración 👤.",
  "Tu Perfil reúne tu información básica, logros, actividad y ajustes."
]

},

{
  name: "perfil_accesibilidad",
  context: "perfil",
  followUpContext: "perfil",
  patterns: [
  { regex: /(perfil de accesibilidad|tipo de movilidad|silla de ruedas|muletas|coche de bebe|coche de bebé)/i, weight: 1.0 },
  { regex: /(cambiar mi perfil de accesibilidad|editar accesibilidad|actualizar accesibilidad)/i, weight: 0.95 },
  { regex: /(editar perfil de accesibilidad)/i, weight: 2.0 },   // ← AÑADIR ESTE
  { regex: /¿?qué es el perfil de accesibilidad\??/i, weight: 1.2 }
  ],
  responses: [
  "Puedes editar tu <b>perfil de accesibilidad</b> desde tu Perfil. Esto ayuda a personalizar tus rutas según tu movilidad ♿.",
  "Desde tu Perfil puedes cambiar tu tipo de movilidad para que las rutas se adapten mejor a ti."
]

},
{
  name: "perfil_info",
  context: "perfil",
  followUpContext: "perfil",
  patterns: [
    { regex: /(qué hay en perfil|que hay en perfil)/i, weight: 1.2 },
    { regex: /(qué puedo hacer en perfil|que puedo hacer en perfil)/i, weight: 1.2 },
    { regex: /(para qué sirve mi perfil|para que sirve mi perfil)/i, weight: 1.1 }
  ],
  responses: [
  "En tu Perfil puedes:\n• Ver tus datos\n• Ver tus insignias\n• Consultar tus contribuciones\n• Cambiar tu perfil de accesibilidad\n• Ajustar configuración 👤",
  "Tu Perfil muestra tu progreso, tus datos, tus contribuciones y opciones de personalización."
]

},
/* =========================================================
    8) CONFIGURACIÓN
  ========================================================= */
{
  name: "config_notificaciones",
  context: "configuracion",
  followUpContext: "configuracion",
  patterns: [
    { regex: /(notificaciones|alertas|avisos|recordatorios)/i, weight: 1.0 }
  ],
  responses: [
  "En <b>Configuración → Notificaciones</b> puedes activar o desactivar las alertas que prefieras 🔔.",
  "Puedes administrar tus avisos desde Configuración, en la sección de Notificaciones."
]

},

{
  name: "config_apariencia",
  context: "configuracion",
  followUpContext: "configuracion",
  patterns: [
    { regex: /(modo oscuro|modo claro|apariencia|tema|tamaño de texto|tamano de texto)/i, weight: 1.0 }
  ],
  responses: [
  "En Apariencia puedes activar el modo oscuro 🌙 y ajustar el tamaño del texto según tu comodidad.",
  "El modo oscuro y el tamaño de letra se modifican desde Configuración → Apariencia."
]

},

{
  name: "config_idioma",
  context: "configuracion",
  followUpContext: "configuracion",
  patterns: [
    { regex: /(idioma|lenguaje|cambiar idioma|language)/i, weight: 1.0 }
  ],
  responses: [
  "Puedes cambiar el idioma desde <b>Configuración → Idioma</b> 🌐.",
  "El idioma de AccessMap se ajusta en Configuración, opción Idioma."
]

},

{
  name: "config_privacidad",
  context: "configuracion",
  followUpContext: "configuracion",
  patterns: [
    { regex: /(privacidad|datos|historial|ahorro de datos|protección de datos|proteccion de datos)/i, weight: 1.0 }
  ],
  responses: [
  "En <b>Privacidad y Datos</b> puedes revisar tu historial y ajustar cómo se usa tu información 🔒.",
  "La sección Privacidad te permite gestionar tu información dentro de AccessMap."
]

},
{
  name: "app_funcionalidades",
  context: "ayuda_general",
  followUpContext: "ayuda_general",
  patterns: [
    { regex: /(qué puedo hacer en accessmap|que puedo hacer en accessmap)/i, weight: 1.2 },
    { regex: /(funciones de accessmap|funcionalidades de accessmap)/i, weight: 1.1 },
    { regex: /(qué hace esta app|para qué sirve esta app|para que sirve accessmap)/i, weight: 1.0 },
    { regex: /(como me ayuda accessmap|qué ofrece accessmap)/i, weight: 1.0 }
  ],
  responses: [
  "AccessMap te permite:\n• Buscar lugares accesibles ♿\n• Reportar barreras ⚠️\n• Trazar rutas accesibles 🧭\n• Guardar rutas ⭐\n• Ver zonas críticas ⚠️\n• Unirte a grupos y comunidad 👥\n• Ajustar tu perfil y preferencias 👤",
  
  "En AccessMap puedes explorar el mapa, reportar barreras, generar rutas accesibles, ver zonas críticas, guardar rutas, unirte a grupos y personalizar tu experiencia."
]

},
{
  name: "cierre_amable",
  context: null,
  followUpContext: "confirmar_salida",
  patterns: [
    { regex: /(ok|okay|oki|gracias|gracias bot|chévere gracias|perfecto|genial|listo|entendido|comprendido|todo claro)$/i, weight: 2.0 }
  ],
  responses: [
    "¡Genial! 😊 Me alegra que todo esté claro. ¿Deseas salir del chat?"
  ]
},

{
  name: "confirmar_salida",
  context: "confirmar_salida",
  followUpContext: null,
  patterns: [
    { regex: /^sí$|^si$|salir|cerrar|adios|chau|chao/i, weight: 1.5 },
    { regex: /^no$|todavía no|aun no|no aún/i, weight: 1.2 }
  ],
  responses: [
    "Perfecto 💚. Cuando quieras volver, estaré aquí."
  ],
  negativeResponses: [
    "¡Perfecto! 😊 ¿En qué más puedo ayudarte?"
  ]
},


/* =========================================================
se viene lo peor again
========================================================= */
/* =========================================================
   9) FAQ REQUEST — PREGUNTAS FRECUENTES
   (Cuando el usuario pide “FAQ”, “ayuda”, “qué puedo preguntar”, etc.)
========================================================= */

{
  name: "faq_request",
  context: "ayuda_general",
  followUpContext: "ayuda_general",
  patterns: [
    { regex: /(preguntas frecuentes|faq|f a q)/i, weight: 1.2 },
    { regex: /(que puedo preguntar|qué puedo preguntar)/i, weight: 1.1 },
    { regex: /(no entiendo esto|no entiendo nada|no sé qué preguntar|no se que preguntar)/i, weight: 1.1 },
    { regex: /(ayuda general|ayuda pls|ayuda porfa|ayúdame porfa)/i, weight: 1.0 },
    { regex: /(cómo funciona esto|como funciona esto)/i, weight: 0.9 }
  ],
  responses: [
  "Aquí tienes algunas preguntas frecuentes que pueden ayudarte 👇:",
  "Estas son algunas preguntas que suelen hacer los usuarios 😊. Elige una:"
]

}

];
/* =========================================================
   PREGUNTAS FRECUENTES POR MÓDULO
========================================================= */

window.ACCESSMAP_FAQ = {

  mapa: [
    "¿Cómo busco un lugar en el mapa?",
    "¿Qué significa la zona crítica?",
    "¿Cómo veo solo lugares accesibles?",
    "¿Para qué sirven los filtros de tiempo?",
    "¿Qué tipos de barrera puedo ver en el mapa?"
  ],

  reportes: [
    "¿Cómo reporto una barrera?",
    "¿Necesito foto para reportar?",
    "¿Puedo usar geolocalización automática?",
    "¿Qué pasa si la IA clasifica mal un reporte?",
    "¿Qué es la validación comunitaria?"
  ],

  rutas: [
    "¿Cómo trazo una ruta accesible?",
    "¿Cómo guardo una ruta?",
    "¿Puedo usar la app sin internet?",
    "¿El sistema adapta la ruta a mi tipo de movilidad?",
    "¿Puedo puntuar una ruta al finalizar?"
  ],

  comunidad: [
    "¿Qué puedo hacer en Comunidad?",
    "¿Cómo creo un grupo?",
    "¿Cómo invito a alguien con su @usuario?",
    "¿Qué son los puntos e insignias?",
    "¿Cómo veo los rankings?"
  ],

  perfil: [
    "¿Dónde edito mi información?",
    "¿Qué es el perfil de accesibilidad?",
    "¿Cómo cambio mi perfil de accesibilidad?",
    "¿Dónde veo mis contribuciones?",
    "¿Cómo veo mis rutas guardadas?"
  ],

  premium: [
    "¿Qué gano con una cuenta Premium?",
    "¿Puedo usar la app sin conexión?",
    "¿Por qué no puedo guardar más de 5 rutas?",
    "¿Qué significa guardar rutas ilimitadas?",
    "¿Cómo funciona el modo offline?"
  ],

  general: [
    "¿Qué puedo hacer en AccessMap?",
    "¿Qué son los reportes?",
    "¿Qué es una ruta accesible?",
    "¿Cómo funciona la comunidad?",
    "¿Qué diferencia hay entre Free y Premium?"
  ]
};

window.ACCESSMAP_FALLBACK_RESPONSES = [
  "No estoy completamente seguro de haber entendido tu pregunta 🤔. Mira estas preguntas frecuentes, quizás alguna te ayuda:",
  "Todavía no tengo una respuesta exacta para eso, pero aquí tienes algunas preguntas frecuentes que podrían ayudarte:"
];
