// scripts/chatbot.js
// Chatbot AccessMap – Versión optimizada (sin perder funciones)

document.addEventListener("chatbot-ready", () => {
  console.log("✅ Chatbot inicializado con DOMContentLoaded.");

  // =========================
  //  INTENTS Y FALLBACKS
  // =========================
  const INTENTS = window.ACCESSMAP_INTENTS || [];
  const FALLBACKS = window.ACCESSMAP_FALLBACK_RESPONSES || [];

  // =========================
  // 1. REFERENCIAS AL NUEVO HTML (am-chatbot)
  // =========================
  const toggleBtn    = document.getElementById("amChatToggle");
  const chatBox      = document.getElementById("amChatWindow");
  const closeBtn     = document.getElementById("amChatClose");
  const msgContainer = document.getElementById("amChatBody");
  const form         = document.getElementById("amChatForm");
  const input        = document.getElementById("amChatInput");
  const micBtn       = document.getElementById("amChatMic");
  const sendBtn      = document.getElementById("amChatSend");

  // Si en esta página no hay chatbot, no hacemos nada
  if (!toggleBtn || !chatBox || !msgContainer || !form || !input) {
    console.warn("⚠️ Chatbot: elementos principales no encontrados en esta página.");
    return;
  }

  // =========================
  // 2. Estado de conversación (memoria corta)
  // =========================
  let currentContext = null; // ej: "rutas", "reportes", "mapa", etc.
  let lastIntentName = null; // para follow-up tipo "¿y si no tengo foto?"

  /* =======================================================
     3. Utilidades de UI (typing, mensajes)
  ======================================================= */
  function showTyping() {
    const div = document.createElement("div");
    div.className = "chat-typing";
    div.id = "typing-indicator";
    div.textContent = "Escribiendo...";
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  }

  // Crear un mensaje dentro del nuevo diseño del chatbot
  function addMessage(text, type) {
    // type: "user" o "bot"
    const wrapper = document.createElement("div");
    wrapper.className = `am-chatbot-message am-chatbot-message--${type}`;

    const bubble = document.createElement("div");
    bubble.className = "am-chatbot-message-bubble";
    bubble.innerHTML = text;

    wrapper.appendChild(bubble);
    msgContainer.appendChild(wrapper);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return "";
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  /* =======================================================
     4. Apertura / cierre del chat
  ======================================================= */
  function openChat() {
    chatBox.style.display = "flex";
    chatBox.setAttribute("aria-hidden", "false");

    // Mostrar animación solo la primera vez por sesión
    if (!window.chatbotWelcomed) {
      window.chatbotWelcomed = true;

      setTimeout(() => {
        showTyping();

        setTimeout(() => {
          hideTyping();
          addMessage(
            "¡Hola! 👋 Soy <b>AccessBot</b>, tu asistente de <b>AccessMap</b>.",
            "bot"
          );

          setTimeout(() => {
            addMessage(
              "Puedo ayudarte con el mapa, rutas accesibles, reportes, comunidad, perfil y más.",
              "bot"
            );

            // Mostrar FAQ general automáticamente
            showFAQButtons("general");
          }, 500);
        }, 900);
      }, 300);
    }

    input.focus();
  }

  function closeChat() {
    chatBox.style.display = "none";
    chatBox.setAttribute("aria-hidden", "true");
  }

  function closeChatSoft() {
    chatBox.style.transition = "opacity 0.4s ease";
    chatBox.style.opacity = "0";

    setTimeout(() => {
      chatBox.style.display = "none";
      chatBox.style.opacity = "1"; // reset
    }, 400);
  }

  // Eventos de abrir/cerrar
  toggleBtn.addEventListener("click", () => {
    const visible = chatBox.style.display === "flex";
    visible ? closeChat() : openChat();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeChat);
  }

  /* =======================================================
     5. Input: micrófono vs botón enviar (estilo WhatsApp)
  ======================================================= */
  if (input && micBtn && sendBtn) {
    // Estado inicial
    sendBtn.classList.add("hidden");

    input.addEventListener("input", () => {
      if (input.value.trim().length > 0) {
        sendBtn.classList.remove("hidden");
        micBtn.style.display = "none";
      } else {
        sendBtn.classList.add("hidden");
        micBtn.style.display = "flex";
      }
    });
  }

  /* =======================================================
     6. Envío de mensaje (form + botón + Enter)
  ======================================================= */
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    // Restaurar estado WhatsApp después de enviar
    if (sendBtn && micBtn) {
      sendBtn.classList.add("hidden");
      micBtn.style.display = "flex";
    }

    processUserText(text);
  }

  // Enviar con el botón
  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  // Enviar con el formulario (Enter en desktop / móviles con botón de enviar)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  // Enviar con Enter (sin Shift)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* =======================================================
     7. Botón de micrófono (Web Speech API)
  ======================================================= */
  let recognizing = false;
  let recognition = null;

  if (
    micBtn &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  ) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "es-PE";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onstart = () => {
    recognizing = true;
    micBtn.classList.add("chat-mic--listening");
    finalTranscript = "";

    hideProcessing();   
    amShowListening();    
    startSiriWave();
    startVolumeMeter();  
  };


    recognition.onend = () => {
    recognizing = false;
    micBtn.classList.remove("chat-mic--listening");

    amHideListening();  
    showProcessing(); 
    stopSiriWave(); 
    stopVolumeMeter(); 
    setTimeout(() => {
        hideProcessing(); 
    }, 800);

    if (finalTranscript.trim() !== "") {
        input.value = finalTranscript;
        sendMessage();
    }
  };

    recognition.onerror = () => {
    amHideListening();
    hideProcessing();
    stopSiriWave(); 
    stopVolumeMeter();
  };


    recognition.onresult = (event) => {
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      input.value = finalTranscript + interim;
    };

    micBtn.addEventListener("click", () => {
      if (!recognition) return;

      if (recognizing) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else if (micBtn) {
    // Si hay botón de mic pero el navegador no soporta API
    micBtn.disabled = true;
    micBtn.title =
      "El reconocimiento de voz no está disponible en este navegador.";
  }

  /* =======================================================
     8. Motor NLP optimizado (1 sola pasada)
  ======================================================= */
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function findBestIntent(userText) {
    const text = normalize(userText);

    let bestIntent = null;
    let bestScore = 0;

    for (const intent of INTENTS) {
      let intentScore = 0;

      // Bonus por contexto actual
      if (intent.context && currentContext && intent.context === currentContext) {
        intentScore += 0.35;
      }

      // Bonus si se repite el mismo intent
      if (lastIntentName && intent.name === lastIntentName) {
        intentScore += 0.1;
      }

      // Coincidencias regex
      for (const pattern of intent.patterns) {
        if (pattern.regex.test(text)) {
          intentScore += pattern.weight;
        }
      }

      if (intentScore > bestScore) {
        bestScore = intentScore;
        bestIntent = intent;
      }
    }

    return { intent: bestIntent, score: bestScore };
  }
/* =======================================================
   8.5 PRO — Procesar FAQ con coincidencia EXACTA
======================================================= */
function processFAQ(question) {
  const raw = question.trim();

  // 1. Buscar un intent cuyo patrón coincida EXACTO con el texto FAQ
  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      try {
        // Probamos la expresión regular directamente sobre el texto original
        if (pattern.regex.test(raw)) {

          const reply = pickRandom(intent.responses);
          addMessage(reply, "bot");

          // Actualizar contexto
          if (intent.followUpContext !== undefined) {
            currentContext = intent.followUpContext;
          } else if (intent.context) {
            currentContext = intent.context;
          }

          lastIntentName = intent.name;
          return;
        }
      } catch (err) {
        console.error("Regex error:", err, pattern.regex);
      }
    }
  }

  // 2. Si no encontró coincidencia exacta, usa NLP normal
  processUserText(raw);
}


  function processUserText(userText) {
    // 0. Animación "escribiendo..."
    showTyping();

    setTimeout(() => {
      hideTyping();

      const texto = userText.toLowerCase().trim();

      /* ----------------------------------------------
         1. Manejo especial de CIERRE AMABLE
         (se evalúa ANTES de cambiar lastIntentName)
      ---------------------------------------------- */
      if (lastIntentName === "cierre_amable") {
        // NO → seguir conversando
        if (
          /^no$/.test(texto) ||
          /no gracias|todavia no|todavía no|aun no|aún no|no aun|no aún/.test(
            texto
          )
        ) {
          addMessage("¡Perfecto! 😊 ¿En qué más puedo ayudarte?", "bot");
          lastIntentName = null;
          return;
        }

        // SÍ → cerrar chat
        if (
          /^sí$/.test(texto) ||
          /^si$/.test(texto) ||
          /salir|cerrar|adios|adiós|chau|chao/.test(texto)
        ) {
          addMessage(
            "Perfecto 💚. Cuando quieras volver, estaré aquí.",
            "bot"
          );
          lastIntentName = null;
          setTimeout(() => closeChatSoft(), 1500);
          return;
        }
      }

      /* ----------------------------------------------
         2. Motor NLP estándar (1 sola pasada)
      ---------------------------------------------- */
      const { intent, score } = findBestIntent(userText);
      const THRESHOLD = 0.45;

      let intentName = "fallback";
      let botResponse = "";

      if (!intent || score < THRESHOLD) {
        // Fallback
        intentName = "fallback";
        botResponse = pickRandom(FALLBACKS);

        // FAQ general en fallback
        showFAQButtons("general");
      } else {
        intentName = intent.name;

        // Actualizar contexto
        if (intent.followUpContext !== undefined) {
          currentContext = intent.followUpContext;
        } else if (intent.context) {
          currentContext = intent.context;
        }

        // FAQ dinámico según contexto o petición explícita
        if (intent.name === "faq_request") {
          showFAQButtons("general");
        }

        if (
          ["mapa", "reportes", "rutas", "comunidad", "perfil", "premium"].includes(
            intent.context
          )
        ) {
          showFAQButtons(intent.context);
        }

        botResponse = pickRandom(intent.responses);
      }

      // Guardamos el nombre del intent para el siguiente turno
      lastIntentName = intentName;

      // 3. Mostrar respuesta del bot
      addMessage(botResponse, "bot");

      // 4. Cierre suave si el intent lo indica
      if (intentName === "cierre_definitivo") {
        setTimeout(() => closeChatSoft(), 2500);
      }
    }, 350);
  }

  /* =======================================================
     9. FAQ dinámico (chips)
  ======================================================= */
  function showFAQButtons(category) {
    const faqs = window.ACCESSMAP_FAQ?.[category] || [];
    if (!faqs.length) return;

    const container = document.createElement("div");
    container.className = "faq-container";

    faqs.forEach((question) => {
      const btn = document.createElement("button");
      btn.className = "faq-chip";
      btn.textContent = question;
      btn.addEventListener("click", () => {
    addMessage(question, "user");
  processFAQ(question); // ← respuesta directa sin NLP
      });

      container.appendChild(btn);
    });

    msgContainer.appendChild(container);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  /* =======================================================
     10. BOTÓN DE AJUSTES (MENÚ NUEVA CONVERSACIÓN)
  ======================================================= */
  const settingsBtn = document.getElementById("amChatSettings");
  const chatMenu    = document.getElementById("amChatMenu");
  const newChatBtn  = document.getElementById("amNewChat");
  const cancelBtn   = document.getElementById("amCancelMenu");

  if (settingsBtn && chatMenu) {
    settingsBtn.addEventListener("click", () => {
      chatMenu.classList.toggle("show");
    });
  }

  if (cancelBtn && chatMenu) {
    cancelBtn.addEventListener("click", () => {
      chatMenu.classList.remove("show");
    });
  }

  // ====== NUEVA CONVERSACIÓN ======
  if (newChatBtn && msgContainer && chatMenu) {
    newChatBtn.addEventListener("click", () => {
      // Borrar mensajes
      msgContainer.innerHTML = `
        <div class="am-chatbot-message am-chatbot-message--bot">
          <div class="am-chatbot-message-bubble">
            ¡Hola! 👋 ¿En qué puedo ayudarte hoy?
          </div>
        </div>
      `;

      // Reset contextos
      window.chatbotWelcomed = true;
      currentContext = null;
      lastIntentName = null;

      chatMenu.classList.remove("show");
    });
  }
});
function amShowListening() {
    const el = document.getElementById("amListening");
    if (el) el.classList.remove("hidden");
}

function amHideListening() {
    const el = document.getElementById("amListening");
    if (el) el.classList.add("hidden");
}
function showProcessing() {
  const el = document.getElementById("amProcessing");
  if (el) el.classList.remove("hidden");
}

function hideProcessing() {
  const el = document.getElementById("amProcessing");
  if (el) el.classList.add("hidden");
}
let currentVolume = 0;
let audioStream = null;
let analyser = null;
let audioDataArray = null;
let audioContext = null;
let volumeAnimationID = null;

async function startVolumeMeter() {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(audioStream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    audioDataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    animateVolumeWaves();
  } catch (err) {
    console.error("Error iniciando micrófono:", err);
  }
}

function stopVolumeMeter() {
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
  }

  if (audioContext) {
    audioContext.close();
  }

  cancelAnimationFrame(volumeAnimationID);
}
function animateVolumeWaves() {
  analyser.getByteFrequencyData(audioDataArray);

  let sum = 0;
  for (let i = 0; i < audioDataArray.length; i++) sum += audioDataArray[i];

  const average = sum / audioDataArray.length;  // volumen promedio (0–255)
  const volume = Math.min(average / 80, 1);     // normalizado 0–1
  currentVolume = volume; 
  // Aplicamos el volumen a cada onda
  document.querySelectorAll(".am-wave-circle").forEach((circle, i) => {
    const scale = 1 + volume * (1.5 + i * 0.2); // onda 1 más chica, 3 más grande
    circle.style.transform = `scale(${scale})`;
    circle.style.opacity = 0.5 + volume * 0.5;
  });

  volumeAnimationID = requestAnimationFrame(animateVolumeWaves);
}
let siriCtx = null;
let siriCanvas = null;
let siriAnimationID = null;
let siriPhase = 0;

function startSiriWave() {
  siriCanvas = document.getElementById("siriCanvas");
  if (!siriCanvas) return;

  siriCanvas.width = siriCanvas.offsetWidth * window.devicePixelRatio;
  siriCanvas.height = siriCanvas.offsetHeight * window.devicePixelRatio;

  siriCtx = siriCanvas.getContext("2d");
  siriCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

  siriAnimate();
}

function stopSiriWave() {
  cancelAnimationFrame(siriAnimationID);
}

function siriAnimate() {
  if (!siriCanvas || !siriCtx) return;   // ✔ seguridad

  const w = siriCanvas.width / window.devicePixelRatio;
  const h = siriCanvas.height / window.devicePixelRatio;

  siriCtx.clearRect(0, 0, w, h);         // ✔ limpiar

  const amplitude = 18 * currentVolume;
  const frequency = 0.02;

  siriCtx.beginPath();
  siriCtx.moveTo(0, h / 2);

  for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * frequency + siriPhase) * amplitude;
      siriCtx.lineTo(x, y);
  }

  const gradient = siriCtx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, "#05af43");
  gradient.addColorStop(1, "#1bc97c");

  siriCtx.strokeStyle = gradient;
  siriCtx.lineWidth = 4;
  siriCtx.lineCap = "round";
  siriCtx.stroke();

  siriPhase += 0.15;

  siriAnimationID = requestAnimationFrame(siriAnimate);
}
