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

    // Modal de ruta
    var routeModal = document.getElementById("route-modal");
    var routeModalBackdrop = document.getElementById("route-modal-backdrop");
    var routeModalClose = document.getElementById("route-modal-close");
    var btnOpenRoutePlanner = document.getElementById(
      "btn-open-route-planner"
    );
    var routeOriginInput = document.getElementById("route-origin-input");
    var routeDestInput = document.getElementById("route-dest-input");
    var btnPickOrigin = document.getElementById("btn-pick-origin");
    var btnPickDestination = document.getElementById("btn-pick-destination");
    var btnStartRoute = document.getElementById("btn-start-route");
    var filterChips = document.querySelectorAll(".chip-filter");

    // ----- Mapa -----
    var map = L.map("map-container").setView([-12.0464, -77.0428], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    var allMarkers = [];
    var barrierMarkers = [];

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

      var marker = L.marker([lat, lng]).addTo(map).bindPopup(popupHtml);

      allMarkers.push(marker);
      if (type === "barrier" || type === "warning") {
        barrierMarkers.push(marker);
      }
    }

    // Puntos demo
    addPlace(-12.055, -77.045, "Rampa verificada", "accessible");
    addPlace(-12.05, -77.04, "Vereda rota", "barrier");
    addPlace(-12.04, -77.048, "Cruce con pendiente fuerte", "warning");

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
        }
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
        displayName: "Hospital Nacional Edgardo Rebagliati Martins, Jesús María, Lima",
        tags: ["hospital", "salud", "emergencias"]
      },
      {
        id: "local-2",
        title: "Parque Kennedy",
        subtitle: "Parque · Miraflores",
        lat: -12.1212,
        lon: -77.0295,
        displayName: "Parque Kennedy, Miraflores, Lima",
        tags: ["parque", "miraflores", "turismo"]
      },
      {
        id: "local-3",
        title: "Estación Central Metropolitano",
        subtitle: "Transporte · Centro de Lima",
        lat: -12.0605,
        lon: -77.0416,
        displayName: "Estación Central Metropolitano, Cercado de Lima",
        tags: ["metropolitano", "bus", "transporte"]
      },
      {
        id: "local-4",
        title: "Plaza San Martín",
        subtitle: "Plaza · Centro de Lima",
        lat: -12.046,
        lon: -77.0339,
        displayName: "Plaza San Martín, Cercado de Lima",
        tags: ["plaza", "centro", "turismo"]
      },
      {
        id: "local-5",
        title: "Hospital Nacional Guillermo Almenara",
        subtitle: "Hospital · La Victoria",
        lat: -12.0714,
        lon: -77.041,
        displayName: "Hospital Nacional Guillermo Almenara, La Victoria",
        tags: ["hospital", "salud"]
      },
      {
        id: "local-6",
        title: "Universidad Nacional de Ingeniería (UNI)",
        subtitle: "Universidad · Rímac",
        lat: -12.023,
        lon: -77.048,
        displayName: "Universidad Nacional de Ingeniería, Rímac",
        tags: ["universidad", "ingenieria"]
      },
      {
        id: "local-7",
        title: "Puente Villena",
        subtitle: "Puente peatonal · Miraflores",
        lat: -12.1302,
        lon: -77.0299,
        displayName: "Puente Villena, Miraflores",
        tags: ["puente", "miraflores"]
      }
    ];

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
        displayName: place.displayName
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
          displayName: item.display_name
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
      if (!searchSuggestions) return;

      if (!suggestions || !suggestions.length) {
        clearSuggestions();
        return;
      }

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
    function updateAccessibleFilter() {
      var onlyAccessible = toggleAccessible && toggleAccessible.checked;

      barrierMarkers.forEach(function (marker) {
        if (onlyAccessible) {
          map.removeLayer(marker);
        } else if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      });
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
          geocodeAddressToLatLng(routeOriginInput.value.trim()).then(
            function (latlng) {
              originLatLng = latlng;
            }
          )
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
      toggleAccessible.addEventListener("change", updateAccessibleFilter);
    }

    if (searchForm) {
      searchForm.addEventListener("submit", searchPlace);
    }

    if (searchInput) {
      searchInput.addEventListener("input", handleSearchInput);
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

      if (
        !searchSuggestions.contains(e.target) &&
        e.target !== searchInput
      ) {
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
