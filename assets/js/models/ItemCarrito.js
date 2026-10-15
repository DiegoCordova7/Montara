export class ItemCarrito {
    #productoId;
    #varianteId;
    #cantidad;

    constructor({ productoId, varianteId, cantidad = 1 }) {
        this.#productoId = ItemCarrito.#validarId(productoId, "productoId");
        this.#varianteId = ItemCarrito.#validarId(varianteId, "varianteId");
        this.#cantidad = ItemCarrito.#validarCantidad(cantidad);
    }

    get productoId() {
        return this.#productoId;
    }

    get varianteId() {
        return this.#varianteId;
    }

    get cantidad() {
        return this.#cantidad;
    }

    establecerCantidad(cantidad) {
        this.#cantidad = ItemCarrito.#validarCantidad(cantidad);
    }

    aumentar(cantidad = 1) {
        this.#cantidad = ItemCarrito.#validarCantidad(this.#cantidad + cantidad);
    }

    toJSON() {
        return {
            productoId: this.#productoId,
            varianteId: this.#varianteId,
            cantidad: this.#cantidad
        };
    }

    static #validarId(id, campo) {
        if (typeof id === "string") {
            if (!id.trim()) throw new TypeError(`${campo} debe ser una cadena no vacía.`);
            return id.trim();
        }
        if (typeof id === "number" && Number.isSafeInteger(id)) return id;
        throw new TypeError(`${campo} debe ser una cadena no vacía o un entero seguro.`);
    }

    static #validarCantidad(cantidad) {
        if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
            throw new RangeError("La cantidad debe ser un entero positivo.");
        }
        return cantidad;
    }
}