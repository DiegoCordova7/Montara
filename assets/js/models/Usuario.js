export class Usuario {
    #id;
    #nombre;
    #correo;
    #hashContrasena;

    constructor({ id, nombre, correo, hashContrasena }) {
        this.#id = Usuario.#validarId(id);
        this.#nombre = Usuario.#validarTexto(nombre, "nombre");
        this.#correo = Usuario.normalizarCorreo(correo);
        this.#hashContrasena = Usuario.#validarTexto(hashContrasena, "hashContrasena");
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get correo() {
        return this.#correo;
    }

    coincideContrasena(hash) {
        return this.#hashContrasena === hash;
    }

    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            correo: this.#correo,
            hashContrasena: this.#hashContrasena
        };
    }

    static normalizarCorreo(correo) {
        if (typeof correo !== "string") throw new TypeError("El correo debe ser una cadena.");
        const limpio = correo.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) throw new TypeError("El correo no tiene un formato válido.");
        return limpio;
    }

    static #validarId(id) {
        if (typeof id === "string" && id.trim()) return id.trim();
        if (typeof id === "number" && Number.isSafeInteger(id)) return id;
        throw new TypeError("id debe ser una cadena no vacía o un entero seguro.");
    }

    static #validarTexto(valor, campo) {
        if (typeof valor !== "string" || !valor.trim()) throw new TypeError(`${campo} debe ser una cadena no vacía.`);
        return valor.trim();
    }
}
