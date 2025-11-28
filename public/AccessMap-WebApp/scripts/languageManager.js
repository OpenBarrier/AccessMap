import { translations } from "./translations.js";

export const LanguageManager = {
    currentLang: "es",

    init() {
        // 1. Cargar idioma guardado o del navegador
        const saved = localStorage.getItem("lang");
        if (saved) {
            this.currentLang = saved;
        } else {
            const browserLang = navigator.language.slice(0, 2);
            if (["es", "en", "ru"].includes(browserLang)) {
                this.currentLang = browserLang;
            }
        }

        this.applyLanguage(this.currentLang);
    },

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem("lang", lang);

        const dict = translations[lang];
        if (!dict) return;

        // ELEMENTOS CON TEXTO NORMAL
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.dataset.lang;
            if (dict[key]) el.textContent = dict[key];
        });

        // ELEMENTOS CON PLACEHOLDERS
        document.querySelectorAll("[data-lang-placeholder]").forEach(el => {
            const key = el.dataset.langPlaceholder;
            if (dict[key]) el.placeholder = dict[key];
        });

        // Animación suave
        document.body.style.opacity = 0.2;
        setTimeout(() => { document.body.style.opacity = 1; }, 150);
    }
};
