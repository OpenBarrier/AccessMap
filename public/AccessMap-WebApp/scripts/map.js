(function () {
 document.addEventListener("DOMContentLoaded", initMapPage);


 function initMapPage() {
//VRO TENGO MIEDO
   // ==========================================
     // DATOS SIMULADOS PARA TU DEMO (FARMACIAS)
     // ==========================================
     var MOCK_DATA = [
       {
         lat: -12.0465, lng: -77.0430,
         title: "Farmacia La Luz",
         subtitle: "Av. Emancipación 450 · 100m",
         rating: 4.8,
         type: "accessible", // Esto activará tu pin VERDE existente
         features: ["Rampa", "Entrada amplia"]
       },
       {
         lat: -12.0455, lng: -77.0425,
         title: "Farmacia Belén",
         subtitle: "Jr. de la Unión 200 · 250m",
         rating: 4.5,
         type: "accessible", // Esto activará tu pin VERDE existente
         features: ["Baño adaptado", "Ascensor"]
       },
       {
         lat: -12.0475, lng: -77.0435,
         title: "Farmacia Don Pepe",
         subtitle: "Av. Tacna 120 · 400m",
         rating: 3.4,
         type: "warning", // Esto activará tu pin ÁMBAR existente
         features: ["Rampa empinada"]
       },
       {
         lat: -12.0485, lng: -77.0415,
         title: "Farmacia Universal",
         subtitle: "Jr. Puno 300 · 600m",
         rating: 1.2,
         type: "barrier", // Esto activará tu pin ROJO existente
         subtype: "escaleras", // Para que salga el ícono correcto
         features: ["Solo escaleras"]
       }
     ];
    
     // Variable para guardar qué estamos mostrando
     var currentMockResults = [];
// fin vro miedo terror panico supuestamente fue para la barra de busqueda


   var mapContainer = document.getElementById("map-container");
   if (!mapContainer) return;


   // ----- Elementos del DOM -----
   var btnMenuToggle = document.getElementById("btn-menu-toggle");
   var sidebar = document.getElementById("sidebar-nav");
   var btnZoomIn = document.getElementById("btn-zoom-in");
   var btnZoomOut = document.getElementById("btn-zoom-out");
   var btnCenterLocation = document.getElementById("btn-center-location");
   var btnOpenReport = document.getElementById("btn-open-report");
   var toggleAccessible = document.getElementById("toggle-accessible");
   var searchForm = document.getElementById("search-form");
   var searchInput = document.getElementById("search-input");
   var searchSuggestions = document.getElementById("search-suggestions");
   var routeInfo = document.getElementById("route-info");
   var routeDuration = document.getElementById("route-duration");
   var routeDistance = document.getElementById("route-distance");
   var toast = document.getElementById("map-toast");
   var toastText = document.getElementById("map-toast-text");
   var toggleVisibleAccessible = document.getElementById(
     "toggle-visible-accessible"
   );
   var toggleVisibleWarning = document.getElementById(
     "toggle-visible-warning"
   );
   var toggleVisibleBarrier = document.getElementById(
     "toggle-visible-barrier"
   );
   var btnOpenPlaceFilter = document.getElementById("btn-open-place-filter");
   var placeFilterPanel = document.getElementById("place-filter-panel");
   var placeFilterChips = document.querySelectorAll(".place-filter__chip");
   var btnTogglePlaceFilter = document.getElementById(
     "btn-toggle-place-filter"
   );
   var placeFilterClose = document.getElementById("place-filter-close");
   var searchOverlay = document.getElementById("search-overlay");
   var searchOverlayClose = document.getElementById("search-overlay-close");
   var searchResultsContainer = document.getElementById(
     "search-results-container"
   );


   // Modal de ruta
   var routeModal = document.getElementById("route-modal");
   var routeModalBackdrop = document.getElementById("route-modal-backdrop");
   var routeModalClose = document.getElementById("route-modal-close");
   var btnOpenRoutePlanner = document.getElementById("btn-open-route-planner");
   var routeOriginInput = document.getElementById("route-origin-input");
   var routeDestInput = document.getElementById("route-dest-input");
   var btnPickOrigin = document.getElementById("btn-pick-origin");
   var btnPickDestination = document.getElementById("btn-pick-destination");
   var btnStartRoute = document.getElementById("btn-start-route");
   var filterChips = document.querySelectorAll(".chip-filter");


   // ----- Mapa -----
   var map = L.map("map-container", { zoomControl: false }).setView(
     [-12.0464, -77.0428],
     14
   );


   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
     maxZoom: 19,
     attribution: "&copy; OpenStreetMap contributors",
   }).addTo(map);
///INICIO DE AGREGACION
   // ============================================================
   //   ZOOM INDICATOR + SNACKBAR (FUNCIONA AL 100%)
   // ============================================================
   var zoomIndicator = document.getElementById("zoom-indicator");
   var zoomSnackbar = document.getElementById("zoom-snackbar");
   var zoomSnackbarText = document.getElementById("zoom-snackbar-text");


   var lastZoom = map.getZoom();
   var ZOOM_MIN = 5;
   var ZOOM_MAX = map.getMaxZoom();


   function showZoomSnackbar(message) {
     zoomSnackbarText.textContent = message;
     zoomSnackbar.classList.remove("zoom-snackbar--hidden");
     setTimeout(() => {
       zoomSnackbar.classList.add("zoom-snackbar--hidden");
     }, 1800);
   }


   map.on("zoomend", function () {
     var currentZoom = map.getZoom();
     zoomIndicator.textContent = currentZoom;


     if (currentZoom > lastZoom) {
       if (currentZoom >= ZOOM_MAX) {
         showZoomSnackbar("🔍 Nivel máximo de zoom alcanzado");
       } else {
         showZoomSnackbar("Acercando vista · Zoom " + currentZoom);
       }
     } else if (currentZoom < lastZoom) {
       if (currentZoom <= ZOOM_MIN) {
         showZoomSnackbar("🔎 Nivel mínimo de zoom alcanzado");
       } else {
         showZoomSnackbar("Disminuyendo vista · Zoom " + currentZoom);
       }
     }


     lastZoom = currentZoom;
   });
// FIN DE AGREGACIÓN
   var allMarkers = [];
   var barrierMarkers = [];
   var accessibleMarkers = [];
   var warningMarkers = [];


   // Marcadores por subtipo de barrera
   var barriersBySubtype = {
     rampas: [],
     obstrucciones: [],
     baches: [],
     aceras: [],
     escaleras: [],
   };


   // Marcadores por rango de fecha (para filtros rápidos)
   var markersByDateRange = {
     urgent: [], // últimas 24 horas
     recent: [], // última semana
   };


   // Capas para lugares (hospitales, parques, transporte)
   var categoryMarkers = {
     hospitales: [],
     parques: [],
     transporte: [],
   };


   // Círculo de zona de riesgo (cluster de pines rojos)
   var dangerCircle = null;


   // Cache de iconos por color
   var iconCache = {};


   // Pin tipo Leaflet pero en SVG, con color dinámico
   function createColoredPin(color) {
     if (iconCache[color]) return iconCache[color];


     var svg =
       '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">' +
       '<path d="M12.5 0C6 0 1 5 1 11.5C1 19 12.5 41 12.5 41C12.5 41 24 19 24 11.5C24 5 19 0 12.5 0z" fill="' +
       color +
       '"/>' +
       '<circle cx="12.5" cy="11.5" r="4" fill="#ffffff"/></svg>';


     var icon = L.icon({
       iconUrl: "data:image/svg+xml;base64," + btoa(svg),
       iconSize: [25, 41],
       iconAnchor: [12, 41],
       popupAnchor: [1, -34],
       shadowUrl: L.Icon.Default.prototype.options.shadowUrl,
       shadowSize: L.Icon.Default.prototype.options.shadowSize,
       shadowAnchor: L.Icon.Default.prototype.options.shadowAnchor,
     });


     iconCache[color] = icon;
     return icon;
   }


   function getMarkerIconByType(type, subtype) {
     if (type === "accessible") return createColoredPin("#05af43"); // verde
     if (type === "warning") return createColoredPin("#e69000"); // ambar
     if (type === "barrier") {
       // Colores por subtipo de barrera (coinciden con el filtro visual)
       switch (subtype) {
         case "rampas":
         case "aceras":
         case "escaleras":
           return createColoredPin("#e03737"); // rojo
         case "obstrucciones":
           return createColoredPin("#f97316"); // naranja
         case "baches":
           return createColoredPin("#e69000"); // amarillo
         default:
           return createColoredPin("#e03737"); // rojo por defecto
       }
     }
     return createColoredPin("#3b82f6");
   }


   // Círculo rojo que cubre cluster de barreras
   function updateDangerZone() {
     // Si hay menos de 4 barreras, no mostramos zona roja
     if (barrierMarkers.length < 4) {
       if (dangerCircle) {
         map.removeLayer(dangerCircle);
         dangerCircle = null;
       }
       return;
     }


     var radius = 250; // Radio en metros para el cálculo de proximidad
     var center = null;


     // Intentar encontrar un grupo de 4 pines rojos cercanos
     barrierMarkers.forEach(function (marker) {
       var markerLatLng = marker.getLatLng();
       var count = 0;


       // Contamos cuántos pines rojos están cercanos al pin actual
       barrierMarkers.forEach(function (otherMarker) {
         if (map.distance(markerLatLng, otherMarker.getLatLng()) <= radius) {
           count++;
         }
       });


       // Si encontramos un grupo de 4 barreras cercanas, ponemos el centro
       if (count >= 4 && !center) {
         center = markerLatLng;
       }
     });


     // Si encontramos un centro para la zona roja, mostramos el círculo
     if (center) {
       if (!dangerCircle) {
         dangerCircle = L.circle(center, {
           radius: radius,
           color: "#dc2626", // Rojo
           fillColor: "#ef4444", // Relleno rojo claro
           fillOpacity: 0.15,
           weight: 2,
           dashArray: "4 4",
         }).addTo(map);
         dangerCircle.bringToBack(); // Asegura que el círculo esté detrás de los pines
       } else {
         dangerCircle.setLatLng(center); // Actualiza el centro si se mueve
         dangerCircle.setRadius(radius); // Actualiza el radio si es necesario
       }
     } else if (dangerCircle) {
       // Si no encontramos un grupo, eliminamos el círculo
       map.removeLayer(dangerCircle);
       dangerCircle = null;
     }
   }


   function addPlace(lat, lng, name, type, subtype, dateReported) {
     // Generar fecha aleatoria si no se proporciona
     if (!dateReported) {
       var now = new Date();
       var randomDays = Math.floor(Math.random() * 30); // 0-30 días atrás
       dateReported = new Date(
         now.getTime() - randomDays * 24 * 60 * 60 * 1000
       );
     }


     // Mapeo de subtipo a etiqueta legible
     var subtypeLabel = {
       rampas: "Rampas Dañadas",
       obstrucciones: "Obstrucciones en Vía",
       baches: "Baches",
       aceras: "Aceras Estrechas",
       escaleras: "Escaleras sin Rampa",
     };


     var dateStr = dateReported.toLocaleDateString("es-PE", {
       year: "numeric",
       month: "short",
       day: "numeric",
     });


     var popupHtml = "<strong>" + name + "</strong><br/>";


     if (type === "barrier" && subtype) {
       popupHtml +=
         '<span class="tag tag-rojo">' +
         (subtypeLabel[subtype] || subtype) +
         "</span><br/>";
       popupHtml += "<small>Reportado: " + dateStr + "</small>";
     } else if (type === "accessible") {
       popupHtml += '<span class="tag tag-verde">Accesible</span><br/>';
       popupHtml += "<small>Verificado: " + dateStr + "</small>";
     } else if (type === "warning") {
       popupHtml += '<span class="tag tag-ambar">Precaución</span><br/>';
       popupHtml += "<small>Reportado: " + dateStr + "</small>";
     }


     // Normalizar subtipo para asegurar coincidencia con los filtros
     var normalizedSubtype = null;
     if (type === "barrier" && subtype) {
       // Solo permitir los subtipos válidos
       var validSubtypes = [
         "rampas",
         "obstrucciones",
         "baches",
         "aceras",
         "escaleras",
       ];
       if (validSubtypes.includes(subtype)) {
         normalizedSubtype = subtype;
       } else {
         normalizedSubtype = "rampas"; // fallback seguro
       }
     }


     var marker = L.marker([lat, lng], {
       icon: getMarkerIconByType(type, normalizedSubtype),
     })
       .addTo(map)
       .bindPopup(popupHtml);


     marker.customType = type;
     marker.customSubtype = normalizedSubtype || null;
     marker.customDate = dateReported;
     allMarkers.push(marker);


     // Clasificar por rango de fecha
     var now = new Date();
     var diffHours = (now - dateReported) / (1000 * 60 * 60);
     var diffDays = diffHours / 24;


     if (diffHours <= 24) {
       markersByDateRange.urgent.push(marker);
     }
     if (diffDays <= 7) {
       markersByDateRange.recent.push(marker);
     }


     if (type === "barrier") {
       barrierMarkers.push(marker);
       if (subtype && barriersBySubtype[subtype]) {
         barriersBySubtype[subtype].push(marker);
       }
     } else if (type === "warning") {
       warningMarkers.push(marker);
     } else if (type === "accessible") {
       accessibleMarkers.push(marker);
     }


     // Recalcular zona roja cuando hay nuevas barreras
     if (type === "barrier") {
       updateDangerZone();
     }
   }


   function checkRedClusters() {
     // Si hay menos de 4 pines rojos, no hay zona crítica
     if (activeMarkers.length < 4) {
       if (clusterCircle) {
         map.removeLayer(clusterCircle);
         clusterCircle = null;
       }
       return;
     }


     var radius = 150; // radio en metros para considerar que están "cerca"
     var clusterCenter = null;


     activeMarkers.forEach(function (marker) {
       var centerCandidate = marker.getLatLng();
       var count = 0;


       activeMarkers.forEach(function (other) {
         var dist = map.distance(centerCandidate, other.getLatLng());
         if (dist <= radius) count++;
       });


       if (count >= 4 && !clusterCenter) {
         clusterCenter = centerCandidate;
       }
     });


     if (clusterCenter) {
       if (!clusterCircle) {
         clusterCircle = L.circle(clusterCenter, {
           radius: radius,
           color: "#e03737",
           fillColor: "#e03737",
           fillOpacity: 0.15,
           weight: 2,
           dashArray: "4 4",
         })
           .addTo(map)
           .bindPopup("Zona roja: múltiples reportes activos.");
       } else {
         clusterCircle.setLatLng(clusterCenter);
         clusterCircle.setRadius(radius);
       }
     }
   }


   // Puntos demo
   addPlace(-12.055, -77.045, "Rampa verificada", "accessible");
   addPlace(-12.05, -77.04, "Vereda rota", "barrier", "baches");
   addPlace(-12.04, -77.048, "Cruce con pendiente fuerte", "warning");


   // Grupo 1: Centro de Lima (cerca de Plaza San Martín)
   var clusterCentro = [
     [-12.0475, -77.0345],
     [-12.0468, -77.0338],
     [-12.0459, -77.0342],
     [-12.0464, -77.035],
   ];
   clusterCentro.forEach(function (c, i) {
     var subtype = i % 2 === 0 ? "rampas" : "baches";
     addPlace(c[0], c[1], "Barrera Centro #" + (i + 1), "barrier", subtype);
   });


   // Grupo 2: Miraflores (cerca del Parque Kennedy)
   var clusterMiraflores = [
     [-12.1215, -77.0293],
     [-12.121, -77.0088],
     [-12.1006, -77.0297],
     [-12.1419, -77.0002],
   ];
   clusterMiraflores.forEach(function (c, i) {
     var subtypes = ["escaleras", "aceras", "obstrucciones", "rampas"];
     addPlace(
       c[0],
       c[1],
       "Barrera Miraflores #" + (i + 1),
       "barrier",
       subtypes[i % 4]
     );
   });


   // Grupo 3: San Juan de Lurigancho (zona demo)
   var clusterSJL = [
     [-12.0145, -77.005],
     [-12.214, -77.0056],
     [-12.115, -77.0048],
     [-12.0552, -77.0054],
   ];
   clusterSJL.forEach(function (c, i) {
     var subtypes = ["baches", "rampas", "escaleras", "obstrucciones"];
     addPlace(
       c[0],
       c[1],
       "Barrera SJL #" + (i + 1),
       "barrier",
       subtypes[i % 4]
     );
   });


   // Asegurar que la zona roja se calcule al inicio
   updateDangerZone();


   // ----- Routing -----
   var startMarker = null;
   var endMarker = null;
   var routingControl = null;


   var originLatLng = null;
   var destLatLng = null;


   // tipo que se está eligiendo desde el mapa ("origin" | "destination" | null)
   var currentPickType = null;


   function setStartMarker(latlng) {
     originLatLng = latlng;
     if (!startMarker) {
       startMarker = L.marker(latlng, { draggable: true })
         .addTo(map)
         .bindPopup("Origen");
       startMarker.on("dragend", function () {
         originLatLng = startMarker.getLatLng();
         buildRoute();
       });
     } else {
       startMarker.setLatLng(latlng);
     }
   }


   function setEndMarker(latlng) {
     destLatLng = latlng;
     if (!endMarker) {
       endMarker = L.marker(latlng, { draggable: true })
         .addTo(map)
         .bindPopup("Destino");
       endMarker.on("dragend", function () {
         destLatLng = endMarker.getLatLng();
         buildRoute();
       });
     } else {
       endMarker.setLatLng(latlng);
     }
   }


// ===============================================
// FUNCIÓN BUILDROUTE (CON GEOMETRÍA DIFERENTE Y COLOR)
// ===============================================
function buildRoute() {
    // 1. CONFIGURACIÓN VISUAL
    var routeColor = '#00b592'; // Verde (Ruta A)
    var waypointsList = [originLatLng, destLatLng]; // Por defecto: Ruta directa

    if (window.currentRouteType === 'B') {
        // --- RUTA B: CORTA / RIESGO ---
        console.warn("⚠️ Calculando Ruta B (Directa/Corta)");
        routeColor = '#e69000'; // Naranja
        // La Ruta B va directa del punto A al B (el camino más corto estándar)
        waypointsList = [originLatLng, destLatLng];

    } else {
        // --- RUTA A: SEGURA / RECOMENDADA ---
        console.log("🛡️ Calculando Ruta A (Segura/Desvío)");
        routeColor = '#00b592'; // Verde
        
        // EL TRUCO MAGICO: Crear un desvío forzado para que la línea cambie
        // Calculamos un punto medio y lo movemos un poco
        var midLat = (originLatLng.lat + destLatLng.lat) / 2;
        var midLng = (originLatLng.lng + destLatLng.lng) / 2;
        
        // Desviamos el punto medio unos 200-300 metros (0.002 grados aprox)
        // Esto obliga a la API a buscar calles alternativas
        var detourPoint = L.latLng(midLat + 0.002, midLng + 0.002);
        
        // La ruta será: Origen -> Desvío -> Destino
        waypointsList = [originLatLng, detourPoint, destLatLng];
    }

    // 2. LIMPIEZA DE MAPA
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (window.fallbackLine) {
        map.removeLayer(window.fallbackLine);
    }

    // 3. DIBUJAR LÍNEA MANUAL DE RESPALDO (Visualización inmediata)
    // Dibujamos líneas rectas entre los puntos para feedback instantáneo
    window.fallbackLine = L.polyline(waypointsList, {
        color: routeColor, 
        weight: 6,
        opacity: 0.5,
        dashArray: '10, 10'
    }).addTo(map);

    map.fitBounds(window.fallbackLine.getBounds(), { padding: [80, 80] });

    // 4. CALCULAR RUTA REAL POR CALLES (API)
    try {
        routingControl = L.Routing.control({
            waypoints: waypointsList, // <--- Aquí pasamos la lista con o sin desvío
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            lineOptions: {
                styles: [{color: routeColor, opacity: 1, weight: 6}] 
            },
            createMarker: function () { return null; }, // Sin pines extra
            show: false 
        })
        .on('routesfound', function(e) {
            // Borramos la línea recta fea cuando llegue la bonita
            if (window.fallbackLine) map.removeLayer(window.fallbackLine);
            console.log("✅ Ruta trazada. Distancia: " + (e.routes[0].summary.totalDistance/1000).toFixed(2) + "km");
        })
        .addTo(map);
    } catch (e) {
        console.warn("Error API, manteniendo línea de respaldo.", e);
    }
}
   // Click en mapa solo cuando estamos eligiendo origen/destino
   map.on("click", function (e) {
     if (!currentPickType) return;


     if (currentPickType === "origin") {
       setStartMarker(e.latlng);
       routeOriginInput.value = "Punto seleccionado en el mapa";
       showToast("Origen seleccionado en el mapa.");
     } else if (currentPickType === "destination") {
       setEndMarker(e.latlng);
       routeDestInput.value = "Punto seleccionado en el mapa";
       showToast("Destino seleccionado en el mapa.");
     }


     currentPickType = null;
     openRouteModal(); // reabrir el modal
   });


   // ----- Geolocalización -----
   function goToUserLocation() {
     if (!navigator.geolocation) {
       showToast("La geolocalización no está disponible en este dispositivo.");
       return;
     }


     navigator.geolocation.getCurrentPosition(
       function (pos) {
         var lat = pos.coords.latitude;
         var lng = pos.coords.longitude;
         map.setView([lat, lng], 16);


         showToast("Ubicación actual centrada en el mapa.");
       },
       function () {
         showToast("No fue posible obtener tu ubicación.");
       }
     );
   }


   // ----- Base local de lugares accesibles en Lima (demo) -----
   var localPlaces = [
     {
       id: "local-1",
       title: "Hospital Nacional Edgardo Rebagliati Martins",
       subtitle: "Hospital · Jesús María",
       lat: -12.0741,
       lon: -77.0473,
       displayName:
         "Hospital Nacional Edgardo Rebagliati Martins, Jesús María, Lima",
       tags: ["hospital", "salud", "emergencias"],
     },
     {
       id: "local-2",
       title: "Parque Kennedy",
       subtitle: "Parque · Miraflores",
       lat: -12.1212,
       lon: -77.0295,
       displayName: "Parque Kennedy, Miraflores, Lima",
       tags: ["parque", "miraflores", "turismo"],
     },
     {
       id: "local-3",
       title: "Estación Central Metropolitano",
       subtitle: "Transporte · Centro de Lima",
       lat: -12.0605,
       lon: -77.0416,
       displayName: "Estación Central Metropolitano, Cercado de Lima",
       tags: ["metropolitano", "bus", "transporte"],
     },
     {
       id: "local-4",
       title: "Plaza San Martín",
       subtitle: "Plaza · Centro de Lima",
       lat: -12.046,
       lon: -77.0339,
       displayName: "Plaza San Martín, Cercado de Lima",
       tags: ["plaza", "centro", "turismo"],
     },
     {
       id: "local-5",
       title: "Hospital Nacional Guillermo Almenara",
       subtitle: "Hospital · La Victoria",
       lat: -12.0714,
       lon: -77.041,
       displayName: "Hospital Nacional Guillermo Almenara, La Victoria",
       tags: ["hospital", "salud"],
     },
     {
       id: "local-6",
       title: "Universidad Nacional de Ingeniería (UNI)",
       subtitle: "Universidad · Rímac",
       lat: -12.023,
       lon: -77.048,
       displayName: "Universidad Nacional de Ingeniería, Rímac",
       tags: ["universidad", "ingenieria"],
     },
     {
       id: "local-7",
       title: "Puente Villena",
       subtitle: "Puente peatonal · Miraflores",
       lat: -12.1302,
       lon: -77.0299,
       displayName: "Puente Villena, Miraflores",
       tags: ["puente", "miraflores"],
     },
   ];


   // Crea marcadores para capas de lugares (no se muestran hasta activar la capa)
   function initCategoryMarkers() {
     localPlaces.forEach(function (place) {
       if (
         place.tags.some(function (t) {
           return t.includes("hospital") || t.includes("salud");
         })
       ) {
         var m = L.marker([place.lat, place.lon], {
           icon: createColoredPin("#9c220cff"),
         }).bindPopup(
           "<strong>" +
             place.title +
             "</strong><br/>" +
             "<span class='tag tag-rojo'>Hospital / Salud</span>"
         );
         categoryMarkers.hospitales.push(m);
       }


       if (
         place.tags.some(function (t) {
           return t.includes("parque") || t.includes("plaza");
         })
       ) {
         var m2 = L.marker([place.lat, place.lon], {
           icon: createColoredPin("#2bff40ff"),
         }).bindPopup(
           "<strong>" +
             place.title +
             "</strong><br/>" +
             "<span class='tag tag-verde'>Parque / Plaza</span>"
         );
         categoryMarkers.parques.push(m2);
       }


       if (
         place.tags.some(function (t) {
           return (
             t.includes("metropolitano") ||
             t.includes("bus") ||
             t.includes("transporte")
           );
         })
       ) {
         var m3 = L.marker([place.lat, place.lon], {
           icon: createColoredPin("#2b80ffff"),
         }).bindPopup(
           "<strong>" +
             place.title +
             "</strong><br/>" +
             "<span class='tag tag-ambar'>Transporte</span>"
         );
         categoryMarkers.transporte.push(m3);
       }
     });
   }


   function toggleCategoryLayer(key) {
     var markers = categoryMarkers[key] || [];
     if (!markers.length) return;


     var isActive = map.hasLayer(markers[0]);


     if (isActive) {
       markers.forEach(function (m) {
         map.removeLayer(m);
       });
     } else {
       markers.forEach(function (m) {
         m.addTo(map);
       });
     }
   }


   // ----- Geocoding Nominatim (Lima) -----
   function geocodeAddressToLatLng(address) {
     var url =
       "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pe&addressdetails=1&q=" +
       encodeURIComponent(address + " Lima, Perú");


     return fetch(url, { headers: { "Accept-Language": "es" } })
       .then(function (response) {
         return response.json();
       })
       .then(function (data) {
         if (!data || !data.length) {
           throw new Error("No se encontró la dirección.");
         }
         var p = data[0];
         return L.latLng(parseFloat(p.lat), parseFloat(p.lon));
       });
   }


   // ----- Buscador híbrido: local + Nominatim -----
   var debounceTimer = null;
   var searchCache = {}; // cache de resultados remotos por query exacta


   // convierte un lugar local en objeto sugerencia general
   function mapLocalPlaceToSuggestion(place) {
     return {
       id: place.id,
       source: "local",
       title: place.title,
       subtitle: place.subtitle,
       lat: place.lat,
       lon: place.lon,
       displayName: place.displayName,
     };
   }


   // convierte respuesta Nominatim en sugerencias generales
   function mapRemoteResultToSuggestions(results) {
     return results.map(function (item, idx) {
       var mainTitle = item.display_name.split(",")[0];
       var rest = item.display_name.replace(mainTitle + ",", "").trim();
       return {
         id: "remote-" + idx + "-" + item.place_id,
         source: "remote",
         title: mainTitle,
         subtitle: rest,
         lat: parseFloat(item.lat),
         lon: parseFloat(item.lon),
         displayName: item.display_name,
       };
     });
   }


   // mezcla listas evitando duplicados por título + lat/lon
   function mergeSuggestions(localList, remoteList, maxTotal) {
     var combined = localList.slice();
     remoteList.forEach(function (r) {
       var exists = combined.some(function (c) {
         return (
           c.title === r.title &&
           Math.abs(c.lat - r.lat) < 0.0001 &&
           Math.abs(c.lon - r.lon) < 0.0001
         );
       });
       if (!exists) {
         combined.push(r);
       }
     });
     if (typeof maxTotal === "number") {
       return combined.slice(0, maxTotal);
     }
     return combined;
   }


   /* QUITE TODO ESTO Y LO REEMPLACE CON OTRA FUNCION IGUAL
   function handleSearchInput() {
     if (!searchInput || !searchSuggestions) return;
     var rawQuery = searchInput.value.trim();
     var query = rawQuery.toLowerCase();


     if (query.length < 2) {
       clearSuggestions();
       return;
     }


     // 1) SUGERENCIAS LOCALES INSTANTÁNEAS
     var localMatches = localPlaces.filter(function (place) {
       var inTitle = place.title.toLowerCase().includes(query);
       var inTags = place.tags.some(function (t) {
         return t.toLowerCase().includes(query);
       });
       var inSubtitle =
         place.subtitle && place.subtitle.toLowerCase().includes(query);
       return inTitle || inTags || inSubtitle;
     });


     var localSuggestions = localMatches.map(mapLocalPlaceToSuggestion);
     // render inmediato con lo local
     renderSuggestions(localSuggestions);


     // 2) REMOTO (Nominatim) CON DEBOUNCE + CACHÉ
     if (debounceTimer) {
       clearTimeout(debounceTimer);
     }


     debounceTimer = setTimeout(function () {
       var currentValue = searchInput.value.trim();
       if (!currentValue || currentValue.length < 2) {
         return;
       }


       // si el usuario ya cambió el texto, no disparamos para query viejo
       if (currentValue.toLowerCase() !== query) {
         return;
       }


       // caché
       if (searchCache[currentValue]) {
         var remoteFromCache = searchCache[currentValue];
         var mergedCached = mergeSuggestions(
           localSuggestions,
           remoteFromCache,
           7
         );
         renderSuggestions(mergedCached);
         return;
       }


       var url =
         "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=pe&addressdetails=1&q=" +
         encodeURIComponent(currentValue + " Lima, Perú");


       fetch(url, { headers: { "Accept-Language": "es" } })
         .then(function (res) {
           return res.json();
         })
         .then(function (data) {
           var remoteSuggestions = mapRemoteResultToSuggestions(data || []);
           searchCache[currentValue] = remoteSuggestions;


           var merged = mergeSuggestions(
             localSuggestions,
             remoteSuggestions,
             7
           );
           renderSuggestions(merged);
         })
         .catch(function () {
           // si falla remoto, nos quedamos con lo local
           renderSuggestions(localSuggestions);
         });
     }, 400);
   } */
//agregue esto nuevo para la barra de busqueda

// ==========================================
// 1. MANEJO DEL INPUT DE BÚSQUEDA (CORREGIDO)
// ==========================================
function handleSearchInput() {
    if (!searchInput) return;
    var query = searchInput.value.toLowerCase().trim();

    // A. Si borras el texto, limpiamos
    if (query.length < 2) {
        if (searchResultsContainer) searchResultsContainer.innerHTML = "";
        return;
    }

    // B. MODO DEMO: Si escribes "farmacia"
    if (query.includes("farma")) {
        currentMockResults = MOCK_DATA; // Usamos tus datos falsos
        renderMockResults(); // Dibujamos las tarjetas demo
        
        // Abrimos el overlay negro
        document.body.classList.add("search-open");
        if (searchOverlay) searchOverlay.classList.remove("search-overlay--hidden");
    
    } else {
        // C. MODO REAL: Buscamos en OpenStreetMap (Nominatim)
        // ESTO ES LO QUE FALTABA PARA QUE SALGA LA LISTA
        var url = "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=pe&addressdetails=1&q=" + encodeURIComponent(query + " Lima");

        fetch(url)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                // Convertimos lo que devuelve internet al formato de tu app
                var suggestions = data.map(function(item) {
                    return {
                        title: item.display_name.split(',')[0], // Titulo corto
                        displayName: item.display_name,         // Titulo largo
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon)
                    };
                });
                
                // Dibujamos los resultados reales
                renderSuggestions(suggestions);
                
                // Aseguramos que se vea el fondo negro
                document.body.classList.add("search-open");
                if (searchOverlay) searchOverlay.classList.remove("search-overlay--hidden");
            })
            .catch(function(err) {
                console.error("Error buscando:", err);
            });
    }
}
   // =========================================================
     // FUNCIONES NUEVAS (Pegar debajo de handleSearchInput)
     // =========================================================


     // Dibuja la lista de tarjetas idéntica a tu Figma
     function renderMockResults() {
       var container = document.getElementById("search-results-container");
       if (!container) return;
       container.innerHTML = "";


       // 1. Ver si el switch "Solo accesibles" está prendido
       var toggle = document.getElementById("toggle-accessible");
       var onlyAccessible = toggle && toggle.checked;


       // 2. Filtrar la lista de datos falsos
       var list = currentMockResults;
       if (onlyAccessible) {
         list = list.filter(function(item) { return item.type === "accessible"; });
       }


       // 3. Dibujar cada tarjeta
       list.forEach(function(item) {
         var card = document.createElement("div");
         card.className = "search-result-card"; // Usa tu CSS existente


         // Definir colores y textos
         var tagClass = "";
         var tagText = "";
         if (item.type === "accessible") { tagClass = "tag-verde"; tagText = "Accesible"; }
         else if (item.type === "warning") { tagClass = "tag-ambar"; tagText = "Precaución"; }
         else { tagClass = "tag-rojo"; tagText = "Inaccesible"; }


         // El HTML interno de la tarjeta
         card.innerHTML =
           '<div style="display:flex; justify-content:space-between; align-items:start;">' +
             '<div>' +
               '<div class="search-result-card__title">' + item.title + '</div>' +
               '<div class="search-result-card__subtitle">' + item.subtitle + '</div>' +
               '<div style="margin-top:0.5rem; display:flex; gap:0.5rem;">' +
                 '<span style="font-size:0.8rem; font-weight:600;">⭐ ' + item.rating + '</span>' +
               '</div>' +
             '</div>' +
             '<span class="tag ' + tagClass + '">' + tagText + '</span>' +
           '</div>';
        
         // Al hacer clic en una tarjeta individual
         // --- CÓDIGO NUEVO ---
        card.addEventListener("click", function() {
            // 1. Primero mostramos el pin en el mapa (para que se vea bonito de fondo)
            showOnMap([item]);

            // 2. ABRIMOS EL PLANIFICADOR DIRECTAMENTE
            // Le pasamos los datos de la tarjeta (item) a tu nueva función
            openRoutePlanner({
                title: item.title,      // Ejemplo: "Farmacia La Luz"
                lat: item.lat,
                lng: item.lng
            });
        });


         container.appendChild(card);
       });


       // 4. EL BOTÓN "BUSCAR EN EL MAPA"
       if (list.length > 0) {
         var btn = document.createElement("button");
         btn.className = "btn-primary"; // Usa tu estilo de botón verde
         btn.style.marginTop = "1rem";
         btn.innerHTML = "Buscar en el mapa";
        
         btn.onclick = function() {
             showOnMap(list);
         };
         container.appendChild(btn);
       }
     }


// 1. Ayuda a pintar los pines y cerrar el buscador
     function showOnMap(itemsToShow) {
        closeSearchModal(); 
        
        // Limpiamos mapa y ponemos pines
        // (Tu lógica de addPlace existente aquí...)
        itemsToShow.forEach(function(p) {
            addPlace(p.lat, p.lng, p.title, p.type, p.subtype || null, new Date());
        });

        if(itemsToShow[0]) {
            map.setView([itemsToShow[0].lat, itemsToShow[0].lng], 16);
            
            // --- NUEVO: Simular que al hacer click en el pin o buscar, preparamos la ruta ---
            // Aquí podrías vincular el click del marker para que abra el modal
            // Por ahora, simularemos que al buscar "Farmacia", seleccionamos la primera
            
            // NOTA: Para la demo, abrimos el modal de ruta tras 1 segundo de ver el pin
            setTimeout(function(){
                openNewRouteModal(itemsToShow[0]);
            }, 800);
        }
    }

// 2. FUNCIÓN PARA ABRIR EL MODAL CON DATOS
    function openNewRouteModal(destinationItem) {
        var modal = document.getElementById("route-modal");
        var overlay = document.getElementById("route-modal-backdrop");
        var destLabel = document.getElementById("summary-dest");
        
        // Actualizar texto del destino
        if(destLabel) destLabel.textContent = destinationItem.title || "Destino Seleccionado";

        // Resetear a Ruta A por defecto
        selectRoute('A');

        modal.classList.remove("route-modal--hidden");
        if(overlay) overlay.classList.remove("route-modal--hidden");
    }

// 3. LÓGICA DE SELECCIÓN DE RUTA (A vs B)
      window.selectRoute = function(routeType) {
          // UI de las tarjetas
          var cardA = document.getElementById("card-route-a");
          var cardB = document.getElementById("card-route-b");
          var bar = document.getElementById("access-bar");
          var percent = document.getElementById("access-percentage");
          var tags = document.getElementById("access-tags");
          
          if (routeType === 'A') {
              cardA.classList.add("route-option-card--selected");
              cardB.classList.remove("route-option-card--selected");
              
              // Datos Ruta A
              percent.textContent = "98%";
              percent.style.color = "#00b592";
              bar.style.width = "98%";
              bar.style.backgroundColor = "#00b592";
              tags.innerHTML = `
                  <span class="tag-feature">Rampa verificada</span>
                  <span class="tag-feature">Iluminación LED</span>
                  <span class="tag-feature">Veredas amplias</span>
              `;
          } else {
              cardB.classList.add("route-option-card--selected");
              cardA.classList.remove("route-option-card--selected");
              
              // Datos Ruta B
              percent.textContent = "55%";
              percent.style.color = "#e69000";
              bar.style.width = "55%";
              bar.style.backgroundColor = "#e69000";
              tags.innerHTML = `
                  <span class="tag-feature">Vereda estrecha</span>
                  <span class="tag-feature">1 bache reportado</span>
                  <span class="tag-feature">Poca iluminación</span>
              `;
          }
      };

// 4. INICIAR NAVEGACIÓN (EL CAMBIO DE PANTALLA)
// ===============================================
// BOTÓN INICIAR NAVEGACIÓN (CON RESPALDO)
// ===============================================
// ===============================================
// BOTÓN INICIAR NAVEGACIÓN (CORREGIDO Y BLINDADO)
// ===============================================
// ===============================================
// BOTÓN INICIAR NAVEGACIÓN (CON ACTUALIZACIÓN DE NOMBRE)
// ===============================================
var btnStartNav = document.getElementById("btn-start-navigation");

if (btnStartNav) {
    btnStartNav.addEventListener("click", function(e) {
        e.preventDefault(); 

        // 1. CERRAR MODALES
        var modal = document.getElementById("route-modal");
        var backdrop = document.getElementById("route-modal-backdrop");
        if(modal) modal.classList.add("route-modal--hidden");
        if(backdrop) backdrop.classList.add("route-modal--hidden");
        
        // 2. PREPARAR COORDENADAS (Respaldo si falla)
        if (currentDestLatLng) {
            setEndMarker(currentDestLatLng);
        } else {
            var demoDest = L.latLng(-12.1380, -76.9850); 
            setEndMarker(demoDest);
        }

        if (!originLatLng) {
            originLatLng = L.latLng(-12.0460, -77.0420); 
            setStartMarker(originLatLng);
        }

        // 3. DIBUJAR RUTA
        buildRoute(); 

        // 4. CAMBIAR UI (OCULTAR LO VIEJO)
        var searchBar = document.querySelector(".map-search-bar");
        var floatControls = document.querySelector(".map-floating-controls");
        var filterBtn = document.getElementById("btn-toggle-place-filter");
        
        if(searchBar) searchBar.style.display = "none";
        if(floatControls) floatControls.style.display = "none";
        if(filterBtn) filterBtn.style.display = "none";
        
        // 5. MOSTRAR BARRA AZUL (Y ACTUALIZAR EL TEXTO)
        var navUI = document.getElementById("active-navigation-ui");
        if (navUI) {
            navUI.classList.remove("nav-ui--hidden");

            // ---------------------------------------------------------
            // <--- LA MAGIA ESTÁ AQUÍ: ACTUALIZAR EL NOMBRE --->
            // ---------------------------------------------------------
            var destInput = document.getElementById("route-dest-input"); // El input del modal
            var navLabel = document.getElementById("nav-dest-label");    // El texto en la barra azul

            if (destInput && navLabel && destInput.value.trim() !== "") {
                // Copiamos lo que dice el input ("Farmacia X") a la barra azul
                navLabel.textContent = destInput.value;
            } else {
                // Si por alguna razón está vacío, ponemos un texto genérico
                navLabel.textContent = "Ubicación seleccionada";
            }
            // ---------------------------------------------------------
        }
        
        if(typeof showToast === "function") showToast("Ruta iniciada 🚀");
    });
}
// 5. SALIR DE NAVEGACIÓN
var btnExitNav = document.getElementById("btn-exit-nav");
if (btnExitNav) {
    btnExitNav.addEventListener("click", function() {
        // 1. OCULTAR TODA LA UI DE NAVEGACIÓN (Arriba y Abajo)
        var navUI = document.getElementById("active-navigation-ui");
        if(navUI) navUI.classList.add("nav-ui--hidden");
        
        // 2. RESTAURAR UI ESTÁNDAR
        var searchBar = document.querySelector(".map-search-bar");
        var floatControls = document.querySelector(".map-floating-controls");
        var filterBtn = document.getElementById("btn-toggle-place-filter");

        if(searchBar) searchBar.style.display = "flex";
        if(floatControls) floatControls.style.display = "flex";
        if(filterBtn) filterBtn.style.display = "flex";
        
        // 3. LIMPIAR RUTA DEL MAPA (Opcional, si quieres borrar la línea azul al salir)
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        if (endMarker) {
            map.removeLayer(endMarker);
            endMarker = null;
        }

        map.setZoom(16);
    });
}
//finde agregue esto nuevo para la barra de busqueda


   function renderSuggestions(suggestions) {
     if (!suggestions || !suggestions.length) {
       clearSuggestions();
       if (searchResultsContainer) searchResultsContainer.innerHTML = "";
       return;
     }


     // Si el buscador está abierto en pantalla completa, renderizamos como cards
     var isFullscreen = document.body.classList.contains("search-open");


     if (isFullscreen && searchResultsContainer) {
       searchResultsContainer.innerHTML = "";
       suggestions.forEach(function (s) {
         var card = document.createElement("div");
         card.className = "search-result-card";


         var title = document.createElement("div");
         title.className = "search-result-card__title";
         title.textContent = s.title;


         var sub = document.createElement("div");
         sub.className = "search-result-card__subtitle";
         sub.textContent = s.subtitle || s.displayName || "";


         card.appendChild(title);
         card.appendChild(sub);


         // --- CÓDIGO NUEVO ---
        card.addEventListener("click", function () {
            var lat = s.lat;
            var lon = s.lon;

            // 1. Ponemos el pin visual en el mapa
            map.setView([lat, lon], 17);
            L.marker([lat, lon])
              .addTo(map)
              .bindPopup(s.title)
              .openPopup();

            // 2. LLAMAMOS A LA MISMA FUNCIÓN CENTRALIZADA
            openRoutePlanner({
                title: s.title,           // Título corto
                displayName: s.displayName, // Título largo
                lat: lat,
                lng: lon
            });
        });


         searchResultsContainer.appendChild(card);
       });


       // ocultar la lista tradicional de sugerencias
       if (searchSuggestions)
         searchSuggestions.classList.add("search-suggestions--hidden");
       return;
     }


     // Render normal como lista de sugerencias (desktop / inline)
     if (!searchSuggestions) return;
     searchSuggestions.innerHTML = "";
     suggestions.forEach(function (s) {
       var li = document.createElement("li");
       li.className = "search-suggestions__item";


       var main = document.createElement("span");
       main.className = "search-suggestions__item-main";
       main.textContent = s.title;


       var sub = document.createElement("span");
       sub.className = "search-suggestions__item-sub";
       sub.textContent = s.subtitle || "";


       li.appendChild(main);
       li.appendChild(sub);


       li.addEventListener("click", function () {
         var lat = s.lat;
         var lon = s.lon;


         map.setView([lat, lon], 17);
         L.marker([lat, lon])
           .addTo(map)
           .bindPopup(s.displayName || s.title)
           .openPopup();


         searchInput.value = s.title;
         clearSuggestions();
       });


       searchSuggestions.appendChild(li);
     });


     searchSuggestions.classList.remove("search-suggestions--hidden");
   }


   function clearSuggestions() {
     if (!searchSuggestions) return;
     searchSuggestions.innerHTML = "";
     searchSuggestions.classList.add("search-suggestions--hidden");
   }


   // Submit del buscador (enter)
   function searchPlace(event) {
     event.preventDefault();
     if (!searchInput) return;
     var query = searchInput.value.trim();
     if (!query) return;


     var lowerQuery = query.toLowerCase();


     // 1) Primero intentamos matchear un lugar local por nombre
     var exactLocal = localPlaces.find(function (p) {
       return p.title.toLowerCase() === lowerQuery;
     });


     if (exactLocal) {
       var latlng = L.latLng(exactLocal.lat, exactLocal.lon);
       map.setView(latlng, 17);
       L.marker(latlng)
         .addTo(map)
         .bindPopup(exactLocal.displayName || exactLocal.title)
         .openPopup();
       clearSuggestions();
       return;
     }


     // 2) Si no hay local exacto, usamos Nominatim
     geocodeAddressToLatLng(query)
       .then(function (latlng) {
         map.setView(latlng, 17);
         L.marker(latlng)
           .addTo(map)
           .bindPopup(query + ", Lima")
           .openPopup();
         clearSuggestions();
       })
       .catch(function () {
         showToast("No se encontró el destino.");
       });
   }


   // ----- Filtro de Quick Filters (por fecha) -----
   function updateQuickFilters() {
     var urgentActive =
       document.getElementById("quick-filter-urgent") &&
       document
         .getElementById("quick-filter-urgent")
         .getAttribute("aria-checked") === "true";
     var recentActive =
       document.getElementById("quick-filter-recent") &&
       document
         .getElementById("quick-filter-recent")
         .getAttribute("aria-checked") === "true";


     // Si ninguno está activo, mostrar todos los pines
     if (!urgentActive && !recentActive) {
       // Mostrar todos los pines (se gestionan otros filtros)
       updateBarrierFilters();
       return;
     }


     // Crear conjunto de pines a mostrar según quick filters
     var pinsToShow = new Set();


     if (urgentActive) {
       markersByDateRange.urgent.forEach(function (m) {
         pinsToShow.add(m);
       });
     }


     if (recentActive) {
       markersByDateRange.recent.forEach(function (m) {
         pinsToShow.add(m);
       });
     }


     // Aplicar filtros de barrera sobre los quick filters
     var barrierCheckboxes = document.querySelectorAll(
       ".place-filter-barrier"
     );
     var selectedSubtypes = {};
     barrierCheckboxes.forEach(function (cb) {
       var subtype = cb.id.replace("barrier-", "");
       selectedSubtypes[subtype] = cb.checked;
     });


     // Mostrar/ocultar todos los pines de barrera según quick filters + tipo
     barrierMarkers.forEach(function (m) {
       var markerSubtype = m.customSubtype;
       var inQuickFilter = pinsToShow.has(m);
       var typeMatches = selectedSubtypes[markerSubtype] || false;
       var shouldShow = inQuickFilter && typeMatches;


       if (shouldShow) {
         if (!map.hasLayer(m)) m.addTo(map);
       } else {
         if (map.hasLayer(m)) map.removeLayer(m);
       }
     });


     updateDangerZone();
   }


   // ----- Filtro de tipos de barreras -----
   function updateBarrierFilters() {
     var onlyAccessible = toggleAccessible && toggleAccessible.checked;


     // Si está activado "solo accesibles", ocultar todas las barreras
     if (onlyAccessible) {
       barrierMarkers.forEach(function (m) {
         if (map.hasLayer(m)) map.removeLayer(m);
       });
       return;
     }


     // Obtener qué tipos de barrera están seleccionados
     var selectedSubtypes = {};
     var barrierCheckboxes = document.querySelectorAll(
       ".place-filter-barrier"
     );
     barrierCheckboxes.forEach(function (cb) {
       var subtype = cb.id.replace("barrier-", "");
       selectedSubtypes[subtype] = cb.checked;
     });


     // Mostrar/ocultar marcadores según filtro
     barrierMarkers.forEach(function (m) {
       var markerSubtype = m.customSubtype;
       var shouldShow = selectedSubtypes[markerSubtype] || false;


       if (shouldShow) {
         if (!map.hasLayer(m)) m.addTo(map);
       } else {
         if (map.hasLayer(m)) map.removeLayer(m);
       }
     });


     updateDangerZone(); // Recalcular zona roja si cambió la visibilidad
   }


   // ----- Filtro "Solo accesibles" -----
   function updateReportVisibility() {
     // Si "Solo accesibles" está activado, solo mostrar accesibles; si no, mostrar todos
     var onlyAccessible = toggleAccessible && toggleAccessible.checked;


     // Accesibles: siempre visibles
     accessibleMarkers.forEach(function (m) {
       if (!map.hasLayer(m)) m.addTo(map);
     });


     // Warning: visibles si NO está activado "solo accesibles"
     warningMarkers.forEach(function (m) {
       if (onlyAccessible) {
         if (map.hasLayer(m)) map.removeLayer(m);
       } else {
         if (!map.hasLayer(m)) m.addTo(map);
       }
     });


     // Barreras: gestionar según filtros de tipo
     updateBarrierFilters();
   }


   // ----- Menú lateral (mobile) -----
   function toggleSidebar() {
     if (!sidebar) return;
     sidebar.classList.toggle("is-open");
   }


   // ----- Toast -----
   var toastTimeoutId = null;


   function showToast(message) {
     if (!toast || !toastText) return;


     toastText.textContent = message;
     toast.classList.remove("map-toast--hidden");


     if (toastTimeoutId) clearTimeout(toastTimeoutId);
     toastTimeoutId = setTimeout(function () {
       toast.classList.add("map-toast--hidden");
     }, 2500);
   }


   // ----- Modal de ruta -----
   function openRouteModal() {
     if (!routeModal || !routeModalBackdrop) return;
     // Close search overlay if it was open
     if (document.body.classList.contains("search-open")) {
       closeSearchModal();
     }
     // Close filter panel if it was open
     if (document.body.classList.contains("place-filter-open")) {
       document.body.classList.remove("place-filter-open");
       if (placeFilterPanel)
         placeFilterPanel.classList.add("place-filter--hidden");
     }
     routeModal.classList.remove("route-modal--hidden");
     routeModalBackdrop.classList.remove("route-modal--hidden");
   }


   function closeRouteModal() {
     if (!routeModal || !routeModalBackdrop) return;
     routeModal.classList.add("route-modal--hidden");
     routeModalBackdrop.classList.add("route-modal--hidden");
   }


   function startPickFromMap(type) {
     currentPickType = type; // "origin" o "destination"
     closeRouteModal();
     showToast(
       "Toca el mapa para elegir " +
         (type === "origin" ? "el origen" : "el destino") +
         "."
     );
   }


   function toggleFilterChip(chip) {
     chip.classList.toggle("chip-filter--active");
     var activeFilters = [];
     filterChips.forEach(function (c) {
       if (c.classList.contains("chip-filter--active")) {
         activeFilters.push(c.getAttribute("data-filter"));
       }
     });


     if (activeFilters.length) {
       showToast("Filtros de ruta activos (demo).");
     } else {
       showToast("Sin filtros de ruta aplicados.");
     }
   }


   function handleStartRoute() {
     // Prepara promesas de geocodificación si hace falta
     var tasks = [];


     if (!originLatLng && routeOriginInput && routeOriginInput.value.trim()) {
       tasks.push(
         geocodeAddressToLatLng(routeOriginInput.value.trim()).then(function (
           latlng
         ) {
           originLatLng = latlng;
         })
       );
     }


     if (!destLatLng && routeDestInput && routeDestInput.value.trim()) {
       tasks.push(
         geocodeAddressToLatLng(routeDestInput.value.trim()).then(function (
           latlng
         ) {
           destLatLng = latlng;
         })
       );
     }


     Promise.all(tasks)
       .then(function () {
         if (!originLatLng || !destLatLng) {
           showToast("Completa origen y destino para iniciar la ruta.");
           return;
         }


         setStartMarker(originLatLng);
         setEndMarker(destLatLng);
         buildRoute();
         closeRouteModal();
         showToast("Ruta inclusiva calculada.");
       })
       .catch(function () {
         showToast("No se pudo calcular la ruta. Revisa las direcciones.");
       });
   }


   // ----- Eventos -----
   if (btnMenuToggle && sidebar) {
     btnMenuToggle.addEventListener("click", toggleSidebar);
   }


   if (btnZoomIn) {
     btnZoomIn.addEventListener("click", function () {
       map.zoomIn();
     });
   }


   if (btnZoomOut) {
     btnZoomOut.addEventListener("click", function () {
       map.zoomOut();
     });
   }


   if (btnCenterLocation) {
     btnCenterLocation.addEventListener("click", goToUserLocation);
   }


   if (btnOpenReport) {
     btnOpenReport.addEventListener("click", function () {
       showToast("Aquí se abriría el formulario de reporte.");
     });
   }
//BORRADO POR LA BARRA NUEVA DE BUSQUEDA DISQUE QAQ
   /*if (toggleAccessible) {
     toggleAccessible.addEventListener("change", updateReportVisibility);
   }*/
   // =========================================================
  // REEMPLAZO DEL LISTENER "SOLO ACCESIBLES"
  // =========================================================
     if (toggleAccessible) {
       toggleAccessible.addEventListener("change", function() {
         // 1. Si el buscador está abierto (pantalla negra), actualiza la lista de tarjetas
         if (document.body.classList.contains("search-open")) {
           renderMockResults();
         }
         // 2. Siempre actualiza también los pines del mapa (tu función original)
         updateReportVisibility();
       });
     }
//FIN DE BORRADO Y REEMPLAZO POR LA BARRA NUEVA DE BUSQUEDA DISQUE QAQ
   if (toggleVisibleAccessible) {
     toggleVisibleAccessible.addEventListener(
       "change",
       updateReportVisibility
     );
   }


   if (toggleVisibleWarning) {
     toggleVisibleWarning.addEventListener("change", updateReportVisibility);
   }


   if (toggleVisibleBarrier) {
     toggleVisibleBarrier.addEventListener("change", updateReportVisibility);
   }


   if (btnOpenPlaceFilter && placeFilterPanel) {
     btnOpenPlaceFilter.addEventListener("click", function () {
       openSearchModal();
     });
   }


   if (btnTogglePlaceFilter && placeFilterPanel) {
     btnTogglePlaceFilter.addEventListener("click", function () {
       var wasHidden = placeFilterPanel.classList.contains(
         "place-filter--hidden"
       );
       if (wasHidden) {
         // ensure we close the full-screen search overlay if it was open
         if (document.body.classList.contains("search-open")) {
           closeSearchModal();
         }
         placeFilterPanel.classList.remove("place-filter--hidden");
         document.body.classList.add("place-filter-open");
       } else {
         placeFilterPanel.classList.add("place-filter--hidden");
         document.body.classList.remove("place-filter-open");
       }
     });
   }


   if (placeFilterClose && placeFilterPanel) {
     placeFilterClose.addEventListener("click", function () {
       placeFilterPanel.classList.add("place-filter--hidden");
       document.body.classList.remove("place-filter-open");
     });
   }


   if (placeFilterChips && placeFilterChips.length) {
     placeFilterChips.forEach(function (chip) {
       chip.addEventListener("click", function () {
         var key = chip.getAttribute("data-layer");
         chip.classList.toggle("place-filter__chip--active");
         toggleCategoryLayer(key);
       });
     });
   }


   // ===== NUEVA LÓGICA: Quick Filters, Barrier Types, Critical Zones =====
   var pfActiveCountEl = document.getElementById("place-filter-active-count");
   var quickUrgentBtn = document.getElementById("quick-filter-urgent");
   var quickRecentBtn = document.getElementById("quick-filter-recent");
   var barrierCheckboxes = document.querySelectorAll(".place-filter-barrier");
   var criticalZonesToggle = document.getElementById("critical-zones-toggle");
   var showAllBtn = document.getElementById("place-filter-show-all");
   var placeFilterBackdrop = document.querySelector(".place-filter__backdrop");


   // Contador de filtros activos
   function updatePlaceFilterActiveCount() {
     var count = 0;
     if (
       quickUrgentBtn &&
       quickUrgentBtn.getAttribute("aria-checked") === "true"
     )
       count++;
     if (
       quickRecentBtn &&
       quickRecentBtn.getAttribute("aria-checked") === "true"
     )
       count++;
     if (barrierCheckboxes && barrierCheckboxes.length) {
       barrierCheckboxes.forEach(function (cb) {
         if (cb.checked) count++;
       });
     }
     if (criticalZonesToggle && criticalZonesToggle.checked) count++;
     if (pfActiveCountEl)
       pfActiveCountEl.textContent = count + " filtros activos";
   }


   // Quick Filter Toggle (Urgent)
   if (quickUrgentBtn) {
     quickUrgentBtn.addEventListener("click", function () {
       var wasChecked = quickUrgentBtn.getAttribute("aria-checked") === "true";
       quickUrgentBtn.setAttribute("aria-checked", !wasChecked);
       updatePlaceFilterActiveCount();
       updateQuickFilters();
     });
   }


   // Quick Filter Toggle (Recent)
   if (quickRecentBtn) {
     quickRecentBtn.addEventListener("click", function () {
       var wasChecked = quickRecentBtn.getAttribute("aria-checked") === "true";
       quickRecentBtn.setAttribute("aria-checked", !wasChecked);
       updatePlaceFilterActiveCount();
       updateQuickFilters();
     });
   }


   // Barrier Checkboxes
   if (barrierCheckboxes && barrierCheckboxes.length) {
     barrierCheckboxes.forEach(function (cb) {
       cb.addEventListener("change", function () {
         updatePlaceFilterActiveCount();
         // Si hay quick filters activos, usar updateQuickFilters, si no, usar updateBarrierFilters
         var urgentActive =
           quickUrgentBtn &&
           quickUrgentBtn.getAttribute("aria-checked") === "true";
         var recentActive =
           quickRecentBtn &&
           quickRecentBtn.getAttribute("aria-checked") === "true";
         if (urgentActive || recentActive) {
           updateQuickFilters();
         } else {
           updateBarrierFilters();
         }
       });
     });
   }


   // Make sure the visible switch wrapper toggles the hidden input reliably (some browsers/styles
   // may make the native click unreliable). Attach click on the .switch container to toggle the input
   // and emit a change event so the rest of the app reacts.
   if (barrierCheckboxes && barrierCheckboxes.length) {
     barrierCheckboxes.forEach(function (cb) {
       try {
         var sw = cb.closest && cb.closest(".switch");
         if (sw) {
           sw.addEventListener("click", function (e) {
             // If click already targeted the actual input, let native behavior run
             if (e.target === cb) return;
             cb.checked = !cb.checked;
             cb.dispatchEvent(new Event("change", { bubbles: true }));
           });
         }
       } catch (err) {
         // ignore
       }
     });
   }


   // Critical Zones Toggle
   if (criticalZonesToggle) {
     criticalZonesToggle.addEventListener("change", function () {
       updatePlaceFilterActiveCount();
       if (criticalZonesToggle.checked) {
         updateDangerZone(); // Recalcular y mostrar zonas críticas
       } else {
         if (dangerCircle && map.hasLayer(dangerCircle)) {
           map.removeLayer(dangerCircle);
           dangerCircle = null;
         }
       }
     });
     // same switch wrapper helper for critical toggle
     try {
       var criticalSw =
         criticalZonesToggle.closest && criticalZonesToggle.closest(".switch");
       if (criticalSw) {
         criticalSw.addEventListener("click", function (e) {
           if (e.target === criticalZonesToggle) return;
           criticalZonesToggle.checked = !criticalZonesToggle.checked;
           criticalZonesToggle.dispatchEvent(
             new Event("change", { bubbles: true })
           );
         });
       }
     } catch (err) {
       // ignore
     }
   }


   // Show All Barriers
   if (showAllBtn) {
     showAllBtn.addEventListener("click", function () {
       if (barrierCheckboxes && barrierCheckboxes.length) {
         barrierCheckboxes.forEach(function (cb) {
           cb.checked = true;
         });
       }
       updatePlaceFilterActiveCount();
       updateBarrierFilters();
     });
   }


   // Cerrar modal al hacer click en el backdrop
   if (placeFilterBackdrop) {
     placeFilterBackdrop.addEventListener("click", function () {
       placeFilterPanel.classList.add("place-filter--hidden");
       document.body.classList.remove("place-filter-open");
     });
   }


   // Inicializar contador
   updatePlaceFilterActiveCount();


   // Inicializar capas y visibilidad
   initCategoryMarkers();
   updateReportVisibility();


   // ----- Listeners de búsqueda -----
   if (searchForm) {
     searchForm.addEventListener("submit", searchPlace);
     // abrir búsqueda en pantalla completa al hacer click en el form (o en el input)
     searchForm.addEventListener("click", function (e) {
       // evitar abrir si se hace click en botones dentro del form que gestionamos por separado
       if (
         e.target &&
         (e.target.id === "btn-open-place-filter" ||
           e.target.id === "search-overlay-close")
       )
         return;
       openSearchModal();
     });
   }


   if (searchInput) {
     searchInput.addEventListener("input", handleSearchInput);
   }


   // Abrir/cerrar modal de búsqueda (overlay)
   function openSearchModal() {
     document.body.classList.add("search-open");
     if (searchOverlay)
       searchOverlay.classList.remove("search-overlay--hidden");
     if (searchOverlayClose) searchOverlayClose.style.display = "block";
     // Close place-filter panel if it was open
     if (placeFilterPanel) {
       placeFilterPanel.classList.add("place-filter--hidden");
       document.body.classList.remove("place-filter-open");
     }
     if (searchInput) {
       searchInput.focus();
       // disparar búsqueda inmediata si hay texto
       if (searchInput.value && searchInput.value.trim().length >= 2)
         handleSearchInput();
     }
   }


   function closeSearchModal() {
     document.body.classList.remove("search-open");
     if (searchOverlay) searchOverlay.classList.add("search-overlay--hidden");
     if (searchOverlayClose) searchOverlayClose.style.display = "none";
     clearSuggestions();
     if (searchResultsContainer) searchResultsContainer.innerHTML = "";
   }


   if (searchOverlayClose) {
     searchOverlayClose.addEventListener("click", function () {
       closeSearchModal();
     });
   }


   if (searchOverlay) {
     searchOverlay.addEventListener("click", function () {
       closeSearchModal();
     });
   }


   // Cerrar sugerencias al hacer click fuera
   document.addEventListener("click", function (e) {
     if (
       !searchSuggestions ||
       !searchInput ||
       searchSuggestions.classList.contains("search-suggestions--hidden")
     ) {
       return;
     }


     if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
       clearSuggestions();
     }
   });


   // Modal de ruta
   if (btnOpenRoutePlanner) {
     btnOpenRoutePlanner.addEventListener("click", openRouteModal);
   }


   if (routeModalClose) {
     routeModalClose.addEventListener("click", closeRouteModal);
   }


   if (routeModalBackdrop) {
     routeModalBackdrop.addEventListener("click", closeRouteModal);
   }


   if (btnPickOrigin) {
     btnPickOrigin.addEventListener("click", function () {
       startPickFromMap("origin");
     });
   }


   if (btnPickDestination) {
     btnPickDestination.addEventListener("click", function () {
       startPickFromMap("destination");
     });
   }


   if (btnStartRoute) {
     btnStartRoute.addEventListener("click", handleStartRoute);
   }


   // chips de filtros
   filterChips.forEach(function (chip) {
     chip.addEventListener("click", function () {
       toggleFilterChip(chip);
     });
   });
//ya no se si agregue o no esto nuevo para la barra de busqueda
// --- PASO 4 MEJORADO: UBICACIÓN "SEGURA" PARA DEMO --- o sea si me permitiía pero no, uso falsa ubi jiji
 // --- UBICACIÓN HÍBRIDA: PIDE PERMISO PERO USA DEMO ---
  function locateUser() {
    // Coordenadas fijas para que la demo salga perfecta (Centro de Lima)
    var demoLat = -12.0460;
    var demoLng = -77.0420;


    // Función para pintar el punto azul
    function showPosition(lat, lng) {
        map.setView([lat, lng], 16);
       
        var userIcon = L.divIcon({
            className: 'user-location-icon',
            html: '<div style="background-color:#4285F4; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });


        L.marker([lat, lng], {icon: userIcon})
         .addTo(map)
         .bindPopup("📍 Tu ubicación")
         .openPopup();
    }


    // 1. PEDIMOS PERMISO REAL (Para que se vea profesional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          // EL TRUCO: El usuario dio permiso, pero...
          // ¡Usamos las coordenadas DEMO en lugar de las reales!
          console.log("Permiso concedido. Activando ubicación demo.");
          showPosition(demoLat, demoLng);
         
          // Opcional: Mostrar mensaje de éxito
          if(typeof showToast === "function") showToast("Ubicación detectada con éxito.");
        },
        function(err) {
          // Si el usuario bloquea o falla, usamos demo igual (Plan B)
          console.warn("Permiso denegado o error. Usando fallback demo.");
          showPosition(demoLat, demoLng);
          if(typeof showToast === "function") showToast("Ubicación aproximada activada.");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      // Si el navegador es muy viejo
      showPosition(demoLat, demoLng);
    }
  }


  // Ejecutar al iniciar
  setTimeout(locateUser, 1000);
//fin ya no se si agregue o no esto nuevo para la barra de busqueda
   // Mensaje inicial
   showToast(
     "Usa 'Planificar ruta' para definir origen, destino y filtros inclusivos."
   );
   // ==========================================
//  LÓGICA CORRECTA: BUSQUEDA -> MODAL -> API
// ==========================================
var currentDestLatLng = null;
// 1. FUNCIÓN PRINCIPAL: Se llama al hacer click en un resultado de búsqueda
function openRoutePlanner(placeData) {
    var modal = document.getElementById("route-modal");
    var overlay = document.getElementById("route-modal-backdrop");
    var destInput = document.getElementById("route-dest-input"); // Este ID debe existir en el HTML nuevo
    
    // 1. Guardar coordenada destino para usarla luego
    if (placeData && placeData.lat && placeData.lng) {
        currentDestLatLng = L.latLng(placeData.lat, placeData.lng);
    }

    // 2. Llenar el input VISUALMENTE
    if (destInput && placeData && (placeData.title || placeData.displayName)) {
        destInput.value = placeData.title || placeData.displayName;
    }

    // 3. Mostrar modal
    if (modal) modal.classList.remove("route-modal--hidden");
    if (overlay) overlay.classList.remove("route-modal--hidden");

    // 4. Cerrar búsqueda y calcular
    closeSearchModal();
    simulateAPICalculation();
}

// 2. SIMULACIÓN DE TU API (Genera Rutas A y B)
function simulateAPICalculation() {
    var container = document.getElementById("route-options-container");
    container.innerHTML = '<p style="text-align:center; color:#666;">Calculando rutas accesibles...</p>';

    // Simulamos un pequeño delay de red (loading)
    setTimeout(function() {
        // TU API DEVUELVE ESTO:
        var htmlRutas = `
          <div id="card-route-a" class="route-card-option" onclick="selectRoute('A')">
            <div class="card-badge badge-green">A</div>
            <div class="card-info">
              <span class="card-title">Ruta A (Recomendada)</span>
              <span class="card-meta">14 min · 1.2 km · <span style="color:#05af43">Accesibilidad Alta</span></span>
            </div>
            <div class="card-check">○</div>
          </div>

          <div id="card-route-b" class="route-card-option" onclick="selectRoute('B')">
            <div class="card-badge badge-amber">B</div>
            <div class="card-info">
              <span class="card-title">Ruta B (Más corta)</span>
              <span class="card-meta">11 min · 0.9 km · <span style="color:#d97706">Accesibilidad Media</span></span>
            </div>
            <div class="card-check">○</div>
          </div>
        `;
        
        container.innerHTML = htmlRutas;
        
        // Seleccionamos la A por defecto automáticamente
        selectRoute('A');
        
    }, 500); // 0.5 segundos de "carga"
}
// Variable global para controlar el tipo de ruta seleccionado
window.currentRouteType = 'A'; // Por defecto A (Verde)
// 3. SELECCIÓN DE RUTA (Usuario elige A o B)
window.selectRoute = function(routeType) {
    // 1. GUARDAR LA ELECCIÓN GLOBALMENTE (¡CRUCIAL!)
    window.currentRouteType = routeType; 
    console.log("Ruta seleccionada:", window.currentRouteType); // Míralo en la consola

    // Referencias DOM...
    var cardA = document.getElementById("card-route-a");
    var cardB = document.getElementById("card-route-b");
    var btnStart = document.getElementById("btn-start-navigation");
    var detailsPanel = document.getElementById("accessibility-details");
    var percentText = document.getElementById("acc-percentage-text");
    var progressBar = document.getElementById("acc-progress-bar");

    if (detailsPanel) detailsPanel.style.display = "block";
    if (btnStart) {
        btnStart.removeAttribute("disabled");
        // Cambiar texto del botón según riesgo
        btnStart.innerHTML = (routeType === 'A') ? "Iniciar Navegación Segura 🛡️" : "Iniciar Navegación (Riesgo) ⚠️";
    }

    if (routeType === 'A') {
        // ESTILOS RUTA A (VERDE)
        if(cardA) { cardA.classList.add("route-card-option--selected"); cardA.querySelector(".card-check").textContent = "●"; }
        if(cardB) { cardB.classList.remove("route-card-option--selected"); cardB.querySelector(".card-check").textContent = "○"; }
        
        if(percentText) { percentText.textContent = "98%"; percentText.style.color = "#00b592"; }
        if(progressBar) { progressBar.style.width = "98%"; progressBar.style.backgroundColor = "#00b592"; }

    } else {
        // ESTILOS RUTA B (NARANJA)
        if(cardB) { cardB.classList.add("route-card-option--selected"); cardB.querySelector(".card-check").textContent = "●"; }
        if(cardA) { cardA.classList.remove("route-card-option--selected"); cardA.querySelector(".card-check").textContent = "○"; }
        
        if(percentText) { percentText.textContent = "55%"; percentText.style.color = "#e69000"; }
        if(progressBar) { progressBar.style.width = "55%"; progressBar.style.backgroundColor = "#e69000"; }
    }
};
var btnPickOriginNew = document.getElementById("btn-pick-origin");
var btnPickDestNew = document.getElementById("btn-pick-destination");

if (btnPickOriginNew) {
    btnPickOriginNew.addEventListener("click", function() {
        startPickFromMap("origin"); 
        document.getElementById("route-modal").classList.add("route-modal--hidden");
        document.getElementById("route-modal-backdrop").classList.add("route-modal--hidden");
    });
}

if (btnPickDestNew) {
    btnPickDestNew.addEventListener("click", function() {
        startPickFromMap("destination");
        document.getElementById("route-modal").classList.add("route-modal--hidden");
        document.getElementById("route-modal-backdrop").classList.add("route-modal--hidden");
    });
}
/*nuevo*/
// =================================================================
// MODIFICACIÓN PARA LA SIMULACIÓN "FARMACIA LA LUZ"
// Reemplaza el bloque original de btnStartNav.addEventListener(...)
// =================================================================
var btnStartNav = document.getElementById("btn-start-navigation");
if (btnStartNav) {
  btnStartNav.addEventListener("click", function (e) {
    e.preventDefault();

    // --- 1. LÓGICA ORIGINAL DE INICIO DE NAVEGACIÓN ---
    var modal = document.getElementById("route-modal");
    var backdrop = document.getElementById("route-modal-backdrop");
    if (modal) modal.classList.add("route-modal--hidden");
    if (backdrop) backdrop.classList.add("route-modal--hidden");

    // Usar ubicación demo si no hay origen
    if (!originLatLng) {
        originLatLng = L.latLng(-12.0460, -77.0420);
        setStartMarker(originLatLng);
    }
    // Usar el destino seleccionado (Farmacia La Luz) o uno demo
    if (currentDestLatLng) {
        setEndMarker(currentDestLatLng);
    } else {
        var demoDest = L.latLng(-12.0465, -77.0430); // Fallback cerca del centro
        setEndMarker(demoDest);
    }

    // Dibujar la ruta inicial
    buildRoute();

    // Actualizar UI
    var searchBar = document.querySelector(".map-search-bar");
    var floatControls = document.querySelector(".map-floating-controls");
    var filterBtn = document.getElementById("btn-toggle-place-filter");
    if (searchBar) searchBar.style.display = "none";
    if (floatControls) floatControls.style.display = "none";
    if (filterBtn) filterBtn.style.display = "none";

    var navUI = document.getElementById("active-navigation-ui");
    var currentDestName = ""; // Para verificar el nombre

    if (navUI) {
      navUI.classList.remove("nav-ui--hidden");
      var destInput = document.getElementById("route-dest-input");
      var navLabel = document.getElementById("nav-dest-label");

      if (destInput && navLabel && destInput.value.trim() !== "") {
        currentDestName = destInput.value; // Guardamos el nombre
        navLabel.textContent = currentDestName;
      } else {
        navLabel.textContent = "Ubicación seleccionada";
      }
    }
    if (typeof showToast === "function") showToast("Ruta iniciada 🚀");

    // --- 2. LÓGICA DE SIMULACIÓN ESPECÍFICA ---
    // Verificamos si el destino es EXACTAMENTE "Farmacia La Luz"
    if (currentDestName && currentDestName.includes("Farmacia La Luz")) {
      console.log("🧪 Iniciando secuencia de simulación para Farmacia La Luz...");

      // TEMPORIZADOR 1: Esperar 4 segundos para mostrar ALERTA ÁMBAR
      setTimeout(function() {
        var amberModal = document.getElementById("sim-alert-modal");
        if (amberModal) amberModal.classList.remove("sim-hidden");

        // Configurar el botón "Recalcular" del modal ámbar
        var btnRecalculate = document.getElementById("btn-sim-recalculate");
        if (btnRecalculate) {
            // Quitamos listeners anteriores por si acaso
            var newBtn = btnRecalculate.cloneNode(true);
            btnRecalculate.parentNode.replaceChild(newBtn, btnRecalculate);
            
            newBtn.addEventListener("click", function() {
                // 2.1 Acciones al dar click en Recalcular
                closeSimAlert();
                showGreenBannerAndChangeRoute();
            });
        }

      }, 4000); // 4 segundos
    }
  });
}

// --- FUNCIONES AUXILIARES PARA LA SIMULACIÓN ---

// Cierra el modal ámbar
function closeSimAlert() {
  var amberModal = document.getElementById("sim-alert-modal");
  if (amberModal) amberModal.classList.add("sim-hidden");
}

// Cierra la encuesta y sale de la navegación (reset completo)
function closeSimSurvey() {
  var surveyModal = document.getElementById("sim-survey-modal");
  if (surveyModal) surveyModal.classList.add("sim-hidden");
  // Disparar el botón de salir de navegación existente para limpiar la UI
  var btnExit = document.getElementById("btn-exit-nav");
  if(btnExit) btnExit.click();
}

// La magia: Muestra banner verde Y cambia la línea en el mapa
function showGreenBannerAndChangeRoute() {
    // A) Mostrar Banner Verde
    var greenBanner = document.getElementById("sim-success-banner");
    if (greenBanner) {
        greenBanner.classList.remove("sim-hidden");
        // Ocultar banner automáticamente después de 5s (opcional)
        setTimeout(function() { greenBanner.classList.add("sim-hidden"); }, 5000);
    }
    if (typeof showToast === "function") showToast("Recalculando ruta segura...");

    // B) CAMBIAR LA LÍNEA EN EL MAPA VISUALMENTE
    // 1. Eliminar la ruta actual (la que creó buildRoute)
    if (routingControl) { map.removeControl(routingControl); routingControl = null; }
    if (window.fallbackLine) { map.removeLayer(window.fallbackLine); }

    // 2. Crear puntos para una nueva ruta "curva" simulada
    // Usamos puntos intermedios falsos para que la línea se vea diferente
    var fakeWaypoints = [
        originLatLng, // Inicio real
        L.latLng(originLatLng.lat - 0.0015, originLatLng.lng + 0.002), // Desvío 1
        L.latLng(destLatLng.lat + 0.001, destLatLng.lng + 0.0015),    // Desvío 2
        destLatLng // Fin real
    ];

    // 3. Dibujar la nueva línea verde
    window.fallbackLine = L.polyline(fakeWaypoints, {
        color: '#05af43', // Verde intenso
        weight: 7,        // Un poco más gruesa para que se note el cambio
        opacity: 0.9,
        smoothFactor: 1
    }).addTo(map);

    // Ajustar la vista a la nueva ruta
    map.fitBounds(window.fallbackLine.getBounds(), { padding: [100, 100] });

    // TEMPORIZADOR 2: Esperar otros 4 segundos para mostrar ENCUESTA
    setTimeout(function() {
         var surveyModal = document.getElementById("sim-survey-modal");
         if (surveyModal) surveyModal.classList.remove("sim-hidden");
    }, 4000);
}
// =================================================================
// FIN DE LA MODIFICACIÓN DE SIMULACIÓN
// =================================================================
// ============================================================
// LÓGICA DE ENCUESTA Y FINALIZACIÓN (Corrección WINDOW)
// ============================================================

// 1. Manejo de Estrellas (1 al 5)
window.rateStar = function(rating) {
  var stars = document.querySelectorAll('#star-container .sim-star');
  
  // Recorremos todas las estrellas
  stars.forEach(function(star, index) {
    // Si el índice es menor que el rating seleccionado, la pintamos
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
  console.log("Calificación seleccionada: " + rating);
};

// 2. Manejo de Tags (Seleccionar/Deseleccionar)
window.toggleSimTag = function(btn) {
  btn.classList.toggle('selected');
};

// 3. Abrir modal "Guardar Ruta"
window.openSaveRouteModal = function() {
  document.getElementById('sim-survey-modal').classList.add('sim-hidden');
  document.getElementById('sim-save-route-modal').classList.remove('sim-hidden');
  
  // Foco automático en el input
  setTimeout(function() {
      document.getElementById('save-route-name').focus();
  }, 100);
};

// 4. Cerrar modal "Guardar Ruta"
window.closeSaveRouteModal = function() {
  document.getElementById('sim-save-route-modal').classList.add('sim-hidden');
  document.getElementById('sim-survey-modal').classList.remove('sim-hidden');
};

// 5. Confirmar Guardado
window.confirmSaveRoute = function() {
  var nameInput = document.getElementById('save-route-name');
  var name = nameInput.value;
  
  if(typeof showToast === "function") {
      showToast("Ruta guardada como: " + name + " ❤️");
  } else {
      alert("Ruta guardada: " + name);
  }
  
  // Cerramos modal de guardar y volvemos a la encuesta
  window.closeSaveRouteModal();
};

// 6. FINALIZAR TODO
window.finishNavigation = function() {
  console.log("Finalizando viaje...");
  
  var navUI = document.getElementById("active-navigation-ui");
  if(navUI) navUI.classList.add("nav-ui--hidden");

  var surveyModal = document.getElementById("sim-survey-modal");
  if(surveyModal) surveyModal.classList.add("sim-hidden");

  // Restaurar UI del mapa original
  var searchBar = document.querySelector(".map-search-bar");
  var floatControls = document.querySelector(".map-floating-controls");
  var filterBtn = document.getElementById("btn-toggle-place-filter");
  
  if(searchBar) searchBar.style.display = "flex";
  if(floatControls) floatControls.style.display = "flex";
  if(filterBtn) filterBtn.style.display = "flex";

  // Volver a Home
  window.location.href = 'home.html'; 
};
  }
})();
