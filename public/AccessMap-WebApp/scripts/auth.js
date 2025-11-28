/* ==========================================================
    AUTENTICACIÓN: REGISTRO + LOGIN + RECUPERACIÓN
   ========================================================== */

const fakeUsers = ["test@example.com", "usuario@correo.com"];

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
        1. REGISTRO
       ========================================================== */

    const form = document.getElementById("form-registro");
    
    if (form) {
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

        /* LIMPIAR ERROR DE EMAIL */
        email.addEventListener("input", () => {
            emailError.style.display = "none";
        });

        /* REGLAS DE CONTRASEÑA + CONFIRMAR */
        password.addEventListener("input", () => {
            passwordRules.style.display = password.value ? "block" : "none";

            const val = password.value;

            const okLength = val.length >= 8;
            const okNumber = /\d/.test(val);
            const okUpper  = /[A-Z]/.test(val);

            updateRule(ruleLength, okLength, "Mínimo 8 caracteres");
            updateRule(ruleNumber, okNumber, "Contiene un número");
            updateRule(ruleUpper, okUpper , "Contiene una mayúscula");

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

        /* CONFIRMACIÓN EN TIEMPO REAL */
        confirmPass.addEventListener("input", () => {
            if (confirmPass.value !== password.value) {
                confirmError.textContent = "Las contraseñas no coinciden.";
                confirmError.style.display = "block";
            } else {
                confirmError.style.display = "none";
            }
        });

        /* OCULTAR ERROR DE TÉRMINOS */
        terms.addEventListener("change", () => {
            if (terms.checked) termsError.style.display = "none";
        });

        /* TOGGLE DE CONTRASEÑA */
        document.querySelectorAll(".toggle-pass").forEach(btn => {
            btn.addEventListener("click", () => {
                const input = document.getElementById(btn.dataset.target);
                const eyeOpen  = btn.querySelector(".eye-open");
                const eyeClosed = btn.querySelector(".eye-closed");

                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";

                eyeOpen.style.display = isPassword ? "none" : "block";
                eyeClosed.style.display = isPassword ? "block" : "none";
            });
        });

        /* ==========================
              VALIDACIÓN FINAL
           ========================== */
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let valido = true;
            const pass = password.value;

            /* EMAIL VACÍO */
            if (email.value.trim() === "") {
                emailError.textContent = "El correo es obligatorio.";
                emailError.style.display = "block";
                valido = false;
            }

            /* EMAIL YA REGISTRADO */
            if (fakeUsers.includes(email.value.trim()) && email.value.trim() !== "") {
                emailError.textContent = "Este correo ya está registrado.";
                emailError.style.display = "block";
                valido = false;
            }

            /* CONTRASEÑA VACÍA */
            if (password.value.trim() === "") {
                passwordRules.style.display = "block";
                valido = false;
            }

            /* REGLAS */
            const reglasOk =
                pass.length >= 8 &&
                /\d/.test(pass) &&
                /[A-Z]/.test(pass);

            if (!reglasOk && password.value !== "") {
                passwordRules.style.display = "block";
                valido = false;
            }

            /* CONFIRMACIÓN */
            if (confirmWrapper.style.display !== "none" &&
                confirmPass.value !== password.value) {

                confirmError.textContent = "Las contraseñas no coinciden.";
                confirmError.style.display = "block";
                valido = false;
            }

            /* TÉRMINOS */
            if (!terms.checked) {
                termsError.textContent = "Debes aceptar los términos.";
                termsError.style.display = "block";
                valido = false;
            }

            /* TODO OK → PASAR A PANTALLA EXITOSA */
            if (valido) {
                document.getElementById("view-register").classList.add("hidden");
                document.getElementById("view-success").classList.remove("hidden");
            }
        });

        /* PASAR DE ÉXITO A SETUP */
        const btnGoToSetup = document.getElementById("btnGoToSetup");
        if (btnGoToSetup) {
            btnGoToSetup.addEventListener("click", () => {
                document.getElementById("view-success").classList.add("hidden");
                document.getElementById("view-setup").classList.remove("hidden");
            });
        }

        /* GUARDAR SETUP */
        const btnSaveSetup = document.getElementById("btnSaveSetup");
        if (btnSaveSetup) {
            btnSaveSetup.addEventListener("click", () => {
                window.location.href = "profile.html";
            });
        }

        /* OMITIR SETUP */
        const skipSetup = document.getElementById("skipSetup");
        if (skipSetup) {
            skipSetup.addEventListener("click", () => {
                window.location.href = "profile.html";
            });
        }
    }



    /* ==========================================================
        2. LOGIN Y RECUPERACIÓN
       ========================================================== */

    const loginView = document.getElementById('login-view');
    
    if (loginView) {

        const forgotView = document.getElementById('forgot-view');
        const successModal = document.getElementById('success-modal');

        const btnLogin = document.getElementById('btn-login-submit');
        const linkGoForgot = document.getElementById('link-go-forgot');
        const btnForgotSubmit = document.getElementById('btn-forgot-submit');
        const linkBackLogin = document.getElementById('link-back-to-login');
        const btnCloseModal = document.getElementById('btn-close-modal');
        const linkGoRegister = document.getElementById('link-go-register');

        const loginEmail = document.getElementById('login-email');
        const loginPass = document.getElementById('login-pass');
        const forgotEmail = document.getElementById('forgot-email');


        /* LOGIN: CAMPOS VACÍOS Y CORREO SIMPLE */
        if (btnLogin) {
            btnLogin.addEventListener('click', (e) => {
                e.preventDefault();

                if (loginEmail.value.trim() === "" || loginPass.value.trim() === "") {
                    alert("Por favor ingresa tu correo y contraseña.");
                    return;
                }

                const emailVal = loginEmail.value;
                if (!emailVal.includes('@')) {
                    alert("Correo inválido.");
                    return;
                }

                window.location.href = "app/home.html";
            });
        }

        
        /* 🔵 REGISTRO DESDE LOGIN (FUNCIONA EN INDEX Y EN /app/login) */
        if (linkGoRegister) {
            linkGoRegister.addEventListener('click', (e) => {
                e.preventDefault();

                const path = window.location.pathname;

                // Si estamos en index.html → ir a /app/register.html
                if (path.endsWith("index.html") || path === "/") {
                    window.location.href = "app/register.html";
                } 
                else {
                    // Si estamos dentro de /app/ → solo register.html
                    window.location.href = "register.html";
                }
            });
        }


        /* RECUPERAR CONTRASEÑA */
        if (linkGoForgot) {
            linkGoForgot.addEventListener('click', (e) => {
                e.preventDefault();
                loginView.classList.add('hidden');
                forgotView.classList.remove('hidden');
            });
        }

        if (linkBackLogin) {
            linkBackLogin.addEventListener('click', (e) => {
                e.preventDefault();
                forgotView.classList.add('hidden');
                loginView.classList.remove('hidden');
            });
        }

        if (btnForgotSubmit) {
            btnForgotSubmit.addEventListener('click', (e) => {
                e.preventDefault();

                if (forgotEmail.value.trim() === "") {
                    alert("Ingresa tu correo.");
                    return;
                }

                if (!forgotEmail.value.includes('@')) {
                    alert("Correo inválido.");
                    return;
                }

                forgotView.classList.add('hidden');
                successModal.classList.remove('hidden');
            });
        }

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => {
                successModal.classList.add('hidden');
                loginView.classList.remove('hidden');
                forgotEmail.value = "";
            });
        }
    }

});
/* ==========================================================
   SELECCIÓN DE OPCIONES DE ACCESIBILIDAD
   ========================================================== */

const optionButtons = document.querySelectorAll(".option-btn");
let selectedOptions = new Set();

optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        const value = btn.dataset.value;

        // Si selecciona "ninguna", desmarcar todo
        if (value === "ninguna") {
            selectedOptions.clear();
            optionButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedOptions.add(value);
            return;
        }

        // Si "ninguna" está seleccionada, quitarla
        const noneOption = document.querySelector('.option-btn[data-value="ninguna"]');
        if (noneOption.classList.contains("selected")) {
            noneOption.classList.remove("selected");
            selectedOptions.delete("ninguna");
        }

        // Alternar selección
        if (btn.classList.contains("selected")) {
            btn.classList.remove("selected");
            selectedOptions.delete(value);
        } else {
            btn.classList.add("selected");
            selectedOptions.add(value);
        }
    });
});

btnSaveSetup.addEventListener("click", () => {
    const opciones = Array.from(selectedOptions);

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem("accessibilityOptions", JSON.stringify(opciones));

    // Redireccionar al perfil
    window.location.href = "profile.html";
});

skipSetup.addEventListener("click", () => {
    localStorage.setItem("accessibilityOptions", JSON.stringify([]));
    window.location.href = "profile.html";
});

// =========================
// HABILITAR BOTÓN SI TODO ESTÁ COMPLETO
// =========================

const regEmail = document.getElementById("reg-email");
const regPass = document.getElementById("reg-pass");
const regPassConfirm = document.getElementById("reg-pass-confirm");
const regTerms = document.getElementById("reg-terms");
const btnRegister = document.getElementById("btn-register-submit");

// función que verifica si los campos están completos:
function checkRegisterFormFilled() {

    const emailFilled = regEmail.value.trim() !== "";
    const passFilled = regPass.value.trim() !== "";
    const confirmFilled = !document.getElementById("confirm-wrapper").classList.contains("hidden")
                           ? regPassConfirm.value.trim() !== ""
                           : true;
    const termsChecked = regTerms.checked;

    // habilitar cuando todo esté lleno
    if (emailFilled && passFilled && confirmFilled && termsChecked) {
        btnRegister.disabled = false;
    } else {
        btnRegister.disabled = true;
    }
}

// escuchar cambios en todos los campos
regEmail.addEventListener("input", checkRegisterFormFilled);
regPass.addEventListener("input", checkRegisterFormFilled);
regPassConfirm.addEventListener("input", checkRegisterFormFilled);
regTerms.addEventListener("change", checkRegisterFormFilled);
