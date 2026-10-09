import { VarianteProducto } from "./VarianteProducto.js";

export class Producto {
  #id;
  #nombre;
  #descripcion;
  #marca;
  #categoriaId;
  #imagen;
  #atributos;
  #variantes;

  constructor({ id, nombre, descripcion, marca, categoriaId, imagen = "", atributos = {}, variantes = [] }) {
    this.#id = Producto.#validarId(id, "id");
    this.#nombre = Producto.#validarTexto(nombre, "nombre");
    this.#descripcion = Producto.#validarTexto(descripcion, "descripcion");
    this.#marca = Producto.#validarTexto(marca, "marca");
    this.#categoriaId = Producto.#validarId(categoriaId, "categoriaId");
    this.#imagen = Producto.#validarImagen(imagen);
    this.#atributos = Producto.#validarAtributos(atributos);
    this.#variantes = [];
    if (!Array.isArray(variantes)) throw new TypeError("Las variantes deben proporcionarse en un arreglo.");
    for (const variante of variantes) this.agregarVariante(variante);
  }

  get id() {
    return this.#id;
  }

  get nombre() {
    return this.#nombre;
  }

  get descripcion() {
    return this.#descripcion;
  }

  get marca() {
    return this.#marca;
  }

  get categoriaId() {
    return this.#categoriaId;
  }

  get imagen() {
    return this.#imagen;
  }

  get atributos() {
    return Producto.#copiarObjeto(this.#atributos);
  }

  get variantes() {
    return [...this.#variantes];
  }

  renombrar(nombre) {
    this.#nombre = Producto.#validarTexto(nombre, "nombre");
  }

  actualizarDescripcion(descripcion) {
    this.#descripcion = Producto.#validarTexto(descripcion, "descripcion");
  }

  actualizarMarca(marca) {
    this.#marca = Producto.#validarTexto(marca, "marca");
  }

  cambiarCategoria(categoriaId) {
    this.#categoriaId = Producto.#validarId(categoriaId, "categoriaId");
  }

  actualizarImagen(imagen) {
    this.#imagen = Producto.#validarImagen(imagen);
  }

  establecerAtributo(nombre, valor) {
    const clave = Producto.#validarTexto(nombre, "nombre del atributo");
    if (valor === undefined) throw new TypeError("El valor del atributo no puede ser undefined.");
    this.#atributos = Producto.#validarAtributos({ ...this.#atributos, [clave]: valor });
  }

  eliminarAtributo(nombre) {
    const clave = Producto.#validarTexto(nombre, "nombre del atributo");
    const nuevosAtributos = { ...this.#atributos };

    delete nuevosAtributos[clave];
    this.#atributos = Producto.#validarAtributos(nuevosAtributos);
  }

  agregarVariante(variante) {
    if (!(variante instanceof VarianteProducto)) throw new TypeError("La variante debe ser una instancia de VarianteProducto.");
    if (this.#variantes.some(actual => actual.id === variante.id)) throw new Error(`Ya existe una variante con el id "${variante.id}".`);
    this.#variantes.push(variante);
  }

  quitarVariante(varianteId) {
    const indice = this.#variantes.findIndex(variante => variante.id === varianteId);
    if (indice === -1) return false;
    this.#variantes.splice(indice, 1);
    return true;
  }

  obtenerVariante(varianteId) {
    return this.#variantes.find(variante => variante.id === varianteId) ?? null;
  }

  obtenerPrecioMinimo() {
    if (this.#variantes.length === 0) return null;
    return Math.min(...this.#variantes.map(variante => variante.precio));
  }

  obtenerVariantesDisponibles() {
    return this.#variantes.filter(variante => variante.estaDisponible());
  }

  tieneVariantes() {
    return this.#variantes.length > 0;
  }

  static #validarId(id, campo) {
    if (typeof id === "string") {
      if (!id.trim()) throw new TypeError(`${campo} debe ser una cadena no vacía.`);
      return id.trim();
    }
    if (typeof id === "number" && Number.isSafeInteger(id)) return id;
    throw new TypeError(`${campo} debe ser una cadena no vacía o un entero seguro.`);
  }

  static #validarTexto(valor, campo) {
    if (typeof valor !== "string" || !valor.trim()) throw new TypeError(`${campo} debe ser una cadena no vacía.`);
    return valor.trim();
  }

  static #validarImagen(imagen) {
    if (typeof imagen !== "string") throw new TypeError("La imagen debe ser una cadena.");
    return imagen.trim();
  }

  static #validarAtributos(atributos) {
    if (atributos === null || typeof atributos !== "object" || Array.isArray(atributos))
      throw new TypeError("Los atributos deben ser un objeto.");
    return Producto.#copiarObjeto(atributos);
  }

  static #copiarObjeto(objeto) {
    if (typeof structuredClone === "function") return structuredClone(objeto);
    return JSON.parse(JSON.stringify(objeto));
  }
}