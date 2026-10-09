export class Categoria {
  #id;
  #nombre;
  #descripcion;
  #categoriaPadreId;

  constructor({ id, nombre, descripcion = "", categoriaPadreId = null }) {
    this.#validarId(id, "id");
    this.#nombre = this.#validarTexto(nombre, "nombre");
    this.#descripcion = this.#validarDescripcion(descripcion);
    this.#validarCategoriaPadre(categoriaPadreId);

    this.#id = id;
    this.#categoriaPadreId = categoriaPadreId;
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

  get categoriaPadreId() {
    return this.#categoriaPadreId;
  }

  renombrar(nuevoNombre) {
    this.#nombre = this.#validarTexto(nuevoNombre, "nombre");
  }

  actualizarDescripcion(descripcion) {
    this.#descripcion = this.#validarDescripcion(descripcion);
  }

  asignarCategoriaPadre(categoriaPadreId) {
    this.#validarCategoriaPadre(categoriaPadreId);
    this.#categoriaPadreId = categoriaPadreId;
  }

  quitarCategoriaPadre() {
    this.#categoriaPadreId = null;
  }

  esCategoriaRaiz() {
    return this.#categoriaPadreId === null;
  }

  #validarCategoriaPadre(categoriaPadreId) {
    if (categoriaPadreId === null) return;
    this.#validarId(categoriaPadreId, "categoriaPadreId");
    if (categoriaPadreId === this.#id) throw new Error("Una categoría no puede ser su propia categoría padre.");
  }

  #validarId(id, campo) {
    const esCadenaValida = typeof id === "string" && id.trim().length > 0;
    const esNumeroValido = typeof id === "number" && Number.isSafeInteger(id);
    if (!esCadenaValida && !esNumeroValido) throw new TypeError(`${campo} debe ser una cadena no vacía o un entero seguro.`);
  }

  #validarTexto(valor, campo) {
    if (typeof valor !== "string" || !valor.trim()) throw new TypeError(`${campo} debe ser una cadena no vacía.`);
    return valor.trim();
  }

  #validarDescripcion(descripcion) {
    if (typeof descripcion !== "string") throw new TypeError("La descripción debe ser una cadena.");
    return descripcion.trim();
  }
}