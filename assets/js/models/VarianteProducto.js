export class VarianteProducto {
  #id;
  #color;
  #talla;
  #precio;
  #stock;
  #activa;
  #imagen;

  constructor({ id, color = null, talla = null, precio, stock = 0, activa = true, imagen = "" }) {
    this.#validarId(id);
    this.#validarOpcion(color, "color");
    this.#validarOpcion(talla, "talla");
    this.#validarPrecio(precio);
    this.#validarStock(stock);
    this.#validarImagen(imagen);

    if (typeof activa !== "boolean") throw new TypeError("El estado de la variante debe ser booleano.");
    this.#id = id;
    this.#color = color?.trim() ?? null;
    this.#talla = talla?.trim() ?? null;
    this.#precio = precio;
    this.#stock = stock;
    this.#activa = activa;
    this.#imagen = imagen.trim();
  }

  get id() {
    return this.#id;
  }

  get color() {
    return this.#color;
  }

  get talla() {
    return this.#talla;
  }

  get precio() {
    return this.#precio;
  }

  get stock() {
    return this.#stock;
  }

  get activa() {
    return this.#activa;
  }

  get imagen() {
    return this.#imagen;
  }

  actualizarPrecio(nuevoPrecio) {
    this.#validarPrecio(nuevoPrecio);
    this.#precio = nuevoPrecio;
  }

  reponerStock(cantidad) {
    this.#validarCantidadPositiva(cantidad);
    const nuevoStock = this.#stock + cantidad;
    if (!Number.isSafeInteger(nuevoStock)) throw new RangeError("La cantidad de stock excede el límite permitido.");
    this.#stock = nuevoStock;
  }

  retirarStock(cantidad) {
    this.#validarCantidadPositiva(cantidad);
    if (cantidad > this.#stock) throw new RangeError("No hay suficiente stock disponible.");
    this.#stock -= cantidad;
  }

  activar() {
    this.#activa = true;
  }

  desactivar() {
    this.#activa = false;
  }

  estaDisponible() {
    return this.#activa && this.#stock > 0;
  }

  actualizarImagen(nuevaImagen) {
    this.#validarImagen(nuevaImagen);
    this.#imagen = nuevaImagen.trim();
  }

  #validarId(id) {
    const esCadenaValida = typeof id === "string" && id.trim().length > 0;
    const esNumeroValido = typeof id === "number" && Number.isSafeInteger(id);
    if (!esCadenaValida && !esNumeroValido) throw new TypeError("El id debe ser una cadena no vacía o un entero seguro.");
  }

  #validarOpcion(valor, campo) {
    if (valor !== null && (typeof valor !== "string" || !valor.trim())) throw new TypeError(`${campo} debe ser una cadena no vacía o null.`);
  }

  #validarPrecio(precio) {
    if (typeof precio !== "number" || !Number.isFinite(precio) || precio < 0) throw new RangeError("El precio debe ser un número finito no negativo.");
  }

  #validarStock(stock) {
    if (!Number.isSafeInteger(stock) || stock < 0) throw new RangeError("El stock debe ser un entero seguro no negativo.");
  }

  #validarCantidadPositiva(cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) throw new RangeError("La cantidad debe ser un entero positivo.");
  }

  #validarImagen(imagen) {
  if (typeof imagen !== "string") throw new TypeError("La imagen debe ser una cadena de texto.");
}
}
