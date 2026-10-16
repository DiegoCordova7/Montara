import { asegurarUsuarioDemo, iniciarSesion, obtenerSesion } from "../data/usuarios.js";

// Solo se permiten redirecciones a páginas .html del mismo sitio.
function destinoSeguro() {
    const siguiente = new URLSearchParams(location.search).get("next");
    return siguiente && /^[\w-]+\.html$/.test(siguiente) ? siguiente : "catalogo.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (obtenerSesion()) {
        location.replace(destinoSeguro());
        return;
    }

    const form = document.getElementById("login-form");
    const inputCorreo = document.getElementById("login-email");
    const inputContrasena = document.getElementById("login-password");
    const btnLogin = document.getElementById("btn-login");
    const mensajeError = document.getElementById("login-error");
    const btnTogglePassword = document.getElementById("toggle-password");

    function mostrarError(mensaje, ...campos) {
        mensajeError.textContent = mensaje;
        mensajeError.hidden = false;
        [inputCorreo, inputContrasena].forEach(campo => campo.classList.remove("invalid"));
        campos.forEach(campo => campo.classList.add("invalid"));
    }

    function limpiarError() {
        mensajeError.hidden = true;
        [inputCorreo, inputContrasena].forEach(campo => campo.classList.remove("invalid"));
    }

    btnTogglePassword.addEventListener("click", () => {
        const visible = inputContrasena.type === "text";
        inputContrasena.type = visible ? "password" : "text";
        btnTogglePassword.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
        btnTogglePassword.innerHTML = `<i class="fa-solid ${visible ? "fa-eye" : "fa-eye-slash"}"></i>`;
    });

    [inputCorreo, inputContrasena].forEach(campo => campo.addEventListener("input", limpiarError));

    form.addEventListener("submit", async evento => {
        evento.preventDefault();
        limpiarError();

        const correo = inputCorreo.value.trim();
        const contrasena = inputContrasena.value;

        if (!correo) return mostrarError("Ingresa tu correo electrónico.", inputCorreo);
        if (!contrasena) return mostrarError("Ingresa tu contraseña.", inputContrasena);

        btnLogin.disabled = true;
        btnLogin.textContent = "Entrando...";

        try {
            await asegurarUsuarioDemo();
            const sesion = await iniciarSesion(correo, contrasena);

            if (!sesion) {
                mostrarError("Correo o contraseña incorrectos.", inputCorreo, inputContrasena);
                return;
            }

            location.href = destinoSeguro();
        } catch {
            mostrarError("No se pudo iniciar sesión. Inténtalo de nuevo.");
        } finally {
            btnLogin.disabled = false;
            btnLogin.textContent = "Entrar";
        }
    });
});
