(function () {
  document.addEventListener("DOMContentLoaded", initMapPage);

  function initMapPage() {
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

    var allMarkers = [];
    var barrierMarkers = [];
    var accessibleMarkers = [];
    var warningMarkers = [];

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

    function getMarkerIconByType(type) {
      if (type === "accessible") return createColoredPin("#16a34a");
      if (type === "warning") return createColoredPin("#f59e0b");
      if (type === "barrier") return createColoredPin("#dc2626");
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

    function addPlace(lat, lng, name, type) {
      var popupHtml =
        "<strong>" +
        name +
        "</strong><br/>" +
        (type === "accessible"
          ? '<span class="tag tag-verde">Accesible</span>'
          : type === "warning"
          ? '<span class="tag tag-ambar">Precaución</span>'
          : '<span class="tag tag-rojo">Barrera</span>');

      var marker = L.marker([lat, lng], {
        icon: getMarkerIconByType(type),
      })
        .addTo(map)
        .bindPopup(popupHtml);

      marker.customType = type;
      allMarkers.push(marker);

      if (type === "barrier") {
        barrierMarkers.push(marker);
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
    addPlace(-12.05, -77.04, "Vereda rota", "barrier");
    addPlace(-12.04, -77.048, "Cruce con pendiente fuerte", "warning");

    // Grupo 1: Centro de Lima (cerca de Plaza San Martín)
    var clusterCentro = [
      [-12.0475, -77.0345],
      [-12.0468, -77.0338],
      [-12.0459, -77.0342],
      [-12.0464, -77.035],
    ];
    clusterCentro.forEach(function (c, i) {
      addPlace(c[0], c[1], "Barrera Centro #" + (i + 1), "barrier");
    });

    // Grupo 2: Miraflores (cerca del Parque Kennedy)
    var clusterMiraflores = [
      [-12.1215, -77.0293],
      [-12.121, -77.0088],
      [-12.1006, -77.0297],
      [-12.1419, -77.0002],
    ];
    clusterMiraflores.forEach(function (c, i) {
      addPlace(c[0], c[1], "Barrera Miraflores #" + (i + 1), "barrier");
    });

    // Grupo 3: San Juan de Lurigancho (zona demo)
    var clusterSJL = [
      [-12.0145, -77.005],
      [-12.214, -77.0056],
      [-12.115, -77.0048],
      [-12.0552, -77.0054],
    ];
    clusterSJL.forEach(function (c, i) {
      addPlace(c[0], c[1], "Barrera SJL #" + (i + 1), "barrier");
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

    function buildRoute() {
      if (!originLatLng || !destLatLng) return;

      if (routingControl) {
        map.removeControl(routingControl);
      }

      routingControl = L.Routing.control({
        waypoints: [originLatLng, destLatLng],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: function () {
          return null; // ya usamos nuestros propios marcadores
        },
      })
        .on("routesfound", function (e) {
          var route = e.routes[0];
          var summary = route.summary;

          var distanceKm = summary.totalDistance / 1000;
          var durationMin = summary.totalTime / 60;

          routeDistance.textContent = distanceKm.toFixed(2) + " km";
          routeDuration.textContent = durationMin.toFixed(0) + " min";

          routeInfo.classList.remove("route-info--hidden");
        })
        .addTo(map);
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
    }

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

          card.addEventListener("click", function () {
            var lat = s.lat;
            var lon = s.lon;
            var latlng = L.latLng(lat, lon);

            // Centrar en mapa y marcar
            map.setView(latlng, 17);
            L.marker(latlng)
              .addTo(map)
              .bindPopup(s.displayName || s.title)
              .openPopup();

            // Pasar coordenadas al modal de rutas como ORIGEN
            if (routeOriginInput) {
              routeOriginInput.value = s.displayName || s.title;
            }
            setStartMarker(latlng);
            // Abrir modal de rutas
            openRouteModal();

            // Cerrar búsqueda fullscreen
            closeSearchModal();
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

    // ----- Filtro "Solo accesibles" -----
    function updateReportVisibility() {
      var showAcc = toggleVisibleAccessible && toggleVisibleAccessible.checked;
      var showWarn = toggleVisibleWarning && toggleVisibleWarning.checked;
      var showBarr = toggleVisibleBarrier && toggleVisibleBarrier.checked;

      // Accesibles
      accessibleMarkers.forEach(function (m) {
        if (showAcc) {
          if (!map.hasLayer(m)) m.addTo(map);
        } else {
          map.removeLayer(m);
        }
      });

      // Warning
      warningMarkers.forEach(function (m) {
        if (showWarn) {
          if (!map.hasLayer(m)) m.addTo(map);
        } else {
          map.removeLayer(m);
        }
      });

      // Barreras
      barrierMarkers.forEach(function (m) {
        if (showBarr) {
          if (!map.hasLayer(m)) m.addTo(map);
        } else {
          map.removeLayer(m);
        }
      });

      updateDangerZone(); // Recalcular zona roja si las barreras cambiaron
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

    if (toggleAccessible) {
      toggleAccessible.addEventListener("change", updateReportVisibility);
    }

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

    // Mensaje inicial
    showToast(
      "Usa 'Planificar ruta' para definir origen, destino y filtros inclusivos."
    );
  }
})();
