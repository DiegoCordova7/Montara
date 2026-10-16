import { productos, categorias } from "../data/productos.js";

function normalizar(texto) {
    return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[caracter]));
}

document.addEventListener("DOMContentLoaded", () => {
    const filtrosContainer = document.getElementById("category-filters");
    const grid = document.getElementById("product-grid");
    const catalogEmpty = document.getElementById("catalog-empty");
    const catalogCount = document.getElementById("catalog-count");
    const catalogSubtitle = document.getElementById("catalog-subtitle");
    const sortSelect = document.getElementById("sort-select");

    const params = new URLSearchParams(location.search);
    const consultaOriginal = (params.get("q") ?? "").trim();
    const consulta = normalizar(consultaOriginal);

    let categoriaActiva = params.get("categoria") ?? "todas";
    if (categoriaActiva !== "todas" && !categorias.some(c => c.id === categoriaActiva)) {
        categoriaActiva = "todas";
    }

    // Incluye la categoría indicada y todas sus descendientes.
    function idsDeCategoria(id) {
        const hijas = categorias.filter(c => c.categoriaPadreId === id);
        return [id, ...hijas.flatMap(hija => idsDeCategoria(hija.id))];
    }

    function coincideConBusqueda(producto) {
        if (!consulta) return true;
        return normalizar(`${producto.nombre} ${producto.marca} ${producto.descripcion}`).includes(consulta);
    }

    function productosDeCategoria(categoriaId) {
        const ids = categoriaId === "todas" ? null : idsDeCategoria(categoriaId);
        return productos.filter(producto =>
            coincideConBusqueda(producto) && (!ids || ids.includes(producto.categoriaId))
        );
    }

    function precioMinimo(producto) {
        return producto.obtenerPrecioMinimo() ?? Infinity;
    }

    function ordenar(lista) {
        const copia = [...lista];
        switch (sortSelect.value) {
            case "precio-asc":
                return copia.sort((a, b) => precioMinimo(a) - precioMinimo(b));
            case "precio-desc":
                return copia.sort((a, b) => precioMinimo(b) - precioMinimo(a));
            case "nombre":
                return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
            default:
                return copia;
        }
    }

    function crearBotonFiltro(id, nombre, cantidad, esSub = false) {
        const activo = id === categoriaActiva ? " active" : "";
        const sub = esSub ? " sub" : "";
        return `
            <button class="filter-btn${activo}${sub}" data-categoria="${id}">
                <span>${escapar(nombre)}</span>
                <span class="filter-count">${cantidad}</span>
            </button>
        `;
    }

    function renderFiltros() {
        let html = crearBotonFiltro("todas", "Todas", productosDeCategoria("todas").length);

        for (const raiz of categorias.filter(c => c.esCategoriaRaiz())) {
            html += crearBotonFiltro(raiz.id, raiz.nombre, productosDeCategoria(raiz.id).length);

            for (const hija of categorias.filter(c => c.categoriaPadreId === raiz.id)) {
                html += crearBotonFiltro(hija.id, hija.nombre, productosDeCategoria(hija.id).length, true);
            }
        }

        filtrosContainer.innerHTML = html;
    }

    function crearTarjeta(producto) {
        const imagen = producto.variantes[0]?.imagen || producto.imagen;
        const precios = producto.variantes.map(variante => variante.precio);
        const minimo = precios.length ? Math.min(...precios) : null;
        const maximo = precios.length ? Math.max(...precios) : null;
        const agotado = producto.obtenerVariantesDisponibles().length === 0;
        const enlace = `producto.html?id=${encodeURIComponent(producto.id)}`;

        let precioHTML = `<p class="product-card-price">Sin precio</p>`;
        if (minimo !== null) {
            precioHTML = minimo === maximo
                ? `<p class="product-card-price">$${minimo}</p>`
                : `<p class="product-card-price"><small>Desde</small> $${minimo}</p>`;
        }

        const imagenHTML = imagen
            ? `<img src="${escapar(imagen)}" alt="${escapar(producto.nombre)}" loading="lazy">`
            : `<i class="fa-solid fa-image img-fallback"></i>`;

        return `
            <article class="product-card">
                <a href="${enlace}" class="product-card-img-box">${imagenHTML}</a>
                <div class="product-card-body">
                    <p class="product-card-brand">${escapar(producto.marca)}</p>
                    <h3 class="product-card-name"><a href="${enlace}">${escapar(producto.nombre)}</a></h3>
                    ${precioHTML}
                    ${agotado ? `<p class="product-card-stock">Agotado</p>` : ""}
                    <a href="${enlace}" class="btn btn-cart">Ver producto</a>
                </div>
            </article>
        `;
    }

    function renderSubtitulo() {
        if (!consultaOriginal) {
            catalogSubtitle.textContent = "Explora todo nuestro equipo para actividades al aire libre.";
            return;
        }

        catalogSubtitle.innerHTML = `Resultados para “${escapar(consultaOriginal)}” · <a href="catalogo.html">Quitar búsqueda</a>`;
    }

    function render() {
        const lista = ordenar(productosDeCategoria(categoriaActiva));
        const vacio = lista.length === 0;

        grid.innerHTML = lista.map(crearTarjeta).join("");
        catalogEmpty.hidden = !vacio;
        grid.hidden = vacio;
        catalogCount.textContent = `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`;

        renderFiltros();
    }

    filtrosContainer.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-categoria]");
        if (!boton) return;

        categoriaActiva = boton.dataset.categoria;

        const url = new URL(location.href);
        if (categoriaActiva === "todas") url.searchParams.delete("categoria");
        else url.searchParams.set("categoria", categoriaActiva);
        history.replaceState(null, "", url);

        render();
    });

    sortSelect.addEventListener("change", render);

    // Si una imagen no carga, se muestra un ícono en su lugar.
    grid.addEventListener("error", evento => {
        if (evento.target.tagName !== "IMG") return;
        const icono = document.createElement("i");
        icono.className = "fa-solid fa-image img-fallback";
        evento.target.replaceWith(icono);
    }, true);

    renderSubtitulo();
    render();
});
