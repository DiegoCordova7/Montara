import { ItemCarrito } from "../models/ItemCarrito.js";
import { buscarProductoPorId } from "./productos.js";

const CLAVE_CARRITO = "montara_carrito";

function leerItems() {
    try {
        const crudo = localStorage.getItem(CLAVE_CARRITO);
        if (!crudo) return [];

        const datos = JSON.parse(crudo);
        if (!Array.isArray(datos)) return [];

        const items = [];
        for (const dato of datos) {
            try {
                items.push(new ItemCarrito(dato));
            } catch {
                // Se ignora cualquier registro dañado en LocalStorage.
            }
        }
        return items;
    } catch {
        return [];
    }
}

function guardarItems(items) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
}

function buscarItem(items, productoId, varianteId) {
    return items.find(item =>
        item.productoId === productoId && item.varianteId === varianteId
    ) ?? null;
}

function obtenerVariante(productoId, varianteId) {
    const producto = buscarProductoPorId(productoId);
    const variante = producto?.obtenerVariante(varianteId) ?? null;
    return { producto, variante };
}

// Devuelve true si se agregó, false si no se pudo (sin stock o variante inexistente).
export function agregarAlCarrito(productoId, varianteId, cantidad = 1) {
    const { variante } = obtenerVariante(productoId, varianteId);
    if (!variante || !variante.estaDisponible()) return false;

    const items = leerItems();
    const existente = buscarItem(items, productoId, varianteId);
    const cantidadActual = existente ? existente.cantidad : 0;

    if (cantidadActual + cantidad > variante.stock) return false;

    if (existente) {
        existente.aumentar(cantidad);
    } else {
        items.push(new ItemCarrito({ productoId, varianteId, cantidad }));
    }

    guardarItems(items);
    return true;
}

// Devuelve true si la cantidad cambió, false si es inválida o supera el stock.
export function cambiarCantidad(productoId, varianteId, cantidad) {
    const { variante } = obtenerVariante(productoId, varianteId);
    if (!variante) return false;
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > variante.stock) return false;

    const items = leerItems();
    const item = buscarItem(items, productoId, varianteId);
    if (!item) return false;

    item.establecerCantidad(cantidad);
    guardarItems(items);
    return true;
}

export function eliminarDelCarrito(productoId, varianteId) {
    const items = leerItems();
    const restantes = items.filter(item =>
        !(item.productoId === productoId && item.varianteId === varianteId)
    );

    if (restantes.length === items.length) return false;

    guardarItems(restantes);
    return true;
}

export function vaciarCarrito() {
    guardarItems([]);
}

// Devuelve las líneas listas para dibujar, con los datos actuales de productos.js.
export function obtenerCarrito() {
    const lineas = [];

    for (const item of leerItems()) {
        const { producto, variante } = obtenerVariante(item.productoId, item.varianteId);
        if (!producto || !variante) continue;

        lineas.push({
            item,
            producto,
            variante,
            subtotal: variante.precio * item.cantidad
        });
    }

    return lineas;
}

export function calcularTotal() {
    return obtenerCarrito().reduce((total, linea) => total + linea.subtotal, 0);
}

export function contarArticulos() {
    return leerItems().reduce((total, item) => total + item.cantidad, 0);
}