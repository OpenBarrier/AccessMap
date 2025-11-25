const fakeUsers = ["test@example.com", "usuario@correo.com"];

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-registro");
    if (!form) return;

    const email = document.getElementById("reg-email");
    const emailError = document.getElementById("email-error");

    const password = document.getElementById("reg-pass");
    const confirmPass = document.getElementById("reg-pass-confirm");
    const confirmWrapper = document.getElementById("confirm-wrapper");
    const confirmError = document.getElementById("confirm-error");

    const passwordRules = document.getElementById("password-rules");
    const ruleLength = document.getElementById("rule-length");
    const ruleNumber = document.getElementById("rule-number");
    const ruleUpper = document.getElementById("rule-upper");

    const terms = document.getElementById("reg-terms");
    const termsError = document.getElementById("terms-error");

    /* LIMPIAR ERROR DE EMAIL AL ESCRIBIR */
    email.addEventListener("input", () => {
        emailError.style.display = "none";
    });

    /* Mostrar reglas + mostrar/ocultar confirmación */
    password.addEventListener("input", () => {

        passwordRules.style.display = password.value ? "block" : "none";

        const val = password.value;

        const okLength = val.length >= 8;
        const okNumber = /\d/.test(val);
        const okUpper  = /[A-Z]/.test(val);

        updateRule(ruleLength, okLength, "Mínimo 8 caracteres");
        updateRule(ruleNumber, okNumber, "Contiene un número");
        updateRule(ruleUpper, okUpper , "Contiene una mayúscula");

        /* Mostrar el campo de Confirmar Contraseña */
        if (password.value.length > 0) {
            confirmWrapper.style.display = "block";
        } else {
            confirmWrapper.style.display = "none";
            confirmPass.value = "";
            confirmError.style.display = "none";
        }
    });

    function updateRule(element, condition, text) {
        if (condition) {
            element.textContent = "✔ " + text;
            element.classList.remove("texto-gris");
            element.classList.add("texto-verde");
        } else {
            element.textContent = "✖ " + text;
            element.classList.add("texto-gris");
            element.classList.remove("texto-verde");
        }
    }

    /* Confirmación en tiempo real */
    confirmPass.addEventListener("input", () => {

        if (confirmWrapper.style.display === "none") return;

        if (confirmPass.value !== password.value) {
            confirmError.textContent = "Las contraseñas no coinciden.";
            confirmError.style.display = "block";
        } else {
            confirmError.style.display = "none";
        }
    });

    /* Ocultar error de términos al marcar */
    terms.addEventListener("change", () => {
        if (terms.checked) {
            termsError.style.display = "none";
        }
    });

    /* Toggle de contraseña con SVG */
    document.querySelectorAll(".toggle-pass").forEach(btn => {
        btn.addEventListener("click", () => {

            const input = document.getElementById(btn.dataset.target);
            const eyeOpen  = btn.querySelector(".eye-open");
            const eyeClosed = btn.querySelector(".eye-closed");

            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";

            // Cambiar iconitos
            eyeOpen.style.display = isPassword ? "none" : "block";
            eyeClosed.style.display = isPassword ? "block" : "none";
        });
    });

    /* Validación final */
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let valido = true;

        /* ================
           CAMPOS VACÍOS
           ================ */

        /* EMAIL vacío */
        if (email.value.trim() === "") {
            emailError.textContent = "El correo es obligatorio.";
            emailError.style.display = "block";
            valido = false;
        }

        /* CONTRASEÑA vacía */
        if (password.value.trim() === "") {
            passwordRules.style.display = "block";
            confirmWrapper.style.display = "none";
            confirmError.style.display = "none";
            valido = false;
        }

        /* CONFIRMACIÓN vacía (solo si está visible) */
        if (confirmWrapper.style.display !== "none" && confirmPass.value.trim() === "") {
            confirmError.textContent = "Debes confirmar tu contraseña.";
            confirmError.style.display = "block";
            valido = false;
        }

        /* Email ya registrado */
        if (fakeUsers.includes(email.value.trim()) && email.value.trim() !== "") {
            emailError.textContent = "Este correo ya está registrado.";
            emailError.style.display = "block";
            valido = false;
        }

        /* Reglas contraseña */
        const pass = password.value;
        const reglasOk =
            pass.length >= 8 &&
            /\d/.test(pass) &&
            /[A-Z]/.test(pass);

        if (!reglasOk && password.value !== "") {
            passwordRules.style.display = "block";
            valido = false;
        }

        /* Confirmación */
        if (pass !== confirmPass.value && password.value !== "" && confirmPass.value !== "") {
            confirmError.textContent = "Las contraseñas no coinciden.";
            confirmError.style.display = "block";
            valido = false;
        }

        /* Términos */
        if (!terms.checked) {
            termsError.textContent = "Debes aceptar los términos para continuar.";
            termsError.style.display = "block";
            valido = false;
        }

        /* Si TODO está ok → pasar */
        if (valido) {
            window.location.href = "home.html";
        }
    });
});
