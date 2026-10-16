import { Usuario } from "../models/Usuario.js";

const CLAVE_USUARIOS = "montara_usuarios";
const CLAVE_SESION = "montara_sesion";

// Usuario de prueba para desarrollo. Elimínalo cuando haya backend real.
const USUARIO_DEMO = {
    nombre: "Cliente Demo",
    correo: "cliente@montara.com",
    contrasena: "Montara123"
};

async function hashear(texto) {
    const datos = new TextEncoder().encode(texto);
    const buffer = await crypto.subtle.digest("SHA-256", datos);
    return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function leerUsuarios() {
    try {
        const crudo = localStorage.getItem(CLAVE_USUARIOS);
        if (!crudo) return [];

        const datos = JSON.parse(crudo);
        if (!Array.isArray(datos)) return [];

        const usuarios = [];
        for (const dato of datos) {
            try {
                usuarios.push(new Usuario(dato));
            } catch {
                // Se ignora cualquier registro dañado en LocalStorage.
            }
        }
        return usuarios;
    } catch {
        return [];
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Devuelve el Usuario creado; lanza Error si el correo ya está registrado.
export async function registrarUsuario({ nombre, correo, contrasena }) {
    if (typeof contrasena !== "string" || contrasena.length < 8) {
        throw new RangeError("La contraseña debe tener al menos 8 caracteres.");
    }

    const usuarios = leerUsuarios();
    const correoNormalizado = Usuario.normalizarCorreo(correo);
    if (usuarios.some(u => u.correo === correoNormalizado)) {
        throw new Error("Ya existe una cuenta con ese correo.");
    }

    const usuario = new Usuario({
        id: Date.now(),
        nombre,
        correo: correoNormalizado,
        hashContrasena: await hashear(contrasena)
    });

    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    return usuario;
}

export async function asegurarUsuarioDemo() {
    if (leerUsuarios().length > 0) return;
    await registrarUsuario(USUARIO_DEMO);
}

// Devuelve la sesión { id, nombre, correo } o null si las credenciales no coinciden.
export async function iniciarSesion(correo, contrasena) {
    let correoNormalizado;
    try {
        correoNormalizado = Usuario.normalizarCorreo(correo);
    } catch {
        return null;
    }

    const usuario = leerUsuarios().find(u => u.correo === correoNormalizado);
    if (!usuario) return null;
    if (!usuario.coincideContrasena(await hashear(contrasena))) return null;

    const sesion = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
}

export function obtenerSesion() {
    try {
        const crudo = localStorage.getItem(CLAVE_SESION);
        if (!crudo) return null;

        const sesion = JSON.parse(crudo);
        if (!sesion || typeof sesion.nombre !== "string") return null;
        return sesion;
    } catch {
        return null;
    }
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}
